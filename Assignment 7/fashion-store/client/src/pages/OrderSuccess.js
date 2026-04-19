import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderSuccess = () => {
  const [orderId] = useState(Math.floor(Math.random() * 1000000));
  const navigate = useNavigate();

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        minHeight: '100vh',
        textAlign: 'center'
      }}
    >
      <div
        className="card"
        style={{
          width: '400px',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.6s ease-in-out'
        }}
      >
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
        <h1 className="text-success mb-3">Order Placed Successfully!</h1>
        <p className="lead mb-4">
          Your Order ID: <strong>{orderId}</strong>
        </p>
        <p className="text-muted mb-4">
          Thank you for your purchase. Your order has been confirmed and will be delivered soon.
        </p>
        <button
          className="btn btn-primary btn-lg w-100"
          onClick={() => navigate('/')}
          style={{ borderRadius: '8px' }}
        >
          Back to Home
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
