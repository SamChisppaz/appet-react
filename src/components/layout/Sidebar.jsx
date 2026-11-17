import styles from './Sidebar.module.css';

// panel de navegacion que se muestra en todas las pantallas despues de
// iniciar sesion, vistaActiva dice cual opcion esta resaltada ahora mismo
// y cambiarVista cambia de pantalla sin recargar la pagina
export default function Sidebar({ usuario, vistaActiva, cambiarVista, alCerrarSesion }) {
  const esAdministrador = usuario !== null && usuario.rol === 'ADMINISTRADOR';

  // cada opcion del menu, con su icono de Font Awesome y la vista que le corresponde en App.jsx.
  //  El administrador tiene un menu distinto
  const opciones = esAdministrador
    ? [
        { id: 'crearJornada', etiqueta: 'Crear jornada', icono: 'fa-calendar-plus' },
        { id: 'solicitudes', etiqueta: 'Solicitudes', icono: 'fa-list-check' },
      ]
    : [
        { id: 'inicio', etiqueta: 'Inicio', icono: 'fa-house' },
        { id: 'perfil', etiqueta: 'Perfil', icono: 'fa-circle-user' },
        { id: 'misMascotas', etiqueta: 'Mis mascotas', icono: 'fa-paw' },
        { id: 'registrarMascota', etiqueta: 'Registrar mascota', icono: 'fa-plus' },
        { id: 'misSolicitudes', etiqueta: 'Mis solicitudes', icono: 'fa-clipboard-list' },
      ];

  return (
    <aside className={styles.panel}>
      <div className={styles.usuario}>
        <i className={`fa-solid ${esAdministrador ? 'fa-user-shield' : 'fa-user'} ${styles.avatar}`}></i>
        <span className={styles.saludo}>{usuario ? `Hola, ${usuario.nombre}` : 'Bienvenido'}</span>
      </div>

      <hr className={styles.divisor} />

      <nav className={styles.navegacion}>
        {opciones.map((opcion) => (
          <button
            key={opcion.id}
            className={`${styles.boton} ${vistaActiva === opcion.id ? styles.activo : ''}`}
            onClick={() => cambiarVista(opcion.id)}
          >
            <i className={`fa-solid ${opcion.icono}`}></i>
            {opcion.etiqueta}
          </button>
        ))}
      </nav>

      {/* va aparte del resto del menu porque no cambia de vista, cierra la sesion */}
      <button className={styles.cerrarSesion} onClick={alCerrarSesion}>
        <i className="fa-solid fa-right-from-bracket"></i>
        Cerrar sesión
      </button>
    </aside>
  );
}