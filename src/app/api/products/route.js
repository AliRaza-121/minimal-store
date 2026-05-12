import connectDB from '@/lib/db'
import Product from '@/models/Product'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    let query = {}

    if (category && category !== 'All') {
      query.category = category
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    if (featured === 'true') {
      query.featured = true
    }

    const products = await Product.find(query).sort({ createdAt: -1 })

    return Response.json({ success: true, products }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const product = await Product.create(body)
    return Response.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error('Product create error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}