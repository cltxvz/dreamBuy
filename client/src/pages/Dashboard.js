import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [address, setAddress] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newCardNumber, setNewCardNumber] = useState("");
    const [newBalance, setNewBalance] = useState("");

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/users/${user.userId}`)
                .then((res) => {
                    setAddress(res.data.address);
                    setPaymentMethods(res.data.paymentMethods);
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    const updateAddress = () => {
        axios.put(`http://localhost:5001/api/users/${user.userId}/address`, { address })
            .then(() => alert("Address updated successfully!"))
            .catch((err) => console.error(err));
    };

    const addPaymentMethod = () => {
        if (!newCardNumber || !newBalance) return alert("Please enter card details!");
        axios.post(`http://localhost:5001/api/users/${user.userId}/payment`, {
            cardNumber: newCardNumber,
            balance: Number(newBalance),
        }).then(() => {
            alert("Payment method added!");
            setPaymentMethods([...paymentMethods, { cardNumber: newCardNumber, balance: Number(newBalance) }]);
            setNewCardNumber("");
            setNewBalance("");
        }).catch((err) => console.error(err));
    };

    return (
        <div>
            <h1>Welcome, {user?.name}!</h1>
            <button onClick={logout}>Log Out</button>

            <h2>Manage Address</h2>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" />
            <button onClick={updateAddress}>Update Address</button>

            <h2>Manage Payment Methods</h2>
            {paymentMethods.map((card, index) => (
                <p key={index}>Card: {card.cardNumber} - Balance: ${card.balance}</p>
            ))}
            <input type="text" value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} placeholder="Card Number" />
            <input type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} placeholder="Balance" />
            <button onClick={addPaymentMethod}>Add Payment Method</button>
        </div>
    );
};

export default Dashboard;
