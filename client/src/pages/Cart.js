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
        <div>
            <h1>Your Shopping Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Go to Products</Link></p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.productId._id} style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            border: "1px solid #ddd", 
                            padding: "10px", 
                            marginBottom: "10px" 
                        }}>
                            {/* Product Image (Using CORS workaround) */}
                            <img 
                                src={`https://images.weserv.nl/?url=${encodeURIComponent(item.productId.imageUrl)}`} 
                                alt={item.productId.name} 
                                style={{ width: "80px", height: "80px", marginRight: "15px" }} 
                            />

                            <div style={{ flex: 1 }}>
                                <h3>{item.productId.name}</h3>
                                <p>Price: ${item.productId.price.toLocaleString()}</p>

                                {/* Quantity Adjustments */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <button onClick={() => decreaseQuantity(item.productId._id, item.quantity)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increaseQuantity(item.productId._id)}>+</button>
                                </div>

                                {/* Remove Button */}
                                <button 
                                    onClick={() => removeFromCart(item.productId._id)} 
                                    style={{ marginTop: "10px", background: "red", color: "white", padding: "5px 10px" }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Checkout Button */}
                    <Link to="/checkout">
                        <button style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}>
                            Proceed to Checkout
                        </button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default Cart;
