import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    details: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    hoverImage: {
      type: String,
      default: '',
    },
    hoverImagePublicId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

export default mongoose.models.Product || mongoose.model('Product', productSchema)