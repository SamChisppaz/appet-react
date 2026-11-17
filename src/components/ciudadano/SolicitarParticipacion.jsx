import { useState, useEffect } from 'react';
import TarjetaJornada from './TarjetaJornada.jsx';
import BotonCargando from '../comunes/BotonCargando.jsx';
import MensajeVacio from '../comunes/MensajeVacio.jsx';
import MensajeError from '../comunes/MensajeError.jsx';
import styles from './SolicitarParticipacion.module.css';

// pantalla para elegir con qué mascotas se participa en una jornada
// jornada: la jornada elegida en la pantalla anterior
export default function SolicitarParticipacion({ jornada }) {
  // mascotas: todas las del ciudadano
  // seleccionadas: ids de las mascotas marcadas
  const [mascotas, setMascotas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // pedir las mascotas del ciudadano una sola vez al abrir la pantalla
  useEffect(() => {
    async function cargarMascotas() {
      const token = localStorage.getItem('token');

      try {
        const respuesta = await fetch('http://localhost:8000/api/mascotas', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          setMascotas(datos);
        } else {
          setErrorGeneral(datos.error || 'No se pudieron cargar las mascotas.');
        }
      } catch {
        setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
      }

      setCargando(false);
    }

    cargarMascotas();
  }, []);

  // marca la mascota si no estaba marcada y la desmarca si ya lo estaba
  function alternarMascota(id) {
    setSeleccionadas(
      seleccionadas.includes(id) ? seleccionadas.filter((m) => m !== id) : [...seleccionadas, id]
    );
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setMensajeExito('');
    setErrorGeneral('');

    if (seleccionadas.length === 0) {
      setErrorGeneral('Elige al menos una mascota.');
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await fetch('http://localhost:8000/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ jornada: jornada._id, mascotas: seleccionadas }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensajeExito(datos.message);
        setSeleccionadas([]); // deja las casillas desmarcadas
      } else {
        // el backend responde con el motivo (ya existe la solicitud, jornada no disponible, etc.)
        setErrorGeneral(datos.error);
      }
    } catch {
      setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
    }

    setEnviando(false);
  }

  return (
    <div>
      <h1 className={styles.titulo}>Solicitar participación</h1>

      <div className={styles.contenedor}>
        {/* sin alSolicitar, la tarjeta se muestra sin botón */}
        <TarjetaJornada jornada={jornada} />

        {cargando && <MensajeVacio texto="Cargando mascotas..." />}

        {!cargando && !errorGeneral && mascotas.length === 0 && (
          <MensajeVacio texto="Aún no tienes mascotas registradas." />
        )}

        {mascotas.length > 0 && (
          <form className={styles.formulario} onSubmit={manejarEnvio}>
            <p className={styles.subtitulo}>Elige las mascotas que participarán:</p>

            {mascotas.map((mascota) => (
              <div className="form-check" key={mascota._id}>
                <input
                  type="checkbox"
                  id={mascota._id}
                  className="form-check-input"
                  checked={seleccionadas.includes(mascota._id)}
                  onChange={() => alternarMascota(mascota._id)}
                />
                <label htmlFor={mascota._id} className="form-check-label">{mascota.nombre}</label>
              </div>
            ))}

            <BotonCargando cargando={enviando} texto="Enviar solicitud" textoCargando="Enviando..." />
          </form>
        )}

        <MensajeError texto={errorGeneral} />
        {mensajeExito && <p className={styles.exito}>{mensajeExito}</p>}
      </div>
    </div>
  );
}