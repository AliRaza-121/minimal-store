import connectDB from '@/lib/db'
import Order from '@/models/Order'
import { Safepay } from '@sfpy/node-sdk'

export async function POST(request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return Response.json({ success: false, error: 'Order ID is required' }, { status: 400 })
    }

    await connectDB()
    const order = await Order.findById(orderId)

    if (!order) {
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    const safepay = new Safepay({
      environment: 'sandbox',
      apiKey: process.env.SAFEPAY_API_KEY,
      v1Secret: process.env.SAFEPAY_SECRET_KEY,
      webhookSecret: process.env.SAFEPAY_SECRET_KEY
    })

    // Safepay SDK for this version expects the exact float amount
    const { token } = await safepay.payments.create({
      amount: order.total,
      currency: 'PKR'
    })

    if (!token) {
      return Response.json({ success: false, error: 'Failed to initialize Safepay token' }, { status: 500 })
    }
    
    // Construct the redirect URL where the customer completes payment
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success`
    
    // 2. Create the secure checkout link using the token
    const checkoutUrl = safepay.checkout.create({
      token: token,
      orderId: orderId.toString(),
      cancelUrl: returnUrl,
      redirectUrl: returnUrl,
      source: 'custom',
      webhooks: true
    })

    return Response.json({ success: true, url: checkoutUrl })

  } catch (error) {
    console.error('Safepay init error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
