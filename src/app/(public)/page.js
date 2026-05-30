import connectDB from '@/lib/db'
import Product from '@/models/Product'
import Lookbook from '@/models/Lookbook'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let products = []
  let lookbook = []
  let trending = []

  try {
    await connectDB()
    products = await Product.find({ featured: true }).lean()
    products = products.map(p => ({
      ...p,
      _id: p._id.toString(),
    }))

    lookbook = await Lookbook.find({ active: true }).sort({ position: 1 }).lean()
    lookbook = lookbook.map(item => ({
      ...item,
      _id: item._id.toString(),
    }))

    trending = await Product.find({ trending: true }).sort({ createdAt: -1 }).limit(5).lean()
    trending = trending.map(p => ({
      ...p,
      _id: p._id.toString(),
    }))
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }

  return <HomeClient products={products} lookbook={lookbook} trending={trending} />
}