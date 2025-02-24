import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import OrderProgress from "../components/OrderProgress";
import io from "socket.io-client";

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);

    const fetchOrders = useCallback(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/orders/${user.userId}`)
                .then((res) => setOrders(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    useEffect(() => {
        fetchOrders();
    
        const socket = io("http://localhost:5001", {
            query: { userId: user.userId }
        });
    
        socket.on("orderUpdated", (updatedOrder) => {
            setOrders(prevOrders =>
                prevOrders.map(order => {
                    // Only update if the order matches
                    if (order.orderId === updatedOrder._id) {
                        const updatedItem = updatedOrder.items.find(i => i.productId === order.product._id);
                        if (updatedItem) {
                            return { ...order, status: updatedItem.status };
                        }
                    }
                    return order;
                })
            );
        });
    
        return () => socket.disconnect();
    }, [fetchOrders, user]);  

    const cancelOrderItem = (orderId, productId) => {
        axios.post(`http://localhost:5001/api/orders/${orderId}/cancel/${productId}`)
            .then(() => {
                setOrders(prevOrders => prevOrders.filter(order => 
                    !(order.orderId === orderId && order.product._id === productId)
                ));
                alert("Item removed from order!");
            })
            .catch((err) => alert(err.response?.data?.message || "Error canceling order"));
    };

    const filteredOrders = orders.filter(order => 
        showCompleted ? order.status === "Delivered" : order.status !== "Delivered"
    );

    return (
        <div>
            <h1>Your Orders</h1>
            
            <button onClick={() => setShowCompleted(!showCompleted)}>
                {showCompleted ? "Show In-Progress Orders" : "Show Completed Orders"}
            </button>

            {filteredOrders.length === 0 ? (
                <p>{showCompleted ? "No completed orders yet." : "No active orders in progress."}</p>
            ) : (
                filteredOrders.map((order) => (
                    <div key={`${order.orderId}-${order.product._id}`} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px" }}>
                        <h3>Order ID: {order.orderId}</h3>
                        <p><strong>Product:</strong> {order.product.name}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Price:</strong> ${order.totalAmount.toLocaleString()}</p>
                        <p><strong>Delivery Time:</strong> {order.deliveryTime} days</p>
                        <p><strong>Shipping Address:</strong> {order.address}</p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

                        <OrderProgress currentStatus={order.status || "Processing"} />

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
