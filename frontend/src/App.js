// src/App.js - VERSIÓN CORREGIDA
import React, { useState } from 'react';
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
import ScoreListener from './components/ScoreListener'; // ✅ CORREGIDO

function App() {
  const [currentSection, setCurrentSection] = useState('inicio');
  const [currentTematica, setCurrentTematica] = useState(null);

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

  // Si se selecciona una temática desde Juegos, cambiar a esa sección
  React.useEffect(() => {
    if (currentTematica) {
      setCurrentSection(currentTematica);
      setCurrentTematica(null);
    }
  }, [currentTematica]);

  return (
    <div className="App">
      <Header 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection} 
      />
      <main>
        {renderSection()}
      </main>
      <Chatbot />
      <ScoreListener /> {/* ✅ COMPONENTE NUEVO - SIN ERRORES */}
    </div>
  );
}

export default App;