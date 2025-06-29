import express from 'express';
import Transaction from '../models/Transaction';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Export transactions to CSV
router.post('/csv', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?._id;
    const { 
      columns = ['date', 'description', 'amount', 'type', 'category', 'status'],
      filters = {}
    } = req.body;

    // Build filter object
    const filter: any = { userId, ...filters };
    
    if (filters.startDate || filters.endDate) {
      filter.date = {};
      if (filters.startDate) filter.date.$gte = new Date(filters.startDate);
      if (filters.endDate) filter.date.$lte = new Date(filters.endDate);
    }

    // Fetch transactions
    const transactions = await Transaction.find(filter).sort({ date: -1 });

    // Define column mappings
    const columnMappings: { [key: string]: { id: string; title: string } } = {
      date: { id: 'date', title: 'Date' },
      description: { id: 'description', title: 'Description' },
      amount: { id: 'amount', title: 'Amount' },
      type: { id: 'type', title: 'Type' },
      category: { id: 'category', title: 'Category' },
      status: { id: 'status', title: 'Status' },
      recipient: { id: 'recipient', title: 'Recipient' },
      reference: { id: 'reference', title: 'Reference' }
    };

    // Create CSV writer configuration
    const csvColumns = columns.map(col => columnMappings[col]).filter(Boolean);
    const fileName = `transactions_${Date.now()}.csv`;
    const filePath = path.join(process.cwd(), 'temp', fileName);

    // Ensure temp directory exists
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: csvColumns
    });

    // Format data for CSV
    const csvData = transactions.map(transaction => {
      const row: any = {};
      columns.forEach(col => {
        if (col === 'date') {
          row[col] = transaction.date.toISOString().split('T')[0];
        } else if (col === 'amount') {
          row[col] = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
        } else {
          row[col] = transaction[col as keyof typeof transaction] || '';
        }
      });
      return row;
    });

    // Write CSV file
    await csvWriter.writeRecords(csvData);

    // Send file as download
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ error: 'Failed to download file' });
      } else {
        // Clean up temp file after download
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
        });
      }
    });
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

export default router;