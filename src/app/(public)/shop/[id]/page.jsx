import connectDB from '@/lib/db'
import Product from '@/models/Product'
import ProductDetailClient from '@/components/ProductDetailClient'

export default async function ProductDetail({ params }) {
  const { id } = await params
  let product = null

  try {
    await connectDB()
    const doc = await Product.findById(id).lean()
    if (doc) {
      product = {
        ...doc,
        _id: doc._id.toString(),
      }
    }
  } catch (error) {
    console.error('Failed to fetch product:', error)
  }

  return <ProductDetailClient product={product} />
}