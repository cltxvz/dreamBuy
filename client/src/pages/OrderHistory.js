import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [toastMessage, setToastMessage] = useState(""); // Toast notification

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/orders/${user.userId}`)
                .then((res) => {
                    setOrders(res.data?.filter(order => order.status === "Delivered") || []);
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    // Calculate the delivery date
    const calculateDeliveryDate = (placedAt, deliveryDays) => {
        const deliveryDate = new Date(new Date(placedAt).getTime() + deliveryDays * 24 * 60 * 60 * 1000);
        return deliveryDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const reorderItems = (order) => {
        if (!order || !order.product) {
            console.error("Order items are undefined");
            return;
        }

        const reorderRequest = {
            userId: user.userId,
            items: [
                {
                    productId: order.product._id,
                    quantity: order.quantity
                }
            ]
        };

        axios.post(`http://localhost:5001/api/orders/${user.userId}/add-multiple`, reorderRequest)
            .then(() => {
                setToastMessage("Items added to cart successfully!"); // Show toast
                setTimeout(() => setToastMessage(""), 3000); // Hide after 3 sec
            })
            .catch((err) => console.error("Error reordering items:", err));
    };

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Order History</h1>

            {/* Toast Notification */}
            {toastMessage && (
                <div style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#4CAF50",
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

            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <Link to="/orders" style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    textDecoration: "none"
                }}>
                    Back to Active Orders
                </Link>
            </div>

            {orders.length === 0 ? (
                <p style={{ textAlign: "center" }}>No past orders yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.orderId} style={{
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
                        <p><strong>Payment Method:</strong> **** **** **** {order.paymentMethod.slice(-4)}</p>
                        <p><strong>Shipping Address:</strong> {order.address}</p>
                        <p><strong>Delivered on:</strong> {calculateDeliveryDate(order.placedAt, order.deliveryTime)}</p>

                        {/* Reorder Button */}
                        <button 
                            onClick={() => reorderItems(order)}
                            style={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                padding: "8px 12px",
                                borderRadius: "5px",
                                border: "none",
                                cursor: "pointer",
                                marginTop: "10px"
                            }}
                        >
                            Reorder
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;
