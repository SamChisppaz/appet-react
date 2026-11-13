import { useState } from 'react';
import Login from './components/auth/Login.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Dashboard from './components/ciudadano/Dashboard.jsx';
import FormularioMascota from './components/ciudadano/FormularioMascota.jsx';
import Perfil from './components/ciudadano/Perfil.jsx';
import styles from './App.module.css';

// pantalla define si se ve el login o el panel interno (con sesion iniciada)
// vista define, dentro del panel, que opcion del sidebar esta abierta
function App() {
  // si ya existe una sesion guardada de antes, recupera el usuario desde
  // el navegador para no mostrar el login otra vez
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [pantalla, setPantalla] = useState(usuario ? 'panel' : 'login');
  const [vista, setVista] = useState('inicio');

  // guarda que servicio se eligio en el dashboard (vacunacion o esterilizacion),
  // lo va a usar la pantalla de jornadas para saber cuales mostrar
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  // se ejecuta cuando el login es exitoso y cambia a la pantalla del panel
  function iniciarSesion(usuarioLogueado) {
    setUsuario(usuarioLogueado);
    setPantalla('panel');
    setVista('inicio');
  }

  // elimina la sesion guardada en el navegador y regresa a la pantalla de login
  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setPantalla('login');
    setVista('inicio');
  }

  // se ejecuta al elegir un servicio en el dashboard, guarda cual fue y cambia a la vista de jornadas
  function verJornadas(tipoServicio) {
    setServicioSeleccionado(tipoServicio);
    setVista('jornadas');
  }

  if (pantalla === 'login') {
    return <Login alAutenticar={iniciarSesion} />;
  }

  return (
    <div className={styles.panel}>
      <Sidebar
        usuario={usuario}
        vistaActiva={vista}
        cambiarVista={setVista}
        alCerrarSesion={cerrarSesion}
      />

      <main className={styles.contenido}>
        {vista === 'inicio' && <Dashboard usuario={usuario} alVerJornadas={verJornadas} />}
        {vista === 'registrarMascota' && <FormularioMascota />}

        {vista === 'perfil' && <Perfil usuario={usuario} />}

        {/* estas pantallas se completan en los siguientes pasos del proyecto */}
        {vista === 'jornadas' && <p>Próximamente: jornadas de {servicioSeleccionado}.</p>}
        {vista === 'misMascotas' && <p>Próximamente: listado de mascotas.</p>}
      </main>
    </div>
  );
}

export default App;