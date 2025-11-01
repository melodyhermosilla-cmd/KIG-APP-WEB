import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

function Login({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [modo, setModo] = useState('login'); // 'login' o 'registro'
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      let data;
      
      if (modo === 'login') {
        // Login
        data = await authAPI.login({ email, password });
        console.log('✅ Login exitoso:', data.usuario.nombre);
      } else {
        // Registro
        data = await authAPI.registro({ nombre, email, password });
        console.log('✅ Registro exitoso:', data.usuario.nombre);
      }
      
      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      // Notificar éxito
      if (onLoginSuccess) {
        onLoginSuccess(data.usuario);
      }
      
      // Cerrar modal si existe
      if (onClose) {
        onClose();
      }
      
      // Mostrar alerta de éxito
      alert(`¡${modo === 'login' ? 'Bienvenida' : 'Cuenta creada para'} ${data.usuario.nombre}! 🎉`);
      
    } catch (error) {
      console.error(`❌ Error en ${modo}:`, error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      {onClose && (
        <button className="login-close-btn" onClick={onClose}>×</button>
      )}
      
      <h2>{modo === 'login' ? '🔐 Iniciar Sesión' : '📝 Crear Cuenta'}</h2>
      
      <form onSubmit={handleSubmit} className="login-form">
        {modo === 'registro' && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="login-input"
            />
          </div>
        )}
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
            minLength="6"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={cargando}
          className="login-submit-btn"
        >
          {cargando ? '⏳ Procesando...' : (modo === 'login' ? 'Ingresar' : 'Crear Cuenta')}
        </button>
      </form>

      <div className="login-switch">
        <button 
          type="button" 
          onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
          className="switch-mode-btn"
        >
          {modo === 'login' 
            ? '¿No tienes cuenta? Regístrate aquí' 
            : '¿Ya tienes cuenta? Inicia sesión aquí'
          }
        </button>
      </div>

      <div className="demo-accounts">
        <h4>💡 Cuenta de prueba:</h4>
        <p><strong>Email:</strong> ana@ejemplo.com</p>
        <p><strong>Contraseña:</strong> 123456</p>
      </div>
    </div>
  );
}

export default Login;