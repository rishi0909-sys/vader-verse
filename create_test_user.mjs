import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({path: '.env.local'});
dotenv.config({path: '.env'});

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection;
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    
    // Check if test user exists
    const collection = db.collection('users');
    const existing = await collection.findOne({ email: 'test@vaderverse.com' });
    
    if (existing) {
      await collection.updateOne(
        { email: 'test@vaderverse.com' },
        { $set: { passwordHash: passwordHash } }
      );
      console.log('Updated existing test user: test@vaderverse.com');
    } else {
      await collection.insertOne({
        username: 'TestVader',
        email: 'test@vaderverse.com',
        passwordHash: passwordHash,
        role: 'user',
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Created new test user: test@vaderverse.com');
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createTestUser();
