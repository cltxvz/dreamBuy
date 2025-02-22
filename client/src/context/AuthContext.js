import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Prevents flashing login page

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const storedUser = JSON.parse(localStorage.getItem("user"));
            setUser(storedUser);
        }
        setLoading(false); // Finish loading once user data is retrieved
    }, []);

    // **Login function**
    const login = async (email, password) => {
        try {
    
            const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });
    
            const userData = {
                userId: res.data.userId,
                name: res.data.name,
                email: res.data.email,
                token: res.data.token
            };
    
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("Login Error:", error.response?.data?.message);
            throw error.response?.data?.message || "Login failed";
        }
    };
    
    

    // **Signup function**
    const signup = async (name, email, password) => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/signup", { name, email, password });
            const userData = { userId: res.data.userId, name: res.data.name, email: res.data.email };

            // Store token
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(userData));

            // Update Axios default headers
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
            setUser(userData);
        } catch (error) {
            throw error.response?.data?.message || "Signup failed";
        }
    };

    // **Logout function**
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
    };

    // **Update user function after profile update (Ensures token update)**
    const updateUser = (updatedUser, newToken = null) => {
        const updatedUserData = { ...updatedUser };

        // If a new token is provided, update it in localStorage and Axios headers
        if (newToken) {
            localStorage.setItem("token", newToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        }

        localStorage.setItem("user", JSON.stringify(updatedUserData));
        setUser(updatedUserData);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
