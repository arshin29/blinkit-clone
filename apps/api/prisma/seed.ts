import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting idempotent database seed...');

  // 1. Seed Users (with secure bcrypt hashes)
  const usersData = [
    {
      email: 'admin@blinkit.com',
      passwordPlain: 'Admin@123',
      name: 'Blinkit Super Admin',
      phone: '+91 98765 43210',
      role: Role.ADMIN,
    },
    {
      email: 'rider@blinkit.com',
      passwordPlain: 'Rider@123',
      name: 'Ramesh Kumar (Rider)',
      phone: '+91 91234 56789',
      role: Role.RIDER,
    },
    {
      email: 'customer@blinkit.com',
      passwordPlain: 'Customer@123',
      name: 'Arshin Roy',
      phone: '+91 99887 76655',
      role: Role.CUSTOMER,
    },
  ];

  console.log('👤 Upserting users...');
  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.passwordPlain, 10);
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
    console.log(`  ✓ [${upsertedUser.role}] ${upsertedUser.email}`);
  }

  // 2. Seed All 20 Categories
  const categoriesData = [
  {
    "name": "Dairy, Bread & Eggs",
    "slug": "dairy-bread-eggs",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153213/blinkit/categories/ar58iwvvu9orziqxae4r.png"
  },
  {
    "name": "Fruits & Vegetables",
    "slug": "fruits-vegetables",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153216/blinkit/categories/qcsx7nwugi8hgfqqsgui.png"
  },
  {
    "name": "Cold Drinks & Juices",
    "slug": "cold-drinks-juices",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153218/blinkit/categories/jwarmnoy00ghip8jacms.png"
  },
  {
    "name": "Snacks & Munchies",
    "slug": "snacks-munchies",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153219/blinkit/categories/zfe9nmywabwmz96geo4g.png"
  },
  {
    "name": "Breakfast & Instant Food",
    "slug": "breakfast-instant-food",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153223/blinkit/categories/h2hixhnfevsvuneotnnt.jpg"
  },
  {
    "name": "Sweet Tooth",
    "slug": "sweet-tooth",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153224/blinkit/categories/nr6a1yp417lvocfcfy9w.png"
  },
  {
    "name": "Bakery & Biscuits",
    "slug": "bakery-biscuits",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153227/blinkit/categories/ez3hdc0ahoqpboblgpjf.png"
  },
  {
    "name": "Tea, Coffee & Milk Drinks",
    "slug": "tea-coffee-milk-drinks",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153228/blinkit/categories/htojhd1mo294mu70ib9k.png"
  },
  {
    "name": "Atta, Rice & Dal",
    "slug": "atta-rice-dal",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153230/blinkit/categories/qstlihxdx3iuarulvnkr.avif"
  },
  {
    "name": "Masala, Oil & More",
    "slug": "masala-oil-more",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153232/blinkit/categories/pwqjb2kyqpq7d0v01tax.png"
  },
  {
    "name": "Sauces & Spreads",
    "slug": "sauces-spreads",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153234/blinkit/categories/gcndvezfjpjw4axeg9gi.png"
  },
  {
    "name": "Chicken, Meat & Fish",
    "slug": "chicken-meat-fish",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153236/blinkit/categories/xrz5toyyxlpphxqnd4r9.png"
  },
  {
    "name": "Organic & Healthy Living",
    "slug": "organic-healthy-living",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153238/blinkit/categories/qea1ifbyyzzogjscnn8o.png"
  },
  {
    "name": "Baby Care",
    "slug": "baby-care",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153241/blinkit/categories/gbodqb7g6u9mhymyx51p.png"
  },
  {
    "name": "Pharma & Wellness",
    "slug": "pharma-wellness",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153243/blinkit/categories/htp4ef6mccjofajwh78l.jpg"
  },
  {
    "name": "Cleaning Essentials",
    "slug": "cleaning-essentials",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153244/blinkit/categories/mvqmp61syfnj5dkks8ou.png"
  },
  {
    "name": "Home & Office",
    "slug": "home-office",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153247/blinkit/categories/q1qpmt1rz9gs1uplyvgm.png"
  },
  {
    "name": "Personal Care",
    "slug": "personal-care",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153249/blinkit/categories/h6a94tth3z8wjtllffdl.webp"
  },
  {
    "name": "Pet Care",
    "slug": "pet-care",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153251/blinkit/categories/ryfgyfeotxolnuacgxit.png"
  },
  {
    "name": "Paan Corner",
    "slug": "paan-corner",
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791153253/blinkit/categories/jd4yifseuje2bs36icpx.webp"
  }
];

  console.log('🏷️  Upserting categories...');
  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const upsertedCategory = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        image: cat.image,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
      },
    });
    categoryMap[cat.slug] = upsertedCategory.id;
    console.log(`  ✓ ${upsertedCategory.name} (${cat.slug})`);
  }

  // Also support legacy slugs
  categoryMap['dairy-breakfast'] = categoryMap['dairy-bread-eggs'];
  categoryMap['cold-drinks-beverages'] = categoryMap['cold-drinks-juices'];
  categoryMap['instant-frozen-food'] = categoryMap['breakfast-instant-food'];

  // 3. Seed Realistic Products (at least 12 per category, 244 products total)
  const productsData = [
  {
    "name": "RAW Classic King Size Slim Rolling Paper",
    "unit": "Pack of 32 leaves",
    "price": 120,
    "mrp": 140,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152050/blinkit/products/hcwp2k6xuqzritdzu6sy.webp",
    "categorySlug": "paan-corner",
    "description": "Natural unrefined unbleached rolling papers."
  },
  {
    "name": "Elements Ultra Thin Rice Rolling Paper",
    "unit": "King Size Slim (32 Leaves)",
    "price": 110,
    "mrp": 130,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152051/blinkit/products/jodbsb5msxzljqeio83e.webp",
    "categorySlug": "paan-corner",
    "description": "Pure rice rolling papers with zero ash."
  },
  {
    "name": "RAW Black Cones Classic",
    "unit": "Pack of 3 Pre-Rolled",
    "price": 90,
    "mrp": 100,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152054/blinkit/products/gttakkfsupuaf8jwhdgw.png",
    "categorySlug": "paan-corner",
    "description": "Artisan extra-fine slow burning cones."
  },
  {
    "name": "Clipper Classic Refillable Electronic Lighter",
    "unit": "1 pc",
    "price": 80,
    "mrp": 90,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152056/blinkit/products/faagil08tnchyr08uun5.avif",
    "categorySlug": "paan-corner",
    "description": "Reusable iconic lighter with replaceable flint system."
  },
  {
    "name": "Bic Maxi Electronic Pocket Lighter",
    "unit": "1 pc",
    "price": 70,
    "mrp": 75,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152057/blinkit/products/q3vdgjprdocjmasrnilm.jpg",
    "categorySlug": "paan-corner",
    "description": "Child-resistant steady flame pocket lighter."
  },
  {
    "name": "Cricket Mini Electronic Lighter",
    "unit": "Pack of 2",
    "price": 60,
    "mrp": 70,
    "stock": 40,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152058/blinkit/products/d9vmmacqajfnkaayxvag.webp",
    "categorySlug": "paan-corner",
    "description": "Compact reliable safety lighters."
  },
  {
    "name": "Pass Pass Sweet Magic Herbal Mukhwas",
    "unit": "100 g",
    "price": 40,
    "mrp": 45,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152059/blinkit/products/cerym142r5nmdz0dfujf.jpg",
    "categorySlug": "paan-corner",
    "description": "Aromatic digestive herbal mouth freshener mix."
  },
  {
    "name": "Rajnigandha Flavored Pan Masala",
    "unit": "100 g Tin",
    "price": 180,
    "mrp": 195,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152059/blinkit/products/ti7wy5hn4h30argxl1dr.webp",
    "categorySlug": "paan-corner",
    "description": "Premium betelnut blend with saffron touch."
  },
  {
    "name": "Chaman Bahar Special Scented Supari",
    "unit": "50 g",
    "price": 45,
    "mrp": 50,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152060/blinkit/products/svo7aigkf9tuyk85elx8.webp",
    "categorySlug": "paan-corner",
    "description": "Rich fragrant sweet betel nut cuts."
  },
  {
    "name": "Baba Silver Coated Elaichi Pearls",
    "unit": "10 g",
    "price": 120,
    "mrp": 135,
    "stock": 40,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152061/blinkit/products/fmbaow9gudvhyldpjrvw.webp",
    "categorySlug": "paan-corner",
    "description": "Fine cardamom seeds coated in pure edible silver foil."
  },
  {
    "name": "Center Fresh Spearmint Chewing Gum",
    "unit": "Pack of 20 (140 g)",
    "price": 50,
    "mrp": 50,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152062/blinkit/products/yj2errjvqukbzcfhasov.jpg",
    "categorySlug": "paan-corner",
    "description": "Liquid-filled refreshing spearmint center gums."
  },
  {
    "name": "Orbit Spearmint Sugarfree Chewing Gum",
    "unit": "22 g (14 Pellets)",
    "price": 50,
    "mrp": 50,
    "stock": 95,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152063/blinkit/products/bpnycf2i28dcsk7zuna7.avif",
    "categorySlug": "paan-corner",
    "description": "Sugarfree dental-friendly fresh mint pellets."
  },
  {
    "name": "Amul Taaza Toned Milk",
    "unit": "500 ml",
    "price": 27,
    "mrp": 29,
    "stock": 80,
    "image": "/products/amul-taaza-500.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Pasteurized toned milk, rich in calcium and natural proteins."
  },
  {
    "name": "Amul Taaza Toned Milk",
    "unit": "200 ml",
    "price": 17,
    "mrp": 17,
    "stock": 60,
    "image": "/products/amul-taaza-200.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Fresh toned milk in compact single-serve pack."
  },
  {
    "name": "Amul Taaza Homogenised Toned Milk",
    "unit": "1 ltr",
    "price": 77,
    "mrp": 77,
    "stock": 45,
    "image": "/products/amul-taaza-homo-1l.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "UHT long life homogenized toned milk carton."
  },
  {
    "name": "Amul Moti Toned Milk (90 Days Shelf Life)",
    "unit": "450 ml",
    "price": 33,
    "mrp": 33,
    "stock": 50,
    "image": "/products/amul-moti-450.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Aseptic pouch toned milk with 90-day shelf life without boiling."
  },
  {
    "name": "Amul Gold Milk",
    "unit": "1 ltr",
    "price": 83,
    "mrp": 83,
    "stock": 70,
    "image": "/products/amul-gold-1l.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Full cream rich pasteurized milk for teas, coffees, and sweets."
  },
  {
    "name": "Amul Buffalo A2 Milk",
    "unit": "1 ltr",
    "price": 90,
    "mrp": 90,
    "stock": 35,
    "image": "/products/amul-buffalo-a2.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Pure and creamy A2 buffalo milk rich in native proteins."
  },
  {
    "name": "Amul Slim 'n' Trim Skimmed Milk (Zero Fat)",
    "unit": "1 ltr",
    "price": 85,
    "mrp": 85,
    "stock": 40,
    "image": "/products/amul-slim-trim-1l.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Zero fat, zero cholesterol skimmed milk for light diets."
  },
  {
    "name": "Yakult Probiotic Drink",
    "unit": "5 x 65 ml",
    "price": 90,
    "mrp": 90,
    "stock": 55,
    "image": "/products/yakult-probiotic-5x.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Fermented probiotic milk drink with billions of L. casei Shirota."
  },
  {
    "name": "Amul Lactose Free Milk",
    "unit": "250 ml",
    "price": 26,
    "mrp": 26,
    "stock": 45,
    "image": "/products/amul-lactose-free.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Gentle easy-to-digest milk for lactose sensitive bodies."
  },
  {
    "name": "Yakult Light Probiotic Drink",
    "unit": "5 x 65 ml",
    "price": 100,
    "mrp": 100,
    "stock": 40,
    "image": "/products/yakult-light-5x.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Low sugar probiotic drink with vitamins D and E."
  },
  {
    "name": "Amul Calci+ Calcium Rich High Protein Milk",
    "unit": "1 ltr",
    "price": 98,
    "mrp": 98,
    "stock": 30,
    "image": "/products/amul-calci-plus.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Fortified with extra bio-available calcium and dairy protein."
  },
  {
    "name": "Akshayakalpa Organic Cow Milk",
    "unit": "1 ltr",
    "price": 142,
    "mrp": 142,
    "stock": 25,
    "image": "/products/akshayakalpa-organic.png",
    "categorySlug": "dairy-bread-eggs",
    "description": "Pure certified organic milk from stress-free grass-fed cows."
  },
  {
    "name": "Harvest Gold Sandwich White Bread",
    "unit": "400 g",
    "price": 35,
    "mrp": 40,
    "stock": 50,
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "dairy-bread-eggs",
    "description": "Classic soft white bread baked fresh every morning."
  },
  {
    "name": "English Oven 100% Whole Wheat Bread",
    "unit": "400 g",
    "price": 50,
    "mrp": 55,
    "stock": 45,
    "image": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "dairy-bread-eggs",
    "description": "100% whole wheat high-fiber sandwich bread."
  },
  {
    "name": "Farm Fresh Brown Eggs",
    "unit": "Pack of 6",
    "price": 55,
    "mrp": 65,
    "stock": 60,
    "image": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "dairy-bread-eggs",
    "description": "Wholesome brown eggs packed with high protein."
  },
  {
    "name": "Amul Fresh Malai Paneer",
    "unit": "200 g",
    "price": 90,
    "mrp": 95,
    "stock": 55,
    "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "dairy-bread-eggs",
    "description": "Soft authentic malai paneer for curries and snacks."
  },
  {
    "name": "Fresh Banana Robusta",
    "unit": "500 g",
    "price": 34,
    "mrp": 45,
    "stock": 70,
    "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Naturally ripened, sweet and energy-rich Robusta bananas."
  },
  {
    "name": "Royal Gala Red Apple",
    "unit": "4 pcs (~500 g)",
    "price": 110,
    "mrp": 140,
    "stock": 50,
    "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Crisp, sweet, and juicy handpicked imported apples."
  },
  {
    "name": "Fresh Hybrid Tomato",
    "unit": "500 g",
    "price": 22,
    "mrp": 30,
    "stock": 90,
    "image": "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Firm and juicy farm-fresh red tomatoes."
  },
  {
    "name": "Farm Fresh Red Onion",
    "unit": "1 kg",
    "price": 38,
    "mrp": 48,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Crisp pungent red onions essential for daily cooking."
  },
  {
    "name": "Fresh Jyoti Potato",
    "unit": "1 kg",
    "price": 28,
    "mrp": 35,
    "stock": 120,
    "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Versatile farm-fresh potatoes with thin skin."
  },
  {
    "name": "Fresh Spinach / Palak",
    "unit": "250 g",
    "price": 18,
    "mrp": 25,
    "stock": 45,
    "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Iron-rich fresh tender green spinach leaves."
  },
  {
    "name": "Fresh Coriander Bunch",
    "unit": "100 g",
    "price": 12,
    "mrp": 15,
    "stock": 60,
    "image": "https://images.unsplash.com/photo-1526344966-89049886b28d?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Aromatic farm-fresh green coriander for garnishing."
  },
  {
    "name": "Green Capsicum",
    "unit": "250 g",
    "price": 25,
    "mrp": 35,
    "stock": 40,
    "image": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Crisp bell peppers for stir fries, salads and pizzas."
  },
  {
    "name": "Fresh Lemon / Nimbu",
    "unit": "4 pcs",
    "price": 20,
    "mrp": 25,
    "stock": 80,
    "image": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Juicy sour yellow lemons high in vitamin C."
  },
  {
    "name": "Fresh Ginger / Adrak",
    "unit": "100 g",
    "price": 18,
    "mrp": 25,
    "stock": 50,
    "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Strong zesty unpolished ginger roots."
  },
  {
    "name": "Fresh Garlic / Lahsun",
    "unit": "100 g",
    "price": 24,
    "mrp": 32,
    "stock": 55,
    "image": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Aromatic garlic cloves for flavorful tadkas."
  },
  {
    "name": "Fresh Green Chilli",
    "unit": "100 g",
    "price": 10,
    "mrp": 15,
    "stock": 65,
    "image": "https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "fruits-vegetables",
    "description": "Spicy sharp green chillies to add punch to meals."
  },
  {
    "name": "Coca-Cola Original Taste",
    "unit": "750 ml",
    "price": 40,
    "mrp": 45,
    "stock": 80,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Chilled sparkling carbonated refreshing soft drink."
  },
  {
    "name": "Thums Up Charged Soft Drink",
    "unit": "750 ml",
    "price": 40,
    "mrp": 45,
    "stock": 85,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Bold fizzy thunderous cola refreshment."
  },
  {
    "name": "Sprite Lemon Lime Soft Drink",
    "unit": "750 ml",
    "price": 40,
    "mrp": 45,
    "stock": 75,
    "image": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Clear crisp lemon-lime fizzy soft drink."
  },
  {
    "name": "Pepsi Zero Sugar Can",
    "unit": "330 ml",
    "price": 40,
    "mrp": 40,
    "stock": 60,
    "image": "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Bold Pepsi flavor without sugar or calories."
  },
  {
    "name": "Real Fruit Power Mixed Fruit Juice",
    "unit": "1 L",
    "price": 115,
    "mrp": 130,
    "stock": 45,
    "image": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Wholesome fruit beverage prepared from 9 luscious fruits."
  },
  {
    "name": "Tropicana 100% Orange Juice",
    "unit": "1 L",
    "price": 125,
    "mrp": 145,
    "stock": 40,
    "image": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Pure sun-ripened orange juice with no added sugar."
  },
  {
    "name": "Paper Boat Aamras Mango Drink",
    "unit": "1 L",
    "price": 110,
    "mrp": 125,
    "stock": 50,
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Rich authentic Alphonso mango pulp beverage."
  },
  {
    "name": "Red Bull Energy Drink",
    "unit": "250 ml",
    "price": 125,
    "mrp": 125,
    "stock": 90,
    "image": "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Vitalizes body and mind with caffeine and taurine."
  },
  {
    "name": "Monster Energy Drink Can",
    "unit": "350 ml",
    "price": 125,
    "mrp": 130,
    "stock": 65,
    "image": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Smooth energy blend with serious power punch."
  },
  {
    "name": "Schweppes Tonic Water",
    "unit": "300 ml",
    "price": 60,
    "mrp": 65,
    "stock": 55,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Classic effervescent botanical tonic water."
  },
  {
    "name": "Kinley Club Soda",
    "unit": "750 ml",
    "price": 20,
    "mrp": 20,
    "stock": 110,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "Extra bubbly chilled club soda."
  },
  {
    "name": "Raw Pressery Tender Coconut Water",
    "unit": "200 ml",
    "price": 60,
    "mrp": 65,
    "stock": 70,
    "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "cold-drinks-juices",
    "description": "100% natural cold pressed coconut water."
  },
  {
    "name": "Lay's India's Magic Masala Chips",
    "unit": "50 g",
    "price": 20,
    "mrp": 20,
    "stock": 120,
    "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Crisp potato chips seasoned with Indian spices."
  },
  {
    "name": "Kurkure Masala Munch",
    "unit": "85 g",
    "price": 20,
    "mrp": 20,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Crunchy corn puff snacks with a spicy tangy twist."
  },
  {
    "name": "Lay's American Style Cream & Onion",
    "unit": "50 g",
    "price": 20,
    "mrp": 20,
    "stock": 110,
    "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Creamy herb and sour onion seasoned potato chips."
  },
  {
    "name": "Haldiram's Nagpur Aloo Bhujia",
    "unit": "200 g",
    "price": 58,
    "mrp": 62,
    "stock": 85,
    "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Crisp spicy potato and gram flour noodles."
  },
  {
    "name": "Haldiram's Khatta Meetha Mixture",
    "unit": "200 g",
    "price": 55,
    "mrp": 60,
    "stock": 75,
    "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Sweet and sour mixture of crisp chickpea flour noodles."
  },
  {
    "name": "Pringles Sour Cream & Onion",
    "unit": "107 g",
    "price": 115,
    "mrp": 125,
    "stock": 60,
    "image": "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Stackable crisp potato chips in signature can."
  },
  {
    "name": "Doritos Cheese Supreme Nachos",
    "unit": "75 g",
    "price": 35,
    "mrp": 40,
    "stock": 70,
    "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Crunchy corn tortilla chips packed with bold cheese."
  },
  {
    "name": "Bingo Mad Angles Achaari Masti",
    "unit": "66 g",
    "price": 20,
    "mrp": 20,
    "stock": 80,
    "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Triangular crunchy chips with spicy pickle burst."
  },
  {
    "name": "Uncle Chipps Spicy Treat",
    "unit": "50 g",
    "price": 20,
    "mrp": 20,
    "stock": 90,
    "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Classic rippled potato chips with aromatic spices."
  },
  {
    "name": "Haldiram's Roasted Salted Cashews",
    "unit": "100 g",
    "price": 145,
    "mrp": 160,
    "stock": 50,
    "image": "https://images.unsplash.com/photo-1509912760195-201550c6bf23?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Golden oven-roasted crunchy salted cashews."
  },
  {
    "name": "Happilo California Almonds",
    "unit": "200 g",
    "price": 189,
    "mrp": 240,
    "stock": 65,
    "image": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Premium whole natural crunchy California badam."
  },
  {
    "name": "Cornitos Nachos Peri Peri",
    "unit": "60 g",
    "price": 35,
    "mrp": 35,
    "stock": 75,
    "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "snacks-munchies",
    "description": "Fiery peri-peri seasoned crispy corn nachos."
  },
  {
    "name": "Maggi 2-Minute Masala Noodles",
    "unit": "70 g",
    "price": 14,
    "mrp": 14,
    "stock": 150,
    "image": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Beloved instant noodles packed with signature tastemaker spices."
  },
  {
    "name": "Maggi 2-Minute Masala Noodles Pack of 4",
    "unit": "280 g",
    "price": 56,
    "mrp": 56,
    "stock": 100,
    "image": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Family saver pack of authentic masala noodles."
  },
  {
    "name": "Top Ramen Curry Instant Noodles",
    "unit": "280 g",
    "price": 52,
    "mrp": 58,
    "stock": 80,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Flat noodles in spicy Indian style curry broth."
  },
  {
    "name": "Wai Wai Ready to Eat Noodles",
    "unit": "70 g",
    "price": 15,
    "mrp": 15,
    "stock": 90,
    "image": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Pre-cooked seasoned noodles to eat straight or cooked."
  },
  {
    "name": "Kellogg's Corn Flakes Original",
    "unit": "475 g",
    "price": 185,
    "mrp": 205,
    "stock": 60,
    "image": "https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Golden crunchy corn flakes fortified with iron and vitamins."
  },
  {
    "name": "Kellogg's Chocos Crunchy Bites",
    "unit": "385 g",
    "price": 170,
    "mrp": 190,
    "stock": 65,
    "image": "https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Chocolatey crunchy wheat bites kids love with milk."
  },
  {
    "name": "Quaker Rolled White Oats",
    "unit": "1 kg",
    "price": 175,
    "mrp": 199,
    "stock": 70,
    "image": "https://images.unsplash.com/photo-1614961908595-53e34b17e47a?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "100% whole grain rolled oats for energy and heart health."
  },
  {
    "name": "Saffola Masala Oats Classic",
    "unit": "500 g",
    "price": 165,
    "mrp": 190,
    "stock": 55,
    "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Savory Indian spiced oats with vegetables."
  },
  {
    "name": "MTR Instant Rava Upma Mix",
    "unit": "500 g",
    "price": 110,
    "mrp": 125,
    "stock": 45,
    "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Authentic South Indian upma ready in 3 easy steps."
  },
  {
    "name": "MTR Ready to Eat Khatta Meetha Poha",
    "unit": "60 g Cup",
    "price": 35,
    "mrp": 35,
    "stock": 80,
    "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Just add hot water instant poha cup."
  },
  {
    "name": "Knorr Classic Mixed Vegetable Soup",
    "unit": "43 g",
    "price": 35,
    "mrp": 40,
    "stock": 90,
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Warm, thick and comforting restaurant style soup."
  },
  {
    "name": "Ching's Secret Hakka Noodles",
    "unit": "150 g",
    "price": 35,
    "mrp": 40,
    "stock": 85,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "breakfast-instant-food",
    "description": "Non-sticky authentic noodles for desi Chinese stir fries."
  },
  {
    "name": "Cadbury Dairy Milk Silk Chocolate",
    "unit": "150 g",
    "price": 175,
    "mrp": 185,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152817/blinkit/products/u9yilfaikkeicrmp3jnv.jpg",
    "categorySlug": "sweet-tooth",
    "description": "Smooth, creamy, and melt-in-mouth milk chocolate delight."
  },
  {
    "name": "Cadbury Dairy Milk Fruit & Nut",
    "unit": "80 g",
    "price": 90,
    "mrp": 95,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152820/blinkit/products/ag1j8sszrsx5s4rvmagk.webp",
    "categorySlug": "sweet-tooth",
    "description": "Crunchy almonds and plump raisins in milk chocolate."
  },
  {
    "name": "KitKat 4 Finger Chocolate Bar",
    "unit": "38 g",
    "price": 25,
    "mrp": 25,
    "stock": 120,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152823/blinkit/products/f7ywovsgw3ayfdcanevf.jpg",
    "categorySlug": "sweet-tooth",
    "description": "Crispy wafer fingers covered with smooth milk chocolate."
  },
  {
    "name": "Ferrero Rocher Premium Chocolates",
    "unit": "Pack of 4 (50 g)",
    "price": 160,
    "mrp": 170,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152826/blinkit/products/k6m9gjks5wk96i3vjeba.jpg",
    "categorySlug": "sweet-tooth",
    "description": "Whole hazelnut dipped in smooth cocoa cream."
  },
  {
    "name": "Kwality Wall's Vanilla Ice Cream Tub",
    "unit": "700 ml",
    "price": 140,
    "mrp": 150,
    "stock": 40,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152829/blinkit/products/vx1icogfd0qaiw8ktrin.avif",
    "categorySlug": "sweet-tooth",
    "description": "Creamy rich vanilla dessert tub for sweet cravings."
  },
  {
    "name": "Kwality Wall's Cornetto Double Chocolate",
    "unit": "105 ml",
    "price": 45,
    "mrp": 50,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152831/blinkit/products/auoitvq36ruuqe9044tg.jpg",
    "categorySlug": "sweet-tooth",
    "description": "Crispy cone filled with double chocolate ice cream."
  },
  {
    "name": "Magnum Truffle Ice Cream Bar",
    "unit": "80 ml",
    "price": 90,
    "mrp": 90,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791151307/blinkit/products/qqsezpvfu2cngabdtuk8.jpg",
    "categorySlug": "sweet-tooth",
    "description": "Belgian chocolate shell with chocolate truffle core."
  },
  {
    "name": "Haldiram's Gulab Jamun Tin",
    "unit": "1 kg",
    "price": 230,
    "mrp": 250,
    "stock": 35,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791151210/blinkit/products/i6fegvsn2hlcutt4nmp7.jpg",
    "categorySlug": "sweet-tooth",
    "description": "Juicy khoya dumplings soaked in fragrant sugar syrup."
  },
  {
    "name": "Haldiram's Rasgulla Tin",
    "unit": "1 kg",
    "price": 220,
    "mrp": 240,
    "stock": 35,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791151186/blinkit/products/wqddkgb7ftqgdt0xceiz.webp",
    "categorySlug": "sweet-tooth",
    "description": "Spongy soft cottage cheese balls in sweet rose syrup."
  },
  {
    "name": "Amul Dark Chocolate 55% Cocoa",
    "unit": "150 g",
    "price": 110,
    "mrp": 120,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791151149/blinkit/products/u0yqvdsfxcujwrgumbec.webp",
    "categorySlug": "sweet-tooth",
    "description": "Rich dark chocolate crafted from finest cocoa beans."
  },
  {
    "name": "Snickers Peanut Chocolate Bar",
    "unit": "45 g",
    "price": 40,
    "mrp": 40,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791151116/blinkit/products/tdzzpgmkavjrdhe7arr2.jpg",
    "categorySlug": "sweet-tooth",
    "description": "Roasted peanuts, nougat, and caramel in milk chocolate."
  },
  {
    "name": "5 Star 3D Chewy Chocolate Bar",
    "unit": "42 g",
    "price": 20,
    "mrp": 20,
    "stock": 95,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791151081/blinkit/products/rrrxpzp4hunavywe8cco.jpg",
    "categorySlug": "sweet-tooth",
    "description": "Crunchy biscuits and chewy caramel drenched in chocolate."
  },
  {
    "name": "Britannia Good Day Butter Cookies",
    "unit": "200 g",
    "price": 40,
    "mrp": 50,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152529/blinkit/products/qxojp25xxbqxsj5hkear.jpg",
    "categorySlug": "bakery-biscuits",
    "description": "Rich, crumbly, and buttery delight in every golden bite."
  },
  {
    "name": "Oreo Vanilla Creme Biscuit",
    "unit": "120 g",
    "price": 35,
    "mrp": 35,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152527/blinkit/products/gv1ulc198u9xs2vjzfph.jpg",
    "categorySlug": "bakery-biscuits",
    "description": "Rich dark cocoa biscuits with smooth sweet cream center."
  },
  {
    "name": "Parle-G Gold Glucose Biscuits",
    "unit": "1 kg",
    "price": 85,
    "mrp": 95,
    "stock": 100,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152528/blinkit/products/oj7dfagnybig2hk2gkxk.jpg",
    "categorySlug": "bakery-biscuits",
    "description": "Timeless chai-time wheat and milk glucose biscuits."
  },
  {
    "name": "Britannia Bourbon Chocolate Cream",
    "unit": "150 g",
    "price": 35,
    "mrp": 35,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152533/blinkit/products/uumvr4fgug91ug1d7ukl.jpg",
    "categorySlug": "bakery-biscuits",
    "description": "Crunchy chocolate biscuits sprinkled with sugar crystals."
  },
  {
    "name": "Sunfeast Dark Fantasy Choco Fills",
    "unit": "75 g",
    "price": 40,
    "mrp": 45,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152531/blinkit/products/tb5wrjqtfbmx8eveflqc.jpg",
    "categorySlug": "bakery-biscuits",
    "description": "Molten chocolate filled inside crispy dark cookie shell."
  },
  {
    "name": "Britannia Marie Gold Biscuits",
    "unit": "250 g",
    "price": 35,
    "mrp": 40,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152531/blinkit/products/hyi14ftdlhvpmrizfzhd.jpg",
    "categorySlug": "bakery-biscuits",
    "description": "Crisp light tea biscuits made with real wheat."
  },
  {
    "name": "Britannia Toastea Premium Elaichi Rusk",
    "unit": "200 g",
    "price": 45,
    "mrp": 50,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152534/blinkit/products/nricynqnpnykekbhw3hq.avif",
    "categorySlug": "bakery-biscuits",
    "description": "Crunchy twice-baked wheat rusks infused with cardamom."
  },
  {
    "name": "English Oven Premium Fruit Bun",
    "unit": "150 g (Pack of 2)",
    "price": 30,
    "mrp": 30,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152536/blinkit/products/bjtwie7uinczpypne7xo.webp",
    "categorySlug": "bakery-biscuits",
    "description": "Soft sweet buns stuffed with tutti frutti bits."
  },
  {
    "name": "Britannia Little Hearts Biscuits",
    "unit": "75 g",
    "price": 20,
    "mrp": 20,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152536/blinkit/products/ayults0nvegkjlhc64iy.webp",
    "categorySlug": "bakery-biscuits",
    "description": "Sugar glazed heart shaped puff biscuits."
  },
  {
    "name": "Winkies Swiss Roll Vanilla",
    "unit": "150 g",
    "price": 55,
    "mrp": 60,
    "stock": 45,
    "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "categorySlug": "bakery-biscuits",
    "description": "Rolled sponge cake with sweet vanilla filling."
  },
  {
    "name": "Bisk Farm Sugar Free Crackers",
    "unit": "200 g",
    "price": 50,
    "mrp": 55,
    "stock": 40,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152538/blinkit/products/mllp64qqcaf6jaspqmsn.jpg",
    "categorySlug": "bakery-biscuits",
    "description": "Crispy salted wheat crackers for healthy snacking."
  },
  {
    "name": "Karachi Bakery Fruit Biscuits",
    "unit": "400 g",
    "price": 190,
    "mrp": 210,
    "stock": 35,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152538/blinkit/products/uqx8hkmghi5zdbz1dtvw.jpg",
    "categorySlug": "bakery-biscuits",
    "description": "Iconic Hyderabad bakery fruit biscuits with cashews."
  },
  {
    "name": "Tata Tea Gold Rich Leaf & Long Leaf",
    "unit": "500 g",
    "price": 295,
    "mrp": 330,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152955/blinkit/products/tw9ntpbllpy9sp334em8.jpg",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Exquisite blend of Assam CTC and gently rolled long leaves."
  },
  {
    "name": "Brooke Bond Red Label Natural Care",
    "unit": "500 g",
    "price": 310,
    "mrp": 350,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152956/blinkit/products/vhntfcx8teft5q3qxi1b.jpg",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Infused with 5 ayurvedic herbs: tulsi, mulethi, ashwagandha, ginger and cardamom."
  },
  {
    "name": "Brooke Bond Taj Mahal Pure Darjeeling Tea",
    "unit": "250 g",
    "price": 195,
    "mrp": 220,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152958/blinkit/products/enxkuvcxq8lc60otwlfr.jpg",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Rare muscatel flavor from misty Darjeeling hills."
  },
  {
    "name": "Wagh Bakri Premium Leaf Tea",
    "unit": "500 g",
    "price": 275,
    "mrp": 300,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152960/blinkit/products/dli2ocvahr15jnmcgjko.webp",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Strong, consistency-tested golden brew for chai lovers."
  },
  {
    "name": "Nescafe Classic Instant Coffee Jar",
    "unit": "100 g",
    "price": 330,
    "mrp": 360,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152962/blinkit/products/vn6k5tjgd2bzbnoyytcx.jpg",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "100% pure robusta coffee with distinct rich aroma."
  },
  {
    "name": "Bru Gold Roasted Instant Coffee",
    "unit": "100 g",
    "price": 295,
    "mrp": 320,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152964/blinkit/products/kyyxjgm6t0fdgzdmm4ce.webp",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Granulated blend of Arabica and Robusta beans."
  },
  {
    "name": "Nescafe Sunrise Rich Aroma Blend",
    "unit": "100 g",
    "price": 240,
    "mrp": 260,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152966/blinkit/products/coolud2uknhe7n9agbxa.webp",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "South Indian style slow-roasted coffee-chicory blend."
  },
  {
    "name": "Cadbury Bournvita Health Drink Jar",
    "unit": "500 g",
    "price": 245,
    "mrp": 265,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152969/blinkit/products/wejedeehwwt3uhu7r5av.jpg",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Nutrition drink powder with inner strength formula."
  },
  {
    "name": "Horlicks Classic Malt Nutrition Drink",
    "unit": "500 g",
    "price": 255,
    "mrp": 275,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152970/blinkit/products/bkykl8p649i2hcqe7xbx.avif",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Clinically proven malted barley formula with 23 vital nutrients."
  },
  {
    "name": "Complan Royale Chocolate Flavour",
    "unit": "500 g",
    "price": 280,
    "mrp": 300,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152972/blinkit/products/fabm8kuh2sdabbzg4iw5.webp",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "100% milk protein health drink for children."
  },
  {
    "name": "Lipton Pure & Light Green Tea Bags",
    "unit": "Pack of 25",
    "price": 165,
    "mrp": 185,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152974/blinkit/products/pyflrp3v0skgys5ctba7.webp",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Zero calorie antioxidant-rich green tea bags."
  },
  {
    "name": "Tetley Lemon & Honey Green Tea",
    "unit": "Pack of 25",
    "price": 170,
    "mrp": 190,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152976/blinkit/products/p3ye7kbqkyxac8dskid2.webp",
    "categorySlug": "tea-coffee-milk-drinks",
    "description": "Zesty lemon and soothing honey flavored green tea."
  },
  {
    "name": "Aashirvaad Shudh Chakki Whole Wheat Atta",
    "unit": "5 kg",
    "price": 245,
    "mrp": 275,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152540/blinkit/products/vxzsuuvlq5clorgsfnbb.jpg",
    "categorySlug": "atta-rice-dal",
    "description": "100% whole wheat chakki atta for extra soft rotis."
  },
  {
    "name": "Fortune Chakki Fresh Atta",
    "unit": "5 kg",
    "price": 225,
    "mrp": 255,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152543/blinkit/products/gc2mvewfbpgzru2qwxj3.jpg",
    "categorySlug": "atta-rice-dal",
    "description": "Cleaned grains ground in traditional chakki stones."
  },
  {
    "name": "India Gate Basmati Rice Feast Rozzana",
    "unit": "5 kg",
    "price": 440,
    "mrp": 510,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152542/blinkit/products/mcny4ssqajuupfdzaz1j.jpg",
    "categorySlug": "atta-rice-dal",
    "description": "Aromatic aged long grain basmati rice for daily meals."
  },
  {
    "name": "Daawat Super Basmati Aged Rice",
    "unit": "1 kg",
    "price": 145,
    "mrp": 170,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152541/blinkit/products/uglhaq1tiq8xyqclvidv.jpg",
    "categorySlug": "atta-rice-dal",
    "description": "Pristine slender grains that elongate twice when cooked."
  },
  {
    "name": "Fortune Rozana Kolam Rice",
    "unit": "5 kg",
    "price": 310,
    "mrp": 360,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152544/blinkit/products/gqiawxaaqtfwqpsxykfx.jpg",
    "categorySlug": "atta-rice-dal",
    "description": "Light non-sticky kolam rice ideal for daily lunches."
  },
  {
    "name": "Tata Sampann Unpolished Toor Dal",
    "unit": "1 kg",
    "price": 175,
    "mrp": 195,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152546/blinkit/products/qrqpoyqkwrdyvqlp6lxk.jpg",
    "categorySlug": "atta-rice-dal",
    "description": "Natural unpolished pigeon pea lentils rich in dietary protein."
  },
  {
    "name": "Tata Sampann Moong Dal Split",
    "unit": "1 kg",
    "price": 145,
    "mrp": 165,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152545/blinkit/products/itnxzsvdarhr7sqcfzop.jpg",
    "categorySlug": "atta-rice-dal",
    "description": "Nutritious yellow moong dal for khichdi and soups."
  },
  {
    "name": "Tata Sampann Chana Dal",
    "unit": "1 kg",
    "price": 120,
    "mrp": 140,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152548/blinkit/products/znwda4jpmi4skzxnxfea.webp",
    "categorySlug": "atta-rice-dal",
    "description": "Unpolished split Bengal gram lentils."
  },
  {
    "name": "Rajma Chitra Jammu Kidney Beans",
    "unit": "1 kg",
    "price": 180,
    "mrp": 210,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152549/blinkit/products/ex60u8ffu9lgbn1l82my.webp",
    "categorySlug": "atta-rice-dal",
    "description": "Authentic speckled rajma beans that cook soft and flavorful."
  },
  {
    "name": "Kabuli Chana Big White Chickpeas",
    "unit": "1 kg",
    "price": 170,
    "mrp": 195,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152547/blinkit/products/gk0ifzoumhnvzznnzqgf.webp",
    "categorySlug": "atta-rice-dal",
    "description": "Large plump white chickpeas for hearty chhole bhature."
  },
  {
    "name": "Fortune Maida Refined Flour",
    "unit": "1 kg",
    "price": 48,
    "mrp": 55,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152550/blinkit/products/vrsuwewuxjfo1g0bp2pa.jpg",
    "categorySlug": "atta-rice-dal",
    "description": "Silky smooth refined wheat flour for bakes and puris."
  },
  {
    "name": "Tata Sampann Besan Gram Flour",
    "unit": "500 g",
    "price": 55,
    "mrp": 65,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152550/blinkit/products/e9uflayvj0nfepdwtnvq.webp",
    "categorySlug": "atta-rice-dal",
    "description": "100% pure chana dal besan for pakodas and sweets."
  },
  {
    "name": "Fortune Sunlite Refined Sunflower Oil",
    "unit": "1 L",
    "price": 140,
    "mrp": 160,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152550/blinkit/products/prstgobypvrlfqh3murd.jpg",
    "categorySlug": "masala-oil-more",
    "description": "Light healthy sunflower oil enriched with vitamins A & D."
  },
  {
    "name": "Dhara Kachi Ghani Mustard Oil",
    "unit": "1 L",
    "price": 155,
    "mrp": 175,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152553/blinkit/products/vuqxbpmhpudgkazty3zc.jpg",
    "categorySlug": "masala-oil-more",
    "description": "Traditional pungent cold pressed sarson oil."
  },
  {
    "name": "Saffola Gold Pro Healthy Lifestyle Oil",
    "unit": "1 L",
    "price": 175,
    "mrp": 195,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152552/blinkit/products/t2irnd83z4wqhtjhdra2.webp",
    "categorySlug": "masala-oil-more",
    "description": "Dual-seed blend with oryzanol for healthy heart."
  },
  {
    "name": "Amul Pure Cow Desi Ghee",
    "unit": "1 L",
    "price": 590,
    "mrp": 630,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152553/blinkit/products/zknbrjsfvfq0j400vufv.webp",
    "categorySlug": "masala-oil-more",
    "description": "Aromatic golden cow ghee crafted from fresh cream."
  },
  {
    "name": "Mother Dairy Cow Ghee",
    "unit": "500 ml",
    "price": 310,
    "mrp": 330,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152555/blinkit/products/hrvr4zrv8xs3g8vtjnwf.webp",
    "categorySlug": "masala-oil-more",
    "description": "Pure granular cow ghee for authentic aroma."
  },
  {
    "name": "MDH Deggi Mirch Chilli Powder",
    "unit": "100 g",
    "price": 85,
    "mrp": 95,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152556/blinkit/products/othfp7muxe5wzfusrijq.png",
    "categorySlug": "masala-oil-more",
    "description": "Adds natural vibrant red color and mild heat."
  },
  {
    "name": "MDH Kitchen King Blended Spices",
    "unit": "100 g",
    "price": 82,
    "mrp": 90,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152556/blinkit/products/phqgh7ivfrd7umqinh5b.jpg",
    "categorySlug": "masala-oil-more",
    "description": "All-in-one masala blend for Indian vegetable curries."
  },
  {
    "name": "Everest Turmeric Powder / Haldi",
    "unit": "100 g",
    "price": 38,
    "mrp": 45,
    "stock": 110,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152558/blinkit/products/igvztbffmq1iql0hupvg.avif",
    "categorySlug": "masala-oil-more",
    "description": "Pure ground golden turmeric with high curcumin content."
  },
  {
    "name": "Everest Coriander Powder / Dhaniya",
    "unit": "100 g",
    "price": 42,
    "mrp": 50,
    "stock": 100,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152560/blinkit/products/ptq1zhfignvuqigc0li4.jpg",
    "categorySlug": "masala-oil-more",
    "description": "Fresh aromatic roasted coriander seeds ground to perfection."
  },
  {
    "name": "Tata Salt Vacuum Evaporated Iodized Salt",
    "unit": "1 kg",
    "price": 28,
    "mrp": 30,
    "stock": 150,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152559/blinkit/products/gaxvzgguaf55na427uar.jpg",
    "categorySlug": "masala-oil-more",
    "description": "Desh Ka Namak - pure vacuum evaporated iodized salt."
  },
  {
    "name": "Catch Black Pepper Grinder",
    "unit": "50 g",
    "price": 110,
    "mrp": 125,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152562/blinkit/products/bo5njvd9lmlnrhkom4uy.webp",
    "categorySlug": "masala-oil-more",
    "description": "Whole Tellicherry black peppercorns in built-in ceramic grinder."
  },
  {
    "name": "Everest Garam Masala",
    "unit": "100 g",
    "price": 88,
    "mrp": 98,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152563/blinkit/products/lbjgwfkdh8yyrlwc41z1.jpg",
    "categorySlug": "masala-oil-more",
    "description": "Exotic blend of 13 aromatic Indian spices."
  },
  {
    "name": "Kissan Fresh Tomato Ketchup",
    "unit": "950 g",
    "price": 125,
    "mrp": 145,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152561/blinkit/products/oq88ehqlnxxa0uonpabd.png",
    "categorySlug": "sauces-spreads",
    "description": "Made from 100% real juicy vine-ripened tomatoes."
  },
  {
    "name": "Maggi Rich Tomato Pichkoo Ketchup",
    "unit": "90 g",
    "price": 15,
    "mrp": 15,
    "stock": 120,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152565/blinkit/products/fyeir7via2rdr9vf9lxf.png",
    "categorySlug": "sauces-spreads",
    "description": "Convenient squeezable pouch of tangy tomato ketchup."
  },
  {
    "name": "Nutella Hazelnut Cocoa Spread",
    "unit": "350 g",
    "price": 320,
    "mrp": 350,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152565/blinkit/products/tsk5fn3op4alu5halaqh.avif",
    "categorySlug": "sauces-spreads",
    "description": "Iconic creamy hazelnut chocolate spread."
  },
  {
    "name": "Pintola All-Natural Peanut Butter Crunchy",
    "unit": "1 kg",
    "price": 399,
    "mrp": 450,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152565/blinkit/products/vonftu6lv05mgzyuvuf5.webp",
    "categorySlug": "sauces-spreads",
    "description": "100% roasted peanuts with zero added sugar or hydrogenated oils."
  },
  {
    "name": "Kissan Mixed Fruit Jam",
    "unit": "500 g",
    "price": 160,
    "mrp": 180,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152567/blinkit/products/pnj3fuwdc9z5stper7md.avif",
    "categorySlug": "sauces-spreads",
    "description": "Burst of 8 delicious fruits in every sweet spoonful."
  },
  {
    "name": "Dabur 100% Pure Honey Squeezy",
    "unit": "400 g",
    "price": 199,
    "mrp": 230,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152568/blinkit/products/u2aspanrwj9d0nczrfwj.jpg",
    "categorySlug": "sauces-spreads",
    "description": "Tested for zero sugar adulteration, pure forest honey."
  },
  {
    "name": "Veeba Classic Mayonnaise Eggless",
    "unit": "250 g",
    "price": 75,
    "mrp": 85,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152567/blinkit/products/vkn1yfntbsoqw92e5ai7.jpg",
    "categorySlug": "sauces-spreads",
    "description": "Ultra-creamy 100% vegetarian sandwich spread."
  },
  {
    "name": "Ching's Secret Schezwan Chutney",
    "unit": "250 g",
    "price": 85,
    "mrp": 95,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152571/blinkit/products/xuu3uuflkvpduerqefqp.jpg",
    "categorySlug": "sauces-spreads",
    "description": "Fiery garlic, red chilli and ginger dip."
  },
  {
    "name": "Veeba Sweet Onion Salad Dressing",
    "unit": "300 g",
    "price": 145,
    "mrp": 160,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152570/blinkit/products/uv9xvjv8jfxmjnmimgya.webp",
    "categorySlug": "sauces-spreads",
    "description": "Subway style sweet onion sauce for rolls and salads."
  },
  {
    "name": "Hershey's Chocolate Syrup Bottle",
    "unit": "623 g",
    "price": 215,
    "mrp": 240,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152570/blinkit/products/zieto9tujghi51hv022i.webp",
    "categorySlug": "sauces-spreads",
    "description": "Genuine chocolate topping for milkshakes, ice creams, and desserts."
  },
  {
    "name": "Funfoods Cheesy Garlic Spread",
    "unit": "250 g",
    "price": 99,
    "mrp": 110,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152574/blinkit/products/tozu1ln8dmh5n8tpqxok.webp",
    "categorySlug": "sauces-spreads",
    "description": "Rich cheddar cheese dip infused with roasted garlic."
  },
  {
    "name": "Ching's Dark Soy Sauce",
    "unit": "200 g",
    "price": 55,
    "mrp": 60,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152573/blinkit/products/gqdcdgsq14ljpyodsqia.jpg",
    "categorySlug": "sauces-spreads",
    "description": "Deep savory naturally brewed soy sauce for noodles and fried rice."
  },
  {
    "name": "Fresh Chicken Breast Boneless",
    "unit": "500 g",
    "price": 180,
    "mrp": 210,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152573/blinkit/products/la7h02sje0zeygbanjvf.jpg",
    "categorySlug": "chicken-meat-fish",
    "description": "Tender skinless antibiotic-free boneless chicken fillets."
  },
  {
    "name": "Fresh Tender Chicken Curry Cut",
    "unit": "500 g",
    "price": 140,
    "mrp": 165,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152576/blinkit/products/hysplexvomv48tbtrpog.jpg",
    "categorySlug": "chicken-meat-fish",
    "description": "Evenly cut bone-in pieces for succulent chicken curry."
  },
  {
    "name": "Fresh Chicken Drumsticks",
    "unit": "500 g (4-5 pcs)",
    "price": 165,
    "mrp": 190,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152576/blinkit/products/ajihsuq40itivvjqefzp.jpg",
    "categorySlug": "chicken-meat-fish",
    "description": "Meaty tender drumsticks perfect for roasts and tandoori."
  },
  {
    "name": "Fresh Chicken Keema / Mince",
    "unit": "450 g",
    "price": 195,
    "mrp": 220,
    "stock": 40,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152576/blinkit/products/h35jpejjtyrv9yrfqfbx.webp",
    "categorySlug": "chicken-meat-fish",
    "description": "Finely ground breast and leg meat for koftas and patties."
  },
  {
    "name": "Fresh Mutton Curry Cut",
    "unit": "500 g",
    "price": 450,
    "mrp": 495,
    "stock": 30,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152578/blinkit/products/teopfdnrgtwx0y6nj31y.webp",
    "categorySlug": "chicken-meat-fish",
    "description": "Tender baby goat cuts with ribs and chops."
  },
  {
    "name": "Fresh Mutton Biryani Cut",
    "unit": "500 g",
    "price": 470,
    "mrp": 515,
    "stock": 25,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152579/blinkit/products/zaj9gfregdhknrwe1jza.webp",
    "categorySlug": "chicken-meat-fish",
    "description": "Juicy bone-in meat chunks selected specifically for dum biryani."
  },
  {
    "name": "Cleaned Fresh Prawns Medium",
    "unit": "250 g",
    "price": 240,
    "mrp": 275,
    "stock": 35,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152589/blinkit/products/n1vtw2muqrsm7tr81thd.jpg",
    "categorySlug": "chicken-meat-fish",
    "description": "Tail-on peeled and deveined succulent freshwater prawns."
  },
  {
    "name": "Fresh Rohu Fish Bengali Curry Cut",
    "unit": "500 g",
    "price": 190,
    "mrp": 220,
    "stock": 35,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152591/blinkit/products/nwcdqjli2wepcosv2bjy.webp",
    "categorySlug": "chicken-meat-fish",
    "description": "Steaks with head pieces cleaned and scaled."
  },
  {
    "name": "Fresh Surmai / King Fish Steaks",
    "unit": "350 g",
    "price": 380,
    "mrp": 420,
    "stock": 25,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152592/blinkit/products/gdmxisg6wnjxzwt5b6sx.jpg",
    "categorySlug": "chicken-meat-fish",
    "description": "Delicate firm white steaks for rava fry or curries."
  },
  {
    "name": "Fresh Catla Fish Steaks",
    "unit": "500 g",
    "price": 210,
    "mrp": 240,
    "stock": 30,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152592/blinkit/products/ntlk4ycslbv1lqbihu0c.webp",
    "categorySlug": "chicken-meat-fish",
    "description": "Fresh freshwater sweet catla cuts for homestyle fish curries."
  },
  {
    "name": "Zorabian Chicken Cocktail Sausages",
    "unit": "250 g",
    "price": 165,
    "mrp": 185,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152596/blinkit/products/fqrqrgjadzr6jdm2ydwq.avif",
    "categorySlug": "chicken-meat-fish",
    "description": "Ready to cook lightly smoked cocktail frankfurters."
  },
  {
    "name": "Venky's Chicken Seekh Kabab",
    "unit": "250 g",
    "price": 175,
    "mrp": 195,
    "stock": 40,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152594/blinkit/products/urflmnsb5hbx4z8lzwpp.webp",
    "categorySlug": "chicken-meat-fish",
    "description": "Aromatic charcoal spiced chicken skewers ready in 5 minutes."
  },
  {
    "name": "Organic Tattva Wheat Flour Atta",
    "unit": "5 kg",
    "price": 295,
    "mrp": 330,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152594/blinkit/products/uhpksz5vnyrefwr2r3sk.jpg",
    "categorySlug": "organic-healthy-living",
    "description": "Certified pesticide-free 100% organic whole wheat flour."
  },
  {
    "name": "Organic Tattva Toor Dal Unpolished",
    "unit": "1 kg",
    "price": 210,
    "mrp": 235,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152598/blinkit/products/pvcw9v4zwldrawtkfwnn.webp",
    "categorySlug": "organic-healthy-living",
    "description": "Grown without chemical fertilizers or synthetic additives."
  },
  {
    "name": "Organic Tattva Moong Dal",
    "unit": "1 kg",
    "price": 190,
    "mrp": 215,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152598/blinkit/products/wewhhybwkgvtambing31.webp",
    "categorySlug": "organic-healthy-living",
    "description": "High protein organic yellow moong dal."
  },
  {
    "name": "24 Mantra Organic Royal Basmati Rice",
    "unit": "1 kg",
    "price": 185,
    "mrp": 210,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152599/blinkit/products/mt3ehvjtpm7wtiq2mw7k.webp",
    "categorySlug": "organic-healthy-living",
    "description": "Naturally aged organic aromatic long-grain basmati."
  },
  {
    "name": "Organic Tattva Raw Chia Seeds",
    "unit": "200 g",
    "price": 145,
    "mrp": 175,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152601/blinkit/products/owz2fd68ijqjfsb1arlr.webp",
    "categorySlug": "organic-healthy-living",
    "description": "Rich in Omega-3 fatty acids, iron, and fiber."
  },
  {
    "name": "True Elements Roasted Flax Seeds",
    "unit": "250 g",
    "price": 140,
    "mrp": 165,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152601/blinkit/products/uqnofgyfiiza29k6tvze.avif",
    "categorySlug": "organic-healthy-living",
    "description": "Crunchy lightly toasted alsi seeds for smoothies and bowls."
  },
  {
    "name": "24 Mantra Organic Cold Pressed Mustard Oil",
    "unit": "1 L",
    "price": 240,
    "mrp": 270,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152601/blinkit/products/dwhjvi05bky7ibr0lw9g.jpg",
    "categorySlug": "organic-healthy-living",
    "description": "Cold pressed without heat to retain authentic natural antioxidants."
  },
  {
    "name": "Organic Tattva Extra Virgin Olive Oil",
    "unit": "500 ml",
    "price": 650,
    "mrp": 750,
    "stock": 35,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152604/blinkit/products/ltnliw3lhz2gifhyqhkn.webp",
    "categorySlug": "organic-healthy-living",
    "description": "First cold pressed Spanish olive oil for healthy salads."
  },
  {
    "name": "24 Mantra Organic Brown Sugar",
    "unit": "500 g",
    "price": 65,
    "mrp": 75,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152604/blinkit/products/kt8ibusbpvjzupp2ylrs.webp",
    "categorySlug": "organic-healthy-living",
    "description": "Unrefined cane sugar with natural molasses aroma."
  },
  {
    "name": "Yogabar 100% Peanut Butter Dark Chocolate",
    "unit": "400 g",
    "price": 225,
    "mrp": 250,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152603/blinkit/products/frazplx191g3rs4i0rzm.webp",
    "categorySlug": "organic-healthy-living",
    "description": "Slow-roasted peanuts blended with real dark cocoa."
  },
  {
    "name": "24 Mantra Organic Turmeric Haldi Powder",
    "unit": "100 g",
    "price": 45,
    "mrp": 55,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152606/blinkit/products/vmlztrbe4lq7h2ggavxh.jpg",
    "categorySlug": "organic-healthy-living",
    "description": "High curcumin organic turmeric ground from whole roots."
  },
  {
    "name": "Organic Tattva White Quinoa",
    "unit": "500 g",
    "price": 220,
    "mrp": 260,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152606/blinkit/products/ujf0pssszpwmawidlyon.webp",
    "categorySlug": "organic-healthy-living",
    "description": "Gluten-free complete protein grain loaded with amino acids."
  },
  {
    "name": "Pampers All Round Protection Pants Size M",
    "unit": "76 pcs",
    "price": 899,
    "mrp": 1199,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152606/blinkit/products/dqqr10mh3maurcvthy4r.jpg",
    "categorySlug": "baby-care",
    "description": "Up to 12 hours absorption with anti-rash lotion with aloe."
  },
  {
    "name": "Pampers Premium Care Diapers Size L",
    "unit": "64 pcs",
    "price": 1050,
    "mrp": 1399,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152608/blinkit/products/mlbmxbsuzmlgepdhxo13.webp",
    "categorySlug": "baby-care",
    "description": "Feather-soft breathable pants for all-day comfort."
  },
  {
    "name": "Huggies Complete Comfort Diaper Pants M",
    "unit": "72 pcs",
    "price": 849,
    "mrp": 1099,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152608/blinkit/products/o4d5vjfnlb3igcmnkov3.webp",
    "categorySlug": "baby-care",
    "description": "Speed dry layer with 100% breathable cover."
  },
  {
    "name": "Johnson's Baby Skincare Wet Wipes",
    "unit": "72 wipes",
    "price": 175,
    "mrp": 210,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152609/blinkit/products/k8f1valm92kdrlfdas3l.jpg",
    "categorySlug": "baby-care",
    "description": "Enriched with moisturizing lotion to gently cleanse soft skin."
  },
  {
    "name": "Himalaya Gentle Baby Wipes",
    "unit": "72 wipes",
    "price": 145,
    "mrp": 175,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152611/blinkit/products/mt4nwepwzs3megezrvzu.webp",
    "categorySlug": "baby-care",
    "description": "Infused with aloe vera and lotus extracts."
  },
  {
    "name": "Nestle Cerelac Wheat Apple Baby Cereal",
    "unit": "300 g",
    "price": 250,
    "mrp": 275,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152611/blinkit/products/hm8swsrmrrybwp26zkbn.webp",
    "categorySlug": "baby-care",
    "description": "Fortified baby food from 6 months with iron and vitamins."
  },
  {
    "name": "Nestle Cerelac Rice Infant Cereal",
    "unit": "300 g",
    "price": 230,
    "mrp": 255,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152611/blinkit/products/a7bxl7we8el0w850emvr.png",
    "categorySlug": "baby-care",
    "description": "Gentle starter solid food with immuno-nutrients."
  },
  {
    "name": "Johnson's Baby No More Tears Shampoo",
    "unit": "200 ml",
    "price": 195,
    "mrp": 220,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152613/blinkit/products/asulgzcxi55iq3kpx6pv.jpg",
    "categorySlug": "baby-care",
    "description": "As gentle to eyes as pure water, pH balanced for babies."
  },
  {
    "name": "Johnson's Baby Soft Bathing Soap",
    "unit": "Pack of 3 (225 g)",
    "price": 165,
    "mrp": 190,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152613/blinkit/products/zzti7fwgbzaxosxfpfqn.jpg",
    "categorySlug": "baby-care",
    "description": "Clinically mildness proven with rich baby lotion."
  },
  {
    "name": "Himalaya Baby Massage Oil",
    "unit": "200 ml",
    "price": 160,
    "mrp": 185,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152613/blinkit/products/xupev3r4kmjjjikc6plq.webp",
    "categorySlug": "baby-care",
    "description": "Nourishes baby skin with olive oil and winter cherry."
  },
  {
    "name": "Sebamed Children's Gentle Wash",
    "unit": "200 ml",
    "price": 450,
    "mrp": 499,
    "stock": 35,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152615/blinkit/products/gykoo6ynkyb1pxrp6a6v.webp",
    "categorySlug": "baby-care",
    "description": "100% soap-free cleanser with ideal pH 5.5 for tender skin."
  },
  {
    "name": "Philips Avent Natural Feeding Bottle",
    "unit": "260 ml",
    "price": 495,
    "mrp": 550,
    "stock": 40,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152615/blinkit/products/wfghrw6dpnegtucpo6yg.webp",
    "categorySlug": "baby-care",
    "description": "Anti-colic ergonomic bottle with natural breast-shaped teat."
  },
  {
    "name": "Dabur Honitus Herbal Cough Syrup",
    "unit": "100 ml",
    "price": 95,
    "mrp": 105,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152615/blinkit/products/zjvezt2hbk21reaxfvc3.webp",
    "categorySlug": "pharma-wellness",
    "description": "Non-drowsy herbal formula with tulsi, mulethi and banapsha."
  },
  {
    "name": "Volini Fast Pain Relief Spray",
    "unit": "100 g",
    "price": 240,
    "mrp": 270,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152617/blinkit/products/akrsodno7j9haqvehwlf.webp",
    "categorySlug": "pharma-wellness",
    "description": "Quick micro-particle penetration for joint and muscular aches."
  },
  {
    "name": "Moov Fast Pain Relief Ointment",
    "unit": "50 g",
    "price": 165,
    "mrp": 185,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152617/blinkit/products/ktnocv0ve8ewd6w1hgsi.jpg",
    "categorySlug": "pharma-wellness",
    "description": "Fortified with wintergreen oil for soothing backache relief."
  },
  {
    "name": "Vicks VapoRub Cold Relief Balm",
    "unit": "50 ml",
    "price": 145,
    "mrp": 160,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152617/blinkit/products/khica6fi7tex1sfrf9h1.webp",
    "categorySlug": "pharma-wellness",
    "description": "Menthol, eucalyptus and camphor vapors for blocked nose."
  },
  {
    "name": "Dettol Antiseptic Liquid Disinfectant",
    "unit": "550 ml",
    "price": 195,
    "mrp": 220,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152620/blinkit/products/jrnptidde0dkvawvpl7h.jpg",
    "categorySlug": "pharma-wellness",
    "description": "Household first aid protection against cuts, scratches and bites."
  },
  {
    "name": "Durex Extra Thin Condoms",
    "unit": "Pack of 10",
    "price": 240,
    "mrp": 260,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152619/blinkit/products/vrvkoecjpfixn72imrtx.webp",
    "categorySlug": "pharma-wellness",
    "description": "Ultra thin lubricated latex condoms for heightened sensitivity."
  },
  {
    "name": "Durex Invisible Super Ultra Thin",
    "unit": "Pack of 3",
    "price": 120,
    "mrp": 135,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152619/blinkit/products/wbozjz7zmhulxyngv3ja.webp",
    "categorySlug": "pharma-wellness",
    "description": "Thinnest condom ever developed by Durex for maximum intimacy."
  },
  {
    "name": "ENO Fruit Salt Regular Antacid Sachet",
    "unit": "Pack of 6",
    "price": 55,
    "mrp": 60,
    "stock": 120,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152621/blinkit/products/rgydd6o5bqxflk80wywf.webp",
    "categorySlug": "pharma-wellness",
    "description": "Gets to work in 6 seconds against acidity and stomach burning."
  },
  {
    "name": "Digene Acidity & Gas Relief Gel Mint",
    "unit": "200 ml",
    "price": 140,
    "mrp": 155,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152621/blinkit/products/fsmspw8qdwb7veekblen.webp",
    "categorySlug": "pharma-wellness",
    "description": "Soothing sugar-free mint antacid syrup for instant acid neutrality."
  },
  {
    "name": "Revital H Daily Health Supplement",
    "unit": "30 Capsules",
    "price": 280,
    "mrp": 310,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152622/blinkit/products/xbvj7j5dsr4iafr9r6j2.jpg",
    "categorySlug": "pharma-wellness",
    "description": "Ginseng, 10 vitamins and 9 minerals to fight daily fatigue."
  },
  {
    "name": "Fast&Up Charge Vitamin C + Zinc Effervescent",
    "unit": "20 Tablets",
    "price": 295,
    "mrp": 390,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152623/blinkit/products/hestrrwj0xhisfazmcha.webp",
    "categorySlug": "pharma-wellness",
    "description": "Tasty orange fizz immunity booster tablets."
  },
  {
    "name": "Hansaplast Waterproof Bandages",
    "unit": "Pack of 20",
    "price": 65,
    "mrp": 75,
    "stock": 100,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152624/blinkit/products/zhvrw7llz3w3ahmgjpe4.jpg",
    "categorySlug": "pharma-wellness",
    "description": "Sterile breathable medicated wound adhesive plasters."
  },
  {
    "name": "Surf Excel Quick Wash Detergent Powder",
    "unit": "1 kg",
    "price": 145,
    "mrp": 165,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152626/blinkit/products/k9sgtdkq3zpsjq35ozqc.webp",
    "categorySlug": "cleaning-essentials",
    "description": "Superior stain removal powder formulated for quick washes."
  },
  {
    "name": "Surf Excel Matic Top Load Liquid Detergent",
    "unit": "1 L",
    "price": 210,
    "mrp": 240,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152626/blinkit/products/ovxuq1ga43zelkczfgou.jpg",
    "categorySlug": "cleaning-essentials",
    "description": "Dissolves completely in machines without leaving powdery residue."
  },
  {
    "name": "Ariel Matic Front Load Detergent Powder",
    "unit": "1 kg",
    "price": 225,
    "mrp": 255,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152628/blinkit/products/ahp1sh5spcitjtuujjas.jpg",
    "categorySlug": "cleaning-essentials",
    "description": "Deep fiber cleansing enzyme formula for brilliant whites."
  },
  {
    "name": "Comfort Morning Fresh Fabric Conditioner",
    "unit": "860 ml",
    "price": 195,
    "mrp": 230,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152628/blinkit/products/nqewlwsulwttwmesbtqr.webp",
    "categorySlug": "cleaning-essentials",
    "description": "Locks in all-day floral fragrance and keeps clothes silky soft."
  },
  {
    "name": "Vim Lemon Dishwash Liquid Gel",
    "unit": "500 ml",
    "price": 105,
    "mrp": 120,
    "stock": 95,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152626/blinkit/products/ifigcl27pnpvxvhdmgyb.jpg",
    "categorySlug": "cleaning-essentials",
    "description": "Cuts through tough oil and burnt grease in one swipe."
  },
  {
    "name": "Pril Lime Dishwash Liquid Degreaser",
    "unit": "425 ml",
    "price": 99,
    "mrp": 115,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152628/blinkit/products/oyjoheajfdnzely3y7wn.webp",
    "categorySlug": "cleaning-essentials",
    "description": "Active lime power formula for sparkling clean utensils."
  },
  {
    "name": "Harpic Power Plus Toilet Cleaner Blue",
    "unit": "500 ml",
    "price": 90,
    "mrp": 99,
    "stock": 110,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152631/blinkit/products/vbwgkgnsu8l0mt22leod.webp",
    "categorySlug": "cleaning-essentials",
    "description": "Kills 99.9% germs and dissolves limescale and yellow stains."
  },
  {
    "name": "Harpic Floral Bathroom Cleaner Liquid",
    "unit": "500 ml",
    "price": 95,
    "mrp": 105,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152629/blinkit/products/o6matundxzexzukdl9iq.jpg",
    "categorySlug": "cleaning-essentials",
    "description": "Strong tile, basin, and floor disinfectant with floral scent."
  },
  {
    "name": "Lizol Disinfectant Surface Cleaner Citrus",
    "unit": "1 L",
    "price": 180,
    "mrp": 210,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152631/blinkit/products/nfdslwfxe6qjfhleu70i.png",
    "categorySlug": "cleaning-essentials",
    "description": "10x better germ protection than regular phenyls."
  },
  {
    "name": "Colin Glass & Surface Cleaner Spray",
    "unit": "500 ml",
    "price": 95,
    "mrp": 105,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152633/blinkit/products/nm8uefnoru2rk2pmgvwk.webp",
    "categorySlug": "cleaning-essentials",
    "description": "Streak-free shine on mirrors, glass tables, and car windscreens."
  },
  {
    "name": "Scotch-Brite Scrub Sponge",
    "unit": "Pack of 3",
    "price": 75,
    "mrp": 90,
    "stock": 120,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152633/blinkit/products/ywyfwbjwukh7bqbtluuf.avif",
    "categorySlug": "cleaning-essentials",
    "description": "Durable nylon scrub with soft absorbent sponge backing."
  },
  {
    "name": "Dettol Disinfectant Multipurpose Liquid",
    "unit": "500 ml",
    "price": 175,
    "mrp": 199,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152632/blinkit/products/oro2tunyukvs8zqw8s9h.webp",
    "categorySlug": "cleaning-essentials",
    "description": "Lime fresh protection for laundry, floors, and personal hygiene."
  },
  {
    "name": "Odonil Room Air Freshener Lavender Block",
    "unit": "50 g",
    "price": 55,
    "mrp": 65,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152635/blinkit/products/dryxrlqiu5gjjng1fr84.jpg",
    "categorySlug": "home-office",
    "description": "Long-lasting natural lavender fragrance block for wardrobes."
  },
  {
    "name": "Godrej Aer Pocket Bathroom Fragrance",
    "unit": "10 g",
    "price": 58,
    "mrp": 65,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152635/blinkit/products/luwwrtdzddphofvxskjx.webp",
    "categorySlug": "home-office",
    "description": "Power gel pocket fragrance lasting up to 30 days."
  },
  {
    "name": "Godrej Aer Matic Auto Room Spray",
    "unit": "225 ml",
    "price": 450,
    "mrp": 500,
    "stock": 40,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152634/blinkit/products/yky9kgk5bgq4vsolilvs.webp",
    "categorySlug": "home-office",
    "description": "Automatic battery operated room fragrance dispenser kit."
  },
  {
    "name": "Fevistik Super Glue Stick Non-Toxic",
    "unit": "15 g",
    "price": 25,
    "mrp": 25,
    "stock": 120,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152636/blinkit/products/cnwr4wpfddtj7f8jgkp0.webp",
    "categorySlug": "home-office",
    "description": "Smooth clean non-messy adhesive glue stick for paper craft."
  },
  {
    "name": "Fevikwik Instant Adhesive Drop",
    "unit": "3 g",
    "price": 10,
    "mrp": 10,
    "stock": 150,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152637/blinkit/products/ij0jmfsl07fklknmq8y3.jpg",
    "categorySlug": "home-office",
    "description": "Bonds plastic, wood, rubber, and ceramics in 5 seconds."
  },
  {
    "name": "Duracell Ultra AA Alkaline Batteries",
    "unit": "Pack of 4",
    "price": 160,
    "mrp": 180,
    "stock": 75,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152638/blinkit/products/pfe1fdvxo4e3kpusk3uo.jpg",
    "categorySlug": "home-office",
    "description": "Powercheck technology for maximum long-lasting battery life."
  },
  {
    "name": "Duracell Chota AAA Alkaline Batteries",
    "unit": "Pack of 4",
    "price": 160,
    "mrp": 180,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152641/blinkit/products/autwrm05nrkefmi1dhwe.jpg",
    "categorySlug": "home-office",
    "description": "Dependable power for TV remotes, toys, and mice."
  },
  {
    "name": "Goodknight Gold Flash Liquid Vaporizer",
    "unit": "45 ml Refill",
    "price": 75,
    "mrp": 85,
    "stock": 100,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152640/blinkit/products/rmhtrrzi8b4ix7z0kigz.avif",
    "categorySlug": "home-office",
    "description": "Guarantees knockout protection against disease-causing mosquitoes."
  },
  {
    "name": "All Out Ultra Mosquito Repellent Refill",
    "unit": "45 ml",
    "price": 75,
    "mrp": 85,
    "stock": 95,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152640/blinkit/products/uzqwjbufplchodtrapwy.jpg",
    "categorySlug": "home-office",
    "description": "Covers entire room corners for peaceful uninterrupted sleep."
  },
  {
    "name": "Origami Kitchen Paper Towel Roll",
    "unit": "Pack of 2 (120 Pulls)",
    "price": 120,
    "mrp": 140,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152643/blinkit/products/bofchm21at2mngklytdr.webp",
    "categorySlug": "home-office",
    "description": "Extra absorbent 2-ply kitchen towels for soaking spills and oils."
  },
  {
    "name": "Classmate Pulse Spiral Notebook A4",
    "unit": "300 pages",
    "price": 160,
    "mrp": 180,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152643/blinkit/products/pyyu1rgrtjzqtyvud41d.webp",
    "categorySlug": "home-office",
    "description": "Smooth ozone-bleached paper with sturdy spiral binding."
  },
  {
    "name": "Scotch Magic Tape with Dispenser",
    "unit": "1 pc (19 mm x 7.6 m)",
    "price": 85,
    "mrp": 95,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152644/blinkit/products/ietxdtq0vgt34noa4mow.jpg",
    "categorySlug": "home-office",
    "description": "Invisible matte-finish writeable tape for envelopes and gifts."
  },
  {
    "name": "Dove Cream Beauty Bathing Soap Bar",
    "unit": "100 g",
    "price": 62,
    "mrp": 70,
    "stock": 85,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152647/blinkit/products/lfttzat1udcpdnfwgmve.jpg",
    "categorySlug": "personal-care",
    "description": "Formulated with 1/4th moisturizing cream for supple skin."
  },
  {
    "name": "Dettol Original Germ Protection Soap",
    "unit": "Pack of 4 x 125 g",
    "price": 180,
    "mrp": 210,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152648/blinkit/products/y9huzxmqwxjrhikrzhk8.jpg",
    "categorySlug": "personal-care",
    "description": "Proven antibacterial defense with signature pine fragrance."
  },
  {
    "name": "Pears Pure & Gentle Glycerin Soap",
    "unit": "Pack of 3 x 125 g",
    "price": 220,
    "mrp": 250,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152650/blinkit/products/wj7x547zongnfzjpd8yp.webp",
    "categorySlug": "personal-care",
    "description": "Natural oils and 98% pure glycerin for glowing clear skin."
  },
  {
    "name": "Dettol Liquid Handwash Refill Pump",
    "unit": "675 ml",
    "price": 99,
    "mrp": 119,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152659/blinkit/products/oczvuysrc9w6xp3xg96m.jpg",
    "categorySlug": "personal-care",
    "description": "10x better germ protection than regular liquid hand soaps."
  },
  {
    "name": "Colgate MaxFresh Spicy Fresh Toothpaste",
    "unit": "150 g",
    "price": 95,
    "mrp": 110,
    "stock": 95,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152647/blinkit/products/ktxzhhe5ezywbeykggti.webp",
    "categorySlug": "personal-care",
    "description": "Cooling crystal gel toothpaste offering long-lasting fresh breath."
  },
  {
    "name": "Sensodyne Fresh Mint Sensitive Toothpaste",
    "unit": "100 g",
    "price": 160,
    "mrp": 180,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152649/blinkit/products/yxr9cfsfxwavxxcrrkkh.jpg",
    "categorySlug": "personal-care",
    "description": "Clinically proven desensitizing relief from tooth sensitivity."
  },
  {
    "name": "Oral-B Pro-Health Soft Toothbrush",
    "unit": "Pack of 2",
    "price": 90,
    "mrp": 100,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152652/blinkit/products/gkj7nojc7xi0ptv7dj4r.webp",
    "categorySlug": "personal-care",
    "description": "CrossAction angled bristles reach between tight teeth."
  },
  {
    "name": "Head & Shoulders Anti-Dandruff Shampoo",
    "unit": "340 ml",
    "price": 295,
    "mrp": 340,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152653/blinkit/products/auu71tm2rhcbgrxhmitr.jpg",
    "categorySlug": "personal-care",
    "description": "Eliminates visible dandruff flakes and cleanses itchy scalp."
  },
  {
    "name": "Dove Intense Repair Hair Conditioner",
    "unit": "175 ml",
    "price": 195,
    "mrp": 225,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152652/blinkit/products/jxybnbnxahhelwgwycjy.webp",
    "categorySlug": "personal-care",
    "description": "Keratin actives deeply repair split ends and frizz."
  },
  {
    "name": "Nivea Soft Light Moisturizing Cream",
    "unit": "200 ml",
    "price": 275,
    "mrp": 320,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152656/blinkit/products/rzcithytmtn3lzszrqik.webp",
    "categorySlug": "personal-care",
    "description": "Jojoba oil and vitamin E fast-absorbing everyday cream."
  },
  {
    "name": "Whisper Ultra Clean Sanitary Pads XL",
    "unit": "30 pads",
    "price": 295,
    "mrp": 349,
    "stock": 90,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152655/blinkit/products/umncgycbphqcq9qmsprj.jpg",
    "categorySlug": "personal-care",
    "description": "Delightful scent and super absorbent core with wings."
  },
  {
    "name": "Gillette Mach 3 Turbo Razor Blade Cartridges",
    "unit": "Pack of 4",
    "price": 550,
    "mrp": 625,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152654/blinkit/products/olvbmq9j0mi6x4taw5py.jpg",
    "categorySlug": "personal-care",
    "description": "3 high-definition blades with lubricating strip for zero irritation."
  },
  {
    "name": "Pedigree Adult Dog Food Chicken & Vegetables",
    "unit": "1.2 kg",
    "price": 295,
    "mrp": 330,
    "stock": 60,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152658/blinkit/products/vevmqcio4dsh63g4c2ns.jpg",
    "categorySlug": "pet-care",
    "description": "Balanced recipe supporting strong immunity, teeth, and shiny coat."
  },
  {
    "name": "Pedigree Puppy Food Chicken & Milk",
    "unit": "1.2 kg",
    "price": 310,
    "mrp": 350,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152658/blinkit/products/egoqxggkes7zypsawzlw.webp",
    "categorySlug": "pet-care",
    "description": "Calcium and protein fortified for growing young puppies."
  },
  {
    "name": "Pedigree Adult Dog Gravy Pouch Chicken",
    "unit": "100 g",
    "price": 40,
    "mrp": 40,
    "stock": 120,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152661/blinkit/products/uwbimgunwojq119uav5y.png",
    "categorySlug": "pet-care",
    "description": "Moist tender meat chunks in delicious savory gravy."
  },
  {
    "name": "Whiskas Adult Cat Food Ocean Fish",
    "unit": "1.2 kg",
    "price": 380,
    "mrp": 420,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152660/blinkit/products/watqioj0my87xmjltp3b.avif",
    "categorySlug": "pet-care",
    "description": "Crunchy kibbles with real fish pockets for adult felines."
  },
  {
    "name": "Whiskas Cat Food Wet Gravy Pouch Tuna",
    "unit": "85 g",
    "price": 45,
    "mrp": 45,
    "stock": 110,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152662/blinkit/products/hnlifpupgclbvkvg4bm9.avif",
    "categorySlug": "pet-care",
    "description": "Delicious soft steamed tuna loaf in aromatic jelly."
  },
  {
    "name": "Pedigree Meat Jerky Stiff Dog Treats",
    "unit": "80 g",
    "price": 120,
    "mrp": 135,
    "stock": 70,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152665/blinkit/products/bjiqm4g77ojxtek2meiy.jpg",
    "categorySlug": "pet-care",
    "description": "Chewy smoked meat strips for reward training."
  },
  {
    "name": "Purepet Ocean Fish Adult Dry Cat Food",
    "unit": "1.2 kg",
    "price": 260,
    "mrp": 290,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152664/blinkit/products/ercg2swmiingziqpoyyn.webp",
    "categorySlug": "pet-care",
    "description": "Essential taurine and vitamins to keep vision and coat healthy."
  },
  {
    "name": "Drools Absolute Calcium Dog Bone Treats",
    "unit": "Pack of 30 bones (300 g)",
    "price": 240,
    "mrp": 280,
    "stock": 55,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152664/blinkit/products/aorzsfyedvogc8hw8em2.webp",
    "categorySlug": "pet-care",
    "description": "Chewable calcium tablets for dense bones and teeth."
  },
  {
    "name": "Me-O Creamy Cat Treats Salmon Flavour",
    "unit": "4 x 15 g (60 g)",
    "price": 95,
    "mrp": 110,
    "stock": 80,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152669/blinkit/products/rjehwmghbtacgk1hntar.jpg",
    "categorySlug": "pet-care",
    "description": "Lickable pureed salmon treat for happy cats."
  },
  {
    "name": "Choostix Dog Chewy Rawhide Pressed Bones",
    "unit": "Pack of 4 (4 inches)",
    "price": 150,
    "mrp": 175,
    "stock": 65,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152667/blinkit/products/ucldu8r6aaxmyiyessaj.jpg",
    "categorySlug": "pet-care",
    "description": "Long-lasting rawhide chew bones reducing tartar buildup."
  },
  {
    "name": "Himalaya Erina Plus Herbal Pet Shampoo",
    "unit": "200 ml",
    "price": 195,
    "mrp": 220,
    "stock": 45,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152668/blinkit/products/vobwcmpzexs2qah9ui0u.jpg",
    "categorySlug": "pet-care",
    "description": "Neem and eucalyptus conditioning coat wash against ticks."
  },
  {
    "name": "Drools Puppy Food Chicken & Egg",
    "unit": "1.2 kg",
    "price": 280,
    "mrp": 310,
    "stock": 50,
    "image": "https://res.cloudinary.com/dkhl8wvj/image/upload/v1791152670/blinkit/products/pd7ssfzihgzwrg5vwsxv.jpg",
    "categorySlug": "pet-care",
    "description": "DHA enriched puppy kibble with easily digestible eggs."
  }
];

  console.log(`📦 Upserting ${productsData.length} products...`);
  for (const prod of productsData) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) {
      console.warn(`  ⚠️ Category not found for slug: ${prod.categorySlug}`);
      continue;
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: prod.name,
        categoryId: categoryId,
      },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          description: prod.description,
          price: prod.price,
          mrp: prod.mrp,
          unit: prod.unit,
          stock: prod.stock,
          image: prod.image,
        },
      });
      console.log(`  ↻ Updated: ${prod.name}`);
    } else {
      await prisma.product.create({
        data: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          mrp: prod.mrp,
          unit: prod.unit,
          stock: prod.stock,
          image: prod.image,
          categoryId: categoryId,
        },
      });
      console.log(`  + Created: ${prod.name}`);
    }
  }

  console.log('🎉 Seeding successfully completed without destructive commands!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
