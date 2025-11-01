// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:5200';

// Función para hacer peticiones con headers
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  
  return data;
};

// Servicios específicos
export const authAPI = {
  registro: (datos) => fetchAPI('/api/auth/registro', { 
    method: 'POST', 
    body: datos 
  }),
  
  login: (datos) => fetchAPI('/api/auth/login', { 
    method: 'POST', 
    body: datos 
  }),
};

export const juegosAPI = {
  obtenerJuegos: () => fetchAPI('/juegos'),
};

export const chatbotAPI = {
  enviarMensaje: (mensaje) => fetchAPI('/chatbot', { 
    method: 'POST', 
    body: { mensaje } 
  }),
};

export const puntuacionesAPI = {
  obtenerRanking: () => fetchAPI('/puntuaciones'),
  guardarPuntaje: (datos) => fetchAPI('/api/users/puntaje', { 
    method: 'POST', 
    body: datos 
  }),
};

export const perfilAPI = {
  actualizarPerfil: (datos) => fetchAPI('/api/users/perfil', { 
    method: 'PUT', 
    body: datos 
  }),
};

export default API_BASE_URL;