import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const [sortOption, setSortOption] = useState("none");
    const { user } = useContext(AuthContext);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        axios.get("http://localhost:5001/api/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleQuantityChange = (productId, value) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, Number(value)),
        }));
    };

    const addToCart = (productId) => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        const quantity = quantities[productId] || 1;
        axios.post(`http://localhost:5001/api/cart/${user.userId}/add`, { productId, quantity })
            .then(() => alert("Added to cart!"))
            .catch((err) => console.error(err));
    };

    const formatDeliveryTime = (days) => {
        if (days < 1) {
            const minutes = Math.round(days * 1440);
            return `${minutes} min`;
        }
        return `${days} days`;
    };

    // Filtering and sorting
    const filteredProducts = products
        .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((product) => {
            if (priceFilter === "low") return product.price < 100000;
            if (priceFilter === "mid") return product.price >= 100000 && product.price < 1000000;
            if (priceFilter === "high") return product.price >= 1000000;
            return true;
        })
        .sort((a, b) => {
            if (sortOption === "price-low-high") return a.price - b.price;
            if (sortOption === "price-high-low") return b.price - a.price;
            if (sortOption === "delivery-fastest") return a.deliveryTime - b.deliveryTime;
            return 0;
        });

    return (
        <>
            <div style={{ padding: "20px" }}>

                {/* Search, Filter, and Sorting Controls (Full-Width Row) */}
                <div style={{ 
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "10px",
                    marginBottom: "20px",
                    width: "100%"
                }}>
                    {/* Search Bar */}
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            width: "100%",
                            fontSize: "16px"
                        }}
                    />

                    {/* Price Filter */}
                    <select 
                        value={priceFilter} 
                        onChange={(e) => setPriceFilter(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            width: "100%",
                            fontSize: "16px"
                        }}
                    >
                        <option value="all">All Prices</option>
                        <option value="low">Under $100K</option>
                        <option value="mid">$100K - $1M</option>
                        <option value="high">Over $1M</option>
                    </select>

                    {/* Sorting Options */}
                    <select 
                        value={sortOption} 
                        onChange={(e) => setSortOption(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            width: "100%",
                            fontSize: "16px"
                        }}
                    >
                        <option value="none">Sort By</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="delivery-fastest">Fastest Delivery</option>
                    </select>
                </div>

                {/* Product Grid */}
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                    gap: "20px" 
                }}>
                    {filteredProducts.map((product) => (
                        <div key={product._id} style={{ 
                            border: "1px solid #ddd", 
                            padding: "15px", 
                            borderRadius: "8px", 
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
                            textAlign: "center", 
                            backgroundColor: "#fff" 
                        }}>
                            <div style={{
                                width: "100%",
                                height: "200px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden"
                            }}>
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    style={{ 
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }} 
                                />
                            </div>
                            <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
                            <p style={{ fontWeight: "bold", margin: "5px 0" }}>${product.price.toLocaleString()}</p>
                            <p style={{ color: "#555", margin: "5px 0" }}>
                                Delivery: {formatDeliveryTime(product.deliveryTime)}
                            </p>

                            {/* Quantity Selector */}
                            <div style={{ margin: "10px 0" }}>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={quantities[product._id] || 1} 
                                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                    style={{ width: "60px", padding: "5px", border: "1px solid #ccc", borderRadius: "4px", textAlign: "center"}}
                                />
                            </div>

                            {/* Add to Cart Button */}
                            <button 
                                onClick={() => addToCart(product._id)}
                                style={{
                                    backgroundColor: "#4CAF50",
                                    color: "#fff",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProductCatalog;
