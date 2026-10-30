import { motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import { updateAccount } from '../store/account';

const products = [
  {
    id: 'classic-tee',
    type: 'T-shirt',
    name: 'Classic Heavyweight Tee',
    description: 'A substantial everyday tee, cut for a relaxed fit.',
    price: 2499,
    color: '#e9e4dc',
    accent: '#161616',
    label: 'Best seller',
  },
  {
    id: 'studio-hoodie',
    type: 'Hoodie',
    name: 'Studio Oversized Hoodie',
    description: 'A soft, heavyweight layer with room for your loudest ideas.',
    price: 3999,
    color: '#d7e4dc',
    accent: '#193a2a',
    label: 'New season',
  },
  {
    id: 'limited-jacket',
    type: 'Jacket',
    name: 'Limited Zip Jacket',
    description: 'A numbered, structured layer for one-off designs.',
    price: 4999,
    color: '#e6d7d5',
    accent: '#582b2b',
    label: 'Limited run',
  },
];

const ProductIcon = ({ type, accent }) => {
  if (type === 'Hoodie') {
    return (
      <svg className="product-icon hoodie-icon" viewBox="0 0 180 210" role="img" aria-label="Hoodie illustration">
        <path d="M62 40c5-18 16-28 28-28s23 10 28 28l26 13 24 32-20 16-12-16v105H44V85L32 101 12 85l24-32 26-13Z" fill={accent} />
        <path d="M62 40c7 12 16 18 28 18s21-6 28-18" fill="none" stroke="white" strokeOpacity=".65" strokeWidth="4" />
        <path d="M71 54v28l19 17 19-17V54" fill="none" stroke="white" strokeOpacity=".5" strokeWidth="3" />
        <path d="M62 143h56" stroke="white" strokeOpacity=".35" strokeWidth="3" />
      </svg>
    );
  }

  if (type === 'Jacket') {
    return (
      <svg className="product-icon jacket-icon" viewBox="0 0 180 210" role="img" aria-label="Jacket illustration">
        <path d="M61 25 90 38l29-13 27 28 20 38-23 13-12-22v101H49V79L37 101 14 88l20-35 27-28Z" fill={accent} />
        <path d="M90 38v142M73 45l17 15 17-15M61 117h22M97 117h22" fill="none" stroke="white" strokeOpacity=".65" strokeWidth="4" />
        <circle cx="90" cy="76" r="3" fill="white" fillOpacity=".75" />
        <circle cx="90" cy="94" r="3" fill="white" fillOpacity=".75" />
      </svg>
    );
  }

  return (
    <svg className="product-icon tee-icon" viewBox="0 0 180 210" role="img" aria-label="T-shirt illustration">
      <path d="M60 24 90 38l30-14 28 27 20 34-23 14-13-21v98H48V78L35 99 12 85l20-34 28-27Z" fill={accent} />
      <path d="M60 24c5 17 15 25 30 25s25-8 30-25" fill="none" stroke="white" strokeOpacity=".55" strokeWidth="4" />
    </svg>
  );
};

const Storefront = () => {
  const snap = useSnapshot(state);
  const cartCount = snap.cart.reduce((total, item) => total + item.quantity, 0);

  const customize = (product) => {
    state.selectedProduct = product;
    state.intro = false;
    state.screen = 'customizer';
  };

  const toggleWishlist = (product) => {
    if (!snap.user) {
      state.authMode = 'customer';
      state.screen = 'auth';
      return;
    }
    const exists = snap.wishlist.some((item) => item.id === product.id);
    const wishlist = exists ? state.wishlist.filter((item) => item.id !== product.id) : [...state.wishlist, product];
    state.wishlist = wishlist;
    updateAccount(snap.user.email, { wishlist });
  };

  return (
    <main className="storefront">
      <nav className="store-nav">
        <button className="brand" onClick={() => { state.screen = 'shop'; state.intro = true; }}>
          <span className="brand-mark">/</span>
          THREADFORM
        </button>
        <div className="nav-links">
          <a href="#shop">Shop</a>
          <a href="#story">Our materials</a>
        </div>
        <button className="cart-button" onClick={() => { state.screen = 'cart'; }}>
          Bag <span>{String(cartCount).padStart(2, '0')}</span>
        </button>
        <button className="sign-in-link" onClick={() => { state.screen = snap.user ? 'account' : 'auth'; state.authMode = 'customer'; }}>{snap.user ? 'Account' : 'Sign in'}</button>
      </nav>

      <section className="store-hero">
        <div className="hero-copy">
          <p className="eyebrow">Wear your point of view</p>
          <h1>Make it yours.<br /><em>Then make it real.</em></h1>
          <p className="hero-description">Premium blank tees, built for the designs that only exist in your head. Customize every detail and we will print, pack, and ship it to your door.</p>
          <button className="primary-action" onClick={() => customize(products[0])}>Start designing <span>-&gt;</span></button>
        </div>
        <div className="hero-art" aria-label="Abstract shirt preview">
          <div className="hero-shirt"><span>YOUR<br />IDEA</span></div>
          <div className="hero-stamp">01<br /><small>MAKE<br />MATTER</small></div>
        </div>
      </section>

      <section className="product-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">The blanks</p><h2>Start with a great base.</h2></div>
          <p>Three weights. Zero compromises.<br />All ready for your signature.</p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <motion.article className="product-card" key={product.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
              <div className="product-visual" style={{ backgroundColor: product.color }}>
                <ProductIcon type={product.type} accent={product.accent} />
                <span className="product-label">{product.label}</span>
              </div>
              <div className="product-info">
                <div><h3>{product.name}</h3><p>{product.description}</p></div>
                <strong>₹{product.price.toLocaleString('en-IN')}</strong>
              </div>
              <div className="product-actions"><button className="product-action" onClick={() => customize(product)}>Customize this {product.type.toLowerCase()} <span>-&gt;</span></button><button className={`wishlist-action ${snap.wishlist.some((item) => item.id === product.id) ? 'saved' : ''}`} aria-label="Save to wishlist" onClick={() => toggleWishlist(product)}>♡</button></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="material-section" id="story">
        <div><p className="eyebrow">Made to be worn</p><h2>Good design deserves<br />good material.</h2></div>
        <p>Our tees use heavyweight, combed cotton that holds its shape and your print. No throwaway blanks, no mystery blends, no shortcuts between your screen and your doorstep.</p>
        <div className="material-stats"><span><b>100%</b> combed cotton</span><span><b>240gsm</b> heavyweight feel</span><span><b>30 day</b> easy returns</span></div>
      </section>

      <footer className="store-footer"><span>THREADFORM / 2026</span><span>Designed by you. Printed by us.</span><button onClick={() => { state.authMode = 'admin'; state.screen = 'auth'; }}>Admin access</button></footer>
    </main>
  );
};

export { products };
export default Storefront;
