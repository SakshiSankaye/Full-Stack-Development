# Assignment 7: Student Feedback System with React.js, Express.js, and MongoDB

## Problem Statement

Design a web application for a student feedback review system using React.js for the frontend, Express.js for the backend, and MongoDB for data storage. The system should support role-based access where administrators can create feedback forms and students can submit feedback.

---

## Objective

* To develop a full-stack web application using React.js and Express.js
* To implement role-based authentication (Admin and Student)
* To design dynamic feedback forms with multiple question types
* To store and manage feedback data using MongoDB
* To integrate frontend and backend using REST APIs
* To build a professional UI with reusable components

---

## Technologies Used

* **Frontend**: React.js (Vite), React Router, Axios, Context API
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JWT (JSON Web Token)
* **Styling**: Custom CSS (Design System)
* **Charts**: Chart.js (for analytics dashboard)

---

## Description

The Student Feedback System is a full-stack web application that enables institutions to collect and analyze feedback efficiently.

The system includes two main roles:

* **Admin**: Can create feedback forms, view responses, analyze data, and manage students
* **Student**: Can fill feedback forms and view their submission history

The application follows a modular architecture with separate frontend and backend layers, ensuring scalability and maintainability.

---

## Key Features

### Authentication & Authorization

* User registration and login using JWT
* Role-based access control (Admin / Student)
* Protected routes and secure APIs

### Admin Features

* Create and manage feedback forms
* Dynamic question builder (text, rating, yes/no, etc.)
* View all student responses
* Filter and search responses
* Export feedback data
* Analytics dashboard with charts

### Student Features

* View available feedback forms
* Submit feedback with ratings and comments
* View submission history

### System Features

* RESTful API architecture
* Global error handling
* Secure password hashing (bcrypt)
* Responsive UI design
* Clean and scalable folder structure

---

## Project Structure

```
sfs-pro/
│
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── formController.js
│   │   └── responseController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── FeedbackForm.js
│   │   └── FeedbackResponse.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── forms.js
│   │   └── responses.js
│   ├── utils/
│   │   └── seed.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
└── client/                    # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   ├── student/
    │   │   └── shared/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── StudentDashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Steps to Run the Project

### Prerequisites

* Node.js (v14 or higher)
* MongoDB (local or MongoDB Atlas)
* npm or yarn

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sfs-pro
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm start
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

App will run at:

```
http://localhost:5173
```

---

### 4. Seed Data (Optional)

```bash
node utils/seed.js
```

Creates:

* Admin user
* Sample students
* Sample feedback forms

---

## Learning Outcomes

* Understanding MERN stack architecture
* Implementing JWT authentication and role-based access
* Designing scalable backend APIs
* Creating dynamic forms in React
* Managing global state using Context API
* Working with MongoDB and Mongoose
* Building real-world full-stack applications

---

## Conclusion

This project demonstrates a complete Student Feedback System built using modern web technologies. It highlights:

* Clean architecture and modular design
* Role-based authentication and security
* Real-world application features (forms, analytics, history)
* Effective frontend-backend integration

The system is scalable, user-friendly, and suitable for real academic or institutional use.
