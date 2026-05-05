# غرس | Ghars — Plant Nursery App

A full-stack MERN application for plant lovers in Oman. Browse rare fruit trees, share plant updates, and manage orders — all in one place.

---

## Project Structure

```plaintext
plant-nursery/
├── client/                       
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                
│   │   ├── App.css               
│   │   ├── index.js              
│   │   ├── config.js             
│   │   ├── Components/
│   │   │   ├── Header.js         
│   │   │   ├── Footer.js         
│   │   │   ├── Login.js          
│   │   │   ├── Register.js       
│   │   │   ├── Home.js           
│   │   │   ├── Posts.js          
│   │   │   ├── Profile.js        
│   │   │   ├── Orders.js         
│   │   │   ├── Checkout.js       
│   │   │   ├── ProductDetail.js  
│   │   │   ├── EditProfile.js    
│   │   │   ├── AdminDashboard.js 
│   │   │   ├── About.js          
│   │   │   └── ProtectedRoute.js 
│   │   ├── Features/
│   │   │   ├── UserSlice.js      
│   │   │   └── PlantSlice.js     
│   │   ├── Store/
│   │   │   └── store.js          
│   │   ├── Tests/
│   │   │   ├── About.test.jsx    
│   │   │   └── setup.js          
│   │   └── Validations/
│   │       └── UserValidations.js
│   ├── .env                      
│   ├── vitest.config.js          
│   └── package.json
│
└── server/                       
    ├── Models/
    │   ├── UserModel.js          
    │   ├── OrderModel.js         
    │   └── PostModel.js          
    ├── uploads/                  
    ├── config.js                 
    ├── index.js                  
    ├── .env                      
    └── package.json
```

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