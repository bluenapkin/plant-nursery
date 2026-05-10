<div align="center">

<img src="client/src/img/logo.png" width="120" />

# غرس | Ghars

### Premium Plant Nursery — Oman 🌿

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

</div>

---

## 📖 About

**Ghars (غرس)** is a full-stack MERN plant nursery app built for Oman.
Browse rare fruit trees, share plant updates with the community, and manage your orders — all in one place.

---

## 🚀 Getting Started

**1. Start the Backend**
```bash
cd server
npm install
node index.js
```
> Server runs at `http://localhost:3001`

**2. Start the Frontend**
```bash
cd client
npm install
npm start
```
> App opens at `http://localhost:3000`

---

## 🔑 Test Account

| Name | Email | Password | Role |
|------|-------|----------|------|
| Nawaf | nawaf1@gmail.com | 12345 | 👑 Admin |
| Abdullah | Abdu@gmail.com | 12345 | 👑 Admin |

---

## ✨ Features

| | Feature | Description |
|-|---------|-------------|
| 🔐 | **Authentication** | Register & login with bcrypt hashing |
| 🛡️ | **Protected Routes** | Redirects to login if not authenticated |
| 💾 | **Persist Login** | Stays logged in after page refresh |
| 🌿 | **Plant Shop** | 12 plants with search & category filter |
| 🪴 | **Product Detail** | Care guide with water, sun & difficulty |
| 🛒 | **Cart** | Add, remove, update quantity |
| 💳 | **Checkout** | Delivery details, map pin location, and payment method |
| 📦 | **Orders** | History with Pending / Delivered status and delivery info |
| 💬 | **Community Posts** | Create, like & delete plant posts |
| 👤 | **Profile** | Stats, posts, orders in one page |
| ✏️ | **Edit Profile** | Update name, password & photo |
| 🛠️ | **Admin Dashboard** | Manage all users & orders with delivery details and order status |
| 🧪 | **Unit Testing** | Vitest + React Testing Library |
| 🇴🇲 | **OMR Currency** | All prices in Omani Riyals |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/registerUser` | Register new user |
| `POST` | `/login` | Login user |
| `POST` | `/logout` | Logout user |
| `PUT` | `/updateUserProfile/:email` | Update profile |
| `GET` | `/posts` | Get all posts |
| `POST` | `/posts` | Create post |
| `PUT` | `/posts/:id/like` | Toggle like |
| `DELETE` | `/posts/:id` | Delete post |
| `POST` | `/orders` | Save order with delivery and location info |
| `GET` | `/orders/:email` | Get user orders |
| `GET` | `/admin/users` | All users (admin) |
| `GET` | `/admin/orders` | All orders with delivery details (admin) |
| `PUT` | `/admin/orders/:id/status` | Update order status |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 18, React Router v6, Redux Toolkit, redux-persist |
| **Forms** | react-hook-form + Yup |
| **Backend** | Node.js, Express, Multer |
| **Database** | MongoDB Atlas — 3 collections |
| **Testing** | Vitest, React Testing Library, jsdom |
| **Styling** | Custom CSS, Playfair Display + Lato |

---

## 🗄️ Database Collections

| Collection | Fields |
|------------|--------|
| `userInfos` | name, email, password, role, profilePic |
| `orders` | userEmail, items, delivery, total, status, date |
| `posts` | author, email, message, category, likes, date |

---

## 📁 Project Structure

```plaintext
plant-nursery/
├── client/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── About.jsx           ← App information page
│   │   │   ├── AdminDashboard.js   ← Admin panel for users/orders
│   │   │   ├── Checkout.js         ← Checkout + delivery form + map
│   │   │   ├── EditProfile.js      ← Profile editing
│   │   │   ├── Footer.js           ← Footer layout
│   │   │   ├── Header.js           ← Navigation header
│   │   │   ├── Home.js             ← Shop + cart
│   │   │   ├── Location.js         ← Optional location helper page
│   │   │   ├── Login.js            ← Login page
│   │   │   ├── Orders.js           ← User order history
│   │   │   ├── Posts.js            ← Community feed
│   │   │   ├── ProductDetail.js    ← Plant detail + care tips
│   │   │   ├── Products.js         ← Plant listing page
│   │   │   ├── Profile.js          ← User profile page
│   │   │   ├── ProtectedRoute.js   ← Route guard for auth
│   │   │   ├── Register.js         ← Registration page
│   │   │   ├── SharePlant.js       ← Share plant updates
│   │   │   └── User.js             ← User card/profile helper
│   │   ├── Features/
│   │   │   ├── PlantSlice.js       ← Redux slice for plants
│   │   │   └── UserSlice.js        ← Redux slice for user state
│   │   ├── Store/
│   │   │   └── store.js            ← Redux store setup
│   │   ├── Tests/
│   │   │   └── About.test.jsx      ← Example unit test
│   │   ├── Validations/
│   │   │   └── UserValidations.js  ← Form validation rules
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── config.js
│   │   ├── ExampleData.js
│   │   ├── index.css
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
└── server/
    ├── Models/
    │   ├── UserModel.js
    │   ├── OrderModel.js
    │   └── PostModel.js
    ├── config.js
    ├── Dockerfile
    ├── index.js
    ├── package.json
    └── uploads/
```

---

## 👨‍💻 Developers

<div align="center">

| Name | Role |
|------|------|
| **Nawaf** | Full Stack Developer |
| **Abdullah** | Full Stack Developer |
| **Nasser** | Full Stack Developer |

*Built with ❤️ for Oman 🇴🇲*

</div>
