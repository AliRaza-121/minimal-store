import connectDB from '@/lib/db'
import Product from '@/models/Product'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
  let products = []

  try {
    await connectDB()
    products = await Product.find({ featured: true }).lean()
    products = products.map(p => ({
      ...p,
      _id: p._id.toString(),
    }))
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }

  return <HomeClient products={products} />
}