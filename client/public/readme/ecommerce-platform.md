# E-Commerce Platform

A full-stack e-commerce solution with Stripe payments.

## Features

- User authentication with JWT tokens
- Shopping cart with persistent storage
- Stripe payment integration
- Order management system
- Admin dashboard for managing products
- Real-time inventory tracking

## Tech Stack

- **Frontend**: React, Redux Toolkit
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe API
- **Authentication**: JWT

## Getting Started

```bash
# Clone the repository
git clone https://github.com/example/ecommerce-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run the development server
npm run dev
```

## Project Structure

```
src/
├── client/          # React frontend
├── server/         # Express backend
└── shared/         # Shared types and utilities
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/products` - List all products
- `POST /api/orders` - Create new order
- `POST /api/payments/create-intent` - Create Stripe payment intent

## License

MIT