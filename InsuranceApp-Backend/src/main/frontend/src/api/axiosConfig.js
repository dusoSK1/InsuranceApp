import axios from 'axios';

// Vytvorenie axios inštancie
const api = axios.create({
  baseURL: '/api', // zmeň podľa tvojho backendu
  headers: { 'Content-Type': 'application/json' },
});

// Axios interceptor – pridá JWT token ku každej request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Prihlásenie – uloží token do localStorage
export async function login(email, password) {
  const res = await api.post('/users/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('jwt', res.data.token);
  }
  return res.data;
}

// Odhlásenie – vymaže token
export function logout() {
  localStorage.removeItem('jwt');
}

// Volanie zabezpečených endpointov
export function getInsurances() {
  return api.get('/insurances');
}

export function createInsurance(insurance) {
  return api.post('/insurances', insurance);
}

export function updateInsurance(id, insurance) {
  return api.put(`/insurances/${id}`, insurance);
}

export function deleteInsurance(id) {
  return api.delete(`/insurances/${id}`);
}

export default api;
