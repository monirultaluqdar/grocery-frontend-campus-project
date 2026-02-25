import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/adminOrdersSlice';
import Header from '../../components/shared/Header';
import { formatCurrency } from '../../utils/formatCurrency';
import AdminHeader from './AdminHeader';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.adminOrders);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log(user)
  // Redirect to admin login if the user is not an admin or not logged in
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login'); // Redirect to admin login page
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return null; // Optionally, render nothing or a loader while redirecting
  }

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  }

  return (
    <div>
      <AdminHeader />
      <section className="admin-orders mt-5 pt-[7rem]">
        <h1 className="heading text-2xl font-bold">All Orders</h1>

        <div className="orders-list mt-5">
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="order-item p-4 border-b flex justify-between">
                <div>
                  <p className="font-bold">Order #{order._id}</p>
                  <p>User: {order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})</p>
                  <p>Address: {order.shippingAddress}</p>
                  <p>Total Amount: {formatCurrency(order.totalAmount)}</p>
                  <p>Payment Method: {order.paymentMethod}</p>
                  <p className={`mt-2 text-sm ${
                    order.status === 'Delivered' ? 'text-green-600' :
                    order.status === 'Processing' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    Status: {order.status}
                  </p>
                </div>

                {/* Status Management */}
                <div className="status-actions">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminOrders;
