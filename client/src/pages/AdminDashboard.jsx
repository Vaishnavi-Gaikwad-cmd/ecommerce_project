import { useSnapshot } from 'valtio';

import state from '../store';
import { updateAccountOrderStatus } from '../store/account';

const AdminDashboard = () => {
  const snap = useSnapshot(state);
  const revenue = snap.orders.reduce((sum, order) => sum + order.total, 0);
  const paid = snap.orders.filter((order) => order.payment === 'Paid').length;
  const shipped = snap.orders.filter((order) => order.shipping === 'Shipped').length;

  const updateShipping = (orderId, shipping) => {
    const order = state.orders.find((entry) => entry.id === orderId);
    if (!order) return;
    order.shipping = shipping;
    if (order.email) updateAccountOrderStatus(order.email, orderId, shipping);
  };

  const logout = () => {
    state.user = null;
    state.screen = 'shop';
    state.intro = true;
  };

  return <main className="admin-page"><header className="admin-header"><button className="brand" onClick={() => { state.screen = 'shop'; state.intro = true; }}><span className="brand-mark">/</span>THREADFORM <small>ADMIN</small></button><div className="admin-user"><span>{snap.user?.email}</span><button onClick={logout}>Sign out</button></div></header><section className="admin-content"><div className="admin-title"><div><p className="eyebrow">Operations overview</p><h1>Good morning,<br /><em>Vaishnavi.</em></h1></div><button className="primary-action" onClick={() => { state.screen = 'shop'; state.intro = true; }}>View storefront <span>-&gt;</span></button></div><div className="metric-grid"><article><span>Gross revenue</span><strong>₹{revenue.toLocaleString('en-IN')}</strong><small>Across all orders</small></article><article><span>Total orders</span><strong>{snap.orders.length}</strong><small>+12% this month</small></article><article><span>Paid orders</span><strong>{paid}</strong><small>Payment collection</small></article><article><span>Shipped</span><strong>{shipped}</strong><small>Fulfilment progress</small></article></div><section className="orders-panel"><div className="panel-heading"><div><p className="eyebrow">Fulfilment</p><h2>Recent orders</h2></div><span>{snap.orders.length} orders</span></div><div className="orders-table"><div className="table-row table-head"><span>Order</span><span>Customer</span><span>Payment</span><span>Shipping</span><span>Total</span></div>{snap.orders.map((order) => <div className="table-row" key={order.id}><span><b>{order.id}</b><small>{order.date}</small></span><span>{order.customer}</span><span><i className={`status-dot ${order.payment.toLowerCase()}`} />{order.payment}<small className="payment-method-label">{order.paymentMethod || 'Legacy order'}</small></span><span className="shipping-cell"><i className={`status-dot ${order.shipping.toLowerCase()}`} /><select value={order.shipping} onChange={(event) => updateShipping(order.id, event.target.value)} aria-label={`Shipping status for ${order.id}`}><option>Processing</option><option>Shipped</option><option>Delivered</option></select></span><strong>₹{order.total.toLocaleString('en-IN')}</strong></div>)}</div></section></section></main>;
};

export default AdminDashboard;
