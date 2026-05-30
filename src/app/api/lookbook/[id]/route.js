import connectDB from '@/lib/db'
import Lookbook from '@/models/Lookbook'

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const item = await Lookbook.findByIdAndUpdate(id, body, { new: true })
    if (!item) return Response.json({ success: false, error: 'Not found' }, { status: 404 })
    return Response.json({ success: true, item: { ...item.toObject(), _id: item._id.toString() } })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const item = await Lookbook.findByIdAndDelete(id)
    if (!item) return Response.json({ success: false, error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
