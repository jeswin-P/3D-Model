import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_APP_URL || "http://localhost:5000" });
export const uploadModel = (formData) => API.post('/addModel', formData);
export const getModels = () => API.get('/getAllModels');
export const deleteModel = (id) => API.delete(`/deleteModel/${id}`);
