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
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/cart/${user.userId}`)
                .then((res) => setCart(res.data.items))
                .catch(() => {}); // Suppress console log

            axios.get(`http://localhost:5001/api/users/${user.userId}`)
                .then((res) => setUserData(res.data))
                .catch(() => {}); // Suppress console log
        }
    }, [user]);

    const handleCheckout = () => {
        if (!selectedCard) return alert("Please select a payment method!");
        if (!selectedAddress) return alert("Please select a shipping address!");

        axios.post(`http://localhost:5001/api/orders/${user.userId}/checkout`, { 
            selectedCard, 
            selectedAddress 
        })
        .then(() => {
            alert("Order placed successfully!");
            navigate("/orders");
        })
        .catch((err) => {
            if (err.response?.status === 400) {
                // Show error to user without logging it in console
                alert(err.response?.data?.message || "Failed to place order. Please try again.");
            }
        });
    };

    return (
        <div>
            <h1>Checkout</h1>

            <h2>Shipping Address</h2>
            {userData.addresses?.length === 0 ? (
                <p>No addresses saved. Please add an address in your account settings.</p>
            ) : (
                userData.addresses?.map((address) => (
                    <div key={address}>
                        <input type="radio" name="address" value={address} onChange={() => setSelectedAddress(address)} />
                        <label>{address}</label>
                    </div>
                ))
            )}

            <h2>Payment Methods</h2>
            {userData.paymentMethods?.map((card) => (
                <div key={card.cardNumber}>
                    <input type="radio" name="payment" value={card.cardNumber} onChange={() => setSelectedCard(card.cardNumber)} />
                    <label>{card.cardNumber} (Balance: ${card.balance})</label>
                </div>
            ))}

            <h2>Order Summary</h2>
            {cart.map((item) => (
                <p key={item.productId._id}>{item.productId.name} x {item.quantity} - ${item.productId.price * item.quantity}</p>
            ))}

            <button onClick={handleCheckout}>Place Order</button>
        </div>
    );
};

export default Checkout;
