import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import connectDB from '@/lib/db'
import Order from '@/models/Order'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 })
    return Response.json({ success: true, orders }, { status: 200 })
  } catch (error) {
    console.error('Orders GET error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()

    // Check if user is logged in
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    let userId = null

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        userId = decoded.id
      } catch {
        // Token invalid, continue as guest
      }
    }

    const order = await Order.create({
      user: userId,
      items: body.items,
      total: body.total,
      customer: body.customer,
    })

    return Response.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error('Orders POST error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}