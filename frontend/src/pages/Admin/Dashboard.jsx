import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import OrderReport from '../../components/Admin/OrderReport';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Men',
    brand: '',
    price: '',
    discount: '0',
    stock: '',
    size: [],
    color: [],
  });

  const categories = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
  const brands = ['Nike', 'Adidas', 'Zara', 'H&M', "Levi's", 'Puma', 'Under Armour'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple'];
  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  const statusColors = {
    Pending: '#fef3c7',
    Processing: '#dbeafe',
    Shipped: '#d1fae5',
    Delivered: '#a7f3d0',
    Cancelled: '#fee2e2',
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    fetchDashboardData();
    fetchOrders();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const fetchDashboardData = async () => {
    try {
      let productCount = 0;
      try {
        const productsRes = await axios.get('/products?limit=1');
        productCount = productsRes.data.totalProducts || 0;
      } catch (err) {
        const allProducts = await axios.get('/products?limit=1000');
        productCount = allProducts.data.products?.length || 0;
      }
      
      setStats(prev => ({ ...prev, totalProducts: productCount }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersRes = await axios.get('/orders');
      const orders = ordersRes.data.orders || [];
      setRecentOrders(orders.slice(0, 5));
      
      const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
      const processingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
      const shippedOrders = orders.filter(o => o.orderStatus === 'Shipped').length;
      const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
      const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;
      const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      
      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        totalSales: totalSales,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeToggle = (size) => {
    const newSizes = formData.size.includes(size)
      ? formData.size.filter(s => s !== size)
      : [...formData.size, size];
    setFormData({ ...formData, size: newSizes });
  };

  const handleColorToggle = (color) => {
    const newColors = formData.color.includes(color)
      ? formData.color.filter(c => c !== color)
      : [...formData.color, color];
    setFormData({ ...formData, color: newColors });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('You can only upload up to 5 images');
      return;
    }
    
    setSelectedImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.brand || !formData.price || !formData.stock) {
      toast.error('Please fill all required fields');
      return;
    }

    setUploading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('brand', formData.brand);
      submitData.append('price', formData.price);
      submitData.append('discount', formData.discount);
      submitData.append('stock', formData.stock);
      submitData.append('size', JSON.stringify(formData.size));
      submitData.append('color', JSON.stringify(formData.color));
      
      selectedImages.forEach(image => {
        submitData.append('images', image);
      });
      
      await axios.post('/products', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Product added successfully!');
      setShowProductModal(false);
      
      setFormData({
        name: '',
        description: '',
        category: 'Men',
        brand: '',
        price: '',
        discount: '0',
        stock: '',
        size: [],
        color: [],
      });
      setSelectedImages([]);
      setImagePreviews([]);
      
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    container: { 
      padding: isMobile ? '12px' : '20px' 
    },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: isMobile ? '16px' : '30px', 
      flexWrap: 'wrap', 
      gap: isMobile ? '10px' : '15px' 
    },
    title: { 
      fontSize: isMobile ? '20px' : '28px', 
      fontWeight: 'bold', 
      color: '#1f2937' 
    },
    buttonGroup: { 
      display: 'flex', 
      gap: isMobile ? '8px' : '10px', 
      flexWrap: 'wrap',
      width: isMobile ? '100%' : 'auto',
    },
    addButton: { 
      backgroundColor: '#4f46e5', 
      color: 'white', 
      padding: isMobile ? '8px 12px' : '12px 24px', 
      border: 'none', 
      borderRadius: '8px', 
      fontSize: isMobile ? '12px' : '16px', 
      fontWeight: 'bold', 
      cursor: 'pointer',
      flex: isMobile ? 1 : 'auto',
      whiteSpace: 'nowrap',
    },
    viewProductsButton: { 
      backgroundColor: '#10b981', 
      color: 'white', 
      padding: isMobile ? '8px 12px' : '12px 24px', 
      border: 'none', 
      borderRadius: '8px', 
      fontSize: isMobile ? '12px' : '16px', 
      fontWeight: 'bold', 
      cursor: 'pointer',
      flex: isMobile ? 1 : 'auto',
      whiteSpace: 'nowrap',
    },
    viewOrdersButton: { 
      backgroundColor: '#f59e0b', 
      color: 'white', 
      padding: isMobile ? '8px 12px' : '12px 24px', 
      border: 'none', 
      borderRadius: '8px', 
      fontSize: isMobile ? '12px' : '16px', 
      fontWeight: 'bold', 
      cursor: 'pointer',
      flex: isMobile ? 1 : 'auto',
      whiteSpace: 'nowrap',
    },
    statsGrid: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: isMobile ? '12px' : '20px', 
      marginBottom: isMobile ? '20px' : '30px' 
    },
    statCard: { 
      backgroundColor: 'white', 
      padding: isMobile ? '12px' : '20px', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', 
      textAlign: 'center' 
    },
    statIcon: { 
      fontSize: isMobile ? '24px' : '32px', 
      marginBottom: isMobile ? '6px' : '10px' 
    },
    statValue: { 
      fontSize: isMobile ? '20px' : '28px', 
      fontWeight: 'bold', 
      color: '#4f46e5', 
      marginBottom: '4px' 
    },
    statLabel: { 
      color: '#6b7280', 
      fontSize: isMobile ? '11px' : '14px' 
    },
    ordersSection: { 
      backgroundColor: 'white', 
      padding: isMobile ? '12px' : '20px', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', 
      marginBottom: isMobile ? '20px' : '30px',
      overflowX: 'auto',
    },
    sectionTitle: { 
      fontSize: isMobile ? '16px' : '20px', 
      fontWeight: 'bold', 
      marginBottom: '12px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      flexWrap: 'wrap', 
      gap: '10px' 
    },
    table: { 
      width: '100%', 
      borderCollapse: 'collapse', 
      minWidth: isMobile ? '500px' : 'auto',
    },
    th: { 
      padding: isMobile ? '8px' : '12px', 
      textAlign: 'left', 
      borderBottom: '1px solid #e5e7eb', 
      fontWeight: '600',
      fontSize: isMobile ? '12px' : '14px',
    },
    td: { 
      padding: isMobile ? '8px' : '12px', 
      borderBottom: '1px solid #f3f4f6',
      fontSize: isMobile ? '11px' : '14px',
    },
    statusBadge: { 
      padding: '4px 8px', 
      borderRadius: '4px', 
      fontSize: isMobile ? '10px' : '12px', 
      display: 'inline-block' 
    },
    statusSelect: { 
      padding: isMobile ? '4px 6px' : '6px 12px', 
      border: '1px solid #d1d5db', 
      borderRadius: '4px', 
      cursor: 'pointer',
      fontSize: isMobile ? '11px' : '14px',
    },
    cancelledText: { 
      color: '#991b1b', 
      fontWeight: '500', 
      fontSize: isMobile ? '11px' : '12px' 
    },
    reportSection: { 
      marginTop: isMobile ? '16px' : '30px' 
    },
    // Modal styles remain the same
    modal: { 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 
    },
    modalContent: { 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: isMobile ? '16px' : '24px', 
      maxWidth: isMobile ? '95%' : '700px', 
      width: '90%', 
      maxHeight: '90vh', 
      overflowY: 'auto' 
    },
    modalHeader: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '16px' 
    },
    closeBtn: { 
      background: 'none', 
      border: 'none', 
      fontSize: '24px', 
      cursor: 'pointer', 
      color: '#6b7280' 
    },
    formGroup: { 
      marginBottom: '15px' 
    },
    label: { 
      display: 'block', 
      fontWeight: '500', 
      marginBottom: '5px', 
      color: '#374151' 
    },
    input: { 
      width: '100%', 
      padding: '8px 12px', 
      border: '1px solid #d1d5db', 
      borderRadius: '4px', 
      fontSize: '14px' 
    },
    select: { 
      width: '100%', 
      padding: '8px 12px', 
      border: '1px solid #d1d5db', 
      borderRadius: '4px', 
      fontSize: '14px' 
    },
    textarea: { 
      width: '100%', 
      padding: '8px 12px', 
      border: '1px solid #d1d5db', 
      borderRadius: '4px', 
      fontSize: '14px', 
      minHeight: '80px' 
    },
    row: { 
      display: 'flex', 
      gap: '10px', 
      flexWrap: 'wrap' 
    },
    halfWidth: { 
      flex: 1, 
      minWidth: '150px' 
    },
    sizeButtons: { 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '8px', 
      marginTop: '5px' 
    },
    sizeBtn: { 
      padding: '6px 12px', 
      border: '1px solid #d1d5db', 
      backgroundColor: 'white', 
      borderRadius: '4px', 
      cursor: 'pointer' 
    },
    activeSizeBtn: { 
      backgroundColor: '#4f46e5', 
      color: 'white', 
      borderColor: '#4f46e5' 
    },
    colorButtons: { 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '8px', 
      marginTop: '5px' 
    },
    colorBtn: { 
      width: '36px', 
      height: '36px', 
      borderRadius: '50%', 
      border: '2px solid #d1d5db', 
      cursor: 'pointer' 
    },
    activeColorBtn: { 
      borderColor: '#4f46e5', 
      boxShadow: '0 0 0 2px rgba(79,70,229,0.5)' 
    },
    imageUploadArea: { 
      border: '2px dashed #d1d5db', 
      borderRadius: '8px', 
      padding: '20px', 
      textAlign: 'center', 
      cursor: 'pointer', 
      backgroundColor: '#f9fafb' 
    },
    imagePreviewContainer: { 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '10px', 
      marginTop: '10px' 
    },
    imagePreview: { 
      position: 'relative', 
      width: '80px', 
      height: '80px', 
      borderRadius: '4px', 
      overflow: 'hidden', 
      border: '1px solid #e5e7eb' 
    },
    previewImg: { 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover' 
    },
    removeImageBtn: { 
      position: 'absolute', 
      top: '-5px', 
      right: '-5px', 
      backgroundColor: '#ef4444', 
      color: 'white', 
      borderRadius: '50%', 
      width: '20px', 
      height: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontSize: '12px', 
      cursor: 'pointer', 
      border: 'none' 
    },
    submitBtn: { 
      width: '100%', 
      backgroundColor: '#4f46e5', 
      color: 'white', 
      padding: '12px', 
      border: 'none', 
      borderRadius: '6px', 
      fontSize: '16px', 
      fontWeight: 'bold', 
      cursor: 'pointer', 
      marginTop: '10px' 
    },
    submitBtnDisabled: { 
      width: '100%', 
      backgroundColor: '#9ca3af', 
      color: 'white', 
      padding: '12px', 
      border: 'none', 
      borderRadius: '6px', 
      fontSize: '16px', 
      fontWeight: 'bold', 
      cursor: 'not-allowed', 
      marginTop: '10px' 
    },
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.buttonGroup}>
          <button style={styles.addButton} onClick={() => setShowProductModal(true)}>
            {isMobile ? '➕ Add' : '➕ Add Product'}
          </button>
          <button style={styles.viewProductsButton} onClick={() => navigate('/admin/products')}>
            {isMobile ? '📦 Products' : '📦 Products'}
          </button>
          <button style={styles.viewOrdersButton} onClick={() => navigate('/admin/orders')}>
            {isMobile ? '📋 Orders' : '📋 All Orders'}
          </button>
        </div>
      </div>

      {/* Stats Cards - 2 per row on mobile */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}><div style={styles.statIcon}>💰</div><div style={styles.statValue}>₹{stats.totalSales.toLocaleString()}</div><div style={styles.statLabel}>Total Sales</div></div>
        <div style={styles.statCard}><div style={styles.statIcon}>📦</div><div style={styles.statValue}>{stats.totalOrders}</div><div style={styles.statLabel}>Total Orders</div></div>
        <div style={styles.statCard}><div style={styles.statIcon}>⭐</div><div style={styles.statValue}>{stats.totalProducts}</div><div style={styles.statLabel}>Total Products</div></div>
        <div style={styles.statCard}><div style={styles.statIcon}>⏳</div><div style={styles.statValue}>{stats.pendingOrders}</div><div style={styles.statLabel}>Pending Orders</div></div>
      </div>

      {/* Order Status Breakdown - 2 per row on mobile */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}><div style={styles.statIcon}>⚙️</div><div style={styles.statValue}>{stats.processingOrders}</div><div style={styles.statLabel}>Processing</div></div>
        <div style={styles.statCard}><div style={styles.statIcon}>🚚</div><div style={styles.statValue}>{stats.shippedOrders}</div><div style={styles.statLabel}>Shipped</div></div>
        <div style={styles.statCard}><div style={styles.statIcon}>✅</div><div style={styles.statValue}>{stats.deliveredOrders}</div><div style={styles.statLabel}>Delivered</div></div>
        <div style={styles.statCard}><div style={styles.statIcon}>❌</div><div style={styles.statValue}>{stats.cancelledOrders}</div><div style={styles.statLabel}>Cancelled</div></div>
      </div>

      {/* Recent Orders Section */}
      <div style={styles.ordersSection}>
        <div style={styles.sectionTitle}>
          <span>Recent Orders</span>
          <button onClick={() => navigate('/admin/orders')} style={styles.viewOrdersButton}>
            View All →
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>No orders yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => {
                  const isCancelled = order.orderStatus === 'Cancelled';
                  
                  return (
                    <tr key={order._id}>
                      <td style={styles.td}>{order._id?.slice(-8)}</td>
                      <td style={styles.td}>{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</td>
                      <td style={styles.td}>₹{(order.totalPrice || 0).toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, backgroundColor: statusColors[order.orderStatus] || '#e5e7eb' }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {isCancelled ? (
                          <span style={styles.cancelledText}>❌ Cancelled</span>
                        ) : (
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            style={styles.statusSelect}
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Report Section */}
      <div style={styles.reportSection}>
        <OrderReport />
      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div style={styles.modal} onClick={() => setShowProductModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Add New Product</h2>
              <button onClick={() => setShowProductModal(false)} style={styles.closeBtn}>×</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={styles.input} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} style={styles.textarea} required />
              </div>
              <div style={styles.row}>
                <div style={styles.halfWidth}>
                  <label style={styles.label}>Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} style={styles.select} required>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={styles.halfWidth}>
                  <label style={styles.label}>Brand *</label>
                  <select name="brand" value={formData.brand} onChange={handleInputChange} style={styles.select} required>
                    <option value="">Select Brand</option>
                    {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                  </select>
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.halfWidth}>
                  <label style={styles.label}>Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} style={styles.input} required />
                </div>
                <div style={styles.halfWidth}>
                  <label style={styles.label}>Discount (%)</label>
                  <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} style={styles.input} />
                </div>
                <div style={styles.halfWidth}>
                  <label style={styles.label}>Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} style={styles.input} required />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Sizes</label>
                <div style={styles.sizeButtons}>
                  {sizes.map(size => (
                    <button type="button" key={size} onClick={() => handleSizeToggle(size)} style={{ ...styles.sizeBtn, ...(formData.size.includes(size) ? styles.activeSizeBtn : {}) }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Colors</label>
                <div style={styles.colorButtons}>
                  {colors.map(color => (
                    <button type="button" key={color} onClick={() => handleColorToggle(color)} style={{ ...styles.colorBtn, backgroundColor: color.toLowerCase(), ...(formData.color.includes(color) ? styles.activeColorBtn : {}) }} title={color} />
                  ))}
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Images (Up to 5 images)</label>
                <div style={styles.imageUploadArea} onClick={() => document.getElementById('imageInput').click()}>
                  📸 Click to upload images
                  <input id="imageInput" type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                </div>
                {imagePreviews.length > 0 && (
                  <div style={styles.imagePreviewContainer}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={styles.imagePreview}>
                        <img src={preview} alt="Preview" style={styles.previewImg} />
                        <button type="button" onClick={() => removeImage(index)} style={styles.removeImageBtn}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" style={uploading ? styles.submitBtnDisabled : styles.submitBtn} disabled={uploading}>
                {uploading ? '⏳ Uploading...' : '➕ Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;