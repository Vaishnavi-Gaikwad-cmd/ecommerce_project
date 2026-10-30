import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Storefront from './pages/Storefront';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Account from './pages/Account';
import { useSnapshot } from 'valtio';
import state from './store';

function App() {
  const snap = useSnapshot(state);

  if (snap.screen === 'cart') return <Cart />;
  if (snap.screen === 'checkout') return <Checkout />;
  if (snap.screen === 'auth') return <Auth />;
  if (snap.screen === 'admin') return <AdminDashboard />;
  if (snap.screen === 'account') return <Account />;
  if (snap.screen === 'customizer') {
    return <main className="app transition-all ease-in"><Canvas /><Customizer /></main>;
  }

  return (
    <Storefront />
  )
}

export default App
