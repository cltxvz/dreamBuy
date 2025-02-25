import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true); // Prevent flashing login page

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
        setLoading(false); // Finish loading after user data retrieval
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });

            const userData = {
                userId: res.data.userId,
                name: res.data.name,
                email: res.data.email,
                token: res.data.token
            };

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(userData));
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

            setUser(userData);
        } catch (error) {
            console.error("Login Error:", error.response?.data?.message);
            throw error.response?.data?.message || "Login failed";
        }
    };

    // Signup function
    const signup = async (name, email, password) => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/signup", { name, email, password });

            const userData = {
                userId: res.data.userId,
                name: res.data.name,
                email: res.data.email,
                token: res.data.token
            };

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(userData));
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

            setUser(userData);
        } catch (error) {
            console.error("Signup Error:", error.response?.data?.message);
            throw error.response?.data?.message || "Signup failed";
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
    };

    // Update user function after profile update
    const updateUser = (updatedUser, newToken = null) => {
        const updatedUserData = { ...user, ...updatedUser };

        if (newToken) {
            localStorage.setItem("token", newToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            updatedUserData.token = newToken;
        }

        localStorage.setItem("user", JSON.stringify(updatedUserData));
        setUser(updatedUserData);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
