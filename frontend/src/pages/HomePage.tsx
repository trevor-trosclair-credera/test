import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/client';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Footwear', 'Sports', 'Kitchen', 'Books', 'Accessories'];

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params: { category?: string; search?: string } = {};
      if (search.trim()) params.search = search.trim();
      else if (selectedCategory !== 'All') params.category = selectedCategory;
      const res = await getProducts(params);
      setProducts(res.data);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to ShopEase</h1>
        <p>Discover amazing products at great prices</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </section>

      <section className="category-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => { setSelectedCategory(cat); setSearch(''); }}
          >
            {cat}
          </button>
        ))}
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
