import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const adminName = process.env.ADMIN_NAME || 'System Admin';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

const seedAdmin = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      existingUser.name = adminName;
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      await existingUser.save();

      console.log(`Updated existing user as admin: ${adminEmail}`);
    } else {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });

      console.log(`Created admin user: ${adminEmail}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
