import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getToken } from '../../utils/getToken';
import { BASE_URL } from '../../utils/constants';

// Fetch all orders for admin
export const fetchAllOrders = createAsyncThunk(
  'adminOrders/fetchAllOrders',
  async () => {
    const token = getToken();
    console.log(token)
    const response = await axios.get(`${BASE_URL}/orders/admin/get-all-orders`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Add token in the Authorization header
            'Content-Type': 'application/json' // Ensure JSON content-type
        }
    });
    console.log(response.data)
    return response.data?.orders; 
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'adminOrders/updateOrderStatus',
  async ({ orderId, status }) => {
    console.log(orderId,status)
    const response = await axios.post(`${BASE_URL}/orders/admin/orders/${orderId}/status`, { status });
    console.log('response')
    console.log(response);
    return response.data.order;
  }
);

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState: {
    orders: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const existingOrderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (existingOrderIndex !== -1) {
          state.orders[existingOrderIndex] = updatedOrder;
        }
      });
  },
});

export default adminOrdersSlice.reducer;
