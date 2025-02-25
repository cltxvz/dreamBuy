import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#222", 
            color: "white",
            fontSize: "16px",
            gap: "40px",
            borderBottom: "2px solid #444"
        }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
            {user && <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>Cart</Link>}
            {user && <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>Orders</Link>}
            {user && <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Account</Link>}
            
            {user ? (
                <button 
                    onClick={logout} 
                    style={{ 
                        backgroundColor: "#ff4d4d", 
                        color: "white", 
                        border: "none", 
                        padding: "5px 10px", 
                        borderRadius: "5px", 
                        cursor: "pointer"
                    }}>
                    Logout
                </button>
            ) : (
                <Link 
                    to="/login" 
                    style={{ 
                        backgroundColor: "#4CAF50", 
                        color: "white", 
                        padding: "5px 10px", 
                        borderRadius: "5px", 
                        textDecoration: "none",
                        cursor: "pointer"
                    }}>
                    Login
                </Link>
            )}
        </nav>
    );
};

export default Navbar;
