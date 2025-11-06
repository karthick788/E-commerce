const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  brand: String,
  rating: Number,
  numReviews: Number,
  countInStock: Number,
  isFeatured: Boolean,
  discount: Number,
  attributes: Object,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const products = [
  // Mobiles
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
    price: 1199.99,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'],
    category: 'Mobiles',
    brand: 'Apple',
    rating: 4.8,
    numReviews: 245,
    countInStock: 50,
    isFeatured: true,
    discount: 5,
    attributes: { storage: '256GB', color: 'Natural Titanium', ram: '8GB' }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Flagship Android phone with S Pen, 200MP camera, and AI features',
    price: 1099.99,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
    category: 'Mobiles',
    brand: 'Samsung',
    rating: 4.7,
    numReviews: 189,
    countInStock: 45,
    isFeatured: true,
    discount: 8,
    attributes: { storage: '512GB', color: 'Titanium Gray', ram: '12GB' }
  },
  {
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    description: 'Pure Android experience with best-in-class AI photography',
    price: 899.99,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
    category: 'Mobiles',
    brand: 'Google',
    rating: 4.6,
    numReviews: 156,
    countInStock: 40,
    isFeatured: false,
    discount: 10,
    attributes: { storage: '128GB', color: 'Obsidian', ram: '12GB' }
  },
  {
    name: 'OnePlus 12',
    slug: 'oneplus-12',
    description: 'Fast charging flagship with Hasselblad camera system',
    price: 699.99,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
    category: 'Mobiles',
    brand: 'OnePlus',
    rating: 4.5,
    numReviews: 134,
    countInStock: 60,
    isFeatured: false,
    discount: 12,
    attributes: { storage: '256GB', color: 'Flowy Emerald', ram: '16GB' }
  },
  {
    name: 'Xiaomi 14 Pro',
    slug: 'xiaomi-14-pro',
    description: 'Premium smartphone with Leica optics and 120W fast charging',
    price: 799.99,
    images: ['https://images.unsplash.com/photo-1592286927505-b6b8b1a5b66f?w=500'],
    category: 'Mobiles',
    brand: 'Xiaomi',
    rating: 4.4,
    numReviews: 98,
    countInStock: 35,
    isFeatured: false,
    discount: 15,
    attributes: { storage: '512GB', color: 'Black', ram: '12GB' }
  },

  // Dresses
  {
    name: 'Floral Summer Maxi Dress',
    slug: 'floral-summer-maxi-dress',
    description: 'Lightweight cotton maxi dress with beautiful floral print, perfect for summer',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
    category: 'Dresses',
    brand: 'Zara',
    rating: 4.5,
    numReviews: 87,
    countInStock: 30,
    isFeatured: true,
    discount: 20,
    attributes: { size: 'M', material: 'Cotton', color: 'Floral' }
  },
  {
    name: 'Elegant Evening Gown',
    slug: 'elegant-evening-gown',
    description: 'Stunning satin evening gown for special occasions',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500'],
    category: 'Dresses',
    brand: 'H&M',
    rating: 4.7,
    numReviews: 65,
    countInStock: 20,
    isFeatured: true,
    discount: 15,
    attributes: { size: 'L', material: 'Satin', color: 'Navy Blue' }
  },
  {
    name: 'Casual Denim Dress',
    slug: 'casual-denim-dress',
    description: 'Comfortable denim dress for everyday wear',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'],
    category: 'Dresses',
    brand: 'Forever 21',
    rating: 4.3,
    numReviews: 112,
    countInStock: 45,
    isFeatured: false,
    discount: 10,
    attributes: { size: 'S', material: 'Denim', color: 'Blue' }
  },
  {
    name: 'Bohemian Midi Dress',
    slug: 'bohemian-midi-dress',
    description: 'Flowy bohemian style midi dress with embroidery',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500'],
    category: 'Dresses',
    brand: 'Free People',
    rating: 4.6,
    numReviews: 73,
    countInStock: 25,
    isFeatured: false,
    discount: 18,
    attributes: { size: 'M', material: 'Rayon', color: 'Cream' }
  },

  // Shoes
  {
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Comfortable running shoes with Air Max cushioning',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    category: 'Shoes',
    brand: 'Nike',
    rating: 4.7,
    numReviews: 234,
    countInStock: 80,
    isFeatured: true,
    discount: 10,
    attributes: { size: '10', color: 'Black/White', type: 'Running' }
  },
  {
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    description: 'Premium running shoes with Boost technology',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'],
    category: 'Shoes',
    brand: 'Adidas',
    rating: 4.8,
    numReviews: 198,
    countInStock: 65,
    isFeatured: true,
    discount: 12,
    attributes: { size: '9', color: 'Core Black', type: 'Running' }
  },
  {
    name: 'Classic Leather Sneakers',
    slug: 'classic-leather-sneakers',
    description: 'Timeless white leather sneakers for casual wear',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'],
    category: 'Shoes',
    brand: 'Converse',
    rating: 4.5,
    numReviews: 167,
    countInStock: 90,
    isFeatured: false,
    discount: 8,
    attributes: { size: '8', color: 'White', type: 'Casual' }
  },
  {
    name: 'Formal Oxford Shoes',
    slug: 'formal-oxford-shoes',
    description: 'Elegant leather oxford shoes for formal occasions',
    price: 119.99,
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500'],
    category: 'Shoes',
    brand: 'Clarks',
    rating: 4.6,
    numReviews: 89,
    countInStock: 40,
    isFeatured: false,
    discount: 15,
    attributes: { size: '11', color: 'Brown', type: 'Formal' }
  },
  {
    name: 'Hiking Boots Pro',
    slug: 'hiking-boots-pro',
    description: 'Durable waterproof hiking boots for outdoor adventures',
    price: 159.99,
    images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500'],
    category: 'Shoes',
    brand: 'Timberland',
    rating: 4.7,
    numReviews: 145,
    countInStock: 35,
    isFeatured: false,
    discount: 20,
    attributes: { size: '10', color: 'Brown', type: 'Hiking' }
  },

  // Accessories
  {
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description: 'Stylish genuine leather crossbody bag with adjustable strap',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'],
    category: 'Accessories',
    brand: 'Coach',
    rating: 4.6,
    numReviews: 156,
    countInStock: 50,
    isFeatured: true,
    discount: 25,
    attributes: { material: 'Leather', color: 'Brown', size: 'Medium' }
  },
  {
    name: 'Designer Sunglasses',
    slug: 'designer-sunglasses',
    description: 'UV protection polarized sunglasses with metal frame',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'],
    category: 'Accessories',
    brand: 'Ray-Ban',
    rating: 4.8,
    numReviews: 234,
    countInStock: 75,
    isFeatured: true,
    discount: 15,
    attributes: { lensType: 'Polarized', frameColor: 'Gold', protection: 'UV400' }
  },
  {
    name: 'Silk Scarf Collection',
    slug: 'silk-scarf-collection',
    description: 'Luxurious 100% silk scarf with elegant patterns',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500'],
    category: 'Accessories',
    brand: 'Hermès',
    rating: 4.7,
    numReviews: 98,
    countInStock: 60,
    isFeatured: false,
    discount: 10,
    attributes: { material: 'Silk', size: '90x90cm', color: 'Multicolor' }
  },
  {
    name: 'Smartwatch Band Set',
    slug: 'smartwatch-band-set',
    description: 'Premium silicone watch bands compatible with Apple Watch',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    category: 'Accessories',
    brand: 'Generic',
    rating: 4.4,
    numReviews: 187,
    countInStock: 120,
    isFeatured: false,
    discount: 20,
    attributes: { material: 'Silicone', compatibility: 'Apple Watch', colors: '5 Pack' }
  },
  {
    name: 'Gold Plated Jewelry Set',
    slug: 'gold-plated-jewelry-set',
    description: 'Elegant necklace and earring set with gold plating',
    price: 69.99,
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'],
    category: 'Accessories',
    brand: 'Pandora',
    rating: 4.5,
    numReviews: 143,
    countInStock: 45,
    isFeatured: false,
    discount: 30,
    attributes: { material: 'Gold Plated', includes: 'Necklace + Earrings', style: 'Classic' }
  },
  {
    name: 'Leather Wallet',
    slug: 'leather-wallet',
    description: 'Slim genuine leather wallet with RFID protection',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'],
    category: 'Accessories',
    brand: 'Fossil',
    rating: 4.6,
    numReviews: 201,
    countInStock: 85,
    isFeatured: false,
    discount: 12,
    attributes: { material: 'Leather', color: 'Black', features: 'RFID Protection' }
  }
];

async function seedProducts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Insert new products
    console.log('Inserting new products...');
    const result = await Product.insertMany(products);
    console.log(`Successfully inserted ${result.length} products`);

    // Display summary
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    console.log('\nProducts by category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} products`);
    });

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
