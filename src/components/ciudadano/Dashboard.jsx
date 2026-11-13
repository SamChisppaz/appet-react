import styles from './Dashboard.module.css';

// pantalla principal del ciudadano, es la primera vista despues de iniciar sesion
// muestra los servicios disponibles (vacunacion y esterilizacion), cada uno con
// un boton para consultar las jornadas de ese servicio
// alVerJornadas recibe el tipo de servicio elegido y cambia la vista en App.jsx
export default function Dashboard({ alVerJornadas }) {
  return (
    <div>
      <div className={styles.encabezado}>
        <h1 className={styles.titulo}>Servicios disponibles</h1>
        <p className={styles.subtitulo}>
          Cuida la salud de tus mascotas con nuestros servicios gratuitos.
          <br />
          Agenda tu cita de manera fácil y rápida.
        </p>
      </div>

      <div className={styles.servicios}>
        <div className={styles.tarjeta}>
          <div className={`${styles.icono} ${styles.iconoAzul}`}>
            <i className="fa-solid fa-syringe"></i>
          </div>
          <h2 className={`${styles.nombreServicio} ${styles.tituloAzul}`}>Vacunación</h2>
          <p className={styles.descripcion}>
            Protege a tu mascota de enfermedades graves. Previene y cuida su
            vida con nuestro programa de vacunación gratuito.
          </p>
          <button
            className={`${styles.boton} ${styles.botonAzul}`}
            onClick={() => alVerJornadas('VACUNACION')}
          >
            Ver jornadas disponibles
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div className={styles.tarjeta}>
          <div className={`${styles.icono} ${styles.iconoMenta}`}>
            <i className="fa-solid fa-scissors"></i>
          </div>
          <h2 className={`${styles.nombreServicio} ${styles.tituloMenta}`}>Esterilización</h2>
          <p className={styles.descripcion}>
            Cuida a tu mascota, previene enfermedades y controla la
            sobrepoblación animal.
          </p>
          <button
            className={`${styles.boton} ${styles.botonMenta}`}
            onClick={() => alVerJornadas('ESTERILIZACION')}
          >
            Ver jornadas disponibles
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}