import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [addresses, setAddresses] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newAddress, setNewAddress] = useState("");
    const [newBalance, setNewBalance] = useState("");

    // Profile Update States
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Inline Messages
    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [addressMessage, setAddressMessage] = useState("");
    const [paymentMessage, setPaymentMessage] = useState("");

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
    const handleProfileUpdate = (type) => {
        axios.put(`http://localhost:5001/api/users/${user.userId}/update`, { 
            name: updatedName, 
            email: updatedEmail, 
            currentPassword, 
            newPassword 
        })
        .then((res) => {
            if (type === "profile") {
                setProfileMessage("Profile updated successfully!");
            } else {
                setPasswordMessage("Password changed successfully!");
            }

            // Update user context and store new token
            updateUser({ userId: user.userId, name: res.data.user.name, email: res.data.user.email }, res.data.token);

            setCurrentPassword(""); 
            setNewPassword("");

            setTimeout(() => {
                setProfileMessage("");
                setPasswordMessage("");
            }, 3000);
        })
        .catch((err) => {
            if (type === "profile") {
                setProfileMessage(err.response?.data?.message || "Failed to update profile");
            } else {
                setPasswordMessage(err.response?.data?.message || "Failed to change password");
            }

            setTimeout(() => {
                setProfileMessage("");
                setPasswordMessage("");
            }, 3000);
        });
    };

    // Add New Address
    const addAddress = () => {
        if (!newAddress) {
            setAddressMessage("Please enter an address!");
            return;
        }
        axios.post(`http://localhost:5001/api/users/${user.userId}/address`, { address: newAddress })
            .then((res) => {
                setAddresses([...res.data]);
                setNewAddress("");
                setAddressMessage("");
            })
            .catch((err) => console.error(err));
    };

    // Delete Address
    const deleteAddress = (index) => {
        axios.delete(`http://localhost:5001/api/users/${user.userId}/address/${index}`)
            .then((res) => setAddresses([...res.data]))
            .catch((err) => console.error(err));
    };

    // Add Payment Method
    const addPaymentMethod = () => {
        if (!newBalance || newBalance <= 0) {
            setPaymentMessage("Please enter a valid balance!");
            return;
        }
        axios.post(`http://localhost:5001/api/users/${user.userId}/payment`, { balance: Number(newBalance) })
            .then((res) => {
                setPaymentMethods([...res.data]);
                setNewBalance("");
                setPaymentMessage("");
            })
            .catch((err) => console.error(err));
    };

    // Delete Payment Method
    const deletePaymentMethod = (cardNumber) => {
        axios.delete(`http://localhost:5001/api/users/${user.userId}/payment/${cardNumber}`)
            .then((res) => setPaymentMethods([...res.data]))
            .catch((err) => {
                if (err.response?.status === 400) {
                    setPaymentMessage(err.response.data.message); // Display the error message
                } else {
                    console.error("Error deleting payment method:", err);
                }
            });
    
        // Clear the message after 3 seconds
        setTimeout(() => setPaymentMessage(""), 3000);
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Account Settings</h1>

            {/* Edit Profile Section */}
            <div style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "20px", 
                marginBottom: "20px", 
                backgroundColor: "#f9f9f9" 
            }}>
                <h2 style={{ marginBottom: "15px" }}>Edit Profile</h2>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Name:</label>
                    <input 
                        type="text" 
                        value={updatedName} 
                        onChange={(e) => setUpdatedName(e.target.value)} 
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Email:</label>
                    <input 
                        type="email" 
                        value={updatedEmail} 
                        onChange={(e) => setUpdatedEmail(e.target.value)} 
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <button 
                    onClick={() => handleProfileUpdate("profile")}
                    style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "10px"
                    }}
                >
                    Update Profile
                </button>
                {profileMessage && <p style={{ marginTop:"10px" }}>{profileMessage}</p>}
            </div>

            {/* Change Password Section */}
            <div style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "20px", 
                marginBottom: "20px", 
                backgroundColor: "#f9f9f9" 
            }}>

                <h3 style={{ marginBottom: "15px"}}>Change Password</h3>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Current Password:</label>
                    <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>New Password:</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <button 
                    onClick={() => handleProfileUpdate("password")}
                    style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "10px"
                    }}
                >
                    Change Password
                </button>
                {passwordMessage && <p style={{ marginTop:"10px" }}>{passwordMessage}</p>}
            </div>

            {/* Address Management */}
            <div style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "20px", 
                marginBottom: "20px", 
                backgroundColor: "#f9f9f9" 
            }}>
                <h2 style={{ marginBottom: "15px" }}>Manage Addresses</h2>
                {addresses.length === 0 ? (
                    <p>No addresses saved.</p>
                ) : (
                    addresses.map((address, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", padding: "8px 0" }}>
                            
                            <p style={{ margin: 0 }}>{address}</p>
                            <button 
                                onClick={() => deleteAddress(index)}
                                style={{
                                    backgroundColor: "#ff4d4d",
                                    color: "white",
                                    padding: "6px 10px",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
                <div style={{ marginTop: "15px" }}>
                    <input 
                        type="text" 
                        value={newAddress} 
                        onChange={(e) => setNewAddress(e.target.value)} 
                        placeholder="Enter new address" 
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}
                    />
                    <button 
                        onClick={addAddress} 
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "10px 15px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Add Address
                    </button>
                    {addressMessage && <p style={{ color: "red", marginTop:"10px" }}>{addressMessage}</p>}
                </div>
            </div>

            {/* Payment Management */}
            <div style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "20px", 
                backgroundColor: "#f9f9f9"
            }}>
                <h2 style={{ marginBottom: "15px" }}>Manage Payment Methods</h2>
                {paymentMethods.length === 0 ? (
                    <p>No payment methods added.</p>
                ) : (
                    paymentMethods.map((card) => (
                        <div key={card.cardNumber} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", padding: "8px 0" }}>
                            <p style={{ margin: 0 }}>Card: **** **** **** {card.cardNumber.slice(-4)} - Balance: ${card.balance.toFixed(2)}</p>
                            <button 
                                onClick={() => deletePaymentMethod(card.cardNumber)}
                                style={{
                                    backgroundColor: "#ff4d4d",
                                    color: "white",
                                    padding: "6px 10px",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
                <div style={{ marginTop: "15px" }}>
                    <input 
                        type="number" 
                        value={newBalance} 
                        onChange={(e) => setNewBalance(e.target.value)} 
                        placeholder="Enter balance" 
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}
                    />
                    <button 
                        onClick={addPaymentMethod} 
                        style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "10px 15px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Add Payment Method
                    </button>
                    {paymentMessage && <p style={{ color: "red", marginTop:"10px" }}>{paymentMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
