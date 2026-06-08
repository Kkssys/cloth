import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      console.log('API Request URL:', `/products?${params.toString()}`);
      const { data } = await axios.get(`/products?${params.toString()}`);
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// ... rest of the slice

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
        state.totalProducts = action.payload.totalProducts || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product || action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;