import { useState, useEffect } from 'react';
import MensajeVacio from '../comunes/MensajeVacio.jsx';
import MensajeError from '../comunes/MensajeError.jsx';
import styles from './MisSolicitudes.module.css';

// la base de datos guarda estos valores en mayúscula
// estos objetos sirven para mostrarlos como "Vacunación" y "Pendiente"
const nombresServicio = { VACUNACION: 'Vacunación', ESTERILIZACION: 'Esterilización' };
const nombresEstado = { PENDIENTE: 'Pendiente', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada' };

// la fecha de la jornada no tiene hora, se usa UTC para que no se muestre un día antes
function formatearFechaJornada(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', { timeZone: 'UTC' });
}

// pantalla "mis solicitudes": tabla con las solicitudes del ciudadano y el estado de cada una
export default function MisSolicitudes() {
  // solicitudes: lista que llega del backend
  // errorGeneral: texto del error a mostrar, vacío si todo salió bien
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState('');

  // con [] al final, pedir las solicitudes una sola vez al abrir la pantalla
  useEffect(() => {
    async function cargarSolicitudes() {
      const token = localStorage.getItem('token');

      try {
        // el token va en el header para que el backend sepa de qué ciudadano son las solicitudes
        const respuesta = await fetch('http://localhost:8000/api/solicitudes/mias', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          setSolicitudes(datos.solicitudes);
        } else {
          setErrorGeneral(datos.error || 'No se pudieron cargar las solicitudes.');
        }
      } catch {
        setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
      }

      setCargando(false);
    }

    cargarSolicitudes();
  }, []);

  return (
    <div>
      <h1 className={styles.titulo}>Mis solicitudes</h1>

      {cargando && <MensajeVacio texto="Cargando solicitudes..." />}

      <MensajeError texto={errorGeneral} />

      {/* mensaje de lista vacía: solo si terminó de cargar, sin error y sin solicitudes */}
      {!cargando && !errorGeneral && solicitudes.length === 0 && (
        <MensajeVacio texto="Aún no has enviado solicitudes." />
      )}

      {solicitudes.length > 0 && (
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className={styles.encabezadoTabla}>
              <tr>
                <th>N° Solicitud</th>
                <th>Mascota</th>
                <th>Jornada</th>
                <th>Fecha solicitud</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {/* una fila por solicitud; key es un identificador único */}
              {solicitudes.map((solicitud) => (
                <tr key={solicitud._id}>
                  <td>{solicitud._id}</td>
                  {/* si la mascota o la jornada fueron eliminadas, llega null
                      y se muestra "No disponible" para que la pantalla no falle */}
                  <td>{solicitud.mascota ? solicitud.mascota.nombre : 'No disponible'}</td>
                  <td>
                    {solicitud.jornada
                      ? `${nombresServicio[solicitud.jornada.tipoServicio]} - ${formatearFechaJornada(solicitud.jornada.fecha)} (${solicitud.jornada.ciudad} - ${solicitud.jornada.ubicacion})`
                      : 'No disponible'}
                  </td>
                  {/* createdAt lo agrega Mongo automáticamente al crear la solicitud */}
                  <td>{new Date(solicitud.createdAt).toLocaleDateString('es-CO')}</td>
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