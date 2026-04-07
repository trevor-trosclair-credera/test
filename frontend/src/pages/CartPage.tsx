import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="loading">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.productImageUrl || 'https://via.placeholder.com/80x80'}
                alt={item.productName}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.productName}</h3>
                <p className="cart-item-price">${item.unitPrice.toFixed(2)} each</p>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => updateItem(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-subtotal">
                ${item.subtotal.toFixed(2)}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
