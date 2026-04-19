import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'COD'
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="text-center mt-5">
        <h3>Please login first</h3>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>Your cart is empty</h3>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userEmail: user.email,
        items: cart,
        total: getTotalPrice(),
        shippingDetails: formData
      };

      const response = await placeOrder(orderData);
      console.log('Order placed:', response.data);

      if (response.data && (response.data.message === 'Order Saved' || response.data.orderId)) {
        alert('Order Placed Successfully! ✅');
        clearCart();
        navigate('/order-success');
      } else {
        alert('Order placed but confirmation unclear. Please check your account.');
        clearCart();
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to place order. Please try again.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Checkout</span>
        </div>
      </nav>

      <div
        className="container mt-5 mb-5"
        style={{ background: '#f5f5f5', minHeight: '80vh' }}
      >
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}
            >
              <h3 className="mb-4 text-center">Checkout Details</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Pincode</label>
                  <input
                    type="number"
                    className="form-control"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-control"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>

                <div className="card p-3 mb-3 bg-light">
                  <p className="mb-0">
                    <strong>Order Total: ₹{getTotalPrice()}</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
