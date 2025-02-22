import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProductCatalog from "./pages/ProductCatalog";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import AuthContext from "./context/AuthContext";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    return user ? element : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<ProductCatalog />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
            </Routes>
        </Router>
    );
};

export default App;
