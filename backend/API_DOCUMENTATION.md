# E-Commerce Backend API

A professional-grade backend API for an e-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Features

✅ **User Management**
- User registration with email validation
- Secure login with JWT authentication
- Password hashing with bcryptjs
- User profile management
- Admin role management

✅ **Product Management**
- Complete CRUD operations for products
- Product filtering and search
- Discount management
- Featured products functionality
- Pagination support
- Stock management
- Product categories

✅ **Shopping Cart**
- Add/remove items from cart
- Update quantities
- Cart persistence
- Cart retrieval

✅ **Save for Later**
- Save items for future purchase
- Retrieve saved items

✅ **Professional Architecture**
- Centralized error handling
- Input validation
- Proper HTTP status codes
- Consistent response format
- Security middleware
- CORS configuration
- Request logging

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB (local or cloud)

## 🔧 Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

4. **Seed the database**
```bash
npm run seed
```

## 🚀 Running the Server

**Development mode (with auto-reload)**
```bash
npm run dev
```

**Production mode**
```bash
npm start
```

**Run frontend and backend together**
```bash
npm run start-all
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
Response includes JWT token

#### Check Authentication
```http
GET /auth/checkAuth
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /product?search=laptop&category=tech&page=1&limit=10
```

Query Parameters:
- `search` - Search by name or description
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)
- `sort` - Sort order (default: -createdAt)

#### Get Featured Products
```http
GET /product/featured
```

#### Get Product by ID
```http
GET /product/:id
```

#### Create Product (Admin only)
```http
POST /product
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Laptop Pro",
  "price": 999.99,
  "discount": 10,
  "image": "https://example.com/image.jpg",
  "description": "High-performance laptop",
  "category": "tech",
  "stock": 50
}
```

#### Update Product (Admin only)
```http
PUT /product/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 899.99,
  "stock": 30
}
```

#### Delete Product (Admin only)
```http
DELETE /product/:id
Authorization: Bearer <admin_token>
```

#### Toggle Featured Status (Admin only)
```http
PATCH /product/:id/featured
Authorization: Bearer <admin_token>
```

### Cart Endpoints

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here"
}
```

#### Update Cart Item
```http
PUT /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 5
}
```

#### Remove from Cart
```http
DELETE /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here"
}
```

## 🏗️ Project Structure

```
backend/
├── models/              # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── SaveForLater.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── saveForLaterRoutes.js
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication & authorization
│   └── errorHandler.js # Error handling
├── utils/               # Utility functions
│   ├── errorHandler.js # Error handling utilities
│   ├── validators.js   # Input validation
│   └── constants.js    # App constants
├── server.js           # Express app setup
├── db.js               # Database connection
├── seed.js             # Database seeding
├── .env.example        # Environment variables template
└── package.json        # Dependencies
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token

1. Register or login to get a token
2. Include the token in the `Authorization` header for protected routes:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry

Tokens expire after **7 days** by default. Update `JWT_CONFIG.EXPIRY` in `utils/constants.js` to change.

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    "user": { ... }
  },
  "timestamp": "2024-04-27T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid input provided",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ],
  "timestamp": "2024-04-27T10:30:00.000Z"
}
```

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling
- ✅ Admin role verification
- ✅ Secure password selection (hidden from responses)

## 🎯 Validation Rules

### User Registration
- Name: Required, 2+ characters
- Email: Valid email format, unique
- Password: 6+ characters

### Product Creation
- Name: Required, 3-100 characters
- Price: Required, non-negative number
- Image: Required URL
- Category: Required, valid category
- Discount: 0-100%
- Stock: Non-negative number

## 📊 Database Models

### User
- name (String)
- email (String, unique)
- password (String, hashed)
- isAdmin (Boolean)
- isActive (Boolean)
- timestamps

### Product
- name (String)
- price (Number)
- discount (Number, 0-100)
- image (String)
- description (String)
- category (String)
- stock (Number)
- isFeatured (Boolean)
- rating (Number, 0-5)
- numReviews (Number)
- isActive (Boolean)
- timestamps

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### JWT Token Error
- Token might be expired
- Ensure token format is correct: `Bearer <token>`
- Check `JWT_SECRET` matches between client and server

### CORS Error
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check CORS middleware configuration in `server.js`

## 📈 Performance Optimization

- Database indexes on frequently queried fields
- Pagination support for large datasets
- Lean queries for read-only operations
- Request logging in development

## 🚀 Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Update `MONGODB_URI` to production database
- [ ] Generate strong `JWT_SECRET`
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Configure logging
- [ ] Setup monitoring/alerts

## 📝 License

ISC

## 👨‍💻 Author

Your Name

---

For more information, visit the project repository or contact the development team.
