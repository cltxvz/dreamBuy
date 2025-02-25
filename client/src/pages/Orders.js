import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import OrderProgress from "../components/OrderProgress";
import io from "socket.io-client";

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [toastMessage, setToastMessage] = useState(""); // State for toast notification

    // Fetch only active orders safely
    const fetchOrders = useCallback(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/orders/${user.userId}`)
                .then((res) => {
                    setOrders(res.data?.filter(order => order.status !== "Delivered") || []);
                })
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
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order? A refund will be provided."
        );

        if (!confirmCancel) return;

        axios.post(`http://localhost:5001/api/orders/${orderId}/cancel/${productId}`)
            .then(() => {
                setOrders(prevOrders => prevOrders.filter(order =>
                    !(order.orderId === orderId && order.product._id === productId)
                ));

                // Show toast notification
                setToastMessage("Order canceled successfully. Refund issued.");
                setTimeout(() => setToastMessage(""), 3000); // Clear message after 3 sec
            })
            .catch((err) => {
                setToastMessage(err.response?.data?.message || "Error canceling order.");
                setTimeout(() => setToastMessage(""), 3000);
            });
    };

    // Helper function for ETA calculation
    const calculateETA = (placedAt, deliveryDays) => {
        const eta = new Date(new Date(placedAt).getTime() + deliveryDays * 24 * 60 * 60 * 1000);

        return eta.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric"
        }) + " - " + eta.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Mask credit card number to only show last 4 digits
    const maskCardNumber = (cardNumber) => {
        return `**** **** **** ${cardNumber.slice(-4)}`;
    };

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Your Orders</h1>

            {/* Toast Notification */}
            {toastMessage && (
                <div style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    padding: "12px 16px",
                    borderRadius: "5px",
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
                    fontSize: "16px",
                    zIndex: 1000,
                    transition: "opacity 0.5s ease-in-out",
                    opacity: toastMessage ? 1 : 0
                }}>
                    {toastMessage}
                </div>
            )}

            {/* Link to Order History */}
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <Link to="/order-history" style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    textDecoration: "none"
                }}>
                    See Past Orders
                </Link>
            </div>

            {orders.length === 0 ? (
                <p style={{ textAlign: "center" }}>No active orders in progress.</p>
            ) : (
                orders.map((order) => (
                    <div key={`${order.orderId}-${order.product._id}`} style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        marginBottom: "15px",
                        backgroundColor: "#fff",
                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
                    }}>
                        <h3>Order ID: {order.orderId}</h3>

                        {/* Product Image */}
                        <div style={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            marginBottom: "10px"
                        }}>
                            <img 
                                src={order.product.imageUrl} 
                                alt={order.product.name} 
                                style={{ 
                                    width: "100px", 
                                    height: "100px", 
                                    objectFit: "contain"
                                }} 
                            />
                        </div>

                        <p><strong>Product:</strong> {order.product.name}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Price:</strong> ${order.totalAmount.toLocaleString()}</p>
                        <p><strong>Payment Method:</strong> {maskCardNumber(order.paymentMethod)}</p>
                        <p><strong>Shipping Address:</strong> {order.address}</p>
                        <p><strong>Delivery ETA:</strong> {calculateETA(order.placedAt, order.deliveryTime)}</p>

                        <OrderProgress currentStatus={order.status || "Processing"} />

                        {/* Show cancel button only if not yet Out for Delivery */}
                        {order.status !== "Out for Delivery" && order.status !== "Delivered" && (
                            <button 
                                onClick={() => cancelOrderItem(order.orderId, order.product._id)}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    padding: "8px 12px",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: "pointer",
                                    marginTop: "10px"
                                }}
                            >
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
