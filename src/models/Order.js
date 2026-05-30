import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    items: [
      {
        name: String,
        price: Number,
        color: String,
        size: String,
        quantity: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'jazzcash', 'easypaisa', 'bank_transfer'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    customer: {
      name: String,
      email: String,
      address: String,
      city: String,
      country: String,
      zip: String,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Order || mongoose.model('Order', orderSchema)