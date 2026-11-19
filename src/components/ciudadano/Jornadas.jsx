import { useState, useEffect } from 'react';
import TarjetaJornada from './TarjetaJornada.jsx';
import MensajeVacio from '../comunes/MensajeVacio.jsx';
import MensajeError from '../comunes/MensajeError.jsx';
import styles from './Jornadas.module.css';
import { API_URL } from '../../config.js';

// pantalla de jornadas disponible: lista las jornadas del servicio elegido en el dashboard
// tipoServicio: "VACUNACION" o "ESTERILIZACION"
// alSolicitar: función que abre la pantalla de solicitud con la jornada elegida
export default function Jornadas({ tipoServicio, alSolicitar }) {

  const [jornadas, setJornadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState('');

  // pedir las jornadas al abrir la pantalla (y de nuevo si cambia el servicio)
  useEffect(() => {
    async function cargarJornadas() {
      const token = localStorage.getItem('token');

      try {
        // el servicio va en la dirección; el backend solo devuelve las jornadas disponibles
        // API_URL cambia segun donde corra la app: localhost o Vercel
        const respuesta = await fetch(`${API_URL}/api/jornadas?tipoServicio=${tipoServicio}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          setJornadas(datos);
        } else {
          setErrorGeneral(datos.error || 'No se pudieron cargar las jornadas.');
        }
      } catch {
        setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
      }

      setCargando(false);
    }

    cargarJornadas();
  }, [tipoServicio]);

  return (
    <div>
      <h1 className={styles.titulo}>Jornadas disponibles</h1>

      {cargando && <MensajeVacio texto="Cargando jornadas..." />}

      <MensajeError texto={errorGeneral} />

      {/* mensaje de lista vacía: solo si terminó de cargar, sin error y sin jornadas */}
      {!cargando && !errorGeneral && jornadas.length === 0 && (
        <MensajeVacio texto="No hay jornadas disponibles en este momento." />
      )}

      <div className={styles.cuadricula}>
        {jornadas.map((jornada) => (
          <TarjetaJornada key={jornada._id} jornada={jornada} alSolicitar={alSolicitar} />
        ))}
      </div>
    </div>
  );
}