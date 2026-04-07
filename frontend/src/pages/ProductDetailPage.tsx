import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/client';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!id) return;
    getProduct(Number(id))
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product!.id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Failed to add to cart.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return null;

  return (
    <div className="product-detail-page">
      <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="product-detail">
        <div className="product-detail-image">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.name}
          />
        </div>
        <div className="product-detail-info">
          {product.category && (
            <span className="product-category">{product.category}</span>
          )}
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className={`stock-status ${product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stockQuantity > 0 ? `✓ In Stock (${product.stockQuantity} available)` : '✗ Out of Stock'}
          </p>
          {product.stockQuantity > 0 && (
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}>+</button>
              </div>
            </div>
          )}
          {message && <div className="alert alert-success">{message}</div>}
          <button
            className="btn btn-primary btn-large"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
