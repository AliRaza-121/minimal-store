import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"MINIMAL Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Verification Code',
    html: `
      <div style="max-width:500px;margin:auto;font-family:sans-serif;background:#111;color:#f5f5f5;padding:40px;border:1px solid #2a2a2a">
        <h2 style="color:#C9A84C;font-weight:300;letter-spacing:4px;text-align:center">MINIMAL</h2>
        <p style="font-size:16px;text-align:center;margin:30px 0">Your verification code is:</p>
        <div style="text-align:center;font-size:36px;letter-spacing:8px;color:#C9A84C;font-weight:300;margin:20px 0">${otp}</div>
        <p style="font-size:12px;color:#9CA3AF;text-align:center;margin-top:30px">This code expires in 5 minutes.<br/>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  })
}
export async function sendContactEmail({ name, email, subject, message }) {
  await transporter.sendMail({
    from: `"MINIMAL Store" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to: 'aliraaza701@gmail.com',
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="max-width:500px;margin:auto;font-family:sans-serif;background:#111;color:#f5f5f5;padding:40px;border:1px solid #2a2a2a">
        <h2 style="color:#C9A84C;font-weight:300;letter-spacing:4px;text-align:center;margin-bottom:30px">MINIMAL</h2>
        <p style="font-size:14px;color:#9CA3AF;margin-bottom:5px">New message from contact form</p>
        <div style="background:#1a1a1a;padding:20px;border:1px solid #2a2a2a;margin-top:15px">
          <p style="color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:2px">${subject}</p>
          <p style="color:#f5f5f5;font-size:14px;line-height:1.6;margin-top:10px">${message}</p>
        </div>
        <div style="margin-top:20px;padding-top:20px;border-top:1px solid #2a2a2a">
          <p style="color:#f5f5f5;font-size:13px;margin:0"><strong>${name}</strong></p>
          <p style="color:#9CA3AF;font-size:12px;margin:5px 0 0">${email}</p>
        </div>
        <p style="font-size:11px;color:#555;text-align:center;margin-top:25px">Reply to this email to respond directly to ${name}</p>
      </div>
    `,
  })
}