# **🛍️ DreamBuy**  
*"A real e-commerce simulator where you can shop like a billionaire!"*  

---

## **🚀 Description:**  

**DreamBuy** is a **full-stack e-commerce simulator** that replicates the experience of a real online store, allowing users to browse products, add items to their cart, complete secure transactions, and track their orders in real-time. Designed for a seamless and interactive shopping experience, DreamBuy lets you:  

✅ **Shop for products and add them to your cart**  
✅ **Simulate secure checkouts and transactions**  
✅ **Track your orders with real-time status updates**  
✅ **Manage addresses and payment methods**  
✅ **Reorder past purchases in one click**  

Whether you're buying the latest gadgets, luxury items, or filling your cart like a true billionaire, DreamBuy gives you the thrill of shopping without spending a dime.  

---

## **🛠️ Technologies Used:**  

### **Frontend (React & UI/UX)**  
- **React.js** – Modern, component-based UI development.  
- **React Router** – Navigation for seamless page transitions.  
- **Axios** – Fetching and sending data to the backend.  
- **React Hooks (useState, useEffect, useContext)** – Efficient state management.  
- **Custom Styled Modals & Toasts** – Enhanced user experience.  

### **Backend (Node.js & Express.js)**  
- **Node.js** – Scalable server-side runtime.  
- **Express.js** – REST API for handling product, order, and user data.  
- **MongoDB Atlas** – Cloud-hosted NoSQL database.  
- **Mongoose** – ODM for structuring MongoDB documents.  
- **Socket.io** – Real-time WebSocket updates for order tracking.  

### **Authentication & Security**  
- **JWT (JSON Web Tokens)** – Secure authentication for users.  
- **Nodemailer** – Email-based password recovery.  

### **Deployment & Hosting**  
- **Heroku** – Hosting for both frontend & backend.  
- **MongoDB Atlas** – Database in the cloud.  
- **Git & GitHub** – Version control and collaboration.  

---

## **📚 Skills & Concepts Applied:**  

### **Full-Stack Development**  
- **Frontend & Backend Integration** – Connecting a React-based frontend with an Express/MongoDB backend.  
- **RESTful API Design** – Secure and scalable API endpoints.  
- **WebSockets (Socket.io)** – Live updates for order status tracking.  

### **Software Engineering Best Practices**  
- **Modular & Scalable Codebase** – Organized folder structure for maintainability.  
- **Middleware & Route Protection** – Securing API routes.  
- **Environment Variables (.env)** – Protecting API keys and credentials.  

### **Data Handling & State Management**  
- **MongoDB for Storing Products & Orders** – Efficient NoSQL database design.  
- **React State Management (useState, useEffect)** – Dynamic UI updates.  
- **Filtering & Sorting Algorithms** – Optimized product listings and order history retrieval.  

### **Authentication & Authorization**  
- **JWT Authentication** – Secure login & session management.  
- **User Access Control** – Protecting private routes with authentication.  

### **UI/UX Enhancements**  
- **Custom Confirmation Modals** – Replacing default `window.confirm`.  
- **Toast Notifications** – Instant feedback for actions like order cancellation.  
- **Responsive Design** – Mobile-friendly layout for all devices.  

---

## **📖 Features & How to Use DreamBuy:**  

### **User Authentication:**  
- **Signup/Login** – Create an account for a personalized shopping experience.  
- **Forgot Password & Reset Password** – Recover accounts via email.  

### **Shopping Experience:**  
- **Product Catalog** – Browse available items like a true billionaire.  
- **Add to Cart & Update Cart** – Modify quantities or remove items easily.  
- **Order Summary & Secure Checkout** – Simulated transactions for a complete shopping experience.  

### **Order Tracking & Management:**  
- **View Active Orders** – Keep track of your purchases.  
- **Order Progress Indicator** – Displays each stage of your order.  
- **Cancel Order & Refund System** – Cancel before "Out for Delivery" status.  
- **Order History & Reorder** – Quickly repurchase previous items.  

### **Payment & Address Management:**  
- **Add/Remove Payment Methods** – Store multiple cards (with imaginary funds!).  
- **Manage Shipping Addresses** – Update or delete saved locations.  

---

## **📈 Future Enhancements:**  

**Wishlist Feature** – Save items for later purchases.  
**Live Chat Support** – Simulated customer service via chat.  
**Discount Codes & Coupons** – Apply promotional offers.  
**Order Notifications** – Email or SMS updates for order status changes.  

---

## **📜 How to Run the Project Locally:**  

### **1️⃣ Clone the Repository:**  
```bash
git clone https://github.com/cltxvz/dreamBuy.git
```

### **2️⃣ Install Backend Dependencies:**  
```bash
cd dreamBuy/server
npm install
```

### **3️⃣ Set Up Environment Variables:**  
Create a `.env` file inside the `server` folder and add:  
```env
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
FRONTEND_URL=http://localhost:3000
```

### **4️⃣ Start the Backend Server:**  
```bash
npm start
```
or  
```bash
node server.js
```

---

### **5️⃣ Install & Run the Frontend:**  
```bash
cd ../client
npm install
npm start
```

Then, visit:  
**http://localhost:3000**  

---

## **🌎 Live Demo (Hosted on Heroku)**  

**DreamBuy App:** [https://dreambuy-frontend-a8d2abd7dad6.herokuapp.com](https://dreambuy-frontend-a8d2abd7dad6.herokuapp.com)   

---

## **👤 Author:**  
**Carlos A. Cárdenas**  

🚀 **Enjoyed DreamBuy?** Feel free to **⭐️ star the repo**, provide feedback, or contribute!  

---

### **✅ Final Notes:**  
DreamBuy was built as a real-world e-commerce simulator, allowing users to experience the thrill of online shopping without spending a cent. This project showcases essential software engineering skills like full-stack development, authentication, responsive UI design, and real-time order tracking.  

If you’d like to expand or customize it, go ahead!  

**Thanks for checking out DreamBuy! 🛒🚀**