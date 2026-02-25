import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, deleteProduct, editProduct } from '../../features/product/productSlice';
import AdminHeader from './AdminHeader';
import { addNotification } from '../../features/notifications/notificationSlice';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const dispatch = useDispatch();
  const { products, status, error, pagination } = useSelector((state) => state.products);

  const [allProducts, setAllProducts] = useState([]); // To store all loaded products
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    stock: 0,
    category: '',
    productImage: ''
  });
  const [imageFile, setImageFile] = useState(null); // For handling image uploads
  const [editMode, setEditMode] = useState(false); // Track whether we are editing a product
  const [currentProductId, setCurrentProductId] = useState(null); // To track product being edited
  const [isPopupOpen, setIsPopupOpen] = useState(false); // For the popup visibility
  const [page, setPage] = useState(1); // Pagination page tracking for "Load More"

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

  // Fetch products initially and when the page changes (for pagination)
  useEffect(() => {
    dispatch(fetchProducts({ search: '', category: '', page }))
      .then((response) => {
        if (response.payload.products) {
          setAllProducts((prevProducts) => [...prevProducts, ...response.payload.products]);
        }
      });
  }, [dispatch, page]);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected file
  };

  // Add or Edit product
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    const productData = {
      ...newProduct,
      productImage: imageFile // Attach the image file for uploads
    };

    if (editMode) {
      dispatch(editProduct({ productId: currentProductId, updatedData: productData }))
        .then(() => {
          dispatch(fetchProducts({ search: '', category: '', page: 1 })); // Re-fetch products after updating
        });
      dispatch(addNotification({ id: Date.now(), message: `Product edited successfully`, type: 'success' }));
    } else {
      dispatch(createProduct(productData))
        .then(() => {
          dispatch(fetchProducts({ search: '', category: '', page: 1 })); // Re-fetch products after adding
        });
      dispatch(addNotification({ id: Date.now(), message: `Product added successfully`, type: 'success' }));
    }

    resetForm();
    setIsPopupOpen(false); // Close popup after form submission
  };

  const handleEditClick = (product) => {
    setNewProduct(product);
    setCurrentProductId(product._id);
    setEditMode(true);
    setIsPopupOpen(true); // Open popup for editing
  };

  const resetForm = () => {
    setNewProduct({ name: '', price: 0, description: '', stock: 0, category: '', productImage: '' });
    setImageFile(null);
    setEditMode(false);
    setCurrentProductId(null);
  };

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId)).then(() => {
      dispatch(fetchProducts({ search: '', category: '', page: 1 })); // Re-fetch products after deletion
    });
    dispatch(addNotification({ id: Date.now(), message: `Product deleted successfully`, type: 'success' }));
  };

  const handleLoadMore = () => {
    setPage(page + 1); // Load more products by incrementing the page
  };

  return (
    <div>
      <AdminHeader />
      <div className="min-h-screen p-8 bg-gray-100 pt-[7em]">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Admin Product Management</h1>

        {/* Add Product Button */}
        <button
          onClick={() => setIsPopupOpen(true)} // Open popup for adding a product
          className="bg-green-600 text-white py-2 px-4 rounded-lg mb-6 text-[16px]"
        >
          Add New Product
        </button>

        {/* Popup for Adding/Editing Product */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="w-[80vw] sm:w-[48vw] lg:w-[40em] bg-white p-8 rounded-lg shadow-lg space-y-4 w-1/3">
              <h2 className="text-[20px] font-bold text-center text-green-600">{editMode ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={handleAddProduct} className="space-y-1">
                <div>
                  <label className="block text-gray-700">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Description:</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Stock:</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Category:</label>
                  <input
                    type="text"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Product Image:</label>
                  <input type="file" onChange={handleFileChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  {editMode ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)} // Close popup on cancel
                  className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-2"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="space-y-4 grid lg:grid-cols-6 sm:grid-cols-3 gap-4">
          {status === 'loading' && <p className="text-gray-500">Loading products...</p>}
          {status === 'failed' && <p className="text-red-500">{error}</p>}
          {status === 'succeeded' &&
            allProducts.map((product, idx) => (
              <div key={product._id || idx} className="bg-white p-6 rounded-lg shadow-lg">
                {product.productImage && (
                  <img src={product.productImage} alt={product.name} className="mt-2 h-40  w-full object-cover" />
                )}
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-700">Price: ${product.price}</p>
                <p className="text-gray-700">Stock: {product.stock}</p>
                <p className="text-gray-700">Category: {product.category}</p>
                
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleEditClick(product)}      
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Load More Button */}
        {pagination.currentPage < pagination.totalPages && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
