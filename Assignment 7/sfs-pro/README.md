# 🎓 Student Feedback System PRO

A production-ready, full-stack MERN application for managing student feedback with role-based access, dynamic forms, analytics dashboards, and CSV export.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with token expiry
- Password hashing with bcryptjs (12 salt rounds)
- Role-based access control: **Admin** and **Student**
- Protected routes — admin middleware blocks unauthorized access
- Input validation on both frontend and backend

### 🧑‍💼 Admin Panel
- **Dashboard** — Overview stats, activity bar chart, responses per form
- **Form Builder** — Create/edit forms with dynamic questions (Rating, Text, Multiple Choice)
- **Responses Viewer** — View per-form responses with search, date filter, pagination
- **Analytics** — Bar charts, doughnut chart, trend line using Chart.js
- **Students** — View all registered students with status
- **CSV Export** — Download all responses for any form as a CSV file

### 🎓 Student Portal
- **Dashboard** — Summary of pending/completed forms
- **Available Forms** — Card view of all active forms, one-click submission
- **Submission Modal** — Dynamic form rendering (star ratings, text, multi-choice)
- **My History** — Expandable cards showing all past submissions with answers
- **Duplicate prevention** — One submission per student per form (enforced DB + UI)

### 📊 Analytics
- Total responses, forms, average rating KPIs
- Responses per form (Bar chart)
- Rating distribution (Doughnut chart)
- 30-day submission trend (Line chart)
- Average rating per form (Bar chart)

---

## 🛠 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, React Router v6, Chart.js     |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB, Mongoose                       |
| Auth      | JWT (jsonwebtoken), bcryptjs            |
| Validation| express-validator                       |
| Build     | Vite                                    |

---

## 📁 Project Structure

```
sfs-pro/
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, getMe
│   │   ├── formController.js  # CRUD for feedback forms
│   │   └── responseController.js # Submit, view, analytics, export
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + role restrict
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # name, email, password, role
│   │   ├── FeedbackForm.js    # title, questions[], createdBy
│   │   └── FeedbackResponse.js # formId, studentId, answers[]
│   ├── routes/
│   │   ├── auth.js
│   │   ├── forms.js
│   │   └── responses.js
│   ├── utils/
│   │   └── seed.js            # Seed admin + students + sample forms
│   ├── .env.example
│   ├── index.js               # App entry point
│   └── package.json
│
└── client/                    # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── AdminHome.jsx
    │   │   │   ├── AdminForms.jsx     # Form builder with dynamic questions
    │   │   │   ├── AdminResponses.jsx # Search, filter, export
    │   │   │   ├── AdminAnalytics.jsx # Chart.js charts
    │   │   │   └── AdminStudents.jsx
    │   │   ├── student/
    │   │   │   ├── StudentHome.jsx
    │   │   │   ├── StudentForms.jsx   # Fill form modal, star ratings
    │   │   │   └── StudentHistory.jsx # Expandable submission history
    │   │   └── shared/
    │   │       ├── Sidebar.jsx
    │   │       ├── Spinner.jsx
    │   │       └── Alert.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx        # JWT-aware global auth state
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── AdminDashboard.jsx     # Admin shell with nested routes
    │   │   └── StudentDashboard.jsx   # Student shell with nested routes
    │   ├── services/
    │   │   └── api.js                 # Axios instance + all API calls
    │   ├── App.jsx                    # Route guards, role-based routing
    │   ├── index.css                  # Full design system
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or higher
- **MongoDB** running locally OR a MongoDB Atlas connection string
- **npm** or **yarn**

---

### 1. Clone / Extract the Project

```bash
# If cloning from git:
git clone <repo-url>
cd sfs-pro

# Or extract the ZIP and navigate into the folder
cd sfs-pro
```

---

### 2. Set Up the Backend

```bash
cd server
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sfs-pro
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

### 3. Seed the Database (Recommended)

This creates an admin account, two student accounts, and two sample feedback forms:

```bash
cd server
node utils/seed.js
```

**Created accounts:**

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Admin   | admin@sfs.com          | admin123    |
| Student | alice@student.com      | student123  |
| Student | bob@student.com        | student123  |

---

### 4. Start the Backend

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

### 5. Set Up the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

### 6. Open in Browser

Navigate to `http://localhost:5173` and log in with the seeded credentials.

---

## 🔌 API Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint     | Access  | Description              |
|--------|-------------|---------|--------------------------|
| POST   | /register   | Public  | Register new student     |
| POST   | /login      | Public  | Login, returns JWT       |
| GET    | /me         | Any     | Get current user         |
| GET    | /users      | Admin   | List all users           |

### Form Routes (`/api/forms`)
| Method | Endpoint   | Access  | Description              |
|--------|-----------|---------|--------------------------|
| GET    | /         | Any     | Get all forms            |
| GET    | /:id      | Any     | Get form by ID           |
| POST   | /         | Admin   | Create new form          |
| PUT    | /:id      | Admin   | Update form              |
| DELETE | /:id      | Admin   | Delete form + responses  |

### Response Routes (`/api/responses`)
| Method | Endpoint              | Access  | Description               |
|--------|-----------------------|---------|---------------------------|
| POST   | /                     | Student | Submit response           |
| GET    | /my                   | Student | Get my submissions        |
| GET    | /submitted-forms      | Student | Get submitted form IDs    |
| GET    | /form/:formId         | Admin   | Get responses for a form  |
| GET    | /analytics            | Admin   | Get analytics data        |
| GET    | /export/:formId       | Admin   | Export responses as CSV   |

---

## 🔒 Environment Variables

| Variable       | Description                                 | Example                          |
|----------------|---------------------------------------------|----------------------------------|
| PORT           | Server port                                 | 5000                             |
| MONGO_URI      | MongoDB connection string                   | mongodb://localhost:27017/sfs-pro|
| JWT_SECRET     | Secret key for signing JWTs                 | your_secret_key                  |
| JWT_EXPIRES_IN | JWT expiry duration                         | 7d                               |
| NODE_ENV       | Environment (development/production)        | development                      |

---

## 📦 Building for Production

```bash
# Build frontend
cd client
npm run build
# Output is in client/dist/

# Serve with a static server or configure Express to serve dist/
```

---

## 📄 License

MIT — Free to use for academic and personal projects.
