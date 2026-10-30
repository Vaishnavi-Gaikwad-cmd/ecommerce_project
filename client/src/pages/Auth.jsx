import { useState } from 'react';
import state from '../store';
import { findAccount, saveAccount, saveSession } from '../store/account';

const ADMIN_EMAIL = 'vaishnavi4943@gmail.com';
const ADMIN_PASSWORD = 'asdf@1234';

const Auth = () => {
  const [mode, setMode] = useState(state.authMode || 'customer');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (mode === 'admin') {
      if (form.email.toLowerCase() !== ADMIN_EMAIL || form.password !== ADMIN_PASSWORD) {
        setError('Admin email or password is incorrect.');
        return;
      }
      state.user = { role: 'admin', email: form.email };
      state.screen = 'admin';
      return;
    }
    if (!form.email || !form.password) {
      setError('Enter your email and password to continue.');
      return;
    }
    const existingAccount = findAccount(form.email);
    if (existingAccount && existingAccount.password !== form.password) {
      setError('That password does not match this account.');
      return;
    }
    const account = existingAccount || {
      email: form.email.toLowerCase(),
      password: form.password,
      name: form.name || form.email.split('@')[0],
      wishlist: [],
      inspirations: [],
      orders: [],
      shippingDetails: {},
    };
    saveAccount(account);
    saveSession({ role: 'customer', email: account.email, name: account.name });
    state.user = { role: 'customer', email: account.email, name: account.name };
    state.cart = account.cart || [];
    state.wishlist = account.wishlist || [];
    state.inspirations = account.inspirations || [];
    state.customerOrders = account.orders || [];
    state.shippingDetails = account.shippingDetails || {};
    state.screen = 'shop';
    state.intro = true;
  };

  return (
    <main className="auth-page">
      <div className="auth-aside"><button className="brand light-brand" onClick={() => { state.screen = 'shop'; state.intro = true; }}><span className="brand-mark">/</span>THREADFORM</button><div><p className="eyebrow">Make it matter</p><h1>Good ideas<br /><em>need a body.</em></h1></div><span className="auth-note">Custom apparel, made personal.</span></div>
      <section className="auth-panel"><button className="back-link" onClick={() => { state.screen = 'shop'; state.intro = true; }}>&lt;- Back to shop</button><div className="auth-heading"><p className="eyebrow">{mode === 'admin' ? 'Private workspace' : 'Your account'}</p><h2>{mode === 'admin' ? 'Admin sign in' : 'Welcome back.'}</h2><p>{mode === 'admin' ? 'Manage orders, payments, and fulfilment.' : 'Sign in to keep your designs and orders together.'}</p></div><div className="auth-switcher"><button className={mode === 'customer' ? 'active' : ''} onClick={() => { setMode('customer'); setError(''); }}>Customer</button><button className={mode === 'admin' ? 'active' : ''} onClick={() => { setMode('admin'); setError(''); }}>Admin</button></div><form className="auth-form" onSubmit={submit}>{mode === 'customer' && <label>Name (optional)<input name="name" value={form.name} onChange={updateField} autoComplete="name" /></label>}<label>Email<input required type="email" name="email" value={form.email} onChange={updateField} autoComplete="email" /></label><label>Password<input required type="password" name="password" value={form.password} onChange={updateField} autoComplete={mode === 'admin' ? 'current-password' : 'new-password'} /></label>{error && <p className="form-error">{error}</p>}<button className="primary-action full-width" type="submit">{mode === 'admin' ? 'Open dashboard' : 'Sign in'} <span>-&gt;</span></button></form>{mode === 'customer' && <p className="auth-footnote">New here? Your account is created when you sign in.</p>}</section>
    </main>
  );
};

export default Auth;
