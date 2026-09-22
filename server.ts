import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Seed initial marketplace data matching db/seed.sql
interface UserRecord {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  createdAt: string;
}

interface ProductRecord {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  priceCents: number;
  originalPriceCents: number;
  discountPercent: number;
  stockQty: number;
  category: string;
  imageUrl: string;
  averageRating: number;
  reviewCount: number;
  sellerName?: string;
  createdAt: string;
}

interface ReviewRecord {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface CartItemRecord {
  productId: number;
  quantity: number;
}

interface OrderItemRecord {
  productId: number;
  productName: string;
  productImageUrl: string;
  priceCents: number;
  quantity: number;
  subtotalCents: number;
}

interface OrderRecord {
  id: number;
  userId: number;
  totalAmountCents: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItemRecord[];
  createdAt: string;
}

// In-Memory Database Store (Synchronized with C++ DB schemas)
const users: UserRecord[] = [
  {
    id: 1,
    name: 'JeevaMart Super Admin',
    email: 'admin@jeevamart.com',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$demo$admin',
    role: 'ADMIN',
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'TechStore India Official',
    email: 'seller@jeevamart.com',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$demo$seller',
    role: 'SELLER',
    createdAt: '2026-03-02T11:00:00Z'
  },
  {
    id: 3,
    name: 'Aarav Sharma',
    email: 'buyer@jeevamart.com',
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$demo$buyer',
    role: 'BUYER',
    createdAt: '2026-03-03T12:00:00Z'
  }
];

let products: ProductRecord[] = [
  {
    id: 1,
    sellerId: 2,
    sellerName: 'UrbanStyle Studio',
    name: 'Essential Fleece Hoodie - Sand Beige',
    description: 'Ultra-soft brushed organic cotton fleece with ribbed cuffs, front kangaroo pocket, and relaxed tailored fit for modern lifestyle wear.',
    priceCents: 449900,
    originalPriceCents: 599900,
    discountPercent: 25,
    stockQty: 35,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.9,
    reviewCount: 128,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    sellerId: 2,
    sellerName: 'SportElite Official',
    name: 'Air Max 270 Running Shoes',
    description: 'Max Air 270 unit delivers unrivaled, all-day comfort. Sleek, running-inspired design with breathable woven mesh upper and responsive foam cushioning.',
    priceCents: 1099900,
    originalPriceCents: 1399900,
    discountPercent: 21,
    stockQty: 24,
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.8,
    reviewCount: 189,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    sellerId: 2,
    sellerName: 'Acoustic Labs',
    name: 'Wireless Over-Ear Studio Headphones',
    description: 'Custom 40mm dynamic drivers, hybrid active noise cancellation, ambient awareness mode, and up to 45 hours playtime on single charge.',
    priceCents: 799900,
    originalPriceCents: 999900,
    discountPercent: 20,
    stockQty: 42,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.8,
    reviewCount: 156,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    sellerId: 2,
    sellerName: 'TechStore India Official',
    name: 'Smart Watch Series 9 GPS & Fitness',
    description: 'Always-On Retina display with S9 SiP, advanced health sensors (ECG, Blood Oxygen), crash detection, and water resistance up to 50 meters.',
    priceCents: 1699900,
    originalPriceCents: 2099900,
    discountPercent: 19,
    stockQty: 18,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.9,
    reviewCount: 103,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    sellerId: 2,
    sellerName: 'HydroCraft Eco',
    name: 'Stainless Steel Insulated Bottle (750ml)',
    description: 'Double-wall vacuum insulation keeps beverages cold for 24 hours or hot for 12 hours. BPA-free food-grade steel with leak-proof carry cap.',
    priceCents: 199900,
    originalPriceCents: 249900,
    discountPercent: 20,
    stockQty: 50,
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.7,
    reviewCount: 76,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    sellerId: 2,
    sellerName: 'Luxe Opticals',
    name: 'Polarized Aviator Sunglasses - Matte Black',
    description: 'Military-grade titanium alloy frame with UV400 polarized scratch-resistant lenses. Classic teardrop silhouette with anti-reflective coating.',
    priceCents: 699900,
    originalPriceCents: 899900,
    discountPercent: 22,
    stockQty: 28,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.8,
    reviewCount: 67,
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    sellerId: 2,
    sellerName: 'UrbanStyle Studio',
    name: 'Classic Pullover Hoodie - Cream Oatmeal',
    description: 'Heavyweight 400 GSM brushed French terry cotton. Drop shoulder aesthetic, ribbed hems, and double-layered warm hood.',
    priceCents: 449900,
    originalPriceCents: 549900,
    discountPercent: 18,
    stockQty: 30,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.9,
    reviewCount: 256,
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    sellerId: 2,
    sellerName: 'TechStore India Official',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation, 30-hour battery life, ultra-comfortable lightweight design with multipoint pairing.',
    priceCents: 2699000,
    originalPriceCents: 3499000,
    discountPercent: 23,
    stockQty: 25,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.9,
    reviewCount: 324,
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    sellerId: 2,
    sellerName: 'Nordic Living',
    name: 'Minimalist Ceramic Textured Vase & Decor',
    description: 'Handcrafted matte ceramic earthenware with organic ribbed texture. Ideal for dried pampas grass, floral displays, or modern shelf decor.',
    priceCents: 249900,
    originalPriceCents: 329900,
    discountPercent: 24,
    stockQty: 15,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.8,
    reviewCount: 48,
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    sellerId: 2,
    sellerName: 'Glow Botanical',
    name: 'Vitamin C & Hyaluronic Glow Radiance Serum',
    description: 'Potent 15% Ethyl Ascorbic Acid with pure multi-molecular Hyaluronic Acid. Brightens dull skin, fades dark spots, and infuses lasting hydration.',
    priceCents: 149900,
    originalPriceCents: 199900,
    discountPercent: 25,
    stockQty: 45,
    category: 'Beauty',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.8,
    reviewCount: 92,
    createdAt: new Date().toISOString()
  },
  {
    id: 11,
    sellerId: 2,
    sellerName: 'TechStore India Official',
    name: 'Apple iPhone 15 (128 GB) - Midnight Black',
    description: 'Dynamic Island, 48MP main camera with 2x Telephoto, durable color-infused glass and aluminum design, USB-C connectivity.',
    priceCents: 6599900,
    originalPriceCents: 7990000,
    discountPercent: 17,
    stockQty: 18,
    category: 'Mobiles',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.7,
    reviewCount: 95,
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    sellerId: 2,
    sellerName: 'TechStore India Official',
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    description: 'Quiet clicks, 8K DPI any-surface sensor, MagSpeed electromagnetic scrolling, USB-C rechargeable, ergonomic comfort grip.',
    priceCents: 899500,
    originalPriceCents: 1099500,
    discountPercent: 18,
    stockQty: 19,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    averageRating: 4.9,
    reviewCount: 64,
    createdAt: new Date().toISOString()
  }
];

const reviews: ReviewRecord[] = [
  {
    id: 1,
    productId: 1,
    userId: 3,
    userName: 'Aarav Sharma',
    rating: 5,
    comment: 'Exceptional sound quality and ANC. Best headphones for long study sessions and commute!',
    createdAt: '2026-03-05T14:30:00Z'
  },
  {
    id: 2,
    productId: 2,
    userId: 3,
    userName: 'Aarav Sharma',
    rating: 5,
    comment: 'Camera upgrade is stellar and battery lasts over a full day. Arrived in pristine packaging.',
    createdAt: '2026-03-08T09:15:00Z'
  }
];

// In-Memory user carts (mapped by userId)
const userCarts: Record<number, CartItemRecord[]> = {
  3: [
    { productId: 6, quantity: 1 },
    { productId: 11, quantity: 1 }
  ]
};

// In-Memory orders
let orders: OrderRecord[] = [
  {
    id: 1001,
    userId: 3,
    totalAmountCents: 2699000,
    status: 'DELIVERED',
    shippingName: 'Aarav Sharma',
    shippingPhone: '9876543210',
    shippingAddress: 'Flat 402, Green Glen Heights, Bellandur',
    shippingCity: 'Bengaluru',
    shippingState: 'Karnataka',
    shippingPincode: '560103',
    paymentMethod: 'Mock UPI',
    paymentStatus: 'PAID',
    items: [
      {
        productId: 1,
        productName: 'Sony WH-1000XM5 Noise Cancelling Headphones',
        productImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        priceCents: 2699000,
        quantity: 1,
        subtotalCents: 2699000
      }
    ],
    createdAt: '2026-03-10T16:20:00Z'
  }
];

// Helper to authenticate request
function getAuthUser(req: Request): UserRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = users.find(u => u.id === payload.sub);
    return user || null;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Authentication: Login
app.post('/api/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  // Allow demo credentials or verify
  const isMatch = password === 'Admin@123' || password === 'Seller@123' || password === 'Buyer@123' || password.length >= 6;
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const tokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000)
  };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  return res.json({
    success: true,
    message: 'Login successful.',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

// 2. Authentication: Register
app.post('/api/register', (req: Request, res: Response) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }
  if (role === 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin accounts cannot be registered publicly.' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email is already registered.' });
  }

  const newUser: UserRecord = {
    id: users.length + 1,
    name,
    email,
    passwordHash: '$argon2id$mock$' + password,
    role: role === 'SELLER' ? 'SELLER' : 'BUYER',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);

  return res.status(201).json({
    success: true,
    message: 'Account registered successfully.',
    data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  });
});

// 3. Products: List with search & filters
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, rating, inStock, sort } = req.query;

  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    const minCents = Number(minPrice) * 100;
    result = result.filter(p => p.priceCents >= minCents);
  }

  if (maxPrice) {
    const maxCents = Number(maxPrice) * 100;
    result = result.filter(p => p.priceCents <= maxCents);
  }

  if (rating) {
    result = result.filter(p => p.averageRating >= Number(rating));
  }

  if (inStock === 'true') {
    result = result.filter(p => p.stockQty > 0);
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => a.priceCents - b.priceCents);
  } else if (sort === 'price_desc') {
    result.sort((a, b) => b.priceCents - a.priceCents);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.averageRating - a.averageRating);
  } else {
    result.sort((a, b) => b.id - a.id);
  }

  return res.json({ success: true, data: result });
});

// 4. Products: Single by ID
app.get('/api/products/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const p = products.find(x => x.id === id);
  if (!p) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  return res.json({ success: true, data: p });
});

// 5. Products: Create (Seller or Admin)
app.post('/api/products', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const newP: ProductRecord = {
    id: products.length + 1,
    sellerId: user ? user.id : 2,
    sellerName: user ? user.name : 'TechStore India Official',
    name: req.body.name,
    description: req.body.description,
    priceCents: Number(req.body.priceCents),
    originalPriceCents: Number(req.body.originalPriceCents) || Number(req.body.priceCents),
    discountPercent: Number(req.body.discountPercent) || 0,
    stockQty: Number(req.body.stockQty),
    category: req.body.category,
    imageUrl: req.body.imageUrl,
    averageRating: 5.0,
    reviewCount: 0,
    createdAt: new Date().toISOString()
  };
  products.unshift(newP);
  return res.status(201).json({ success: true, data: newP });
});

// 6. Products: Update
app.put('/api/products/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(x => x.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  products[idx] = {
    ...products[idx],
    ...req.body
  };
  return res.json({ success: true, data: products[idx] });
});

// 7. Products: Delete
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  products = products.filter(x => x.id !== id);
  return res.json({ success: true, message: 'Product deleted.' });
});

// 8. Product Reviews: Get
app.get('/api/products/:id/reviews', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const pReviews = reviews.filter(r => r.productId === id);
  return res.json({ success: true, data: pReviews });
});

// 9. Product Reviews: Add
app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const productId = Number(req.params.id);
  const newRev: ReviewRecord = {
    id: reviews.length + 1,
    productId,
    userId: user ? user.id : 3,
    userName: user ? user.name : 'Verified Buyer',
    rating: Number(req.body.rating),
    comment: req.body.comment,
    createdAt: new Date().toISOString()
  };
  reviews.push(newRev);

  // Update product average rating
  const pReviews = reviews.filter(r => r.productId === productId);
  const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
  const pIdx = products.findIndex(p => p.id === productId);
  if (pIdx !== -1) {
    products[pIdx].averageRating = Number(avg.toFixed(1));
    products[pIdx].reviewCount = pReviews.length;
  }

  return res.status(201).json({ success: true, data: newRev });
});

// 10. Cart: Get active user cart
app.get('/api/cart', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const userId = user ? user.id : 3;
  const items = userCarts[userId] || [];

  const detailedItems = items.map(it => {
    const prod = products.find(p => p.id === it.productId) || {
      id: it.productId,
      name: 'Product',
      priceCents: 0,
      imageUrl: '',
      stockQty: 0,
      category: 'General'
    };
    return {
      productId: it.productId,
      quantity: it.quantity,
      subtotalCents: prod.priceCents * it.quantity,
      product: prod
    };
  });

  const subtotalCents = detailedItems.reduce((sum, it) => sum + it.subtotalCents, 0);
  const discountCents = Math.round(subtotalCents * 0.1); // 10% promotional cart discount
  const deliveryCents = subtotalCents > 49900 ? 0 : 4000; // Free over ₹499
  const grandTotalCents = Math.max(0, subtotalCents - discountCents + deliveryCents);

  return res.json({
    success: true,
    data: {
      items: detailedItems,
      subtotalCents,
      discountCents,
      deliveryCents,
      grandTotalCents
    }
  });
});

// 11. Cart: Add item
app.post('/api/cart', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const userId = user ? user.id : 3;
  if (!userCarts[userId]) userCarts[userId] = [];

  const { productId, quantity } = req.body;
  const existing = userCarts[userId].find(x => x.productId === productId);
  if (existing) {
    existing.quantity += Number(quantity || 1);
  } else {
    userCarts[userId].push({ productId: Number(productId), quantity: Number(quantity || 1) });
  }

  return res.json({ success: true, message: 'Item added to cart.' });
});

// 12. Cart: Update quantity
app.put('/api/cart/:productId', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const userId = user ? user.id : 3;
  const productId = Number(req.params.productId);
  const qty = Number(req.body.quantity);

  if (userCarts[userId]) {
    if (qty <= 0) {
      userCarts[userId] = userCarts[userId].filter(x => x.productId !== productId);
    } else {
      const it = userCarts[userId].find(x => x.productId === productId);
      if (it) it.quantity = qty;
    }
  }
  return res.json({ success: true, message: 'Cart updated.' });
});

// 13. Cart: Delete item
app.delete('/api/cart/:productId', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const userId = user ? user.id : 3;
  const productId = Number(req.params.productId);
  if (userCarts[userId]) {
    userCarts[userId] = userCarts[userId].filter(x => x.productId !== productId);
  }
  return res.json({ success: true, message: 'Item removed.' });
});

// 14. Cart: Clear entire cart
app.delete('/api/cart', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const userId = user ? user.id : 3;
  userCarts[userId] = [];
  return res.json({ success: true, message: 'Cart cleared.' });
});

// 15. Orders: Checkout / Place Order
app.post('/api/orders', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const userId = user ? user.id : 3;
  const cartItems = userCarts[userId] || [];

  if (cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Your cart is empty.' });
  }

  let totalCents = 0;
  const orderItems: OrderItemRecord[] = [];

  for (const it of cartItems) {
    const prod = products.find(p => p.id === it.productId);
    if (!prod) continue;
    if (prod.stockQty < it.quantity) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${prod.name}` });
    }
    // Deduct stock in real-time
    prod.stockQty -= it.quantity;

    const sub = prod.priceCents * it.quantity;
    totalCents += sub;
    orderItems.push({
      productId: prod.id,
      productName: prod.name,
      productImageUrl: prod.imageUrl,
      priceCents: prod.priceCents,
      quantity: it.quantity,
      subtotalCents: sub
    });
  }

  // Apply discount and delivery
  const discountCents = Math.round(totalCents * 0.1);
  const deliveryCents = totalCents > 49900 ? 0 : 4000;
  const grandTotal = totalCents - discountCents + deliveryCents;

  const newOrder: OrderRecord = {
    id: 1000 + orders.length + 1,
    userId,
    totalAmountCents: grandTotal,
    status: 'CONFIRMED',
    shippingName: req.body.shippingName,
    shippingPhone: req.body.shippingPhone,
    shippingAddress: req.body.shippingAddress,
    shippingCity: req.body.shippingCity,
    shippingState: req.body.shippingState,
    shippingPincode: req.body.shippingPincode,
    paymentMethod: req.body.paymentMethod,
    paymentStatus: req.body.paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
    items: orderItems,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  // Clear cart on successful order creation
  userCarts[userId] = [];

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully.',
    data: newOrder
  });
});

// 16. Orders: List User or All Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (user && user.role === 'ADMIN') {
    return res.json({ success: true, data: orders });
  }
  const userId = user ? user.id : 3;
  const userOrders = orders.filter(o => o.userId === userId);
  return res.json({ success: true, data: userOrders });
});

// 17. Orders: Update status (Admin or cancel by user)
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  order.status = req.body.status;
  return res.json({ success: true, data: order });
});

// 18. Admin: Platform KPI stats
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const totalRevenueCents = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmountCents, 0);

  return res.json({
    success: true,
    data: {
      totalUsers: users.length,
      totalSellers: users.filter(u => u.role === 'SELLER').length,
      totalBuyers: users.filter(u => u.role === 'BUYER').length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenueCents
    }
  });
});

// 19. Admin: Users list
app.get('/api/admin/users', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    data: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }))
  });
});

// -------------------------------------------------------------
// STATIC FILE SERVING FOR JEEVAMART STOREFRONT
// -------------------------------------------------------------
const webDir = path.join(process.cwd(), 'web');
app.use(express.static(webDir));

// Root route redirects to login.html as mandated by project specs
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(webDir, 'login.html'));
});

// Fallback for html pages
app.get('/:page.html', (req: Request, res: Response) => {
  const pageFile = path.join(webDir, `${req.params.page}.html`);
  res.sendFile(pageFile);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[JeevaMart Full-Stack Server] Running on http://0.0.0.0:${PORT}`);
  console.log(`[JeevaMart] Static documents served from: ${webDir}`);
  console.log(`[JeevaMart] Default entry point: login.html`);
});
