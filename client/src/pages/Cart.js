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

    const removeFromCart = (productId) => {
        axios.post(`http://localhost:5001/api/cart/${user.userId}/remove`, { productId })
            .then(() => setCart(cart.filter(item => item.productId._id !== productId)))
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h1>Your Shopping Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Go to Products</Link></p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.productId._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                            <img src={item.productId.image} alt={item.productId.name} style={{ width: "100px", height: "100px" }} />
                            <h3>{item.productId.name}</h3>
                            <p>Price: ${item.productId.price.toLocaleString()}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
                        </div>
                    ))}
                    <Link to="/checkout">
                        <button style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}>Proceed to Checkout</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default Cart;
