import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:5001/api/auth/forgot-password", { email });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Error sending reset link");
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubmit}>Send Reset Link</button>
            <p>{message}</p>
        </div>
    );
};

export default ForgotPassword;
