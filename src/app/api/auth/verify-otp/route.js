import connectDB from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request) {
  try {
    await connectDB()
    const { email, otp, type, name, password } = await request.json()

    if (!email || !otp || !type) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type,
      verified: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return Response.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // Mark OTP as verified
    otpRecord.verified = true
    await otpRecord.save()

    let user

    if (type === 'register') {
      if (!name || !password) {
        return Response.json({ success: false, error: 'Name and password are required' }, { status: 400 })
      }

      user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'customer',
        lastLogin: new Date(),
      })
    } else {
      user = await User.findOne({ email: email.toLowerCase() })
      user.lastLogin = new Date()
      await user.save()
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return Response.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 200 })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}