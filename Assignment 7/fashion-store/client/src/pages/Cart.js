import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const { cart, removeFromCart, updateQty, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">My Cart</span>
        </div>
      </nav>

      <div className="container mt-5 mb-5">
        <h2 className="mb-4">My Cart</h2>

        {cart.length === 0 ? (
          <div className="alert alert-info">
            <h5>Your cart is empty</h5>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div id="cart-items">
              {cart.map((item, index) => (
                <div key={item._id} className="card p-3 mb-3 shadow-sm">
                  <div className="row align-items-center">
                    <div className="col-md-3 text-center">
                      <img
                        src={item.image}
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        alt={item.name}
                      />
                    </div>

                    <div className="col-md-3">
                      <h6>{item.name}</h6>
                      <p className="text-success fw-bold">₹{item.price}</p>
                    </div>

                    <div className="col-md-3 d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary me-2"
                        onClick={() => updateQty(item._id, (item.qty || 1) - 1)}
                      >
                        -
                      </button>
                      <span>{item.qty || 1}</span>
                      <button
                        className="btn btn-outline-secondary ms-2"
                        onClick={() => updateQty(item._id, (item.qty || 1) + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="col-md-3 text-end">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-3 mt-3 shadow">
              <h4>Total: ₹<span id="total-price">{getTotalPrice()}</span></h4>
              <button className="btn btn-success w-100 mt-2" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <footer className="bg-dark text-white mt-5 p-4 text-center">
        © 2026 FashionKart
      </footer>
    </div>
  );
};

export default Cart;
