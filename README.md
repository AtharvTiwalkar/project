# Penta Financial Dashboard

A comprehensive full-stack financial application with dynamic data visualization, advanced filtering, and configurable CSV export functionality.

## Features

### 🔐 Authentication & Security
- JWT-based login/logout system
- Secure API endpoints with token validation
- Protected routes and middleware
- Password hashing with bcrypt

### 📊 Financial Dashboard
- **Interactive Visualizations**: Revenue vs expenses trends, category breakdowns, summary metrics
- **Transaction Management**: Paginated display with responsive design
- **Advanced Filtering**: Multi-field filters (Date, Amount, Category, Status, User)
- **Smart Sorting**: Column-based sorting with visual indicators
- **Real-time Search**: Search across transaction fields with instant results

### 📈 Data Visualization
- Beautiful charts using Recharts library
- Monthly income/expense trends
- Category-wise expense breakdown
- Real-time dashboard metrics

### 📋 CSV Export System
- **Column Configuration**: Users can select which fields to export
- **Auto-download**: Automatic file download when ready
- **Filter Integration**: Export filtered data sets
- **Custom Formatting**: Proper CSV formatting with headers

### 🎨 Modern UI/UX
- Dark theme interface with emerald green accents
- Responsive design for all screen sizes
- Smooth animations and hover effects
- Professional card-based layout
- Intuitive navigation and user flows

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Zustand** for state management
- **Recharts** for data visualization
- **React Router** for navigation
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CSV Writer** for export functionality
- **Helmet** for security headers
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/financial-dashboard
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
```

3. **Start the development servers**:
```bash
npm run dev
```

This will start both frontend (port 5173) and backend (port 3001) servers concurrently.

### Default Test Data

For development, you can create test transactions via the API or add sample data directly to MongoDB.

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication).

### Transaction Endpoints

#### GET `/api/transactions`
Get paginated transactions with filtering and sorting.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term
- `category` (string): Filter by category
- `type` (string): Filter by type (income/expense)
- `status` (string): Filter by status
- `startDate` (string): Start date filter
- `endDate` (string): End date filter
- `sortBy` (string): Sort field (default: date)
- `sortOrder` (string): Sort order (asc/desc)

#### POST `/api/transactions`
Create a new transaction.

**Request Body:**
```json
{
  "type": "expense",
  "amount": 25.50,
  "category": "Food",
  "description": "Lunch at restaurant",
  "status": "completed",
  "date": "2024-01-15T12:00:00Z",
  "recipient": "Restaurant ABC"
}
```

#### PUT `/api/transactions/:id`
Update an existing transaction.

#### DELETE `/api/transactions/:id`
Delete a transaction.

### Dashboard Endpoints

#### GET `/api/dashboard/analytics`
Get dashboard analytics and summary data.

**Query Parameters:**
- `period` (number): Number of months to include (default: 12)

#### GET `/api/dashboard/categories`
Get list of available transaction categories.

### Export Endpoints

#### POST `/api/export/csv`
Export transactions to CSV format.

**Request Body:**
```json
{
  "columns": ["date", "description", "amount", "type", "category"],
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "category": "Food"
  }
}
```

## Project Structure

```
├── server/                     # Backend application
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── middleware/             # Express middleware
│   └── index.ts               # Server entry point
├── src/                       # Frontend application
│   ├── components/            # React components
│   │   ├── Auth/              # Authentication components
│   │   ├── Dashboard/         # Dashboard components
│   │   ├── Export/            # Export functionality
│   │   ├── Layout/            # Layout components
│   │   └── Transactions/      # Transaction components
│   ├── pages/                 # Page components
│   ├── services/              # API services
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript types
│   └── App.tsx               # Main app component
├── package.json
└── README.md
```

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend development server
- `npm run dev:backend` - Start only backend development server
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint

### Database Schema

#### User Model
```typescript
{
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Transaction Model
```typescript
{
  userId: ObjectId;
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
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- Secure HTTP headers with Helmet
- Protected API routes with middleware

## Deployment

### Production Build

1. **Build the frontend**:
```bash
npm run build
```

2. **Set production environment variables**:
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-url
JWT_SECRET=your-production-jwt-secret
```

3. **Start the production server**:
```bash
node server/index.js
```

### Environment Variables

Make sure to set these environment variables in production:

- `NODE_ENV=production`
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong secret key for JWT tokens
- `FRONTEND_URL` - Your frontend domain
- `PORT` - Server port (optional, defaults to 3001)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.