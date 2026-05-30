import connectDB from '@/lib/db'
import Lookbook from '@/models/Lookbook'

export async function GET() {
  try {
    await connectDB()
    const items = await Lookbook.find().sort({ position: 1 }).lean()
    const serialized = items.map(item => ({
      ...item,
      _id: item._id.toString(),
    }))
    return Response.json({ success: true, lookbook: serialized })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const item = await Lookbook.create(body)
    return Response.json({ success: true, item: { ...item.toObject(), _id: item._id.toString() } }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
