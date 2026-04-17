import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

// Load environment variables
dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env' });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL,
      role: 'superadmin'
    });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Validate environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
    }

    // Create new admin user in the unified User collection with superadmin role
    // Password will be hashed by pre-save middleware
    const admin = new User({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'superadmin',
      isEmailVerified: true,
      status: 'active'
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email:', process.env.ADMIN_EMAIL);
    console.log('Password has been hashed and stored securely');
    console.log('Role: superadmin');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the migration
createAdminUser();