import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // 👈 Import Link
import AuthContext from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            alert(err);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input 
                type="email" 
                placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit">Log In</button>
            <p>
                Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
            <p>
                <Link to="/forgot-password">Forgot Password?</Link> 
            </p>
        </form>
    );
};

export default Login;
