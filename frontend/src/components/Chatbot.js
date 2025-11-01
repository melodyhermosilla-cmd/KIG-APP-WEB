import React, { useState } from 'react';
import { chatbotAPI } from '../services/api';
import './Chatbot.css';

function Chatbot() {
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;
    
    setCargando(true);
    try {
      const data = await chatbotAPI.enviarMensaje(mensaje);
      setRespuesta(data.respuesta);
      setMensaje('');
    } catch (error) {
      setRespuesta('❌ Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      enviarMensaje();
    }
  };

  return (
    <div className="chatbot">
      <h3>🤖 Duende Mágico</h3>
      <div className="chat-contenedor">
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Pregunta sobre hardware/software..."
          disabled={cargando}
        />
        <button onClick={enviarMensaje} disabled={cargando}>
          {cargando ? '⏳' : '➤'}
        </button>
      </div>
      {respuesta && (
        <div className="respuesta">
          <p><strong>Duende:</strong> {respuesta}</p>
        </div>
      )}
    </div>
  );
}

export default Chatbot;