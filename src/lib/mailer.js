// This is a utility to handle transactional emails.
// In a true production environment, you would use Resend, SendGrid, or Nodemailer here.
// For now, it securely logs the email contents to the terminal console.

export const sendOrderConfirmationEmail = async (order, customerEmail, customerName) => {
  const isDev = process.env.NODE_ENV !== 'production'
  
  const emailContent = `
==================================================
EMAIL SYSTEM [MOCK]
To: ${customerEmail} (${customerName})
Subject: Order Confirmation - MINIMAL #${order._id.toString().substring(order._id.toString().length - 8).toUpperCase()}
--------------------------------------------------
Hi ${customerName},

Thank you for your order! We're preparing your items 
for shipment. 

Order Total: Rs. ${order.total}
Items:
${order.items.map(i => `- ${i.name} (${i.color}, ${i.size}) x${i.quantity}`).join('\n')}

We will notify you once it ships.
==================================================
  `

  if (isDev) {
    console.log(emailContent)
    return { success: true, message: 'Email logged to console in dev mode.' }
  } else {
    // TODO: Plug in Resend or SendGrid API here
    // Example:
    // await resend.emails.send({ ... })
    console.log('[PROD] Sending email via mocked service:\n', emailContent)
    return { success: true, message: 'Email sent via mock provider.' }
  }
}
