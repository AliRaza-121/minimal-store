import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import connectDB from '@/lib/db'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET

async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    await connectDB()
    return await User.findById(decoded.id).select('-password')
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'super_admin' && currentUser.role !== 'admin')) {
      return Response.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    return Response.json({ success: true, users }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'super_admin') {
      return Response.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    if (!['admin', 'staff'].includes(role)) {
      return Response.json({ success: false, error: 'Can only create admin or staff users' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return Response.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    const user = await User.create({ name, email: email.toLowerCase(), password, role })

    return Response.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}