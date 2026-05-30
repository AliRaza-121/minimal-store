import connectDB from '@/lib/db'
import Product from '@/models/Product'
import ProductDetailClient from '@/components/ProductDetailClient'

export async function generateMetadata({ params }) {
  const { id } = await params
  try {
    await connectDB()
    const product = await Product.findById(id).lean()
    if (!product) return {}

    return {
      title: product.name,
      description: product.description || `Buy ${product.name} at MINIMAL.`,
      openGraph: {
        title: product.name,
        description: product.description || `Buy ${product.name} at MINIMAL.`,
        images: product.image ? [{ url: product.image }] : [],
      },
    }
  } catch (error) {
    return {}
  }
}

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