# 🌿 GreenLeaf Plant Nursery App

A full-stack React + Redux + Express community app for plant lovers — built as a plant-themed version of the PostIT app.

---

## 📁 Project Structure

```
plant-nursery/
├── client/                  ← React frontend (port 3000)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js            ← Router + layout
│   │   ├── App.css           ← Full green theme styles
│   │   ├── index.js          ← Entry + Redux Provider
│   │   ├── ExampleData.js    ← Seed data
│   │   ├── Components/
│   │   │   ├── Header.js     ← Sticky navbar
│   │   │   ├── Footer.js     ← Site footer
│   │   │   ├── Login.js      ← Login form
│   │   │   ├── Register.js   ← Register form (with validation)
│   │   │   ├── Home.js       ← Feed layout
│   │   │   ├── User.js       ← Sidebar (user info + categories)
│   │   │   ├── SharePlant.js ← Post composer
│   │   │   ├── Posts.js      ← Posts feed
│   │   │   └── Profile.js    ← User profile page
│   │   ├── Features/
│   │   │   ├── UserSlice.js  ← Auth Redux slice
│   │   │   └── PlantSlice.js ← Plant posts Redux slice
│   │   ├── Store/
│   │   │   └── store.js      ← Redux store config
│   │   └── Validations/
│   │       └── UserValidations.js ← Yup schema
│   └── package.json
│
└── server/                  ← Express backend (port 3001)
    ├── server.js             ← All API routes
    └── package.json
```

---

## 🚀 Getting Started

### 1. Start the Backend Server

```bash
cd server
npm install
npm start
```

Server runs at **http://localhost:3001**

### 2. Start the React Frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

App opens at **http://localhost:3000**

---

## 🔑 Accounts (ready to use)

| Name | Email | Password |
|------|-------|----------|
| nawaf | nawaf1@gmail.com | 12345 |
| 

---

## 🌱 Features

| Feature | Details |
|---------|---------|
| **Registration** | Name, email, password with Yup + react-hook-form validation |
| **Login / Logout** | Redux async thunk → Express session auth |
| **Protected Routes** | Home & Profile redirect to /login if not authenticated |
| **Plant Feed** | Browse and like community plant posts |
| **Share Post** | Compose posts with plant category tags |
| **User Sidebar** | Shows logged-in user info + category browser |
| **Profile Page** | Shows user stats and their posted updates |
| **Password Hashing** | bcryptjs on the server |
| **Session Auth** | express-session keeps login state |

---

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/registerUser` | Register a new user |
| `POST` | `/login` | Login and start session |
| `POST` | `/logout` | End session |
| `GET` | `/posts` | Fetch all plant posts |
| `POST` | `/posts` | Create a new post |
| `PATCH` | `/posts/:id/like` | Like a post |
| `GET` | `/users` | List all users (debug) |

---

## 🛠 Tech Stack

- **Frontend**: React 18, React Router v6, Redux Toolkit, react-hook-form, Yup, Reactstrap, Bootstrap
- **Backend**: Node.js, Express, bcryptjs, express-session, CORS
- **State**: Redux async thunks for all API calls
- **Styling**: Custom CSS with Playfair Display + Lato fonts, green/cream plant palette
