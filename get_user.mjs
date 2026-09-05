import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: '.env.local'});
dotenv.config({path: '.env'});
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.once('open', async () => {
  const users = await db.collection('users').find({}).limit(5).toArray();
  console.log(users.map(u => ({email: u.email, passHash: u.passwordHash})));
  process.exit();
});
