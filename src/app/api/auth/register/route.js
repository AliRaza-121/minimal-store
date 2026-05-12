import connectDB from '@/lib/db'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request) {
  try {
    await connectDB()
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return Response.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'customer',
    })

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    user.lastLogin = new Date()
    await user.save()

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return Response.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}