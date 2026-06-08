import React, { useState } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const ProductForm = ({ product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    brand: product?.brand || '',
    price: product?.price || '',
    discount: product?.discount || 0,
    stock: product?.stock || '',
    size: product?.size || [],
    color: product?.color || [],
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
  const brands = ['Nike', 'Adidas', 'Zara', 'H&M', "Levi's", 'Puma'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink'];

  const handleChange = (e) => {
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formDataImg = new FormData();
    files.forEach(file => formDataImg.append('images', file));

    try {
      setLoading(true);
      const { data } = await axios.post('/upload', formDataImg);
      setFormData({ ...formData, images: [...formData.images, ...data.images] });
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await axios.put(`/products/${product._id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await axios.post('/products', formData);
        toast.success('Product created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    group: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    label: {
      fontWeight: 500,
      color: '#374151',
    },
    row: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    halfWidth: {
      flex: 1,
      minWidth: '200px',
    },
    buttonsGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    button: {
      padding: '0.25rem 0.75rem',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      borderRadius: '0.375rem',
      cursor: 'pointer',
    },
    activeButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      borderColor: '#4f46e5',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.row}>
        <div style={styles.halfWidth}>
          <div style={styles.group}>
            <label style={styles.label}>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>
        <div style={styles.halfWidth}>
          <div style={styles.group}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
          rows="4"
          required
        />
      </div>

      <div style={styles.row}>
        <div style={styles.halfWidth}>
          <div style={styles.group}>
            <label style={styles.label}>Brand</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.halfWidth}>
          <div style={styles.group}>
            <label style={styles.label}>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.halfWidth}>
          <div style={styles.group}>
            <label style={styles.label}>Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
        <div style={styles.halfWidth}>
          <div style={styles.group}>
            <label style={styles.label}>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Sizes</label>
        <div style={styles.buttonsGroup}>
          {sizes.map(size => (
            <button
              type="button"
              key={size}
              onClick={() => handleSizeToggle(size)}
              style={{
                ...styles.button,
                ...(formData.size.includes(size) ? styles.activeButton : {})
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Colors</label>
        <div style={styles.buttonsGroup}>
          {colors.map(color => (
            <button
              type="button"
              key={color}
              onClick={() => handleColorToggle(color)}
              style={{
                ...styles.button,
                backgroundColor: color.toLowerCase(),
                color: ['Black', 'Blue', 'Purple'].includes(color) ? 'white' : 'black',
                ...(formData.color.includes(color) ? styles.activeButton : {})
              }}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Product Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="input-field"
        />
        {formData.images.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {formData.images.map((img, idx) => (
              <img key={idx} src={img.url} alt={`Product ${idx}`} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
};

export default ProductForm;