import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [addresses, setAddresses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [newBalance, setNewBalance] = useState("");

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/users/${user.userId}`)
                .then((res) => {
                    setAddresses(res.data.addresses || []);
                    setPaymentMethods(res.data.paymentMethods || []);
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    // Add New Address
    const addAddress = () => {
        if (!newAddress) return alert("Please enter an address!");
        axios.post(`http://localhost:5001/api/users/${user.userId}/address`, { address: newAddress })
            .then((res) => {
                setAddresses([...res.data]); // Ensure UI updates immediately
                setNewAddress("");
            })
            .catch((err) => console.error(err));
    };

    // Delete Address (Fix: Allow Deleting Last Address)
    const deleteAddress = (index) => {
        axios.delete(`http://localhost:5001/api/users/${user.userId}/address/${index}`)
            .then((res) => {
                setAddresses([...res.data]); // Ensure state updates correctly
            })
            .catch((err) => console.error(err));
    };

    // Add Payment Method
    const addPaymentMethod = () => {
        if (!newBalance || newBalance <= 0) return alert("Please enter a valid balance!");
        axios.post(`http://localhost:5001/api/users/${user.userId}/payment`, { balance: Number(newBalance) })
            .then((res) => {
                setPaymentMethods([...res.data]);
                setNewBalance("");
            })
            .catch((err) => console.error(err));
    };

    // Delete Payment Method
    const deletePaymentMethod = (cardNumber) => {
        axios.delete(`http://localhost:5001/api/users/${user.userId}/payment/${cardNumber}`)
            .then((res) => setPaymentMethods([...res.data]))
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h1>Welcome, {user?.name}!</h1>
            <button onClick={logout}>Log Out</button>

            <h2>Manage Addresses</h2>
            {addresses.length === 0 ? (
                <p>No addresses saved.</p>
            ) : (
                addresses.map((address, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <p>{address}</p>
                        <button onClick={() => deleteAddress(index)}>Delete</button>
                    </div>
                ))
            )}
            <input 
                type="text" 
                value={newAddress} 
                onChange={(e) => setNewAddress(e.target.value)} 
                placeholder="Enter new address" 
            />
            <button onClick={addAddress}>Add Address</button>

            <h2>Manage Payment Methods</h2>
            {paymentMethods.length === 0 ? (
                <p>No payment methods added.</p>
            ) : (
                paymentMethods.map((card) => (
                    <div key={card.cardNumber} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <p>Card: {card.cardNumber} - Balance: ${card.balance.toFixed(2)}</p>
                        <button onClick={() => deletePaymentMethod(card.cardNumber)}>Delete</button>
                    </div>
                ))
            )}
            <input 
                type="number" 
                value={newBalance} 
                onChange={(e) => setNewBalance(e.target.value)} 
                placeholder="Enter balance" 
            />
            <button onClick={addPaymentMethod}>Add Payment Method</button>
        </div>
    );
};

export default Dashboard;
