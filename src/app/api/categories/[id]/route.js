import connectDB from '@/lib/db'
import Category from '@/models/Category'
import Product from '@/models/Product'

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const category = await Category.findByIdAndUpdate(id, body, { new: true })

    if (!category) {
      return Response.json({ success: false, error: 'Category not found' }, { status: 404 })
    }

    return Response.json({ success: true, category }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params

    const category = await Category.findById(id)
    if (!category) {
      return Response.json({ success: false, error: 'Category not found' }, { status: 404 })
    }

    await Product.updateMany(
      { category: category.name },
      { category: 'Uncategorized' }
    )

    await Category.findByIdAndDelete(id)

    return Response.json({ success: true, message: 'Category deleted' }, { status: 200 })
  } catch (error) {
    console.error('Delete category error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}