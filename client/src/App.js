import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AuthContext from "./context/AuthContext";

const ProtectedRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    return user ? element : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<h1>Welcome to DreamBuy!</h1>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            </Routes>
        </Router>
    );
};

export default App;
