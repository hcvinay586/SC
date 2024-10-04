import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  // State to store products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: ""
  });

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmU4Mzc5NDczZjRkOTc3NmI1NjhkYiIsImlhdCI6MTcyNzk1NjAwNywiZXhwIjoxNzMwNTQ4MDA3fQ.yr9ivug7SCc0NOf7850jR3J0sIx0-7J2mmfmEZ15log" // Retrieve the token from localStorage
      const config = {
        headers: { Authorization: `Bearer ${token}` }, // Add token to headers
      };
      try {
        const response = await axios.get("http://localhost:5000/api/products", config);
        setProducts(response.data); // Set fetched products in state
        setLoading(false);
      } catch (err) {
        setError("Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/products", newProduct);
      setProducts([...products, response.data]); // Add the new product to the existing list
      setNewProduct({ name: "", price: "", description: "" }); // Clear the form
    } catch (error) {
      console.log("Error adding product", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      <h1>Product List</h1>
      <ProductList products={products} />

      {/* Add Product Form */}
      <h2>Add a New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
        />
        <input
          type="text"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

// Component to display the product list
const ProductList = ({ products }) => {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>{product._id}</td>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default App;
