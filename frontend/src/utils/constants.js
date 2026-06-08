export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const PRODUCT_CATEGORIES = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCT_COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};