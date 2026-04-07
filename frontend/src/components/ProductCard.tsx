import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <div className="product-info">
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        <Link to={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-description">{product.description?.slice(0, 80)}...</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
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

export default ProductCard;
