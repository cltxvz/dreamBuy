import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [selectedCard, setSelectedCard] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [userData, setUserData] = useState({});
    const [error, setError] = useState({ address: "", payment: "", funds: "" });
    const [isProcessing, setIsProcessing] = useState(false); // New state to track button state
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/cart/${user.userId}`)
                .then((res) => setCart(res.data.items))
                .catch(() => {});

            axios.get(`http://localhost:5001/api/users/${user.userId}`)
                .then((res) => setUserData(res.data))
                .catch(() => {});
        }
    }, [user]);

    const handleCheckout = () => {
        let hasError = false;
        const newError = { address: "", payment: "", funds: "" };

        if (!selectedAddress) {
            newError.address = "Please select a shipping address.";
            hasError = true;
        }

        if (!selectedCard) {
            newError.payment = "Please select a payment method.";
            hasError = true;
        }

        setError(newError);
        if (hasError) return;

        setIsProcessing(true); // Disable button during processing

        axios.post(`http://localhost:5001/api/orders/${user.userId}/checkout`, { 
            selectedCard, 
            selectedAddress 
        })
        .then(() => {
            setTimeout(() => {
                navigate("/orders");
            }, 1000); // 1-second delay before navigating
        })
        .catch((err) => {
            setIsProcessing(false); // Re-enable button on error
            if (err.response?.status === 400) {
                setError((prev) => ({ ...prev, funds: err.response.data.message || "Insufficient balance." }));
            }
        });
    };

    const grandTotal = cart.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    const maskCardNumber = (cardNumber) => {
        return `**** **** **** ${cardNumber.slice(-4)}`;
    };

    // Calculate delivery ETA
    const calculateETA = (deliveryDays) => {
        const etaDate = new Date();
        etaDate.setDate(etaDate.getDate() + deliveryDays);

        return etaDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Checkout</h1>

            {/* Shipping Address Section */}
            <div style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "15px", 
                marginBottom: "20px",
                backgroundColor: "#f9f9f9"
            }}>
                <h2>Shipping Address:</h2>
                {userData.addresses?.length === 0 ? (
                    <p>No addresses saved. Please add an address in your account settings.</p>
                ) : (
                    userData.addresses?.map((address) => (
                        <div key={address} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                            <input 
                                type="radio" 
                                name="address" 
                                value={address} 
                                onChange={() => {
                                    setSelectedAddress(address);
                                    setError((prev) => ({ ...prev, address: "" }));
                                }} 
                            />
                            <label style={{ marginLeft: "8px" }}>{address}</label>
                        </div>
                    ))
                )}
                {error.address && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{error.address}</p>}
            </div>

            {/* Payment Methods Section */}
            <div style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "15px", 
                marginBottom: "20px",
                backgroundColor: "#f9f9f9"
            }}>
                <h2>Payment Method:</h2>
                {userData.paymentMethods?.length === 0 ? (
                    <p>No payment methods saved. Please add a payment method in your account settings.</p>
                ) : (
                    userData.paymentMethods?.map((card) => (
                        <div key={card.cardNumber} style={{ marginBottom: "8px", display: "flex", alignItems: "center"}}>
                            <input 
                                type="radio" 
                                name="payment" 
                                value={card.cardNumber} 
                                onChange={() => {
                                    setSelectedCard(card.cardNumber);
                                    setError((prev) => ({ ...prev, payment: "", funds: "" }));
                                }} 
                            />
                            <label style={{ marginLeft: "8px" }}>
                                {maskCardNumber(card.cardNumber)} (Balance: ${card.balance.toLocaleString()})
                            </label>
                        </div>
                    ))
                )}
                {error.payment && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{error.payment}</p>}
                {error.funds && <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{error.funds}</p>}
            </div>

            {/* Order Summary Section */}
            <div style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "15px", 
                marginBottom: "20px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
            }}>
                <h2>Order Summary:</h2>
                {cart.length === 0 ? (
                    <p>No items in cart.</p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div key={item.productId._id} style={{ 
                                display: "flex", 
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 0",
                                borderBottom: "1px solid #ddd"
                            }}>
                                {/* Product Image */}
                                <img 
                                    src={`https://images.weserv.nl/?url=${encodeURIComponent(item.productId.imageUrl)}`} 
                                    alt={item.productId.name} 
                                    style={{ 
                                        width: "50px", 
                                        height: "50px", 
                                        objectFit: "contain", 
                                        marginRight: "10px" 
                                    }} 
                                />
                                <p style={{ margin: "0", flex: "1" }}>
                                    <strong>{item.productId.name}</strong> x {item.quantity} <br />
                                    <span style={{ color: "#555", fontSize: "14px" }}>
                                        Estimated Delivery: {calculateETA(item.productId.deliveryTime || 7)}
                                    </span>
                                </p>
                                <p style={{ margin: "0", fontWeight: "bold" }}>
                                    ${ (item.productId.price * item.quantity).toLocaleString() }
                                </p>
                            </div>
                        ))}
                        {/* Grand Total */}
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            fontSize: "18px",
                            fontWeight: "bold",
                            paddingTop: "10px",
                            marginTop: "5px"
                        }}>
                            <span>Total:</span>
                            <span>${grandTotal.toLocaleString()}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Place Order Button */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button 
                    onClick={handleCheckout}
                    disabled={isProcessing} // Button disabled when processing
                    style={{
                        padding: "12px 20px",
                        fontSize: "18px",
                        backgroundColor: isProcessing ? "#999" : "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: isProcessing ? "not-allowed" : "pointer",
                        width: "100%",
                        marginTop: "5px",
                        opacity: isProcessing ? "0.7" : "1"
                    }}
                >
                    {isProcessing ? "Processing..." : "Place Order"}
                </button>
            </div>
        </div>
    );
};

export default Checkout;
