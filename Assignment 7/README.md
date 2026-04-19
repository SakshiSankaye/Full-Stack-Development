# Assignment 7: E-Commerce Application with React.js, Express.js, and MongoDB

## Problem Statement

Design a web application for e-commerce with a modern React.js frontend, Express.js backend, and MongoDB database. The application should allow users to browse products, manage a shopping cart, perform user authentication, and place orders with persistent data storage.

## Objective
To build a modern full-stack web application using React.js and Express.js
To implement component-based architecture with React
To understand state management using Context API
To develop RESTful APIs using Express.js
To handle data persistence for users, products, and orders in MongoDB
To practice frontend-backend integration with proper error handling

## Technologies Used
- **Frontend**: React.js 18, React Router DOM v6, Axios, Bootstrap 5, Context API
- **Backend**: Express.js 5, Node.js, MongoDB with Mongoose ODM
- **Database**: MongoDB (local or Atlas cloud)
- **Styling**: Bootstrap 5, Custom CSS with animations
- **State Management**: React Context API (CartContext, AuthContext)

## Description

This project is a modern, full-stack e-commerce web application demonstrating best practices in contemporary web development.

**Frontend Architecture**: Built with React.js, the application uses component-based architecture with reusable components (Navbar, ProductCard, etc.). React Router DOM v6 enables client-side navigation without full page reloads, creating a smooth Single Page Application (SPA) experience. Context API manages global state for user authentication and shopping cart functionality.

**Backend Architecture**: Express.js server provides RESTful APIs for all application features. The backend handles user authentication, product management, and order processing with proper error handling and validation.

**Database Layer**: MongoDB with Mongoose ODM stores user accounts, product catalog, and order history. The database auto-seeds 8 sample products on first startup for immediate testing.

**Key Features**: 
- Browse products with search functionality
- User registration and login with authentication
- Shopping cart with add/remove/update quantity
- Checkout with shipping details
- Order confirmation and history
- Responsive design with Bootstrap 5
- Professional animations and UI/UX

## Features
- **React Component-Based UI**: Modular, reusable components (9 pages + Navbar)
- **User Authentication**: Registration, login, logout with session management
- **Product Management**: Browse, search, filter products by category
- **Shopping Cart**: Add/remove items, adjust quantities, persistent state
- **Checkout System**: Multi-step checkout with shipping details and order summary
- **Order Management**: Place orders, view order history, order confirmation
- **RESTful API**: Well-organized Express.js routes for all operations
- **MongoDB Integration**: Persistent storage with auto-seeding
- **Context API State Management**: Global state for authentication and cart
- **Responsive Design**: Mobile-friendly UI with Bootstrap 5
- **Error Handling**: Comprehensive error handling on both frontend and backend
- **Professional Styling**: Modern animations and UI effects

## Steps to Run the Project

### Prerequisites
- Node.js v14 or higher
- MongoDB (local installation or MongoDB Atlas cloud account)
- npm package manager

### 1. Setup MongoDB
**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update MONGODB_URI in backend

### 2. Setup Backend
```bash
cd d:\FSD\Assignment 7\fashion-store\backend
npm install
npm start
```
Expected output: `Server running on port 5000` and products auto-seeded

### 3. Setup Frontend
```bash
cd d:\FSD\Assignment 7\fashion-store\client
npm install
npm start
```
Expected output: Browser opens at `http://localhost:3000`

### 4. Test the Application
- Browse products on home page
- Register a new account
- Login with credentials
- Add products to cart
- Complete checkout
- View order confirmation

## Folder Structure
```
Assignment 7
│
├── README.md
│
├── Outputs/
│   ├── Documentation files
│   ├── Setup guides
│   └── Architecture documentation
│
└── fashion-store/
    │
    ├── backend/
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Product.js
    │   │   └── Order.js
    │   │
    │   ├── routes/
    │   │   ├── userRoutes.js
    │   │   ├── productRoutes.js
    │   │   └── orderRoutes.js
    │   │
    │   ├── package.json
    │   ├── package-lock.json
    │   └── server.js
    │
    ├── client/                     # React Frontend (NEW)
    │   ├── src/
    │   │   ├── components/
    │   │   │   └── Navbar.js
    │   │   │
    │   │   ├── pages/              # 8 page components
    │   │   │   ├── Home.js
    │   │   │   ├── Products.js
    │   │   │   ├── ProductDetails.js
    │   │   │   ├── Cart.js
    │   │   │   ├── Checkout.js
    │   │   │   ├── Login.js
    │   │   │   ├── Register.js
    │   │   │   └── OrderSuccess.js
    │   │   │
    │   │   ├── context/            # State Management
    │   │   │   ├── CartContext.js
    │   │   │   └── AuthContext.js
    │   │   │
    │   │   ├── services/
    │   │   │   └── api.js          # Centralized API calls
    │   │   │
    │   │   ├── App.js
    │   │   ├── App.css
    │   │   ├── index.js
    │   │   └── index.css
    │   │
    │   ├── public/
    │   │   └── index.html
    │   │
    │   ├── package.json
    │   └── package-lock.json
    │
    └── frontend/                   # Original frontend (reference)
        ├── index.html
        ├── products.html
        ├── product-details.html
        ├── cart.html
        ├── checkout.html
        ├── order-success.html
        ├── login.html
        ├── register.html
        ├── script.js
        └── style.css
```

## Learning Outcomes
- Understanding modern React.js component architecture and hooks
- Implementing state management with Context API
- Building Single Page Applications (SPA) with React Router
- Developing RESTful APIs using Express.js
- Connecting frontend with backend via HTTP requests (Axios)
- MongoDB schema design and integration with Mongoose
- User authentication and session management
- Error handling and validation on both frontend and backend
- Responsive web design with Bootstrap
- Full-stack development workflow from planning to deployment
- Professional code organization and best practices

## Conclusion

This assignment demonstrates a comprehensive modern full-stack e-commerce application using industry-standard technologies. By transitioning from traditional HTML/CSS/JavaScript to React.js and Express.js, the project showcases:

- **Component-Based Architecture**: React's modular approach enables code reuse and easier maintenance
- **State Management**: Context API provides elegant global state handling without Redux complexity
- **Separation of Concerns**: Frontend, backend, and database layers are properly decoupled
- **Best Practices**: Proper error handling, validation, and professional code organization
- **Real-World Patterns**: Authentication, cart management, and order processing reflect production applications
