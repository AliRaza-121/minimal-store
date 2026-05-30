import connectDB from '@/lib/db'
import Settings from '@/models/Settings'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET(request) {
  try {
    await connectDB()
    let settings = await Settings.findOne()
    
    // If no settings document exists, create a default one
    if (!settings) {
      settings = await Settings.create({ isAcceptingOrders: true })
    }

    return Response.json({ success: true, settings }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    // Basic auth check
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return Response.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    await connectDB()
    
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings()
    }

    if (body.isAcceptingOrders !== undefined) {
      settings.isAcceptingOrders = body.isAcceptingOrders
    }

    await settings.save()

    return Response.json({ success: true, settings }, { status: 200 })
  } catch (error) {
    console.error('Settings update error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
