import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav style={{ display: "flex", justifyContent: "space-around", padding: "10px", borderBottom: "1px solid #ddd" }}>
            <Link to="/">Home</Link>
            {user && <Link to="/cart">Cart</Link>}
            {user && <Link to="/orders">Orders</Link>}
            {user && <Link to="/dashboard">Account</Link>}
            {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </nav>
    );
};

export default Navbar;
