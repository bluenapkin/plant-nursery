# غرس | Ghars — Plant Nursery App

A full-stack MERN application for plant lovers in Oman. Browse rare fruit trees, share plant updates, and manage orders — all in one place.

---

## Project Structure
plant-nursery/
├── client/                       ← React frontend (port 3000)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                ← Router + layout
│   │   ├── App.css               ← Global styles
│   │   ├── index.js              ← Entry + Redux Provider + PersistGate
│   │   ├── config.js             ← Environment variables
│   │   ├── ExampleData.js        ← Seed data
│   │   ├── Components/
│   │   │   ├── Header.js         ← Navbar with logo
│   │   │   ├── Footer.js         ← Site footer
│   │   │   ├── Login.js          ← Login page
│   │   │   ├── Register.js       ← Register page with validation
│   │   │   ├── Home.js           ← Shop page with cart
│   │   │   ├── Posts.js          ← Community posts feed
│   │   │   ├── Profile.js        ← User profile page
│   │   │   ├── Orders.js         ← User orders history
│   │   │   ├── Checkout.js       ← Checkout + payment form
│   │   │   ├── ProductDetail.js  ← Plant detail page with care tips
│   │   │   ├── EditProfile.js    ← Edit name, password, photo
│   │   │   ├── AdminDashboard.js ← Admin orders + users management
│   │   │   ├── About.js          ← About page
│   │   │   └── ProtectedRoute.js ← Route guard
│   │   ├── Features/
│   │   │   ├── UserSlice.js      ← Auth Redux slice
│   │   │   └── PlantSlice.js     ← Posts Redux slice
│   │   ├── Store/
│   │   │   └── store.js          ← Redux store + redux-persist
│   │   ├── Tests/
│   │   │   ├── About.test.jsx    ← Vitest unit tests
│   │   │   └── setup.js          ← Testing setup
│   │   └── Validations/
│   │       └── UserValidations.js ← Yup schema
│   ├── .env                      ← Client environment variables
│   ├── vitest.config.js          ← Vitest configuration
│   └── package.json
│
└── server/                       ← Express backend (port 3001)
├── Models/
│   ├── UserModel.js          ← User schema (name, email, password, role, profilePic)
│   ├── OrderModel.js         ← Order schema (items, total, status, date)
│   └── PostModel.js          ← Post schema (message, category, likes)
├── uploads/                  ← Profile picture uploads
├── config.js                 ← Environment variables
├── index.js                  ← All API routes
├── .env                      ← Server environment variables
└── package.json

---

## Getting Started

### 1. Start the Backend Server

```bash
cd server
npm install
node index.js
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

## Accounts (ready to use)

| Name | Email | Password | Role |
|------|-------|----------|------|
| Nawaf | nawaf1@gmail.com | 12345 | Admin |

---

## Features

| Feature | Details |
|---------|---------|
| **Authentication** | Register, login, logout with bcrypt password hashing |
| **Protected Routes** | Redirects to /login if not authenticated |
| **Persist Login** | Redux-persist keeps user logged in after refresh |
| **Plant Shop** | Browse 12 plants with search and category filter |
| **Product Detail** | Full plant page with care guide (water, sun, temp, difficulty) |
| **Cart** | Add, remove, update quantity — saved in localStorage |
| **Checkout** | Separate checkout page with order summary + payment form |
| **Orders** | View order history with status (Pending / Delivered) |
| **Community Posts** | Create, like, and delete plant posts |
| **Profile** | View stats, recent posts, orders count |
| **Edit Profile** | Update name, password, and profile picture (Multer upload) |
| **Admin Dashboard** | View all users and orders, update order status |
| **Environment Variables** | dotenv on server, REACT_APP_ on client |
| **Unit Testing** | Vitest + React Testing Library for component testing |
| **OMR Currency** | All prices in Omani Riyals (3 decimal places) |

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/registerUser` | Register a new user |
| `POST` | `/login` | Login user |
| `POST` | `/logout` | Logout user |
| `PUT` | `/updateUserProfile/:email` | Update name, password, profile picture |
| `GET` | `/posts` | Get all posts |
| `POST` | `/posts` | Create a new post |
| `PUT` | `/posts/:id/like` | Toggle like on a post |
| `DELETE` | `/posts/:id` | Delete a post (author only) |
| `POST` | `/orders` | Save a new order |
| `GET` | `/orders/:email` | Get orders by user |
| `GET` | `/admin/users` | Get all users (admin) |
| `GET` | `/admin/orders` | Get all orders (admin) |
| `PUT` | `/admin/orders/:id/status` | Update order status (admin) |

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, React Router v6, Redux Toolkit, redux-persist |
| **Forms** | react-hook-form, Yup validation |
| **Backend** | Node.js, Express, Mongoose, bcrypt, Multer |
| **Database** | MongoDB Atlas (3 collections: users, orders, posts) |
| **Testing** | Vitest, React Testing Library, jsdom |
| **Styling** | Custom CSS, Playfair Display + Lato fonts |
| **Environment** | dotenv (server), REACT_APP_ variables (client) |

---

## Database Collections

| Collection | Fields |
|------------|--------|
| **userInfos** | name, email, password, role, profilePic |
| **orders** | userEmail, items, total, status, date |
| **posts** | author, email, message, category, likes, date |

---

## Developers

| Name | Role |
|------|------|
| Nawaf Abdullah | Full Stack Developer |
| Abdullah | Full Stack Developer |
| Nasser | Full Stack Developer |