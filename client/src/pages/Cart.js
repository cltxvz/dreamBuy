import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Cart = () => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5001/api/cart/${user.userId}`)
                .then((res) => setCart(res.data.items))
                .catch((err) => console.error(err));
        }
    }, [user]);

    // Remove item from cart
    const removeFromCart = (productId) => {
        axios.post(`http://localhost:5001/api/cart/${user.userId}/remove`, { productId })
            .then(() => setCart(cart.filter(item => item.productId._id !== productId)))
            .catch((err) => console.error(err));
    };

    // Increase quantity
    const increaseQuantity = (productId) => {
        axios.post(`http://localhost:5001/api/cart/${user.userId}/add`, { productId, quantity: 1 })
            .then(() => {
                setCart(cart.map(item => 
                    item.productId._id === productId ? { ...item, quantity: item.quantity + 1 } : item
                ));
            })
            .catch((err) => console.error(err));
    };

    // Decrease quantity
    const decreaseQuantity = (productId, quantity) => {
        if (quantity === 1) {
            removeFromCart(productId);
        } else {
            axios.post(`http://localhost:5001/api/cart/${user.userId}/decrease`, { productId })
                .then(() => {
                    setCart(cart.map(item => 
                        item.productId._id === productId ? { ...item, quantity: item.quantity - 1 } : item
                    ));
                })
                .catch((err) => console.error(err));
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
            <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Shopping Cart</h1>

            {cart.length === 0 ? (
                <p style={{ textAlign: "center" }}>
                    Your cart is empty. <Link to="/" style={{ color: "#4CAF50", fontWeight: "bold" }}>Go to Products</Link>
                </p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.productId._id} style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            border: "1px solid #ddd", 
                            borderRadius: "8px",
                            padding: "15px", 
                            marginBottom: "15px",
                            backgroundColor: "#fff",
                            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
                        }}>
                            {/* Product Image (Using CORS workaround) */}
                            <img 
                                src={`https://images.weserv.nl/?url=${encodeURIComponent(item.productId.imageUrl)}`} 
                                alt={item.productId.name} 
                                style={{ 
                                    width: "100px", 
                                    height: "100px", 
                                    objectFit: "contain", 
                                    marginRight: "15px" 
                                }} 
                            />

                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: "5px 0" }}>{item.productId.name}</h3>
                                <p style={{ margin: "5px 0", fontSize: "16px", fontWeight: "bold" }}>
                                    ${item.productId.price.toLocaleString()}
                                </p>

                                {/* Quantity Adjustments */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                                    <button 
                                        onClick={() => decreaseQuantity(item.productId._id, item.quantity)}
                                        style={{
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        -
                                    </button>
                                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>{item.quantity}</span>
                                    <button 
                                        onClick={() => increaseQuantity(item.productId._id)}
                                        style={{
                                            border: "none",
                                            padding: "5px 10px",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remove Button */}
                                <button 
                                    onClick={() => removeFromCart(item.productId._id)} 
                                    style={{ 
                                        marginTop: "10px", 
                                        background: "red", 
                                        color: "white", 
                                        padding: "7px 12px",
                                        borderRadius: "4px",
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Checkout Button */}
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Link to="/checkout">
                            <button style={{
                                padding: "12px 20px",
                                fontSize: "18px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                marginTop: "10px"
                            }}>
                                Proceed to Checkout
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
