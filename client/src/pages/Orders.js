import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/orders/${user.userId}`)
                .then((res) => setOrders(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    return (
        <div>
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p>No orders placed yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                        <h3>Order ID: {order._id}</h3>
                        <p>Total Amount: ${order.totalAmount.toLocaleString()}</p>
                        <p>Address: {order.address}</p>
                        <p>Payment Method: {order.paymentMethod.cardNumber}</p>
                        <p>Status: <strong>{order.status}</strong></p>
                        <h4>Items:</h4>
                        {order.items.map((item) => (
                            <p key={item.productId._id}>{item.productId.name} x {item.quantity}</p>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
