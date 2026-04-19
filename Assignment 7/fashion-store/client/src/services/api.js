import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// User APIs
export const registerUser = (userData) => API.post('/save', userData);
export const loginUser = (credentials) => API.post('/login', credentials);
export const getUsers = () => API.get('/users');

// Product APIs
export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/product/${id}`);
export const addProduct = (productData) => API.post('/product', productData);

// Order APIs
export const placeOrder = (orderData) => API.post('/order', orderData);

export default API;
