import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`http://localhost:5001/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setMessageType("success");

            // Redirect to login after 2 seconds
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password");
            setMessageType("error");
        }

        // Hide message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
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
            <div 
                style={{
                    width: "600px",
                    padding: "30px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    textAlign: "center"
                }}
            >
                <h2 style={{ marginBottom: "25px", fontSize: "24px" }}>Reset Password</h2>

                <input
                    type="password"
                    placeholder="New password"
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
                    onClick={handleSubmit}
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
                    Reset Password
                </button>

                {/* Inline Message Display */}
                {message && (
                    <p style={{ 
                        color: messageType === "success" ? "green" : "red", 
                        fontSize: "16px",
                        marginTop: "12px"
                    }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
