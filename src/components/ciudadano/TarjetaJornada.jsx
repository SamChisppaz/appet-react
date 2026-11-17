import styles from './TarjetaJornada.module.css';

// la base de datos guarda "VACUNACION" en mayúscula
// este objeto sirve para mostrarlo como "Vacunación"
const nombresServicio = { VACUNACION: 'Vacunación', ESTERILIZACION: 'Esterilización' };

// la fecha de la jornada no tiene hora, se usa UTC para que no se muestre un día antes
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// tarjeta con los datos de una sola jornada
// jornada: los datos a mostrar
// alSolicitar: función que se ejecuta al pulsar "solicitar participacion; si no se envía, no se muestra el botón
export default function TarjetaJornada({ jornada, alSolicitar }) {
  return (
    <div className={styles.tarjeta}>
      <div className={styles.encabezado}>
        <i className="fa-solid fa-calendar-days"></i> {formatearFecha(jornada.fecha)}
      </div>

      <div className={styles.info}>
        <h2 className={styles.servicio}>{nombresServicio[jornada.tipoServicio]}</h2>
        <p className={styles.dato}>
          <i className="fa-solid fa-location-dot"></i> {jornada.ciudad} - {jornada.ubicacion}
        </p>
        <p className={styles.dato}>
          <i className="fa-regular fa-clock"></i> {jornada.horaInicio} - {jornada.horaFin}
        </p>

        {/* al hacer clic, se envía la jornada completa a App.jsx, que abre la pantalla de solicitud */}
        {alSolicitar && (
          <button type="button" className={styles.boton} onClick={() => alSolicitar(jornada)}>
            <i className="fa-solid fa-paper-plane"></i> Solicitar participación
          </button>
        )}
      </div>
    </div>
  );
}