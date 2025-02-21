import { useState, useEffect } from "react";
import axios from "axios";

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5001/api/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h1>DreamBuy Product Catalog</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {products.map((product) => (
                    <div key={product._id} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                        <img src={product.image} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p><strong>${product.price.toLocaleString()}</strong></p>
                        <p>Delivery: {product.deliveryTime} days</p>
                        <button>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCatalog;
