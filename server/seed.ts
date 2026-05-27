import { connectDB } from './configs/db';
import { Admin } from './models/Admin';
import { Theme } from './models/Theme';
import bcrypt from 'bcryptjs';

const defaultThemes = [
  { name: 'Neon Green', slug: 'green', primary: '#39ff14', rgb: '57, 255, 20', isActive: true },
  { name: 'Electric Blue', slug: 'blue', primary: '#3b82f6', rgb: '59, 130, 246', isActive: true },
  { name: 'Vivid Purple', slug: 'purple', primary: '#a855f7', rgb: '168, 85, 247', isActive: true },
  { name: 'Sky Blue', slug: 'skyblue', primary: '#0ea5e9', rgb: '14, 165, 233', isActive: true },
  { name: 'Zinc', slug: 'zinc', primary: '#71717a', rgb: '113, 113, 122', isActive: true },
  { name: 'Amber', slug: 'amber', primary: '#f59e0b', rgb: '245, 158, 11', isActive: true },
  { name: 'Rose', slug: 'rose', primary: '#f43f5e', rgb: '244, 63, 94', isActive: true },
  { name: 'Cyan', slug: 'cyan', primary: '#06b6d4', rgb: '6, 182, 212', isActive: true },
  { name: 'Emerald', slug: 'emerald', primary: '#10b981', rgb: '16, 185, 129', isActive: true },
  { name: 'Orange', slug: 'orange', primary: '#f97316', rgb: '249, 115, 22', isActive: true },
];

async function seed() {
  await connectDB();

  const adminExists = await Admin.findOne({ email: 'admin@portfolio.com' });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      email: 'admin@portfolio.com',
      username: 'superadmin',
      password: hashedPassword,
      role: 'super_admin',
    });
    console.log('Super admin created: admin@portfolio.com / admin123');
  } else {
    console.log('Super admin already exists');
  }

  const existingThemes = await Theme.countDocuments();
  if (existingThemes === 0) {
    await Theme.insertMany(defaultThemes);
    console.log(`${defaultThemes.length} default themes created`);
  } else {
    console.log(`${existingThemes} themes already exist`);
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
