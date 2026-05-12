import connectDB from '@/lib/db'
import Product from '@/models/Product'

export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findById(id)

    if (!product) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ success: true, product }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const product = await Product.findByIdAndUpdate(id, body, { new: true })

    if (!product) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ success: true, product }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return Response.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ success: true, message: 'Product deleted' }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}