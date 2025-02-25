import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const { user } = useContext(AuthContext); // Get user context
    const [quantities, setQuantities] = useState({}); // Track quantity for each product

    useEffect(() => {
        axios.get("http://localhost:5001/api/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleQuantityChange = (productId, value) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, Number(value)), // Ensure minimum quantity is 1
        }));
    };

    const addToCart = (productId) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }

        const quantity = quantities[productId] || 1; // Default to 1 if not specified

        axios.post(`http://localhost:5001/api/cart/${user.userId}/add`, { productId, quantity })
            .then(() => alert("Added to cart!"))
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <h1>DreamBuy Product Catalog</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {products.map((product) => (
                    <div key={product._id} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                        <img src={`https://images.weserv.nl/?url=${encodeURIComponent(product.imageUrl)}`} 
                            alt={product.name} 
                            style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                        />
                        <h3>{product.name}</h3>
                        <p><strong>${product.price.toLocaleString()}</strong></p>
                        <p>Delivery: {product.deliveryTime} days</p>

                        {/* Quantity Selector */}
                        <input 
                            type="number" 
                            min="1" 
                            value={quantities[product._id] || 1} 
                            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                            style={{ width: "50px", marginRight: "10px" }}
                        />

                        {/* Add to Cart Button */}
                        <button onClick={() => addToCart(product._id)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCatalog;
