import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';
import { Page } from '../src/models/Page';
import { Section } from '../src/models/Section';
import { MenuItem } from '../src/models/Menu';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in the .env file.');
  process.exit(1);
}

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected successfully.\n');

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Page.deleteMany({}),
      Section.deleteMany({}),
      MenuItem.deleteMany({}),
    ]);
    console.log('Data cleared.\n');

    // 1. Create Super Admin
    console.log('Creating Super Admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'System Administrator',
      email: 'admin@novaindustries.com',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    console.log('Admin created: admin@novaindustries.com / admin123\n');

    // 2. Create Navigation Menu
    console.log('Creating Navigation...');
    const homeMenu = await MenuItem.create({ label: 'Home', url: '/', isActive: true, sortOrder: 1 });
    const aboutMenu = await MenuItem.create({ label: 'About Us', url: '/about', isActive: true, sortOrder: 2 });
    
    // Parent Dropdown
    const businessesMenu = await MenuItem.create({ label: 'Our Businesses', url: '#', isActive: true, sortOrder: 3 });
    await MenuItem.create({ label: 'Pharmaceuticals', url: '/businesses/pharma', isActive: true, sortOrder: 1, parentId: businessesMenu._id });
    await MenuItem.create({ label: 'Agriculture', url: '/businesses/agri', isActive: false, sortOrder: 2, parentId: businessesMenu._id }); // Inactive test case

    await MenuItem.create({ label: 'Contact', url: '/contact', isActive: true, sortOrder: 4 });
    console.log('Navigation created.\n');

    // 3. Create Homepage
    console.log('Creating Homepage & Sections...');
    const homePage = await Page.create({
      title: 'Home',
      slug: 'home',
      status: 'PUBLISHED',
      seo: { title: 'Nova Industries PLC - Official Website', description: 'Innovating for a better tomorrow.' },
    });

    const heroSection = await Section.create({
      pageId: homePage._id,
      type: 'hero',
      sortOrder: 1,
      isVisible: true,
      content: {
        title: 'Building the Future of Industry',
        subtitle: 'A global leader in sustainable manufacturing and innovation.',
        backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
        button1: 'Discover Our Businesses',
        button1Url: '/businesses',
        button2: 'Investor Relations',
        button2Url: '/investors',
      }
    });

    const aboutSection = await Section.create({
      pageId: homePage._id,
      type: 'about',
      sortOrder: 2,
      isVisible: true,
      content: {
        heading: 'Pioneering Progress Since 1995',
        description: 'Nova Industries PLC operates across multiple sectors, driving economic growth while maintaining our commitment to environmental sustainability. Our diverse portfolio spans pharmaceuticals, agriculture, and advanced consumer products.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
        button: 'Read Full Profile',
        buttonUrl: '/about',
        statistics: [
          { value: '25+', label: 'Countries' },
          { value: '10K+', label: 'Employees' },
        ]
      }
    });

    // Link sections to page
    homePage.sections = [heroSection._id, aboutSection._id];
    await homePage.save();
    console.log('Homepage created.\n');

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();