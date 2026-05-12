import connectDB from '@/lib/db'
import Product from '@/models/Product'
import ShopClient from '@/components/ShopClient'

export default async function Shop() {
  let products = []

  try {
    await connectDB()
    products = await Product.find().lean()
    products = products.map(p => ({
      ...p,
      _id: p._id.toString(),
    }))
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }

  return <ShopClient products={products} />
}