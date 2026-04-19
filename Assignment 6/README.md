# Assignment 6: E-Commerce Website with Database Connection

## Problem Statement

Design and develop an e-commerce website that allows users to browse products, add items to a shopping cart, and checkout with order persistence in a MongoDB database using a Node.js backend.

## Objective
To understand frontend-backend integration
To implement product display and cart functionality
To develop a full-stack application using Node.js and MongoDB
To handle data persistence for orders

## Technologies Used
HTML
CSS
JavaScript
Node.js
Express.js
MongoDB
Mongoose

## Description

This project demonstrates a full-stack e-commerce web application.

The frontend provides multiple pages such as product listing, product details, cart, login/register, checkout, and order success. Users can browse products, add them to the cart, and place orders.

The backend, built using Node.js and Express.js, handles API requests, processes orders, and connects to MongoDB for storing order data.

MongoDB with Mongoose is used to store order details such as items, quantity, total price, and customer information.

## Features
Product listing and details pages
Add to cart functionality
Checkout system with order submission
User authentication pages (login/register UI)
Backend API for order handling
MongoDB database integration
Organized frontend and backend structure
Responsive UI design

## Steps to Run the Project
1. Setup Backend
cd fashion-store/backend
npm install
2. Configure Environment

Create a .env file inside backend and add:

MONGODB_URI=mongodb://localhost:27017/fashionstore
PORT=3000
3. Run Backend Server
node server.js
OR
nodemon server.js
4. Run Frontend

Open:

fashion-store/frontend/index.html

OR use Live Server in VS Code

## Folder Structure
Assignment 6
│
├── Outputs
│   ├── output1.png
│   ├── output2.png
│   ├── output3.png
│   ├── output4.png
│   ├── output5.png
│   └── output6.png
│
├── fashion-store
│
│   ├── backend
│   │   ├── models
│   │   ├── routes
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── server.js
│
│   ├── frontend
│   │   ├── index.html
│   │   ├── products.html
│   │   ├── product-details.html
│   │   ├── cart.html
│   │   ├── checkout.html
│   │   ├── order-success.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── script.js
│   │   └── style.css
│
└── README.md

## Learning Outcomes
Understanding full-stack development workflow
Building REST APIs using Express.js
Connecting Node.js with MongoDB
Managing cart and order data
Structuring large web applications
Working with frontend multi-page navigation

## Conclusion

This assignment provided hands-on experience in building a full-stack e-commerce application. It demonstrated how frontend and backend systems interact, how APIs are used, and how data is stored in MongoDB. The project helped in understanding real-world application flow from product selection to order storage.