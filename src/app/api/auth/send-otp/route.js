import connectDB from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import { sendOTP } from '@/lib/email'

export async function POST(request) {
  try {
    await connectDB()
    const { email, type } = await request.json()

    if (!email || !type) {
      return Response.json({ success: false, error: 'Email and type are required' }, { status: 400 })
    }

    if (!['register', 'login'].includes(type)) {
      return Response.json({ success: false, error: 'Invalid type' }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (type === 'register' && user) {
      return Response.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    if (type === 'login' && !user) {
      return Response.json({ success: false, error: 'No account found with this email' }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Delete old OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase() })

    // Save new OTP
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      type,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    })

    // Send email
    await sendOTP(email, otp)

    return Response.json({ success: true, message: 'OTP sent to your email' }, { status: 200 })
  } catch (error) {
    console.error('Send OTP error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}