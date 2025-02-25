import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/orders/${user.userId}`)
                .then((res) => {
                    setOrders(res.data?.filter(order => order.status === "Delivered") || []);
                })
                .catch((err) => console.error(err));
        }
    }, [user]);

    const reorderItems = (order) => {
        if (!order || !order.items) {
            console.error("Order items are undefined");
            return;
        }

        const reorderRequests = order.items.map((item) => {
            return axios.post(`http://localhost:5001/api/cart/${user.userId}/add`, { 
                productId: item.productId._id, 
                quantity: item.quantity 
            });
        });

        Promise.all(reorderRequests)
            .then(() => alert("Items added to cart!"))
            .catch((err) => console.error("Error reordering items:", err));
    };

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Order History</h1>

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
                        <p><strong>Shipping Address:</strong> {order.address}</p>
                        <p><strong>Payment Method:</strong> **** **** **** {order.paymentMethod.slice(-4)}</p>

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
