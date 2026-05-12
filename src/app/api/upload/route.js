import cloudinary from '@/lib/cloudinary'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) {
      return Response.json({ success: false, error: 'No image provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'minimal-store',
    })

    return Response.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}