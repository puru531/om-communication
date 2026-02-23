# Om Communication - Invoice Generator

A professional, responsive, and database-backed invoice management system for Om Communication. Built with modern technologies including React, Node.js, Express, MongoDB, and Tailwind CSS.

## 🚀 Features

- **Secure Authentication**: JWT-based login system
- **Invoice Management**: Create, store, and manage invoices
- **PDF Generation**: Dynamic PDF generation with professional layout
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Calculations**: Automatic total calculations
- **Search & Filter**: Find invoices quickly
- **Professional Layout**: Clean, modern UI design

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Router DOM** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **PDFKit** for PDF generation
- **bcryptjs** for password hashing

## 📁 Project Structure

```
om-comm/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Server entry point
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
copy .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/omcommunication
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Create Initial User (Development Only)

With `NODE_ENV=development`, you can register a user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@omcommunication.com","password":"your_password"}'
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (dev only)

### Invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices` - Get all invoices (with search/filter)
- `GET /api/invoices/:id` - Get specific invoice
- `GET /api/invoices/:id/pdf` - Download invoice PDF

## 🧾 Invoice Schema

```javascript
{
  invoiceNumber: String,      // Unique invoice number
  date: Date,                 // Invoice date
  customerName: String,       // Customer name
  mobileNumber: String,       // Customer mobile
  address: String,            // Customer address
  items: [{
    itemName: String,         // Product name
    productSerialNo: String,  // Product/Serial number
    quantity: Number,         // Quantity
    pricePerUnit: Number,     // Price per unit
    total: Number             // Item total (auto-calculated)
  }],
  grandTotal: Number          // Invoice grand total
}
```

## 🎨 UI Components

### Login Page
- Clean, centered login form
- Email and password validation
- Error handling and loading states

### Dashboard
- Navigation bar with tabs
- Create Invoice and View Invoices sections
- Logout functionality

### Invoice Form
- Dynamic item table with add/remove functionality
- Real-time total calculations
- Form validation and error handling
- Success notifications

### Invoice List
- Searchable table of all invoices
- PDF download functionality
- Responsive design

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Disable registration endpoint
3. Use secure JWT secret
4. Configure MongoDB connection
5. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```
2. Deploy the `dist` folder to your hosting service

## 🔧 Environment Variables

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/omcommunication
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

## 📄 Sample Invoice PDF

The generated PDF includes:
- **Header**: Shop name, address, contact details
- **Invoice Details**: Invoice number, date, customer info
- **Items Table**: Sr. No, Item Name, Product/Serial No, Quantity, Price, Total
- **Footer**: Grand total, authorized signature placeholder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Om Communication Invoice Generator** - Professional invoice management made simple.