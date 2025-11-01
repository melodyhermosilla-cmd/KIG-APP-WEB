import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Introduccion from './pages/Introduccion';
import Juegos from './pages/Juegos';
import Hardware from './pages/Hardware';
import Software from './pages/Software';
import Puntuaciones from './pages/Puntuaciones';
import Contacto from './pages/Contacto';
import Chatbot from './components/Chatbot';
import Perfil from './pages/Perfil';
import MisJuegos from './pages/MisJuegos';
import Configuracion from './pages/Configuracion';
import Login from './components/Login'; // ✅ Nuevo import

function App() {
  const [currentSection, setCurrentSection] = useState('inicio');
  const [currentTematica, setCurrentTematica] = useState(null);
  const [usuario, setUsuario] = useState(null); // ✅ Nuevo estado para usuario
  const [mostrarLogin, setMostrarLogin] = useState(false); // ✅ Nuevo estado para modal

  // ✅ Verificar si hay usuario al cargar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  // ✅ Función para manejar login exitoso
  const handleLoginSuccess = (usuarioData) => {
    setUsuario(usuarioData);
    setMostrarLogin(false);
  };

  // ✅ Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    alert('¡Hasta pronto! 👋');
  };

  // ✅ Tu función renderSection existente (SIN MODIFICAR)
  const renderSection = () => {
    switch (currentSection) {
      case 'inicio':
        return <Home />;
      case 'introduccion':
        return <Introduccion />;
      case 'juegos':
        return <Juegos onTematicaSelect={setCurrentTematica} />;
      case 'hardware':
        return <Hardware onBack={() => setCurrentSection('juegos')} />;
      case 'software':
        return <Software onBack={() => setCurrentSection('juegos')} />;
      case 'puntuaciones':
        return <Puntuaciones />;
      case 'contacto':
        return <Contacto />;
      case 'perfil':
        return <Perfil onBack={() => setCurrentSection('inicio')} />;
      case 'configuracion':
        return <Configuracion onBack={() => setCurrentSection('inicio')} />;
      case 'mis-juegos':
        return <MisJuegos onBack={() => setCurrentSection('inicio')} />;
      default:
        return <Home />;
    }
  };

  // ✅ Tu useEffect existente (SIN MODIFICAR)
  React.useEffect(() => {
    if (currentTematica) {
      setCurrentSection(currentTematica);
      setCurrentTematica(null);
    }
  }, [currentTematica]);

  return (
    <div className="App">
      {/* ✅ Header modificado para mostrar info de usuario */}
      <Header 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection}
        usuario={usuario} // ✅ Pasar usuario al Header
        onLoginClick={() => setMostrarLogin(true)} // ✅ Función para abrir login
        onLogoutClick={handleLogout} // ✅ Función para cerrar sesión
      />
      
      <main>
        {renderSection()}
      </main>
      
      <Chatbot />
      
      {/* ✅ Modal de Login (solo se muestra cuando es necesario) */}
      {mostrarLogin && (
        <div className="modal-overlay">
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setMostrarLogin(false)}
          />
        </div>
      )}
    </div>
  );
}

export default App;