import { useSnapshot } from 'valtio';

import state from '../store';
import { updateAccount } from '../store/account';

const Cart = () => {
  const snap = useSnapshot(state);
  const subtotal = snap.cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const updateQuantity = (id, amount) => {
    const item = state.cart.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity += amount;
    if (item.quantity <= 0) state.cart = state.cart.filter((entry) => entry.id !== id);
    if (state.user?.role === 'customer') updateAccount(state.user.email, { cart: [...state.cart] });
  };

  return (
    <main className="commerce-page">
      <header className="commerce-header"><button className="brand" onClick={() => { state.screen = 'shop'; state.intro = true; }}><span className="brand-mark">/</span>THREADFORM</button><span className="checkout-progress">01 / BAG</span></header>
      <section className="cart-layout">
        <div><button className="back-link" onClick={() => { state.screen = 'shop'; state.intro = true; }}>&lt;- Continue shopping</button><p className="eyebrow">Your selection</p><h1>Your bag <span>({snap.cart.length})</span></h1>
          {snap.cart.length === 0 ? <div className="empty-state"><h2>Your bag is waiting.</h2><p>Add a custom tee and it will appear here.</p><button className="primary-action" onClick={() => { state.screen = 'shop'; state.intro = true; }}>Browse tees <span>-&gt;</span></button></div> : <div className="cart-items">{snap.cart.map((item) => <article className="cart-item" key={item.id}><div className="cart-swatch" style={{ backgroundColor: item.color }}><span style={{ color: item.accent }}>TF</span></div><div className="cart-item-details"><div><h3>{item.name}</h3><p>Size {item.size} / Custom color</p></div><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong><div className="quantity-control"><button onClick={() => updateQuantity(item.id, -1)}>-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)}>+</button></div></div></article>)}</div>}
        </div>
        <aside className="order-summary"><p className="eyebrow">Summary</p><div><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><div><span>Shipping</span><span>{subtotal > 0 ? 'Free' : '-'}</span></div><div className="summary-total"><span>Total</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><button className="primary-action full-width" disabled={!snap.cart.length} onClick={() => { state.screen = 'checkout'; }}>Checkout <span>-&gt;</span></button><small>Taxes calculated at checkout. Secure payment.</small></aside>
      </section>
    </main>
  );
};

export default Cart;
