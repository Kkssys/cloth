import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import MobileBottomNav from './components/Layout/MobileBottomNav';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/Common/PrivateRoute';
import AdminRoute from './components/Common/AdminRoute';
import Dashboard from './pages/Admin/Dashboard';
import ProductList from './pages/Admin/ProductList';
import Orders from './pages/Admin/Orders';

function App() {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ 
        minHeight: 'calc(100vh - 8rem)', 
        paddingBottom: isMobile ? '70px' : '0' 
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Route>
          
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/orders" element={<Orders />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
      <Toaster position="top-right" />
    </>
  );
}

export default App;