import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`http://localhost:5001/api/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            
            setTimeout(() => navigate("/login"), 2000); // Redirect after 2s
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Reset Password</button>
            <p>{message}</p>
        </div>
    );
};

export default ResetPassword;
