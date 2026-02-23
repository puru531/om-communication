# Quick Setup Guide

## 1. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env file with your MongoDB URI and JWT secret
# Then start the server
npm run dev
```

## 2. Client Setup

```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 3. Create Initial User (Development)

```bash
# Register a user (only works in development mode)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@omcommunication.com","password":"admin123"}'
```

## 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Login Credentials

- Email: admin@omcommunication.com
- Password: admin123

## Next Steps

1. Login to the application
2. Create your first invoice
3. Download the generated PDF
4. Explore the invoice management features

The application is now ready to use!