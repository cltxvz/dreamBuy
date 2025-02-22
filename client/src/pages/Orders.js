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

    const cancelOrderItem = (orderId, productId) => {
        axios.post(`http://localhost:5001/api/orders/${orderId}/cancel/${productId}`)
            .then(() => {
                setOrders(orders.filter(order => 
                    !(order.orderId === orderId && order.product._id === productId)
                ));
                alert("Item removed from order!");
            })
            .catch((err) => alert(err.response?.data?.message || "Error canceling order"));
    };

    return (
        <div>
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p>No orders placed yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.product._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                        <h3>Order ID: {order.orderId}</h3>
                        <p><strong>Product:</strong> {order.product.name}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Price:</strong> ${order.totalAmount.toLocaleString()}</p>
                        <p><strong>Delivery Time:</strong> {order.deliveryTime} days</p>
                        <p>
                            <strong>Status: </strong> 
                            <span style={{ color: order.status ? (order.status === "Canceled" ? "red" : "green") : "black" }}>
                                {order.status || "Processing"}
                            </span>
                        </p>
                        <p><strong>Shipping Address:</strong> {order.address}</p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

                        {order.status !== "Out for Delivery" && order.status !== "Delivered" && (
                            <button onClick={() => cancelOrderItem(order.orderId, order.product._id)}>
                                Cancel Order
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
