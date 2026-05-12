'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const roleColors = {
  super_admin: 'bg-gold/10 text-gold border-gold/30',
  admin: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  staff: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  customer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
}

const roleLabels = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  staff: 'Staff',
  customer: 'Customer',
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' })
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const openAdd = () => {
    setForm({ name: '', email: '', password: '', role: 'staff' })
    setEditingUser(null)
    setActionError('')
    setShowModal(true)
  }

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role })
    setEditingUser(user)
    setActionError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setActionError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setActionError('')
    setActionLoading(true)

    try {
      if (editingUser) {
        // Update user
        const body = { role: form.role }
        const res = await fetch(`/api/users/${editingUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (data.success) {
          closeModal()
          fetchUsers()
        } else {
          setActionError(data.error)
        }
      } else {
        // Create new user
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json()
        if (data.success) {
          closeModal()
          fetchUsers()
        } else {
          setActionError(data.error)
        }
      }
    } catch {
      setActionError('Network error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (user) => {
    if (user.role === 'super_admin') {
      alert('Cannot delete super admin')
      return
    }
    if (!confirm(`Delete "${user.name}"? They will no longer be able to login.`)) return

    try {
      const res = await fetch(`/api/users/${user._id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchUsers()
      } else {
        alert(data.error)
      }
    } catch {
      alert('Network error')
    }
  }

  const handleToggleStatus = async (user) => {
    if (user.role === 'super_admin') {
      alert('Cannot change super admin status')
      return
    }
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u))
      }
    } catch {
      alert('Network error')
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'All' || user.role === filterRole
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light text-light">Users</h1>
          <p className="text-muted text-sm mt-1">{users.length} total users</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="px-5 py-2.5 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors"
        >
          + Add User
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Super Admins', count: users.filter(u => u.role === 'super_admin').length, color: 'text-gold' },
          { label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'text-purple-400' },
          { label: 'Staff', count: users.filter(u => u.role === 'staff').length, color: 'text-blue-400' },
          { label: 'Customers', count: users.filter(u => u.role === 'customer').length, color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-dark-card border border-dark-border p-4">
            <p className={`text-2xl font-light ${stat.color}`}>{stat.count}</p>
            <p className="text-[10px] text-muted tracking-widest uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-card border border-dark-border text-light text-sm font-light pl-10 pr-4 py-2 focus:outline-none focus:border-gold/50 transition-colors"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-dark-card border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
        >
          <option value="All">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="customer">Customer</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-dark-card border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
        >
          <option value="All">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse h-16 bg-dark-card border border-dark-border" />
          ))}
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">User</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Role</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Status</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Last Login</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Joined</th>
                  <th className="py-3 px-4 text-[10px] text-muted tracking-widest uppercase font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted text-sm font-light">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-dark-border/50 hover:bg-dark-bg/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-muted font-medium">
                              {user.name?.split(' ').map(n => n[0]).join('') || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-light font-light">{user.name}</p>
                            <p className="text-xs text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 border font-medium ${roleColors[user.role]}`}>
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className="flex items-center gap-2"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : user.status === 'deleted' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                          <span className={`text-xs font-light ${user.status === 'active' ? 'text-emerald-400' : user.status === 'deleted' ? 'text-red-400' : 'text-yellow-400'}`}>
                            {user.status}
                          </span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted font-light">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted font-light">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="text-xs text-muted hover:text-light tracking-wide transition-colors"
                          >
                            Edit
                          </button>
                          {user.role !== 'super_admin' && (
                            <button
                              onClick={() => handleDelete(user)}
                              className="text-xs text-muted hover:text-red-400 tracking-wide transition-colors"
                            >
                              {user.status === 'deleted' ? 'Remove' : 'Delete'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-dark-card border border-dark-border w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="border-b border-dark-border px-6 py-4 flex items-center justify-between">
                  <h2 className="text-sm text-light tracking-widest uppercase font-medium">
                    {editingUser ? 'Edit User' : 'Add User'}
                  </h2>
                  <button onClick={closeModal} className="text-muted hover:text-light">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {actionError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-light px-4 py-3">
                      {actionError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      disabled={!!editingUser}
                      className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      disabled={!!editingUser}
                      className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50"
                    />
                  </div>

                  {!editingUser && (
                    <div>
                      <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Password</label>
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        minLength={6}
                        className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] text-muted tracking-widest uppercase mb-1.5">Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full bg-dark-bg border border-dark-border text-light text-sm font-light px-3 py-2 focus:outline-none focus:border-gold/50 transition-colors"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                    <p className="text-[10px] text-muted/50 mt-1">Super admin can create Admins and Staff only</p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={actionLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 bg-gold text-dark-bg text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}