import connectDB from '@/lib/db'
import Order from '@/models/Order'

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const order = await Order.findByIdAndUpdate(id, body, { new: true })

    if (!order) {
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    return Response.json({ success: true, order }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}