import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found ✅' : 'Missing ❌')

const { default: connectDB } = await import('../lib/db.js')
const { default: Product } = await import('../models/Product.js')
const { default: User } = await import('../models/User.js')
const { default: Category } = await import('../models/Category.js')

const categories = [
  { name: 'Men', status: 'active' },
  { name: 'Women', status: 'active' },
  { name: 'Accessories', status: 'active' },
  { name: 'Home', status: 'active' },
]

const products = [
  {
    name: 'Linen Overshirt',
    price: 189,
    category: 'Men',
    badge: 'New',
    description: 'A relaxed-fit overshirt crafted from premium French linen. Perfect for layering year-round.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Sand'],
    details: ['100% French linen', 'Mother-of-pearl buttons', 'Curved hem', 'Made in Portugal'],
    featured: true,
  },
  {
    name: 'Wool Blend Coat',
    price: 349,
    category: 'Women',
    badge: 'Bestseller',
    description: 'An elegant double-faced wool blend coat with a relaxed silhouette.',
    sizes: ['S', 'M', 'L'],
    colors: ['Camel', 'Charcoal', 'Black'],
    details: ['80% wool, 20% cashmere', 'Double-faced fabric', 'Notched lapel', 'Self-tie belt', 'Made in Italy'],
    featured: true,
  },
  {
    name: 'Leather Tote',
    price: 259,
    category: 'Accessories',
    badge: null,
    description: 'A spacious everyday tote in full-grain vegetable-tanned leather.',
    sizes: ['One Size'],
    colors: ['Black', 'Tan', 'Burgundy'],
    details: ['Full-grain leather', 'Vegetable-tanned', 'Interior zip pocket', 'Magnetic closure', 'Made in Spain'],
    featured: true,
  },
  {
    name: 'Ceramic Vase Set',
    price: 89,
    category: 'Home',
    badge: 'Limited',
    description: 'A set of three hand-thrown ceramic vases in varying heights.',
    sizes: ['Set of 3'],
    colors: ['Matte White', 'Terracotta', 'Charcoal'],
    details: ['Hand-thrown ceramic', 'Matte glaze', 'Set of 3', 'Height: 15cm, 22cm, 30cm', 'Made in Japan'],
    featured: true,
  },
  {
    name: 'Cashmere Sweater',
    price: 225,
    category: 'Women',
    badge: 'New',
    description: 'A lightweight cashmere crewneck with ribbed cuffs and hem.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Cream', 'Grey', 'Navy'],
    details: ['100% Grade-A cashmere', 'Ribbed cuffs and hem', 'Crewneck', 'Made in Scotland'],
    featured: true,
  },
  {
    name: 'Minimalist Watch',
    price: 320,
    category: 'Accessories',
    badge: null,
    description: 'A slim-profile timepiece with a Swiss movement and sapphire crystal glass.',
    sizes: ['One Size'],
    colors: ['Silver/Black', 'Gold/White', 'Rose Gold/Tan'],
    details: ['Swiss quartz movement', 'Sapphire crystal', '38mm case', 'Genuine leather strap', 'Water resistant 50m'],
    featured: false,
  },
]

const users = [
  {
    name: 'Super Admin',
    email: 'admin@minimal.com',
    password: 'admin123',
    role: 'super_admin',
  },
  {
    name: 'Staff Member',
    email: 'staff@minimal.com',
    password: 'staff123',
    role: 'staff',
  },
  {
    name: 'Test Customer',
    email: 'customer@minimal.com',
    password: 'customer123',
    role: 'customer',
  },
]

async function seed() {
  try {
    await connectDB()
    
    await Category.deleteMany()
    await Category.insertMany(categories)
    console.log('✅ Categories seeded')
    
    await Product.deleteMany()
    await Product.insertMany(products)
    console.log('✅ Products seeded')
    
    await User.deleteMany()
    for (const userData of users) {
      await User.create(userData)
    }
    console.log('✅ Users seeded')
    
    console.log('✅ Database seeded successfully')
    console.log('📧 Admin: admin@minimal.com / admin123')
    console.log('📧 Staff: staff@minimal.com / staff123')
    console.log('📧 Customer: customer@minimal.com / customer123')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seed()