# 📚 Book Heaven – Fullstack E-commerce Bookstore Website

**Book Heaven** is a fully-featured e-commerce platform for browsing, purchasing, and managing books online. Built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** with **TypeScript on the frontend**, this platform simulates a real-world bookstore with features like product browsing, cart/wishlist handling, secure authentication, and admin control.

---

## 🚀 Features

- 🔍 **Browse & Search Books:** Filter and search books by category, author, or keyword.
- 🛒 **Shopping Cart & Wishlist:** Add, remove, or update items in the cart and wishlist.
- 👤 **User Authentication:** Secure registration, login, logout, JWT-based session management, and email verification.
- ⚙️ **Profile Management:** Update user info, view order history, manage saved addresses, and handle personal data.
- 📮 **Saved Addresses:** Add, edit, and manage multiple shipping addresses.
- 📧 **Email Notifications:** Password reset, email verification.
- 📬 **Newsletter Subscription:** Subscribe to receive updates and promotions.
- 🎨 **Admin Panel:** Role-based access to add/edit/delete books and manage users.
- 💬 **Feedback System:** Logged-in users can send feedback and receive responses.

---

## 🛠️ Tech Stack

| Layer        | Technology                                       |
|--------------|--------------------------------------------------|
| Frontend     | React.js, TypeScript, Vite, React Router         |
| Backend      | Node.js, Express.js                              |
| Database     | MongoDB, Mongoose                                |
| Auth         | JWT (JSON Web Token), bcrypt                     |
| Styling      | Tailwind CSS, shadcn/ui                          |
| Email        | Nodemailer                                       |
| APIs         | RESTful APIs                                     |
| Tools        | Axios, dotenv                                    |

---

## 📁 Folder Structure

```
book-heaven/
├── client/               # React + TypeScript frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components (shadcn/ui)
│   │   ├── pages/        # Route-based page components
│   │   ├── contexts/     # React Context (Cart, Wishlist)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and types
│   └── ...
├── controllers/          # Express route controllers
├── models/               # Mongoose schemas
├── routes/               # Express API routes
├── middlewares/          # Auth and error handling
├── utils/                # Backend utilities
├── index.js              # Express server entry point
├── docker-compose.yml    # Docker setup
├── Dockerfile
└── README.md
```

---

## ⚙️ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Salusha/Book-Heaven.git
cd Book-Heaven

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..

# 5. Run the app (backend + frontend)
npm run dev
```

---

## 🧪 Testing

Manual testing was performed across key features:
- Add/Remove from Cart & Wishlist
- Book search, category filtering, and author browsing
- User registration/login/logout with email verification
- Password reset and email functionality
- Order placement and checkout process
- Saved addresses management
- Admin-only book CRUD operations
- Newsletter subscription handling
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
- Responsive UI with hover-based navigation and smooth transitions.

---

<!-- ## 📄 License

Licensed under the [MIT License](LICENSE)

--- -->

## 🙋‍♀️ Author

**Salusha**  
GitHub: [github.com/salusha](https://github.com/salusha) 

