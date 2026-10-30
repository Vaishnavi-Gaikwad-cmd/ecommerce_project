import { proxy } from 'valtio';
import { getSession, findAccount } from './account';

const session = getSession();
const savedAccount = session?.role === 'customer' ? findAccount(session.email) : null;

const state = proxy({
  intro: true,
  screen: 'shop',
  user: session || null,
  authMode: 'customer',
  selectedProduct: {
    id: 'classic-tee',
    type: 'T-shirt',
    name: 'Classic Heavyweight Tee',
    price: 2499,
    color: '#e9e4dc',
    accent: '#161616',
  },
  selectedSize: 'M',
  cart: savedAccount?.cart || [],
  wishlist: savedAccount?.wishlist || [],
  inspirations: savedAccount?.inspirations || [],
  customerOrders: savedAccount?.orders || [],
  shippingDetails: savedAccount?.shippingDetails || {},
  orderNumber: '',
  orders: [
    { id: 'TF-104892', customer: 'Aarav Mehta', date: '23 Sep 2026', payment: 'Paid', shipping: 'Shipped', total: 2799 },
    { id: 'TF-104891', customer: 'Mira Shah', date: '22 Sep 2026', payment: 'Paid', shipping: 'Processing', total: 4998 },
    { id: 'TF-104890', customer: 'Rohan Iyer', date: '21 Sep 2026', payment: 'Paid', shipping: 'Shipped', total: 3199 },
    { id: 'TF-104889', customer: 'Ananya Rao', date: '20 Sep 2026', payment: 'Pending', shipping: 'Processing', total: 2499 },
  ],
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',
});

export default state;