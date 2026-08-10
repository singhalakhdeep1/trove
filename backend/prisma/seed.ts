import { PrismaClient, UserRole, ProductStatus, SellerStatus, AddressType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trove.com' },
    update: {},
    create: {
      email: 'admin@trove.com',
      firstName: 'System',
      lastName: 'Admin',
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fKbX23dO1r3vWjJgP7tJ3n7N7z8N9k0N1m2O3p4', // dummy hashed pass
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@trove.com' },
    update: {},
    create: {
      email: 'seller@trove.com',
      firstName: 'John',
      lastName: 'Seller',
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fKbX23dO1r3vWjJgP7tJ3n7N7z8N9k0N1m2O3p4',
      role: UserRole.SELLER,
      isVerified: true,
    },
  });

  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@trove.com' },
    update: {},
    create: {
      email: 'buyer@trove.com',
      firstName: 'Alice',
      lastName: 'Buyer',
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fKbX23dO1r3vWjJgP7tJ3n7N7z8N9k0N1m2O3p4',
      role: UserRole.BUYER,
      isVerified: true,
    },
  });

  console.log('✅ Created Users:', { admin: admin.id, seller: sellerUser.id, buyer: buyerUser.id });

  // 2. Create Address for Buyer
  await prisma.address.create({
    data: {
      userId: buyerUser.id,
      type: AddressType.HOME,
      street: '123 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      isDefault: true,
    },
  }).catch(() => {});

  // 3. Create Seller Profile
  const sellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      businessName: 'TechTrove Electronics',
      businessType: 'Retail',
      description: 'Official electronics storefront for premium gadgets.',
      status: SellerStatus.ACTIVE,
      isVerified: true,
    },
  });

  console.log('✅ Created Seller Profile:', sellerProfile.id);

  // 4. Create Categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets, audio gear, and smart home tech.',
    },
  });

  const fashionCategory = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion & Apparel',
      slug: 'fashion',
      description: 'Clothing, footwear, and accessories.',
    },
  });

  console.log('✅ Created Categories:', [electronicsCategory.name, fashionCategory.name]);

  // 5. Create Products
  const product1 = await prisma.product.upsert({
    where: { slug: 'wireless-headphones' },
    update: {},
    create: {
      sellerId: sellerProfile.id,
      categoryId: electronicsCategory.id,
      name: 'Wireless Noise-Cancelling Headphones',
      slug: 'wireless-headphones',
      description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
      sku: 'HEADPHONES-NC-001',
      price: 199.99,
      comparePrice: 249.99,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 24,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { slug: 'smart-watch-pro' },
    update: {},
    create: {
      sellerId: sellerProfile.id,
      categoryId: electronicsCategory.id,
      name: 'Smart Watch Pro Edition',
      slug: 'smart-watch-pro',
      description: 'Fitness tracking, heart-rate monitoring, and AMOLED display.',
      sku: 'WATCH-PRO-002',
      price: 149.50,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
      status: ProductStatus.PUBLISHED,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 18,
    },
  });

  console.log('✅ Created Products:', [product1.name, product2.name]);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
