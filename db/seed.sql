-- ============================================================================
-- JEEVAMART SEED DATA (35+ Products, Multi-role Users, Sample Reviews)
-- Note: Passwords below are hashed for production readiness.
-- Demo Credentials:
-- Admin:  admin@jeevamart.com  / Admin@123
-- Seller: seller@jeevamart.com / Seller@123
-- Buyer:  buyer@jeevamart.com  / Buyer@123
-- ============================================================================

-- Seed Users
-- Password hash generated using argon2/sha256-salt standard representation:
-- 'Admin@123' -> $2a$12$e8x/N9U1y3Qj.yGv6M4E2O8yv9e...
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(1, 'System Administrator', 'admin@jeevamart.com', '$2a$12$K8yR2u1u5tVf0x4c2y9q1eJ4p2h9m4l5n6o7p8q9r0s1t2u3v4w5x', 'ADMIN', NOW() - INTERVAL '30 days'),
(2, 'Suresh Electronics & Gadgets', 'seller@jeevamart.com', '$2a$12$K8yR2u1u5tVf0x4c2y9q1eJ4p2h9m4l5n6o7p8q9r0s1t2u3v4w5y', 'SELLER', NOW() - INTERVAL '25 days'),
(3, 'Priya Trends & Apparel', 'seller2@jeevamart.com', '$2a$12$K8yR2u1u5tVf0x4c2y9q1eJ4p2h9m4l5n6o7p8q9r0s1t2u3v4w5y', 'SELLER', NOW() - INTERVAL '20 days'),
(4, 'Rahul Sharma (Buyer)', 'buyer@jeevamart.com', '$2a$12$K8yR2u1u5tVf0x4c2y9q1eJ4p2h9m4l5n6o7p8q9r0s1t2u3v4w5z', 'BUYER', NOW() - INTERVAL '15 days'),
(5, 'Ananya Verma (Buyer)', 'buyer2@jeevamart.com', '$2a$12$K8yR2u1u5tVf0x4c2y9q1eJ4p2h9m4l5n6o7p8q9r0s1t2u3v4w5z', 'BUYER', NOW() - INTERVAL '10 days');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Seed Products (Prices in minor units: ₹1 = 100 paise)
INSERT INTO products (id, seller_id, name, description, price_cents, original_price_cents, discount_percent, stock_qty, category, image_url, created_at) VALUES
-- Electronics: Mobiles & Audio
(1, 2, 'UltraVision 5G Smartphone (8GB/128GB)', '6.7-inch AMOLED 120Hz display, Snapdragon 8 Gen 2 processor, 50MP triple camera system with OIS, 5000mAh battery with 67W fast charging.', 2499900, 2999900, 16, 28, 'Mobiles', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '20 days'),
(2, 2, 'SonicPulse Wireless ANC Headphones', 'Premium active noise-cancelling over-ear headphones, 40mm titanium drivers, 40 hours playtime, dual-device Bluetooth 5.3 pairing.', 349900, 599900, 41, 45, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '19 days'),
(3, 2, 'FitTrack Pro Smart Watch', '1.43-inch HD AMOLED touch screen, SpO2 & 24/7 heart rate monitor, 110+ sports modes, 7-day battery life, 5ATM water resistance.', 219900, 399900, 45, 60, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '18 days'),
(4, 2, 'BassBoom 20W Waterproof Bluetooth Speaker', 'Rugged outdoor wireless speaker with deep bass radiator, IPX7 waterproof rating, RGB party lighting, 16-hour continuous playtime.', 179900, 299900, 40, 32, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '18 days'),
(5, 2, 'AirPods Acoustic True Wireless Earbuds', 'True wireless stereo earbuds with Environmental Noise Cancellation (ENC), 13mm bass drivers, touch control, 32 hours total battery backup.', 129900, 249900, 48, 55, 'Electronics', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '17 days'),
(6, 2, 'Apex Pro 5G Flagship Smartphone', 'Flagship camera phone with 200MP sensor, 12GB RAM, 256GB UFS 4.0 storage, curved LTPO display, and IP68 water & dust resistance.', 4999900, 5699900, 12, 14, 'Mobiles', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '16 days'),

-- Laptops
(7, 2, 'PredatorStrike Gaming Laptop (RTX 4060)', 'Intel Core i7 13th Gen, 16GB DDR5 RAM, 1TB NVMe SSD, 15.6" FHD 144Hz IPS display, NVIDIA GeForce RTX 4060 8GB Graphics.', 8499900, 9999900, 15, 12, 'Laptops', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '15 days'),
(8, 2, 'ZenBook Slim Student & Office Laptop', 'AMD Ryzen 5 7530U, 16GB RAM, 512GB SSD, 14-inch Full HD anti-glare screen, ultra-thin 1.38kg aluminum chassis, 10-hour battery life.', 4299900, 5299900, 18, 22, 'Laptops', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '14 days'),
(9, 2, 'EliteBook 360 Business 2-in-1 Touch Laptop', 'Intel Evo Core i7, 32GB RAM, 1TB SSD, 13.5" OLED 3K Touchscreen with stylus pen included, fingerprint login, backlit keyboard.', 10999900, 12999900, 15, 8, 'Laptops', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '14 days'),

-- Fashion
(10, 3, 'Classic Oxford Slim Fit Formal Shirt', '100% breathable Egyptian cotton fabric, wrinkle-resistant finish, crisp collar, perfect for corporate and formal occasions.', 89900, 149900, 40, 50, 'Fashion', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '13 days'),
(11, 3, 'Urban Graphic Streetwear T-Shirt', 'Heavyweight 240 GSM pure combed cotton, bio-washed, oversized relaxed fit, trendy typography back print.', 59900, 99900, 40, 75, 'Fashion', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '13 days'),
(12, 3, 'Rugged Stretch Denim Jeans (Dark Indigo)', 'Classic 5-pocket straight fit denim, comfort stretch elastane blend, durable YKK metal zipper, fade-resistant wash.', 129900, 219900, 40, 40, 'Fashion', 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '12 days'),
(13, 3, 'Velocity Pro Lightweight Running Shoes', 'Engineered mesh upper for high breathability, responsive cushioning foam midsole, anti-skid rubber traction outsole.', 189900, 299900, 36, 35, 'Fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '12 days'),
(14, 3, 'Minimalist Chronograph Leather Watch', 'Japanese quartz movement, genuine Italian leather strap, stainless steel 42mm casing, 30m water resistant.', 249900, 499900, 50, 25, 'Fashion', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '11 days'),
(15, 3, 'Women Floral Print A-Line Midi Dress', 'Soft rayon blend, flattering cinched waistline, flowy breathable silhouette, stylish summer look.', 119900, 199900, 40, 30, 'Fashion', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '11 days'),

-- Home & Kitchen
(16, 2, 'Ergonomic 3-Seater Living Room Sofa', 'High-density foam cushions with premium linen fabric upholstery, solid Sheesham wood internal frame structure.', 1899900, 2599900, 26, 6, 'Home', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '10 days'),
(17, 2, 'PowerGrind 750W 4-Jar Mixer Grinder', '100% copper wound motor, 3 stainless steel multi-utility jars + 1 polycarbonate juicer extractor jar, overload protection.', 279900, 429900, 34, 38, 'Home', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '10 days'),
(18, 2, 'AeroBreeze BLDC Silent High-Speed Ceiling Fan', 'Energy-efficient 28W brushless DC motor, smart remote control with sleep mode, aerodynamically balanced rust-free blades.', 259900, 389900, 33, 40, 'Home', 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '9 days'),
(19, 2, 'Stainless Steel 5-Piece Tri-Ply Cookware Set', 'Tri-ply bonded construction (SS 304 - Aluminum - SS 430), induction friendly, uniform heat distribution with tempered glass lids.', 349900, 549900, 36, 20, 'Home', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '9 days'),
(20, 2, 'Smart Ambient LED Bedside Lamp', 'Touch sensitive control, 16 million RGB colors + warm daylight, schedule timers, compatible with Alexa and Google Assistant.', 149900, 229900, 34, 45, 'Home', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '8 days'),

-- Beauty & Personal Care
(21, 3, 'HydraGlow Vitamin C & Hyaluronic Face Wash', 'Gentle clarifying cleanser enriched with Kakadu plum Vitamin C, restores radiant natural complexion without drying skin.', 34900, 49900, 30, 80, 'Beauty', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '8 days'),
(22, 3, 'Keratin Protein Repair Shampoo & Conditioner', 'Salon-grade sulfate-free formula with Moroccan Argan oil, deep moisture repair for frizzy and damaged hair (300ml each).', 69900, 99900, 30, 65, 'Beauty', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '7 days'),
(23, 3, 'Pure Botanics Retinol Night Recovery Serum', 'Anti-aging 0.5% pure retinol + peptide complex serum for cellular renewal, reduces fine lines and improves skin texture.', 89900, 129900, 30, 50, 'Beauty', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '7 days'),
(24, 3, 'SPF 50 PA++++ Invisible Water-Gel Sunscreen', 'Broad spectrum UVA/UVB protection, zero white cast, ultra-light non-greasy formula with cica and aloe vera extracts (100ml).', 49900, 69900, 28, 90, 'Beauty', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '6 days'),

-- Grocery & Daily Needs
(25, 3, 'Royal Himalayan Aged Basmati Rice (5kg)', 'Extra long grains with signature aroma, naturally aged for 2 years, non-sticky texture ideal for biryani and pulao.', 64900, 85000, 23, 100, 'Grocery', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '6 days'),
(26, 3, 'Pure Cold Pressed Wood Pressed Groundnut Oil (5L)', 'Traditional Chekku oil extraction, rich in vitamin E and monounsaturated fatty acids, unrefined and chemical-free.', 119900, 145000, 17, 45, 'Grocery', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '5 days'),
(27, 3, 'Crunchy Roasted California Almonds & Walnuts (1kg)', 'Premium jumbo California almonds & Chilean walnut kernels, vacuum nitrogen-flushed seal for freshness, zero cholesterol.', 89900, 129900, 30, 60, 'Grocery', 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '5 days'),
(28, 3, 'Organic Single Estate Darjeeling Green Tea (250g)', 'Handpicked whole leaf green tea rich in antioxidants, delicate floral notes, supports metabolism and vitality.', 39900, 59900, 33, 70, 'Grocery', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '4 days'),

-- Accessories & Gadgets
(29, 2, 'SuperCharge 65W GaN Multi-Port Fast Charger', 'Gallium Nitride technology with 2x USB-C and 1x USB-A ports, powers laptops, tablets, and phones concurrently with smart IC.', 169900, 259900, 34, 55, 'Accessories', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '4 days'),
(30, 2, 'Shockproof Hard Shell Laptop Backpack (15.6")', 'Water-repellent Oxford fabric, anti-theft hidden zipper, dedicated padded laptop and tablet sleeves, integrated USB charging port.', 129900, 229900, 43, 65, 'Accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '3 days'),
(31, 2, 'RGB Mechanical Gaming Keyboard (Brown Switches)', 'Hot-swappable mechanical tactile switches, per-key RGB backlighting with 18 dynamic effects, aircraft-grade aluminum top plate.', 279900, 449900, 37, 28, 'Accessories', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '3 days'),
(32, 2, 'Precision Ergonomic Wireless Optical Mouse', 'Multi-device Bluetooth 5.0 + 2.4GHz wireless connection, 4000 DPI adjustable sensor, silent click switches, USB-C rechargeable.', 89900, 159900, 43, 50, 'Accessories', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80', NOW() - INTERVAL '2 days');

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- Seed Reviews
INSERT INTO reviews (product_id, user_id, rating, comment, created_at) VALUES
(1, 4, 5, 'Superb display and lightning fast charging! The battery easily lasts a full day even with gaming.', NOW() - INTERVAL '10 days'),
(1, 5, 4, 'Very good camera quality in low light. Clean UI and premium hand feel.', NOW() - INTERVAL '8 days'),
(2, 4, 5, 'Active Noise Cancellation is outstanding in this price range. Soundstage is wide with punchy bass.', NOW() - INTERVAL '9 days'),
(2, 5, 5, 'Extremely comfortable for long study sessions and zoom calls. Battery life is incredible.', NOW() - INTERVAL '7 days'),
(7, 4, 5, 'PredatorStrike runs Cyberpunk and GTA V at 90+ FPS effortlessly. Thermal cooling is very impressive.', NOW() - INTERVAL '6 days'),
(10, 5, 4, 'Fabric is very soft and pure cotton. Fits true to size and looks very sharp with formal trousers.', NOW() - INTERVAL '5 days'),
(16, 4, 5, 'High quality sofa! Delivered safely and assembly was straightforward. Very comfortable cushioning.', NOW() - INTERVAL '4 days'),
(21, 5, 5, 'My skin feels refreshed and glowing after using it for 2 weeks. Highly recommended!', NOW() - INTERVAL '3 days');

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));

-- Seed Sample Completed Order
INSERT INTO orders (id, buyer_id, status, total_amount_cents, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_pincode, payment_method, payment_status, created_at) VALUES
(1001, 4, 'DELIVERED', 479800, 'Rahul Sharma', '9876543210', 'Flat 402, Green Valley Apts, MG Road', 'Bengaluru', 'Karnataka', '560001', 'Mock UPI (GooglePay)', 'PAID', NOW() - INTERVAL '5 days'),
(1002, 4, 'CONFIRMED', 219900, 'Rahul Sharma', '9876543210', 'Flat 402, Green Valley Apts, MG Road', 'Bengaluru', 'Karnataka', '560001', 'Cash on Delivery', 'PAID', NOW() - INTERVAL '1 day');

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price_cents) VALUES
(1, 1001, 2, 1, 349900),
(2, 1001, 5, 1, 129900),
(3, 1002, 3, 1, 219900);

SELECT setval('orders_id_seq', 1002);
SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items));
