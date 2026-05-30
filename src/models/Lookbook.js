import mongoose from 'mongoose'

const lookbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '/shop',
    },
    position: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Lookbook || mongoose.model('Lookbook', lookbookSchema)
