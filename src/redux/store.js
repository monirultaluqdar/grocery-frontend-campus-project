import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import productReducer from '../features/product/productSlice';
import orderReducer from '../features/orders/ordersSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import adminOrdersSlice from '../features/orders/adminOrdersSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
    notifications: notificationReducer,
    adminOrders:adminOrdersSlice,

  },
});

export default store;