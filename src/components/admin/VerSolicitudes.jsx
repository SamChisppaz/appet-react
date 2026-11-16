import { useState, useEffect } from 'react';
import MensajeVacio from '../comunes/MensajeVacio.jsx';
import MensajeError from '../comunes/MensajeError.jsx';
import styles from './VerSolicitudes.module.css';

// el backend guarda estos valores en mayusculas
const nombresServicio = {
  VACUNACION: 'Vacunación',
  ESTERILIZACION: 'Esterilización',
};

const nombresEstado = {
  PENDIENTE: 'Pendiente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
};

// la fecha de la jornada no tiene hora, uso UTC para que no se muestre un dia antes
function formatearFechaJornada(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', { timeZone: 'UTC' });
}

// la fecha de la solicitud si tiene hora, se muestra en la hora local
function formatearFechaSolicitud(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO');
}

// pantalla del administrador, muestra en una tabla todas las solicitudes de los ciudadanos
export default function VerSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState('');

  // pido las solicitudes al backend una sola vez, al abrir la pantalla
  useEffect(() => {
    async function cargarSolicitudes() {
      const token = localStorage.getItem('token');

      try {
        const respuesta = await fetch('http://localhost:8000/api/solicitudes', {
          // envio el token para que el backend sepa quien soy
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          setSolicitudes(datos.solicitudes);
        } else {
          // el backend responde con el motivo (sesion vencida, no es administrador, etc.)
          setErrorGeneral(datos.error);
        }
      } catch (error) {
        setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
      }

      setCargando(false);
    }

    cargarSolicitudes();
  }, []);

  return (
    <div>
      <div className={styles.encabezado}>
        <h1 className={styles.titulo}>Solicitudes recibidas</h1>
        <p className={styles.subtitulo}>
          Listado de todas las solicitudes enviadas por los ciudadanos.
        </p>
      </div>

      {cargando && <MensajeVacio texto="Cargando solicitudes..." />}

      <MensajeError texto={errorGeneral} />

      {!cargando && !errorGeneral && solicitudes.length === 0 && (
        <MensajeVacio texto="Aún no hay solicitudes registradas." />
      )}

      {!cargando && !errorGeneral && solicitudes.length > 0 && (
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className={styles.encabezadoTabla}>
              <tr>
                <th>N° Solicitud</th>
                <th>Ciudadano</th>
                <th>Mascota</th>
                <th>Jornada</th>
                <th>Fecha solicitud</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {solicitudes.map((solicitud) => (
                <tr key={solicitud._id}>
                  <td>{solicitud._id}</td>
                  {/* si borraron al ciudadano, la mascota o la jornada, llega null
                      y muestro "No disponible" para que la pantalla no falle */}
                  <td>
                    {solicitud.ciudadano
                      ? `${solicitud.ciudadano.nombre} ${solicitud.ciudadano.apellido}`
                      : 'No disponible'}
                  </td>
                  <td>{solicitud.mascota ? solicitud.mascota.nombre : 'No disponible'}</td>
                  <td>
                    {solicitud.jornada
                      ? `${nombresServicio[solicitud.jornada.tipoServicio]} - ${formatearFechaJornada(solicitud.jornada.fecha)} (${solicitud.jornada.ciudad})`
                      : 'No disponible'}
                  </td>
                  <td>{formatearFechaSolicitud(solicitud.createdAt)}</td>
                  <td>{nombresEstado[solicitud.estado]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}