const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const config = {
  backendUrl: `${apiUrl}/api/v1/dalle`,
  ordersUrl: `${apiUrl}/api/v1/orders`,
};

export default config;
