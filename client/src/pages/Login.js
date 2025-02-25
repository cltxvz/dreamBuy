import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setErrorMessage("Invalid email or password.");
            setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 sec
        }
    };

    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            paddingTop: "50px",
            minHeight: "100vh", 
            backgroundColor: "#f9f9f9"
        }}>
            <form 
                onSubmit={handleLogin} 
                style={{
                    width: "600px",
                    padding: "30px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center"
                }}
            >
                <h2 style={{ marginBottom: "25px", fontSize: "24px" }}>Login</h2>

                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "18px"
                    }}
                />

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "18px"
                    }}
                />

                <button 
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginTop: "10px"
                    }}
                >
                    Log In
                </button>

                {/* Inline Error Message */}
                {errorMessage && (
                    <p style={{ color: "red", fontSize: "16px", marginTop: "12px" }}>{errorMessage}</p>
                )}

                <p style={{ marginTop: "20px", fontSize: "16px" }}>
                    Don't have an account? <Link to="/signup" style={{ color: "#4CAF50", fontWeight: "bold", textDecoration: "none" }}>Sign up here</Link>
                </p>
                
                <p style={{ fontSize: "16px" }}>
                    <Link to="/forgot-password" style={{ color: "#4CAF50", fontWeight: "bold", textDecoration: "none" }}>Forgot Password?</Link> 
                </p>
            </form>
        </div>
    );
};

export default Login;
