import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import { CartContext } from '../context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToWishlist } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  if (loading) return <div className="text-center mt-5"><h3>Loading...</h3></div>;

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand fw-bold">All Products</span>
        </div>
      </nav>

      <div className="container mt-5">
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h2 className="mb-4">All Products</h2>
        <div className="row" id="product-container">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product._id} className="col-md-3 mb-4">
                <div className="card p-2 shadow-sm h-100">
                  <img
                    src={product.image}
                    className="card-img-top"
                    style={{ height: '220px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${product._id}`)}
                    alt={product.name}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6
                      style={{ cursor: 'pointer', color: '#007bff' }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </h6>
                    <span className="badge bg-success w-fit">{product.rating} ★</span>
                    <p className="fw-bold text-success mt-2">₹{product.price}</p>
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={() => {
                        addToCart(product);
                        alert('Added to Cart 🛒');
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={() => {
                        addToWishlist(product);
                        alert('Added to Wishlist ❤️');
                      }}
                    >
                      ❤️ Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <h5>No products found</h5>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-dark text-white mt-5 p-4 text-center">
        © 2026 FashionKart
      </footer>
    </div>
  );
};

export default Products;
