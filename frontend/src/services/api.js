// src/services/api.js - VERSIÓN DEFINITIVA
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5200';

const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error en la petición' }));
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ✅ SERVICIO que tu compañera YA USA en AMBOS componentes
export const juegosAPI = {
  obtenerJuegos: () => fetchAPI('/juegos')
};

// ✅ SERVICIOS NUEVOS para el resto de funcionalidades
export const authAPI = {
  registro: (userData) => fetchAPI('/api/auth/registro', {
    method: 'POST',
    body: userData
  }),

  login: (credentials) => fetchAPI('/api/auth/login', {
    method: 'POST',
    body: credentials
  }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('kig-user');
  }
};

export const userAPI = {
  guardarPuntaje: (puntajeData) => fetchAPI('/api/users/puntaje', {
    method: 'POST',
    body: puntajeData
  }),

  actualizarPerfil: (nombre) => fetchAPI('/api/users/perfil', {
    method: 'PUT',
    body: { nombre }
  })
};

export const generalAPI = {
  getPuntuaciones: () => fetchAPI('/puntuaciones'),
  chatbot: (mensaje) => fetchAPI('/chatbot', {
    method: 'POST',
    body: { mensaje }
  })
};