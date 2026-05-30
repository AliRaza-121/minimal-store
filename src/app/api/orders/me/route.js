import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import connectDB from '@/lib/db'
import Order from '@/models/Order'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = decoded.id

    await connectDB()
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 })
    
    return Response.json({ success: true, orders }, { status: 200 })
  } catch (error) {
    console.error('Orders GET /me error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
