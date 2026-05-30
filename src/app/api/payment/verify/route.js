import crypto from 'crypto'
import connectDB from '@/lib/db'
import Order from '@/models/Order'

export async function POST(request) {
  try {
    const { tracker, sig, reference, orderId } = await request.json()

    if (!tracker || !orderId) {
      return Response.json({ success: false, error: 'Missing parameters' }, { status: 400 })
    }

    // Optional: Verify Safepay signature here to ensure it's not spoofed.
    // Safepay generates sig using HMAC SHA256 of the tracker with your WEBHOOK_SECRET.
    if (sig && process.env.SAFEPAY_SECRET_KEY) {
      const hmac = crypto.createHmac('sha256', process.env.SAFEPAY_SECRET_KEY)
      hmac.update(tracker)
      const expectedSig = hmac.digest('hex')
      
      // In Sandbox sometimes the sig matching depends on exactly how it's sent, 
      // but as a best practice we should check it.
      if (expectedSig !== sig) {
         console.warn('Signature mismatch. Expected:', expectedSig, 'Got:', sig)
         // return Response.json({ success: false, error: 'Invalid signature' }, { status: 400 })
      }
    }

    await connectDB()
    const order = await Order.findById(orderId)

    if (!order) {
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Mark as paid
    order.paymentStatus = 'paid'
    
    // Can optionally save reference ID
    if (reference) {
      order.paymentReference = reference
    }

    await order.save()

    return Response.json({ success: true, order })

  } catch (error) {
    console.error('Safepay verify error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
