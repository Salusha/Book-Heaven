# 📚 Book Heaven – Fullstack E-commerce Bookstore Website

**Book Heaven** is a fully-featured e-commerce platform for browsing, purchasing, and managing books online. Built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** with **TypeScript on the frontend**, this platform simulates a real-world bookstore with features like product browsing, cart/wishlist handling, secure authentication, and admin control.

---

## 🚀 Features

- 🔍 **Browse & Search Books:** Filter and search books by category, name, or keyword.
- 🛒 **Shopping Cart & Wishlist:** Add, remove, or update items in the cart and wishlist.
- 👤 **User Authentication:** Secure registration, login, logout, and JWT-based session management.
- ⚙️ **Profile Management:** Update user info, view order history, and manage personal data.
- 📦 **Admin Panel:** Role-based access to add/edit/delete books and manage users.
- 💬 **Feedback System:** Logged-in users can send feedback and receive responses.
- 💡 **Responsive UI/UX:** Mobile-first design with hover menus, transitions, and clean layout.

---

## 🛠️ Tech Stack

| Layer        | Technology                                       |
|--------------|--------------------------------------------------|
| Frontend     | React.js, TypeScript, React Router, HTML, CSS    |
| Backend      | Node.js, Express.js                              |
| Database     | MongoDB, Mongoose                                |
| Auth         | JWT (JSON Web Token), bcrypt                     |
| Styling      | CSS3, Flexbox, Grid, Animations                  |
| APIs         | RESTful APIs                                     |
| Tools        | Axios, dotenv, concurrently, nodemon             |

---

## 📁 Folder Structure

```
book-heaven/
├── client/               # React + TypeScript frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── server/               # Express + Node backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Salusha/Book-Heaven.git

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Create .env in /server with the following:
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

# 5. Run the app (from root directory)
npm run dev
```

---

## 🧪 Testing

Manual testing was performed across key features:
- Add/Remove from Cart & Wishlist
- Book search and category filtering
- User registration/login/logout flows
- Admin-only book CRUD operations
- Feedback form submission & display

---
<!-- 
## 🌐 Deployment

- 🚀 **Frontend:** [Vercel or Netlify link here]  
- 🚀 **Backend:** [Render, Railway, or your platform link here]

--- -->

---

## 📎 Notes

- JWT authentication and bcrypt password hashing used for secure user login.
- Proper error handling and response status codes implemented.
- Clean component-based architecture and reusable logic maintained throughout.
- Fully responsive UI with hover-based navigation and smooth transitions.

---

<!-- ## 📄 License

Licensed under the [MIT License](LICENSE)

--- -->

## 🙋‍♀️ Author

**Salusha**  
GitHub: [github.com/salusha](https://github.com/salusha) 

