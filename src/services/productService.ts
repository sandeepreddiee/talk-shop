import { Product, Review } from '@/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones with Noise Cancellation',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviewCount: 2847,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
    features: ['Active Noise Cancellation', '30-hour battery life', 'Bluetooth 5.0', 'Premium sound quality', 'Comfortable over-ear design'],
    inStock: true,
    prime: true
  },
  {
    id: '2',
    name: 'Smartphone Case - Protective Cover',
    price: 19.99,
    rating: 4.3,
    reviewCount: 1523,
    category: 'Phone Accessories',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8',
    images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8'],
    description: 'Durable protective case with shock absorption and slim profile.',
    features: ['Military-grade drop protection', 'Slim design', 'Precise cutouts', 'Wireless charging compatible'],
    inStock: true,
    prime: true
  },
  {
    id: '3',
    name: 'USB-C Fast Charging Cable 6ft - 2 Pack',
    price: 14.99,
    rating: 4.6,
    reviewCount: 8932,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0',
    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0'],
    description: 'Durable braided cables with fast charging support.',
    features: ['Fast charging support', 'Braided nylon design', '6 feet length', '2-pack value'],
    inStock: true,
    prime: true
  },
  {
    id: '4',
    name: 'Wireless Mouse - Ergonomic Design',
    price: 24.99,
    rating: 4.4,
    reviewCount: 3421,
    category: 'Computer Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46'],
    description: 'Comfortable wireless mouse with precision tracking.',
    features: ['Ergonomic design', '2.4GHz wireless', 'Long battery life', 'Adjustable DPI'],
    inStock: true,
    prime: false
  },
  {
    id: '5',
    name: 'Mechanical Keyboard - RGB Backlit',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviewCount: 5621,
    category: 'Computer Accessories',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3'],
    description: 'Professional mechanical keyboard with customizable RGB lighting.',
    features: ['Mechanical switches', 'RGB backlighting', 'Aluminum frame', 'N-key rollover'],
    inStock: true,
    prime: true
  },
  {
    id: '6',
    name: 'Portable Bluetooth Speaker - Waterproof',
    price: 49.99,
    rating: 4.5,
    reviewCount: 4132,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1'],
    description: '360-degree sound with waterproof design.',
    features: ['IPX7 waterproof', '12-hour battery', '360-degree sound', 'Built-in microphone'],
    inStock: true,
    prime: true
  },
  {
    id: '7',
    name: 'Smart Watch - Fitness Tracker',
    price: 129.99,
    rating: 4.4,
    reviewCount: 2893,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'],
    description: 'Advanced fitness tracking with heart rate monitoring.',
    features: ['Heart rate monitor', 'Sleep tracking', 'GPS built-in', '5-day battery life'],
    inStock: true,
    prime: false
  },
  {
    id: '8',
    name: 'Laptop Stand - Aluminum Adjustable',
    price: 34.99,
    rating: 4.6,
    reviewCount: 1876,
    category: 'Computer Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46'],
    description: 'Ergonomic laptop stand with adjustable height.',
    features: ['Adjustable height', 'Aluminum construction', 'Cable management', 'Compatible with all laptops'],
    inStock: true,
    prime: true
  },
  {
    id: '9',
    name: 'Webcam HD 1080p with Microphone',
    price: 59.99,
    rating: 4.3,
    reviewCount: 2145,
    category: 'Computer Accessories',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04',
    images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04'],
    description: 'Professional webcam for video calls and streaming.',
    features: ['1080p Full HD', 'Built-in microphone', 'Auto-focus', 'Wide-angle lens'],
    inStock: true,
    prime: true
  },
  {
    id: '10',
    name: 'External SSD 1TB - Portable Storage',
    price: 99.99,
    rating: 4.8,
    reviewCount: 6234,
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b',
    images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b'],
    description: 'Ultra-fast portable SSD with USB-C connectivity.',
    features: ['1TB capacity', 'USB 3.2 Gen 2', 'Read speeds up to 1050MB/s', 'Compact and durable'],
    inStock: true,
    prime: true
  },
  {
    id: '11',
    name: 'Desk Lamp LED - Adjustable Brightness',
    price: 39.99,
    rating: 4.5,
    reviewCount: 1432,
    category: 'Home & Office',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'],
    description: 'Modern LED desk lamp with touch controls.',
    features: ['Adjustable brightness', 'Touch controls', 'Energy efficient', 'Flexible arm'],
    inStock: true,
    prime: false
  },
  {
    id: '12',
    name: 'Office Chair - Ergonomic Mesh Back',
    price: 189.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviewCount: 3876,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8'],
    description: 'Ergonomic office chair with lumbar support.',
    features: ['Lumbar support', 'Breathable mesh', 'Adjustable height', '360-degree swivel'],
    inStock: true,
    prime: true
  },
  {
    id: '13',
    name: 'Monitor 27" 4K UHD',
    price: 349.99,
    rating: 4.7,
    reviewCount: 4521,
    category: 'Monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf'],
    description: 'Professional 4K monitor with HDR support.',
    features: ['27-inch 4K display', 'HDR10 support', 'IPS panel', 'Multiple connectivity options'],
    inStock: true,
    prime: true
  },
  {
    id: '14',
    name: 'Wireless Earbuds - True Wireless',
    price: 59.99,
    rating: 4.4,
    reviewCount: 5234,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df'],
    description: 'Compact true wireless earbuds with charging case.',
    features: ['True wireless', '24-hour battery with case', 'IPX5 water resistant', 'Touch controls'],
    inStock: true,
    prime: true
  },
  {
    id: '15',
    name: 'Power Bank 20000mAh - Fast Charging',
    price: 29.99,
    rating: 4.5,
    reviewCount: 7654,
    category: 'Phone Accessories',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5',
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5'],
    description: 'High-capacity power bank with dual USB ports.',
    features: ['20000mAh capacity', 'Fast charging', 'Dual USB ports', 'LED display'],
    inStock: true,
    prime: false
  },
  {
    id: '16',
    name: 'Gaming Controller - Wireless',
    price: 64.99,
    rating: 4.6,
    reviewCount: 3421,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48',
    images: ['https://images.unsplash.com/photo-1592840496694-26d035b52b48'],
    description: 'Professional gaming controller with programmable buttons.',
    features: ['Wireless connectivity', 'Programmable buttons', 'Vibration feedback', '40-hour battery'],
    inStock: true,
    prime: true
  },
  {
    id: '17',
    name: 'Phone Mount - Car Dashboard',
    price: 15.99,
    rating: 4.3,
    reviewCount: 2876,
    category: 'Phone Accessories',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8',
    images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8'],
    description: 'Secure phone mount for car dashboard.',
    features: ['Strong suction', '360-degree rotation', 'One-hand operation', 'Universal compatibility'],
    inStock: true,
    prime: true
  },
  {
    id: '18',
    name: 'Backpack - Laptop Travel Bag',
    price: 49.99,
    rating: 4.7,
    reviewCount: 4532,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62'],
    description: 'Durable travel backpack with laptop compartment.',
    features: ['Laptop compartment', 'Water-resistant', 'Multiple pockets', 'Padded straps'],
    inStock: true,
    prime: false
  },
  {
    id: '19',
    name: 'Ring Light - LED Studio Light',
    price: 44.99,
    rating: 4.5,
    reviewCount: 2134,
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'],
    description: 'Professional ring light for photography and video.',
    features: ['Adjustable brightness', 'Color temperature control', 'Phone holder included', 'Tripod stand'],
    inStock: true,
    prime: true
  },
  {
    id: '20',
    name: 'Screen Protector - Tempered Glass',
    price: 9.99,
    rating: 4.4,
    reviewCount: 5432,
    category: 'Phone Accessories',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8',
    images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8'],
    description: 'Ultra-clear tempered glass screen protector.',
    features: ['9H hardness', 'Bubble-free installation', 'HD clarity', 'Touch sensitive'],
    inStock: true,
    prime: true
  },
  {
    id: '21',
    name: 'Water Bottle - Insulated Stainless Steel',
    price: 24.99,
    rating: 4.6,
    reviewCount: 6234,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8'],
    description: 'Double-wall insulated water bottle keeps drinks cold or hot.',
    features: ['Double-wall insulation', 'Leak-proof lid', 'BPA-free', '32 oz capacity'],
    inStock: true,
    prime: true
  },
  {
    id: '22',
    name: 'Tablet Stand - Adjustable Aluminum',
    price: 27.99,
    rating: 4.5,
    reviewCount: 1876,
    category: 'Tablet Accessories',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'],
    description: 'Sturdy tablet stand with multiple viewing angles.',
    features: ['Adjustable angles', 'Aluminum build', 'Non-slip base', 'Universal compatibility'],
    inStock: true,
    prime: false
  },
  {
    id: '23',
    name: 'Microphone USB - Podcast Recording',
    price: 89.99,
    rating: 4.7,
    reviewCount: 3421,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc'],
    description: 'Professional USB microphone for podcasting and streaming.',
    features: ['Studio-quality sound', 'Plug-and-play USB', 'Mute button', 'Headphone monitoring'],
    inStock: true,
    prime: true
  },
  {
    id: '24',
    name: 'Smart Plug - WiFi Enabled',
    price: 12.99,
    rating: 4.4,
    reviewCount: 8765,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1558089687-e1b9b1e6f0a0',
    images: ['https://images.unsplash.com/photo-1558089687-e1b9b1e6f0a0'],
    description: 'Smart plug with voice control and scheduling.',
    features: ['WiFi enabled', 'Voice control compatible', 'Scheduling', 'Energy monitoring'],
    inStock: true,
    prime: true
  },
  {
    id: '25',
    name: 'Graphics Tablet - Drawing Pad',
    price: 74.99,
    rating: 4.5,
    reviewCount: 2341,
    category: 'Computer Accessories',
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae',
    images: ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae'],
    description: 'Digital drawing tablet with pressure sensitivity.',
    features: ['8192 pressure levels', 'Battery-free pen', 'Express keys', 'Compatible with major software'],
    inStock: true,
    prime: true
  },
  {
    id: '26',
    name: 'Desk Organizer - Bamboo',
    price: 32.99,
    rating: 4.6,
    reviewCount: 1543,
    category: 'Home & Office',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338',
    images: ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338'],
    description: 'Eco-friendly bamboo desk organizer with multiple compartments.',
    features: ['Sustainable bamboo', 'Multiple compartments', 'Phone holder slot', 'Cable management'],
    inStock: true,
    prime: false
  },
  {
    id: '27',
    name: 'Noise Cancelling Earbuds Pro',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewCount: 9234,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df'],
    description: 'Premium noise cancelling earbuds with spatial audio.',
    features: ['Active noise cancellation', 'Spatial audio', '30-hour battery', 'Wireless charging case'],
    inStock: true,
    prime: true
  },
  {
    id: '28',
    name: 'USB Hub 7-Port with Power Adapter',
    price: 28.99,
    rating: 4.4,
    reviewCount: 3782,
    category: 'Computer Accessories',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f',
    images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f'],
    description: 'Powered USB hub with 7 high-speed ports.',
    features: ['7 USB 3.0 ports', 'Individual power switches', 'LED indicators', 'BC1.2 fast charging'],
    inStock: true,
    prime: true
  },
  {
    id: '29',
    name: 'Portable Monitor 15.6" Full HD',
    price: 189.99,
    rating: 4.5,
    reviewCount: 2156,
    category: 'Monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf'],
    description: 'Portable second monitor for laptop productivity.',
    features: ['15.6" Full HD IPS', 'USB-C powered', 'Ultra-thin design', 'Protective case included'],
    inStock: true,
    prime: true
  },
  {
    id: '30',
    name: 'Wireless Charging Pad - 3-in-1',
    price: 54.99,
    rating: 4.6,
    reviewCount: 4521,
    category: 'Phone Accessories',
    image: 'https://images.unsplash.com/photo-1591290619762-2b39f02ea8a1',
    images: ['https://images.unsplash.com/photo-1591290619762-2b39f02ea8a1'],
    description: 'Charge phone, watch, and earbuds simultaneously.',
    features: ['3-in-1 charging', '15W fast charging', 'LED indicator', 'Non-slip surface'],
    inStock: true,
    prime: true
  },
  {
    id: '31',
    name: 'Drone with 4K Camera',
    price: 299.99,
    rating: 4.7,
    reviewCount: 1876,
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f',
    images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f'],
    description: 'Foldable drone with 4K camera and GPS.',
    features: ['4K video recording', 'GPS positioning', '25-minute flight time', 'Follow-me mode'],
    inStock: true,
    prime: false
  },
  {
    id: '32',
    name: 'Smart Doorbell - Video Camera',
    price: 119.99,
    rating: 4.5,
    reviewCount: 5432,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827',
    images: ['https://images.unsplash.com/photo-1558002038-1055907df827'],
    description: 'Video doorbell with motion detection and two-way audio.',
    features: ['1080p HD video', 'Motion detection', 'Two-way audio', 'Night vision'],
    inStock: true,
    prime: true
  },
  {
    id: '33',
    name: 'Electric Standing Desk',
    price: 399.99,
    originalPrice: 549.99,
    rating: 4.7,
    reviewCount: 3214,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c',
    images: ['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c'],
    description: 'Motorized height-adjustable standing desk.',
    features: ['Electric height adjustment', 'Memory presets', 'Collision detection', 'Cable management tray'],
    inStock: true,
    prime: true
  },
  {
    id: '34',
    name: 'Portable Air Purifier',
    price: 89.99,
    rating: 4.4,
    reviewCount: 2987,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd',
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd'],
    description: 'Compact air purifier with HEPA filter.',
    features: ['True HEPA filter', 'Quiet operation', 'Night light mode', 'USB powered'],
    inStock: true,
    prime: true
  },
  {
    id: '35',
    name: 'Gaming Mouse Pad XXL',
    price: 19.99,
    rating: 4.6,
    reviewCount: 6543,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6',
    images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6'],
    description: 'Extended gaming mouse pad with RGB lighting.',
    features: ['XXL size', 'RGB lighting', 'Non-slip rubber base', 'Water-resistant surface'],
    inStock: true,
    prime: false
  },
  {
    id: '36',
    name: 'Bluetooth Car Adapter',
    price: 24.99,
    rating: 4.3,
    reviewCount: 4123,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3'],
    description: 'Stream music wirelessly in your car.',
    features: ['Bluetooth 5.0', 'Hands-free calling', 'USB charging port', 'Voice assistant support'],
    inStock: true,
    prime: true
  },
  {
    id: '37',
    name: 'Yoga Mat - Extra Thick',
    price: 34.99,
    rating: 4.7,
    reviewCount: 5234,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f'],
    description: 'Premium yoga mat with carrying strap.',
    features: ['Extra thick cushioning', 'Non-slip surface', 'Eco-friendly material', 'Carrying strap included'],
    inStock: true,
    prime: true
  },
  {
    id: '38',
    name: 'Smart Light Bulbs - 4 Pack',
    price: 39.99,
    rating: 4.5,
    reviewCount: 7654,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1558089687-e1b9b1e6f0a0',
    images: ['https://images.unsplash.com/photo-1558089687-e1b9b1e6f0a0'],
    description: 'WiFi smart bulbs with color changing.',
    features: ['16 million colors', 'Voice control', 'Scheduling', 'Energy efficient'],
    inStock: true,
    prime: true
  },
  {
    id: '39',
    name: 'Digital Photo Frame 10 inch',
    price: 79.99,
    rating: 4.4,
    reviewCount: 1987,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32'],
    description: 'WiFi digital photo frame with remote control.',
    features: ['10" HD display', 'WiFi enabled', 'Remote control', 'Auto-rotate'],
    inStock: true,
    prime: false
  },
  {
    id: '40',
    name: 'Fitness Tracker Band',
    price: 39.99,
    rating: 4.3,
    reviewCount: 8765,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1557935728-e6d1eaabe558',
    images: ['https://images.unsplash.com/photo-1557935728-e6d1eaabe558'],
    description: 'Activity tracker with heart rate monitor.',
    features: ['Heart rate monitoring', 'Sleep tracking', 'Waterproof', '7-day battery life'],
    inStock: true,
    prime: true
  },
  {
    id: '41',
    name: 'Espresso Machine - Automatic',
    price: 249.99,
    rating: 4.6,
    reviewCount: 3421,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6'],
    description: 'Automatic espresso maker with milk frother.',
    features: ['One-touch operation', 'Built-in grinder', 'Milk frother', '15-bar pressure'],
    inStock: true,
    prime: true
  },
  {
    id: '42',
    name: 'VR Headset - Virtual Reality',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 2876,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac',
    images: ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac'],
    description: 'Standalone VR headset with wireless controllers.',
    features: ['All-in-one VR', 'Wireless controllers', '3D audio', 'Large game library'],
    inStock: true,
    prime: true
  },
  {
    id: '43',
    name: 'Security Camera - Indoor WiFi',
    price: 44.99,
    rating: 4.4,
    reviewCount: 6234,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb',
    images: ['https://images.unsplash.com/photo-1557324232-b8917d3c3dcb'],
    description: 'Indoor security camera with night vision.',
    features: ['1080p HD video', 'Night vision', 'Two-way audio', 'Motion alerts'],
    inStock: true,
    prime: true
  },
  {
    id: '44',
    name: 'Blender - High Speed',
    price: 69.99,
    rating: 4.7,
    reviewCount: 4521,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62'],
    description: 'Professional blender for smoothies and more.',
    features: ['1500W motor', 'Variable speed', 'Self-cleaning', 'BPA-free container'],
    inStock: true,
    prime: false
  },
  {
    id: '45',
    name: 'E-Reader 7 inch',
    price: 129.99,
    rating: 4.6,
    reviewCount: 9876,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'],
    description: 'Digital e-reader with adjustable warm light.',
    features: ['7" glare-free display', 'Adjustable warm light', 'Waterproof', 'Weeks of battery life'],
    inStock: true,
    prime: true
  },
  {
    id: '46',
    name: 'Robot Vacuum Cleaner',
    price: 279.99,
    rating: 4.5,
    reviewCount: 3214,
    category: 'Smart Home',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473',
    images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473'],
    description: 'Smart robot vacuum with mapping technology.',
    features: ['Laser navigation', 'App control', 'Auto-recharge', '2-hour runtime'],
    inStock: true,
    prime: true
  },
  {
    id: '47',
    name: 'Streaming Microphone with Boom Arm',
    price: 119.99,
    rating: 4.7,
    reviewCount: 2543,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc'],
    description: 'Professional streaming setup with boom arm and pop filter.',
    features: ['Cardioid pattern', 'Boom arm stand', 'Pop filter included', 'Shock mount'],
    inStock: true,
    prime: true
  },
  {
    id: '48',
    name: 'Digital Scale - Kitchen',
    price: 18.99,
    rating: 4.6,
    reviewCount: 7654,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d',
    images: ['https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d'],
    description: 'Precision kitchen scale with tare function.',
    features: ['High precision', 'Tare function', 'Multiple units', 'Easy to clean'],
    inStock: true,
    prime: false
  },
  {
    id: '49',
    name: 'Camping Lantern - Rechargeable',
    price: 29.99,
    rating: 4.5,
    reviewCount: 3456,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4'],
    description: 'Bright LED camping lantern with power bank.',
    features: ['800 lumens', 'Rechargeable battery', 'Power bank function', 'Waterproof IPX4'],
    inStock: true,
    prime: true
  },
  {
    id: '50',
    name: 'Portable Projector - Mini',
    price: 159.99,
    rating: 4.4,
    reviewCount: 2341,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6',
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6'],
    description: 'Compact projector for home entertainment.',
    features: ['1080p support', 'Built-in speaker', 'HDMI input', 'Portable design'],
    inStock: true,
    prime: true
  }
];

const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    author: 'John Smith',
    rating: 5,
    title: 'Amazing sound quality!',
    content: 'Best headphones I\'ve ever owned. The noise cancellation is incredible.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: 'r2',
    productId: '1',
    author: 'Sarah Johnson',
    rating: 4,
    title: 'Great but a bit pricey',
    content: 'Excellent quality but wish they were a bit cheaper.',
    date: '2024-01-10',
    verified: true
  },
  {
    id: 'r3',
    productId: '1',
    author: 'Mike Davis',
    rating: 5,
    title: 'Worth every penny',
    content: 'Comfortable for long listening sessions. Battery lasts forever.',
    date: '2024-01-05',
    verified: false
  }
];

export const productService = {
  getAllProducts: (): Product[] => {
    return mockProducts;
  },

  getProductById: (id: string): Product | undefined => {
    return mockProducts.find(p => p.id === id);
  },

  searchProducts: (query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
  }): Product[] => {
    let results = mockProducts;

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters?.category) {
      results = results.filter(p => p.category === filters.category);
    }

    if (filters?.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters?.minRating !== undefined) {
      results = results.filter(p => p.rating >= filters.minRating!);
    }

    return results;
  },

  getProductsByCategory: (category: string): Product[] => {
    return mockProducts.filter(p => p.category === category);
  },

  getReviews: (productId: string): Review[] => {
    return mockReviews.filter(r => r.productId === productId);
  },

  getCategories: (): string[] => {
    return Array.from(new Set(mockProducts.map(p => p.category)));
  }
};
