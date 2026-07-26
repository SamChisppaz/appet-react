import { useState } from 'react';
import Login from './components/auth/Login.jsx';
import FormularioMascota from './components/ciudadano/FormularioMascota.jsx';
import './App.css';

// controla que pantalla se ve ahora mismo
// login: con sus pestañas de iniciar sesion y registrarse
// mascota: la pantalla protegida, para donde se va apenas hay sesion iniciada
function App() {
  const [pantalla, setPantalla] = useState('login');

  // esta funcion se la pasamos a login para que nos avise cuando el login o el registro salieron bien
  function irARegistrarMascota() {
    setPantalla('mascota');
  }

  if (pantalla === 'mascota') {
    return (
      <main style={{ maxWidth: '420px', margin: '3rem auto', padding: '0 1rem' }}>
        <h2>Registrar mascota</h2>
        <FormularioMascota />
      </main>
    );
  }

  return <Login alAutenticar={irARegistrarMascota} />;
}

export default App;