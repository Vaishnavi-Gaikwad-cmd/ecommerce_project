import { useState } from 'react';
import { useSnapshot } from 'valtio';

import state from '../store';
import { updateAccount } from '../store/account';
import config from '../config/config';

const Checkout = () => {
  const snap = useSnapshot(state);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const total = snap.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setEmailStatus('');
    const shippingDetails = Object.fromEntries(new FormData(event.currentTarget).entries());
    state.orderNumber = `TF-${Math.floor(100000 + Math.random() * 899999)}`;
    const trackingNumber = `TFTRK${Math.floor(10000000 + Math.random() * 89999999)}`;
    state.orders.unshift({
      id: state.orderNumber,
      trackingNumber,
      email: shippingDetails.email || state.user?.email,
      customer: state.user?.name || state.user?.email || 'Guest customer',
      paymentMethod,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      payment: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      shipping: 'Processing',
      total,
    });
    const customerOrders = [{ id: state.orderNumber, trackingNumber, paymentMethod, payment: paymentMethod === 'cod' ? 'Pending' : 'Paid', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), shipping: 'Processing', total }, ...state.customerOrders];
    state.customerOrders = customerOrders;
    if (state.user?.role === 'customer') updateAccount(state.user.email, { orders: customerOrders, shippingDetails });
    if (state.user?.role === 'customer') {
      try {
        const response = await fetch(`${config.ordersUrl}/confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: shippingDetails.email || state.user.email, orderNumber: state.orderNumber, trackingNumber, total, paymentMethod, shipping: shippingDetails }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Email delivery failed.');
        setEmailStatus(`Tracking email sent to ${shippingDetails.email || state.user.email}.`);
      } catch (error) {
        setEmailStatus(`Order saved, but the tracking email was not sent: ${error.message}`);
      }
    }
    state.cart = [];
    if (state.user?.role === 'customer') updateAccount(state.user.email, { cart: [] });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return <main className="success-page"><div className="success-mark">OK</div><p className="eyebrow">Order confirmed</p><h1>Made real.</h1><p>Your custom tee is in the queue. We will send tracking details to your inbox when it ships.</p><strong>Order {snap.orderNumber}</strong><p className={emailStatus.startsWith('Tracking') ? 'email-success' : 'email-warning'}>{emailStatus}</p><button className="primary-action" onClick={() => { state.screen = 'shop'; state.intro = true; }}>Back to shop <span>-&gt;</span></button></main>;

  return <main className="commerce-page"><header className="commerce-header"><button className="brand" onClick={() => { state.screen = 'shop'; state.intro = true; }}><span className="brand-mark">/</span>THREADFORM</button><span className="checkout-progress">02 / CHECKOUT</span></header><section className="checkout-layout"><form className="checkout-form" onSubmit={placeOrder}><button type="button" className="back-link" onClick={() => { state.screen = 'cart'; }}>&lt;- Back to bag</button><p className="eyebrow">Almost yours</p><h1>Delivery details</h1><div className="form-grid"><label>First name<input required name="firstName" autoComplete="given-name" /></label><label>Last name<input required name="lastName" autoComplete="family-name" /></label><label className="span-two">Email<input required type="email" name="email" autoComplete="email" defaultValue={snap.user?.email || ''} /></label><label className="span-two">Address<input required name="address" autoComplete="street-address" /></label><label>City<input required name="city" /></label><label>Postal code<input required name="postal" /></label></div><h2>Payment method</h2><div className="payment-methods">{[['upi', 'UPI', 'Google Pay, PhonePe, Paytm'], ['qr', 'QR scanner', 'Scan and pay instantly'], ['netbanking', 'Net banking', 'All major Indian banks'], ['cod', 'Cash on delivery', 'Pay when your tee arrives']].map(([value, label, description]) => <button type="button" key={value} className={`payment-option ${paymentMethod === value ? 'selected' : ''}`} onClick={() => setPaymentMethod(value)}><span className="payment-radio" /><span><b>{label}</b><small>{description}</small></span></button>)}</div>{paymentMethod === 'upi' && <div className="payment-instruction">Enter your UPI ID or complete payment in your UPI app after placing the order.</div>}{paymentMethod === 'qr' && <div className="qr-placeholder"><span>QR</span><p>Your payment QR will appear here after order confirmation.</p></div>}{paymentMethod === 'netbanking' && <div className="payment-instruction">You will be redirected to your bank's secure login after placing the order.</div>}{paymentMethod === 'cod' && <div className="payment-instruction">Pay in cash when your order is delivered. A small confirmation call may be required.</div>}<button className="primary-action full-width" type="submit" disabled={submitting}>{submitting ? 'Sending confirmation...' : 'Place order'} <span>-&gt;</span></button></form><aside className="order-summary checkout-summary"><p className="eyebrow">In your bag</p>{snap.cart.map((item) => <div className="checkout-item" key={item.id}><span>{item.name} x {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></div>)}<div className="summary-total"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div><small>Free shipping on every custom tee.</small></aside></section></main>;
};

export default Checkout;
