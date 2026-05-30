import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import connectDB from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Settings from '@/models/Settings'
import { sendOrderConfirmationEmail } from '@/lib/mailer'

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

    // Check if store is accepting orders
    const settings = await Settings.findOne()
    if (settings && !settings.isAcceptingOrders) {
      return Response.json({ success: false, error: 'Store is temporarily closed. Not accepting new orders.' }, { status: 403 })
    }

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

    // Calculate total on server side securely
    let calculatedTotal = 0
    const populatedItems = []

    for (const item of body.items) {
      const product = await Product.findById(item.id || item._id)
      if (product) {
        calculatedTotal += product.price * item.quantity
        populatedItems.push({
          name: product.name,
          price: product.price,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          id: product._id
        })
      }
    }

    const order = await Order.create({
      user: userId,
      items: populatedItems,
      total: calculatedTotal,
      paymentMethod: body.paymentMethod || 'cod',
      paymentStatus: body.paymentStatus || 'pending',
      customer: body.customer,
    })

    // Send confirmation email asynchronously (don't await it to block the response)
    if (body.customer?.email && body.customer?.name) {
      sendOrderConfirmationEmail(order, body.customer.email, body.customer.name)
        .catch(err => console.error('Failed to send confirmation email:', err))
    }

    return Response.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error('Orders POST error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}