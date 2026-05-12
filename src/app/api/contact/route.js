import { sendContactEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    await sendContactEmail({ name, email, subject, message })

    return Response.json({ success: true, message: 'Message sent' }, { status: 200 })
  } catch (error) {
    console.error('Contact error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}