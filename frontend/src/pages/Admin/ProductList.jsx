import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    fetchProducts();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  // For mobile: 3 products per row, Tablet: 4 products per row, Desktop: 5-6 products per row
  const getGridColumns = () => {
    if (isMobile) return 'repeat(3, 1fr)';
    if (isTablet) return 'repeat(4, 1fr)';
    return 'repeat(5, 1fr)';
  };

  const categories = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
  const brands = ['Nike', 'Adidas', 'Zara', 'H&M', "Levi's", 'Puma', 'Under Armour'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Navy', 'Grey'];

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products?limit=100');
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
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

  const removeNewImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = async (index) => {
    const newExistingImages = [...existingImages];
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
  };

  const openAddModal = () => {
    setEditingProduct(null);
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
    setExistingImages([]);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      discount: product.discount || '0',
      stock: product.stock,
      size: product.size || [],
      color: product.color || [],
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingImages(product.images || []);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
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
      
      if (editingProduct) {
        await axios.put(`/products/${editingProduct._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully!');
      } else {
        await axios.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added successfully!');
      }
      
      setShowModal(false);
      fetchProducts();
      
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
      setExistingImages([]);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
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
      gap: '12px' 
    },
    title: { 
      fontSize: isMobile ? '20px' : '28px', 
      fontWeight: 'bold', 
      color: '#1f2937' 
    },
    addButton: { 
      backgroundColor: '#4f46e5', 
      color: 'white', 
      padding: isMobile ? '10px 16px' : '12px 24px', 
      border: 'none', 
      borderRadius: '8px', 
      fontSize: isMobile ? '14px' : '16px', 
      fontWeight: 'bold', 
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: getGridColumns(),
      gap: isMobile ? '12px' : '16px',
      marginTop: '20px',
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    },
    productImage: {
      width: '100%',
      height: isMobile ? '120px' : '150px',
      objectFit: 'cover',
      backgroundColor: '#f3f4f6',
    },
    productInfo: {
      padding: isMobile ? '8px' : '12px',
    },
    productName: {
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '4px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    productPrice: {
      fontSize: isMobile ? '11px' : '13px',
      fontWeight: 'bold',
      color: '#4f46e5',
      marginBottom: '4px',
    },
    productStock: {
      fontSize: isMobile ? '10px' : '12px',
      color: '#6b7280',
      marginBottom: '8px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '6px',
    },
    editBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: isMobile ? '4px 8px' : '6px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: isMobile ? '10px' : '12px',
      flex: 1,
    },
    deleteBtn: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: isMobile ? '4px 8px' : '6px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: isMobile ? '10px' : '12px',
      flex: 1,
    },
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
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: isMobile ? '16px' : '24px',
      maxWidth: isMobile ? '95%' : '700px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
    },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontWeight: '500', marginBottom: '5px', color: '#374151' },
    input: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' },
    select: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' },
    textarea: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', minHeight: '80px' },
    row: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    halfWidth: { flex: 1, minWidth: '150px' },
    sizeButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' },
    sizeBtn: { padding: '6px 12px', border: '1px solid #d1d5db', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' },
    activeSizeBtn: { backgroundColor: '#4f46e5', color: 'white', borderColor: '#4f46e5' },
    colorButtons: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' },
    colorBtn: { width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #d1d5db', cursor: 'pointer' },
    activeColorBtn: { borderColor: '#4f46e5', boxShadow: '0 0 0 2px rgba(79,70,229,0.5)' },
    imageUploadArea: { border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f9fafb' },
    imagePreviewContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' },
    imagePreview: { position: 'relative', width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e5e7eb' },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    removeImageBtn: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', cursor: 'pointer', border: 'none' },
    submitBtn: { width: '100%', backgroundColor: '#4f46e5', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    submitBtnDisabled: { width: '100%', backgroundColor: '#9ca3af', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '10px' },
    noProducts: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
    },
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading products...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products Management</h1>
        <button style={styles.addButton} onClick={openAddModal}>
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div style={styles.noProducts}>
          No products found. Click "Add Product" to create one.
        </div>
      ) : (
        <div style={styles.productsGrid}>
          {products.map(product => (
            <div key={product._id} style={styles.productCard}>
              <img
                src={product.images?.[0]?.url || 'https://picsum.photos/id/20/150/150'}
                alt={product.name}
                style={styles.productImage}
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/id/20/150/150';
                }}
              />
              <div style={styles.productInfo}>
                <div style={styles.productName}>{product.name}</div>
                <div style={styles.productPrice}>₹{product.price?.toLocaleString() || 0}</div>
                <div style={styles.productStock}>
                  Stock: <span style={{ 
                    color: product.stock === 0 ? '#ef4444' : product.stock < 10 ? '#f59e0b' : '#10b981',
                    fontWeight: 'bold'
                  }}>
                    {product.stock || 0}
                  </span>
                </div>
                <div style={styles.buttonGroup}>
                  <button onClick={() => openEditModal(product)} style={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} style={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
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
                <label style={styles.label}>Sizes (Select multiple)</label>
                <div style={styles.sizeButtons}>
                  {sizes.map(size => (
                    <button type="button" key={size} onClick={() => handleSizeToggle(size)} style={{ ...styles.sizeBtn, ...(formData.size.includes(size) ? styles.activeSizeBtn : {}) }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Colors (Select multiple)</label>
                <div style={styles.colorButtons}>
                  {colors.map(color => (
                    <button type="button" key={color} onClick={() => handleColorToggle(color)} style={{ ...styles.colorBtn, backgroundColor: color.toLowerCase(), ...(formData.color.includes(color) ? styles.activeColorBtn : {}) }} title={color} />
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Product Images (Up to 5 images)</label>
                {existingImages.length > 0 && (
                  <div style={styles.imagePreviewContainer}>
                    {existingImages.map((img, index) => (
                      <div key={index} style={styles.imagePreview}>
                        <img src={img.url} alt="Existing" style={styles.previewImg} />
                        <button type="button" onClick={() => removeExistingImage(index)} style={styles.removeImageBtn}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <div style={styles.imageUploadArea} onClick={() => document.getElementById('imageInput').click()}>
                  📸 Click to upload images
                  <input id="imageInput" type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                </div>
                {imagePreviews.length > 0 && (
                  <div style={styles.imagePreviewContainer}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={styles.imagePreview}>
                        <img src={preview} alt="Preview" style={styles.previewImg} />
                        <button type="button" onClick={() => removeNewImage(index)} style={styles.removeImageBtn}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" style={uploading ? styles.submitBtnDisabled : styles.submitBtn} disabled={uploading}>
                {uploading ? '⏳ Uploading...' : (editingProduct ? '✏️ Update Product' : '➕ Create Product')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;