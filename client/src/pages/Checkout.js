import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [selectedCard, setSelectedCard] = useState("");
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/cart/${user.userId}`)
                .then((res) => setCart(res.data.items))
                .catch((err) => console.error(err));

            axios.get(`http://localhost:5001/api/users/${user.userId}`)
                .then((res) => setUserData(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    const handleCheckout = () => {
        if (!selectedCard) return alert("Please select a payment method!");

        axios.post(`http://localhost:5001/api/orders/${user.userId}/checkout`, { selectedCard })
            .then(() => {
                alert("Order placed successfully!");
                navigate("/orders");
            })
            .catch((err) => alert(err.response.data.message));
    };

    return (
        <div>
            <h1>Checkout</h1>
            <h2>Shipping Address</h2>
            <p>{userData.address || "No address provided"}</p>

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
