import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const [addresses, setAddresses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [newBalance, setNewBalance] = useState("");

    // Profile Update States
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/users/${user.userId}`)
                .then((res) => {
                    setAddresses(res.data.addresses || []);
                    setPaymentMethods(res.data.paymentMethods || []);
                    setUpdatedName(res.data.name);
                    setUpdatedEmail(res.data.email);
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    // Update Profile
    const handleProfileUpdate = () => {
        axios.put(`http://localhost:5001/api/users/${user.userId}/update`, { 
            name: updatedName, 
            email: updatedEmail, 
            currentPassword, 
            newPassword 
        })
        .then((res) => {
            setMessage("Profile updated successfully!");
            setMessageType("success");
    
            // **Update user context and store new token**
            updateUser({ userId: user.userId, name: res.data.user.name, email: res.data.user.email }, res.data.token);
    
            setCurrentPassword(""); 
            setNewPassword(""); 
    
            // Hide message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        })
        .catch((err) => {
            setMessage(err.response?.data?.message || "Failed to update profile");
            setMessageType("error");
    
            // Hide message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        });
    };
    

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

    // Delete Address
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

            {/* Edit Profile Section */}
            <h2>Edit Profile</h2>
            {message && (
                <p style={{ 
                    color: messageType === "success" ? "green" : "red", 
                    fontWeight: "bold" 
                }}>
                    {message}
                </p>
            )}

            <label>Name:</label>
            <input 
                type="text" 
                value={updatedName} 
                onChange={(e) => setUpdatedName(e.target.value)} 
            />

            <label>Email:</label>
            <input 
                type="email" 
                value={updatedEmail} 
                onChange={(e) => setUpdatedEmail(e.target.value)} 
            />

            <h3>Change Password</h3>
            <label>Current Password:</label>
            <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
            />

            <label>New Password:</label>
            <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
            />

            <button onClick={handleProfileUpdate}>Update Profile</button>

            {/* Address Management */}
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

            {/* Payment Management */}
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
