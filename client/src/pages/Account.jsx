import { useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { clearSession, updateAccount } from '../store/account';

const Account = () => {
  const snap = useSnapshot(state);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [shipping, setShipping] = useState({ ...snap.shippingDetails });
  const orders = snap.customerOrders;

  const logout = () => {
    clearSession();
    state.user = null;
    state.cart = [];
    state.wishlist = [];
    state.inspirations = [];
    state.customerOrders = [];
    state.screen = 'shop';
    state.intro = true;
  };

  const saveShipping = (event) => {
    event.preventDefault();
    state.shippingDetails = shipping;
    updateAccount(snap.user.email, { shippingDetails: shipping });
    setMessage('Shipping details saved.');
  };

  const removeWishlistItem = (id) => {
    const wishlist = state.wishlist.filter((item) => item.id !== id);
    state.wishlist = wishlist;
    updateAccount(snap.user.email, { wishlist });
  };

  return <main className="account-page"><header className="account-header"><button className="brand" onClick={() => { state.screen = 'shop'; state.intro = true; }}><span className="brand-mark">/</span>THREADFORM</button><div className="account-header-actions"><span>{snap.user?.email}</span><button onClick={logout}>Sign out</button></div></header><section className="account-content"><div className="account-welcome"><div><p className="eyebrow">Your space</p><h1>Hello, <em>{snap.user?.name || 'creator'}.</em></h1><p>Everything you make, save, and order in one place.</p></div><button className="primary-action" onClick={() => { state.screen = 'shop'; state.intro = true; }}>Shop tees <span>-&gt;</span></button></div><nav className="account-tabs">{[['overview', 'Overview'], ['orders', 'Orders'], ['wishlist', 'Wishlist'], ['inspirations', 'Saved inspo'], ['shipping', 'Shipping']].map(([id, label]) => <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>{label}</button>)}</nav>{message && <p className="account-message">{message}</p>}{activeTab === 'overview' && <div className="account-grid"><article className="account-card account-card-wide"><p className="eyebrow">Recent orders</p><h2>{orders.length ? `${orders.length} order${orders.length === 1 ? '' : 's'} placed` : 'Your first tee is waiting.'}</h2>{orders.length ? <div className="mini-order-list">{orders.slice(0, 3).map((order) => <div key={order.id}><span><b>{order.id}</b><small>{order.date} / {order.shipping}</small></span><strong>₹{order.total.toLocaleString('en-IN')}</strong></div>)}</div> : <button className="text-action" onClick={() => { state.screen = 'shop'; state.intro = true; }}>Start designing -&gt;</button>}</article><article className="account-card"><p className="eyebrow">Saved inspo</p><strong className="big-number">{snap.inspirations.length}</strong><p>Ideas ready for your next design.</p><button className="text-action" onClick={() => setActiveTab('inspirations')}>View saved -&gt;</button></article><article className="account-card"><p className="eyebrow">Wishlist</p><strong className="big-number">{snap.wishlist.length}</strong><p>Pieces you want to make yours.</p><button className="text-action" onClick={() => setActiveTab('wishlist')}>View wishlist -&gt;</button></article></div>}{activeTab === 'orders' && <section className="account-section"><p className="eyebrow">Order history</p><h2>Your orders</h2>{orders.length ? orders.map((order) => <div className="account-order" key={order.id}><div><b>{order.id}</b><span>{order.date}</span></div><span className="order-status">{order.shipping}</span><strong>₹{order.total.toLocaleString('en-IN')}</strong></div>) : <p className="muted-copy">No orders yet.</p>}</section>}{activeTab === 'wishlist' && <section className="account-section"><p className="eyebrow">Saved for later</p><h2>Your wishlist</h2>{snap.wishlist.length ? snap.wishlist.map((item) => <div className="account-order" key={item.id}><div><b>{item.name}</b><span>₹{item.price.toLocaleString('en-IN')}</span></div><button className="text-action" onClick={() => removeWishlistItem(item.id)}>Remove</button></div>) : <p className="muted-copy">Your wishlist is empty. Save pieces you want to customize later.</p>}</section>}{activeTab === 'inspirations' && <section className="account-section"><p className="eyebrow">Your visual library</p><h2>Saved inspirations</h2>{snap.inspirations.length ? <div className="inspo-grid">{snap.inspirations.map((inspo) => <div key={inspo.id} className="inspo-item" style={{ backgroundImage: `url(${inspo.image})` }}><span>{inspo.name}</span></div>)}</div> : <p className="muted-copy">Upload a design in the customizer and save it here for later.</p>}</section>}{activeTab === 'shipping' && <section className="account-section"><p className="eyebrow">Delivery profile</p><h2>Shipping details</h2><form className="shipping-form" onSubmit={saveShipping}><label>Full name<input required value={shipping.name || ''} onChange={(event) => setShipping({ ...shipping, name: event.target.value })} /></label><label>Address<input required value={shipping.address || ''} onChange={(event) => setShipping({ ...shipping, address: event.target.value })} /></label><label>City<input required value={shipping.city || ''} onChange={(event) => setShipping({ ...shipping, city: event.target.value })} /></label><label>Postal code<input required value={shipping.postal || ''} onChange={(event) => setShipping({ ...shipping, postal: event.target.value })} /></label><button className="primary-action" type="submit">Save details <span>-&gt;</span></button></form></section>}</section></main>;
};

export default Account;
