import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  recipient?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  recipient: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, status: 1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);