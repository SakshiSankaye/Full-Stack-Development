import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { CartContext } from '../context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart, addToWishlist } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><h3>Loading...</h3></div>;

  if (!product) {
    return (
      <div className="text-center mt-5">
        <h3>Product not found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    alert(`Added ${qty} item(s) to cart 🛒`);
    setQty(1);
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span
            className="navbar-brand"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            FashionKart
          </span>
        </div>
      </nav>

      <div className="container mt-5 mb-5">
        <button
          className="btn btn-secondary mb-3"
          onClick={() => navigate('/products')}
        >
          ← Back to Products
        </button>

        <div className="row">
          <div className="col-md-6">
            <img
              src={product.image}
              className="img-fluid"
              style={{ borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}
              alt={product.name}
            />
          </div>

          <div className="col-md-6">
            <h2>{product.name}</h2>
            <p className="text-muted">Category: <strong>{product.category}</strong></p>

            <div className="mb-3">
              <span className="badge bg-success p-2" style={{ fontSize: '16px' }}>
                {product.rating} ★ Rating
              </span>
            </div>

            <h3 className="text-success fw-bold mb-3">₹{product.price}</h3>

            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
              This is a premium quality {product.category.toLowerCase()} item that combines style and comfort.
              Perfect for any occasion!
            </p>

            <div className="mb-4">
              <label className="form-label fw-bold">Quantity:</label>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  style={{ width: '80px', textAlign: 'center' }}
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>
              <button
                className="btn btn-outline-danger btn-lg"
                onClick={() => {
                  addToWishlist(product);
                  alert('Added to Wishlist ❤️');
                }}
              >
                ❤️ Add to Wishlist
              </button>
            </div>

            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="fw-bold">Product Features:</h6>
              <ul className="mb-0">
                <li>Premium Quality Material</li>
                <li>Comfortable Fit</li>
                <li>Trendy Design</li>
                <li>Easy Care & Maintenance</li>
                <li>Free Shipping on Orders Above ₹500</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white mt-5 p-4 text-center">
        © 2026 FashionKart
      </footer>
    </div>
  );
};

export default ProductDetails;
