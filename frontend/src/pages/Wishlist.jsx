import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import Loader from '../components/Common/Loader';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, userInfo]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  if (loading) {
    return <Loader />;
  }

  if (!wishlist || wishlist.products?.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>♥</div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Your wishlist is empty
        </h2>
        <p style={{ marginBottom: '2rem' }}>Start adding items you love to your wishlist!</p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const styles = {
    container: {
      maxWidth: '1280px',
      margin: '2rem auto',
      padding: '0 1rem',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    imageContainer: {
      height: '16rem',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    info: {
      padding: '1rem',
    },
    productName: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#1f2937',
      marginBottom: '0.5rem',
      textDecoration: 'none',
    },
    price: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#4f46e5',
      marginBottom: '0.5rem',
    },
    removeBtn: {
      width: '100%',
      marginTop: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Wishlist ({wishlist.products.length})</h1>

      <div className="grid grid-cols-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {wishlist.products.map(product => (
          <div key={product._id} style={styles.productCard}>
            <Link to={`/product/${product._id}`}>
              <div style={styles.imageContainer}>
                <img src={product.images[0]?.url} alt={product.name} style={styles.image} />
              </div>
            </Link>
            <div style={styles.info}>
              <Link to={`/product/${product._id}`} style={styles.productName}>
                {product.name}
              </Link>
              <div style={styles.price}>₹{product.price.toLocaleString()}</div>
              <button
                onClick={() => handleRemove(product._id)}
                className="btn-danger"
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;