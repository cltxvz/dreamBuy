import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Signup = () => {
    const { signup } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate("/");
        } catch (err) {
            alert(err);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
