import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import ProductCatalog from "./pages/ProductCatalog";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const ProtectedRoute = ({ element }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return user ? element : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Header />
            <Navbar />
            <div style={{ minHeight: "80vh", padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<ProductCatalog />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
                    <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
                    <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
};

export default App;
