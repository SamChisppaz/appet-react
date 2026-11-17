import { useState, useEffect } from 'react';
import MensajeVacio from '../comunes/MensajeVacio.jsx';
import MensajeError from '../comunes/MensajeError.jsx';
import styles from './VerSolicitudes.module.css';

// el backend guarda estos valores en mayusculas, aqui se pasan a texto legible
const nombresServicio = {
  VACUNACION: 'Vacunación',
  ESTERILIZACION: 'Esterilización',
};

const nombresEstado = {
  PENDIENTE: 'Pendiente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
};

// la fecha de la jornada no tiene hora, se usa utc para que no se muestre un dia antes
function formatearFechaJornada(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', { timeZone: 'UTC' });
}

// la fecha de la solicitud si tiene hora, se muestra en la hora local
function formatearFechaSolicitud(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO');
}

// texto de una jornada: servicio, fecha y ciudad
// se usa tanto en la tabla como en la lista del filtro
function textoJornada(jornada) {
  return `${nombresServicio[jornada.tipoServicio]} - ${formatearFechaJornada(jornada.fecha)} (${jornada.ciudad})`;
}

// pantalla del administrador: tabla con las solicitudes de los ciudadanos
// permite filtrarlas por jornada y estado, y aprobar o rechazar las pendientes
export default function VerSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState('');

  // error al aprobar o rechazar, se muestra sin ocultar la tabla
  const [errorAccion, setErrorAccion] = useState('');

  // true mientras el backend responde a un aprobar o rechazar
  // desactiva los botones para evitar clics repetidos
  const [procesando, setProcesando] = useState(false);

  // filtros elegidos: texto vacio significa "todas las jornadas" o "todos los estados"
  const [filtroJornada, setFiltroJornada] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // carga las solicitudes desde el backend una sola vez, al abrir la pantalla
  useEffect(() => {
    async function cargarSolicitudes() {
      const token = localStorage.getItem('token');

      try {
        const respuesta = await fetch('http://localhost:8000/api/solicitudes', {
          // el token identifica al usuario ante el backend
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

  // cambia el estado de una solicitud pendiente a APROBADA o RECHAZADA
  async function resolverSolicitud(id, nuevoEstado) {
    const token = localStorage.getItem('token');

    setErrorAccion('');
    setProcesando(true);

    try {
      const respuesta = await fetch(`http://localhost:8000/api/solicitudes/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // el cuerpo lleva el nuevo estado
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // se actualiza solo esa solicitud en la lista, sin volver a pedir todas
        setSolicitudes(
          solicitudes.map((solicitud) =>
            solicitud._id === id ? { ...solicitud, estado: nuevoEstado } : solicitud
          )
        );
      } else {
        setErrorAccion(datos.error);
      }
    } catch (error) {
      setErrorAccion('No se pudo conectar con el servidor. Intenta más tarde.');
    }

    setProcesando(false);
  }

  // jornadas distintas que aparecen en las solicitudes, para llenar la lista del filtro
  const jornadas = [];
  solicitudes.forEach((solicitud) => {
    const jornada = solicitud.jornada;

    // se omiten las solicitudes sin jornada (eliminada) y las jornadas ya agregadas
    if (jornada && !jornadas.some((agregada) => agregada._id === jornada._id)) {
      jornadas.push(jornada);
    }
  });

  // solicitudes que cumplen los dos filtros a la vez
  // si un filtro esta vacio, ese filtro no descarta nada
  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const coincideJornada =
      filtroJornada === '' || (solicitud.jornada && solicitud.jornada._id === filtroJornada);
    const coincideEstado = filtroEstado === '' || solicitud.estado === filtroEstado;

    return coincideJornada && coincideEstado;
  });

  return (
    <div>
      <div className={styles.encabezado}>
        <h1 className={styles.titulo}>Solicitudes recibidas</h1>
        <p className={styles.subtitulo}>
          Listado de las solicitudes enviadas por los ciudadanos. Las pendientes se pueden aprobar o rechazar.
        </p>
      </div>

      {cargando && <MensajeVacio texto="Cargando solicitudes..." />}

      <MensajeError texto={errorGeneral} />

      {!cargando && !errorGeneral && solicitudes.length === 0 && (
        <MensajeVacio texto="Aún no hay solicitudes registradas." />
      )}

      {!cargando && !errorGeneral && solicitudes.length > 0 && (
        <div>
          {/* filtros: cada lista cambia el estado y la tabla se actualiza sola */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="filtroJornada" className="form-label">Jornada</label>
              <select
                id="filtroJornada"
                className="form-select"
                value={filtroJornada}
                onChange={(evento) => setFiltroJornada(evento.target.value)}
              >
                <option value="">Todas las jornadas</option>
                {jornadas.map((jornada) => (
                  <option key={jornada._id} value={jornada._id}>
                    {textoJornada(jornada)}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="filtroEstado" className="form-label">Estado</label>
              <select
                id="filtroEstado"
                className="form-select"
                value={filtroEstado}
                onChange={(evento) => setFiltroEstado(evento.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="APROBADA">Aprobada</option>
                <option value="RECHAZADA">Rechazada</option>
              </select>
            </div>
          </div>

          <MensajeError texto={errorAccion} />

          {/* si los filtros no dejan ninguna solicitud, se muestra un aviso en lugar de la tabla */}
          {solicitudesFiltradas.length === 0 ? (
            <MensajeVacio texto="No hay solicitudes con los filtros elegidos." />
          ) : (
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
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {solicitudesFiltradas.map((solicitud) => (
                    <tr key={solicitud._id}>
                      <td>{solicitud._id}</td>
                      {/* si el ciudadano, la mascota o la jornada fueron eliminados, llega null
                          y se muestra "no disponible" para que la pantalla no falle */}
                      <td>
                        {solicitud.ciudadano
                          ? `${solicitud.ciudadano.nombre} ${solicitud.ciudadano.apellido}`
                          : 'No disponible'}
                      </td>
                      <td>{solicitud.mascota ? solicitud.mascota.nombre : 'No disponible'}</td>
                      <td>{solicitud.jornada ? textoJornada(solicitud.jornada) : 'No disponible'}</td>
                      <td>{formatearFechaSolicitud(solicitud.createdAt)}</td>
                      <td>{nombresEstado[solicitud.estado]}</td>
                      <td>
                        {/* los botones solo aparecen en solicitudes pendientes */}
                        {solicitud.estado === 'PENDIENTE' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-success btn-sm me-2"
                              disabled={procesando}
                              onClick={() => resolverSolicitud(solicitud._id, 'APROBADA')}
                            >
                              Aprobar
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              disabled={procesando}
                              onClick={() => resolverSolicitud(solicitud._id, 'RECHAZADA')}
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}