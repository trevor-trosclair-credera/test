import React, { useEffect, useState } from 'react';
import { getOrders } from '../api/client';
import type { Order } from '../types';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You have no orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="order-meta">
                  <span
                    className="order-status"
                    style={{ backgroundColor: STATUS_COLORS[order.status] ?? '#6b7280' }}
                  >
                    {order.status}
                  </span>
                  <span className="order-total">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <span>{item.productName}</span>
                    <span>
                      {item.quantity} × ${item.unitPrice.toFixed(2)} = ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              {order.shippingAddress && (
                <p className="order-address">📦 {order.shippingAddress}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
