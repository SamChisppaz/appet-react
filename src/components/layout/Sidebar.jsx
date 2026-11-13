import styles from './Sidebar.module.css';

// panel de navegacion que se muestra en todas las pantallas despues de
// iniciar sesion, vistaActiva dice cual opcion esta resaltada ahora mismo
// y cambiarVista cambia de pantalla sin recargar la pagina
export default function Sidebar({ usuario, vistaActiva, cambiarVista, alCerrarSesion }) {
  // cada opcion del menu, junto con su icono de Font Awesome y la vista
  // que le corresponde en App.jsx
  const opciones = [
    { id: 'inicio', etiqueta: 'Inicio', icono: 'fa-house' },
    { id: 'perfil', etiqueta: 'Perfil', icono: 'fa-circle-user' },
    { id: 'misMascotas', etiqueta: 'Mis mascotas', icono: 'fa-paw' },
    { id: 'registrarMascota', etiqueta: 'Registrar mascota', icono: 'fa-plus' },
  ];

  return (
    <aside className={styles.panel}>
      <div className={styles.usuario}>
        <i className={`fa-solid fa-user ${styles.avatar}`}></i>
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