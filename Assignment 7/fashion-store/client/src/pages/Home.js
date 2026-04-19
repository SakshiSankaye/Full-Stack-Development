import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import { CartContext } from '../context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const filterCategory = (category) => {
    setSelectedCategory(category);
    if (category === null) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  if (loading) return <div className="text-center mt-5"><h3>Loading...</h3></div>;

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="banner text-white text-center d-flex align-items-center"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh'
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">Big Fashion Sale 2026</h1>
          <p className="lead">Up to 60% Off on Top Brands</p>
          <button
            className="btn btn-warning btn-lg"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* CATEGORIES */}
      <div className="container mt-4">
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => filterCategory(null)}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => filterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="container mt-5 mb-5">
        <h3 className="mb-4">Trending Products</h3>
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

      {/* FOOTER */}
      <footer className="bg-dark text-white mt-5 p-4 text-center">
        <p>© 2026 FashionKart | Designed for Modern Shopping</p>
        <p>
          <a href="/" className="text-white me-3">
            Home
          </a>
          <a href="/products" className="text-white me-3">
            Products
          </a>
          <a href="/cart" className="text-white">
            Cart
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
