# Smart Bazaar - MERN E-Commerce Web Application

Smart Bazaar is a modern MERN stack e-commerce web application designed with a premium shopping experience. The system includes user authentication, product browsing, cart management, wishlist handling, order flow, admin product management, and a responsive premium UI.

This project was customized and upgraded with a modern brand identity, improved product listing layout, premium product cards, enhanced navigation bar, redesigned login/signup pages, and a polished footer.

---

## 🚀 Project Overview

Smart Bazaar allows users to browse products, create an account, login, add products to cart, manage wishlist items, and place orders. Admin users can manage product-related operations through the admin dashboard.

The project is built using the MERN stack:

* **MongoDB** - Database
* **Express.js** - Backend API
* **React.js** - Frontend UI
* **Node.js** - Server runtime

---

## ✨ Key Features

### User Features

* User registration and login
* OTP/email verification support
* Browse products
* Product sorting
* Product details page
* Add to cart
* Wishlist management
* Order management
* User profile
* Responsive shopping experience

### Admin Features

* Admin dashboard
* Add new products
* Update product details
* View and manage orders
* Product, brand, and category handling

### UI/UX Improvements

* Premium Smart Bazaar branding
* Modern responsive navbar
* Premium product cards
* Improved product listing layout
* Redesigned login page
* Redesigned signup page
* Premium footer design
* Clean spacing, shadows, badges, and hover effects

---

## 🛠️ Technologies Used

### Frontend

* React.js
* React Router
* Redux Toolkit
* Material UI
* Framer Motion
* React Hook Form
* Lottie React
* React Toastify

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt.js
* Nodemailer
* Cookie Parser
* Dotenv

---

## 📁 Project Structure

```bash
smart-bazaar-mern-ecommerce/
│
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── app/
│   │   └── constants/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-bazaar-mern-ecommerce.git
cd smart-bazaar-mern-ecommerce
```

---

## 🔧 Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=mongodb://127.0.0.1:27017/mern-ecommerce
PORT=8000
JWT_SECRET=mysecret123
SECRET_KEY=mysecret123
LOGIN_TOKEN_EXPIRATION=7d
PASSWORD_RESET_TOKEN_EXPIRATION=10m
COOKIE_EXPIRATION_DAYS=7
OTP_EXPIRATION_TIME=600000
PRODUCTION=false
ORIGIN=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```bash
http://localhost:8000
```

---

## 🌱 Seed Database

To insert sample products, brands, categories, users, cart, wishlist, reviews, and orders, run:

```bash
node .\seed\seed.js
```

Expected output:

```bash
connected to DB
Seed [started] please wait..
Brand seeded successfully
Category seeded successfully
Product seeded successfully
User seeded successfully
Address seeded successfully
Wishlist seeded successfully
Cart seeded successfully
Review seeded successfully
Order seeded successfully
Seed completed..
```

---

## 🎨 Update Product Images

If product images do not load properly, run the image update script:

```bash
node updateProductImages.js
```

This updates product thumbnails with working placeholder images.

---

## 💻 Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm start
```

The frontend will run on:

```bash
http://localhost:3000
```

---

## 🔐 Authentication Flow

1. User registers with username, email, and password.
2. System creates a user account.
3. OTP verification is supported.
4. User logs in after verification.
5. Authenticated users can access cart, wishlist, profile, and orders.

---

## 📸 Screenshots

Add your project screenshots here after uploading them to GitHub.

### Home Page

```md
![Home Page](./screenshots/home.png)
```

### Login Page

```md
![Login Page](./screenshots/login.png)
```

### Signup Page

```md
![Signup Page](./screenshots/signup.png)
```

### Product Listing

```md
![Product Listing](./screenshots/products.png)
```

---

## 📌 Main Pages

* `/` - Home / Product Listing
* `/login` - User Login
* `/signup` - User Registration
* `/wishlist` - Wishlist
* `/cart` - Cart
* `/orders` - User Orders
* `/profile` - User Profile
* `/admin/orders` - Admin Orders
* `/admin/add-product` - Add Product

---

## 🧪 API Testing

You can test backend APIs using Postman.

Example API:

```bash
GET http://localhost:8000/products
```

Auth APIs:

```bash
POST http://localhost:8000/auth/signup
POST http://localhost:8000/auth/login
GET  http://localhost:8000/auth/check-auth
```

---

## 🔒 Important Notes

Do not upload `.env` files or `node_modules` to GitHub.

Recommended `.gitignore`:

```gitignore
node_modules/
frontend/node_modules/
backend/node_modules/

.env
frontend/.env
backend/.env

build/
frontend/build/
dist/

npm-debug.log*
.DS_Store
```

---

## 👨‍💻 Author

**Muhammad Insath**

* GitHub: https://github.com/insath67
* LinkedIn: [www.linkedin.com/in/muhammad-insath-20b070282](http://www.linkedin.com/in/muhammad-insath-20b070282)

---

## 📄 License

This project is developed for learning, portfolio, and academic purposes.

---

## ⭐ Project Status

Smart Bazaar is currently running successfully in local development with:

* Backend server
* MongoDB database
* Seeded product data
* Premium frontend UI
* Authentication system
* Cart and wishlist features

Future improvements can include online payment integration, advanced search, real email SMTP configuration, order tracking, and deployment.
