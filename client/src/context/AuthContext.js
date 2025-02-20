import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const storedUser = JSON.parse(localStorage.getItem("user"));
            setUser(storedUser);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify({ userId: res.data.userId, name: res.data.name }));
            setUser({ userId: res.data.userId, name: res.data.name });
        } catch (error) {
            throw error.response.data.message;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/signup", { name, email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify({ userId: res.data.userId, name: res.data.name }));
            setUser({ userId: res.data.userId, name: res.data.name });
        } catch (error) {
            throw error.response.data.message;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
