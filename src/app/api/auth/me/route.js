import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import connectDB from '@/lib/db'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    await connectDB()
    const user = await User.findById(decoded.id).select('-password')

    if (!user || user.status !== 'active') {
      return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    return Response.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      },
    }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
}