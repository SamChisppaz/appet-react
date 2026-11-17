import { useState } from 'react';
import Login from './components/auth/Login.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Dashboard from './components/ciudadano/Dashboard.jsx';
import FormularioMascota from './components/ciudadano/FormularioMascota.jsx';
import Perfil from './components/ciudadano/Perfil.jsx';
import MisMascotas from './components/ciudadano/MisMascotas.jsx';
import Jornadas from './components/ciudadano/Jornadas.jsx';
import SolicitarParticipacion from './components/ciudadano/SolicitarParticipacion.jsx';
import MisSolicitudes from './components/ciudadano/MisSolicitudes.jsx';
import CrearJornada from './components/admin/CrearJornada.jsx';
import VerSolicitudes from './components/admin/VerSolicitudes.jsx';
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

  // el administrador empieza en su propio menu y el ciudadano en el inicio
  const [vista, setVista] = useState(
    usuario && usuario.rol === 'ADMINISTRADOR' ? 'crearJornada' : 'inicio'
  );

  // guarda que servicio se eligio en el dashboard (vacunacion o esterilizacion),
  // lo usa la pantalla de jornadas para saber cuales mostrar
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  // guarda la jornada elegida, la pantalla de solicitud la necesita para inscribir las mascotas
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState(null);

  // guarda los datos de la mascota que se esta editando, el formulario los usa para llenar los campos
  const [mascotaEditando, setMascotaEditando] = useState(null);

  const esAdministrador = usuario !== null && usuario.rol === 'ADMINISTRADOR';

  // se ejecuta cuando el login es exitoso y cambia a la pantalla del panel
  function iniciarSesion(usuarioLogueado) {
    setUsuario(usuarioLogueado);
    setPantalla('panel');
    setVista(usuarioLogueado.rol === 'ADMINISTRADOR' ? 'crearJornada' : 'inicio');
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

  // se ejecuta al pulsar "Solicitar" en una jornada, guarda la jornada y abre la pantalla de solicitud
  function solicitarParticipacion(jornada) {
    setJornadaSeleccionada(jornada);
    setVista('solicitarParticipacion');
  }

  // se ejecuta al pulsar "Editar" en una tarjeta, guarda la mascota y abre el formulario de edicion
  function editarMascota(mascota) {
    setMascotaEditando(mascota);
    setVista('editarMascota');
  }

  // se ejecuta al guardar o cancelar la edicion, regresa a la lista de mascotas
  function terminarEdicion() {
    setVista('misMascotas');
  }

  if (pantalla === 'login') {
    return <Login alAutenticar={iniciarSesion} />;
  }

  // algunas vistas no estan en el menu, asi que resaltan la opcion a la que pertenecen
  let vistaActiva = vista;
  if (vista === 'editarMascota') vistaActiva = 'misMascotas';
  if (vista === 'jornadas' || vista === 'solicitarParticipacion') vistaActiva = 'inicio';

  return (
    <div className={styles.panel}>
      <Sidebar
        usuario={usuario}
        vistaActiva={vistaActiva}
        cambiarVista={setVista}
        alCerrarSesion={cerrarSesion}
      />

      <main className={styles.contenido}>
        {/* pantallas del administrador, solo se muestran con el rol ADMINISTRADOR */}
        {esAdministrador && vista === 'crearJornada' && <CrearJornada />}
        {esAdministrador && vista === 'solicitudes' && <VerSolicitudes />}

        {/* pantallas del ciudadano */}
        {!esAdministrador && vista === 'inicio' && (
          <Dashboard usuario={usuario} alVerJornadas={verJornadas} />
        )}
        {!esAdministrador && vista === 'perfil' && <Perfil usuario={usuario} />}
        {!esAdministrador && vista === 'registrarMascota' && <FormularioMascota />}
        {!esAdministrador && vista === 'misMascotas' && <MisMascotas alEditar={editarMascota} />}
        {!esAdministrador && vista === 'editarMascota' && (
          <FormularioMascota mascota={mascotaEditando} alTerminarEdicion={terminarEdicion} />
        )}
        {!esAdministrador && vista === 'jornadas' && (
          <Jornadas tipoServicio={servicioSeleccionado} alSolicitar={solicitarParticipacion} />
        )}
        {!esAdministrador && vista === 'solicitarParticipacion' && (
          <SolicitarParticipacion jornada={jornadaSeleccionada} />
        )}
        {!esAdministrador && vista === 'misSolicitudes' && <MisSolicitudes />}
      </main>
    </div>
  );
}

export default App;