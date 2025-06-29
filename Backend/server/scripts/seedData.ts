import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Transaction from '../models/Transaction';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Sample users data
const sampleUsers = [
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'user001@example.com',
    password: 'password123',
    name: 'John Smith',
    role: 'user'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'user002@example.com',
    password: 'password123',
    name: 'Sarah Johnson',
    role: 'user'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'user003@example.com',
    password: 'password123',
    name: 'Michael Brown',
    role: 'user'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    email: 'user004@example.com',
    password: 'password123',
    name: 'Emily Davis',
    role: 'user'
  }
];

// User ID mapping
const userIdMapping: { [key: string]: mongoose.Types.ObjectId } = {
  'user_001': sampleUsers[0]._id,
  'user_002': sampleUsers[1]._id,
  'user_003': sampleUsers[2]._id,
  'user_004': sampleUsers[3]._id
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI );
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    await User.insertMany(hashedUsers);
    console.log('Created sample users');

    // Read and process transactions data
    const transactionsPath = path.join(__dirname, '../data/transactions.json');
    const transactionsData = JSON.parse(fs.readFileSync(transactionsPath, 'utf8'));

    // Transform transactions to match our schema
    const transformedTransactions = transactionsData.map((transaction: any) => ({
      userId: userIdMapping[transaction.user_id],
      type: transaction.category === 'Revenue' ? 'income' : 'expense',
      amount: transaction.amount,
      category: transaction.category === 'Revenue' ? 'Sales' : 'Business Expense',
      description: `Transaction #${transaction.id} - ${transaction.category}`,
      status: transaction.status.toLowerCase() === 'paid' ? 'completed' : 'pending',
      date: new Date(transaction.date),
      recipient: `${transaction.category} Transaction`,
      reference: `REF-${transaction.id}`
    }));

    await Transaction.insertMany(transformedTransactions);
    console.log(`Created ${transformedTransactions.length} sample transactions`);

    console.log('Database seeded successfully!');
    console.log('\nSample user credentials:');
    sampleUsers.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.email} / password123`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding script
seedDatabase();

export default seedDatabase;