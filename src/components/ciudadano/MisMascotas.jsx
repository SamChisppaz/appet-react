import { useState, useEffect } from 'react';
import TarjetaMascota from './TarjetaMascota.jsx';
import MensajeVacio from '../comunes/MensajeVacio.jsx';
import styles from './MisMascotas.module.css';
import { API_URL } from '../../config.js';

// pantalla "mis mascotas": lista de las mascotas del ciudadano con sesión iniciada
// prop recibida desde App.jsx:
// alEditar: función que abre el formulario de edición con la mascota elegida
export default function MisMascotas({ alEditar }) {
  // mascotas: lista que llega del backend
  // cargando: true mientras llega la respuesta
  // errorGeneral: texto del error a mostrar, vacío si todo salió bien
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState('');

  // con [] al final, pedir las mascotas una sola vez al abrir la pantalla
  useEffect(() => {
    async function cargarMascotas() {
      // token guardado en localStorage al iniciar sesión
      const token = localStorage.getItem('token');

      try {
        // el token va en el header para que el backend sepa de qué ciudadano son las mascotas
        // API_URL cambia segun donde corra la app: localhost o Vercel
        const respuesta = await fetch(`${API_URL}/api/mascotas`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          // respuesta correcta: guardar la lista para mostrarla
          setMascotas(datos);
        } else {
          // respuesta con error (ej. token vencido): mostrar el mensaje del backend
          setErrorGeneral(datos.error || 'No se pudieron cargar las mascotas.');
        }
      } catch {
        // el servidor no respondió (backend apagado o sin conexión)
        setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
      }

      // la petición terminó, con éxito o con error: ocultar el "cargando"
      setCargando(false);
    }

    cargarMascotas();
  }, []);

  // eliminar una mascota; se ejecuta al hacer clic en el botón "Eliminar" de una tarjeta
  async function eliminarMascota(mascota) {
    // confirm abre un cuadro con "Aceptar" y "Cancelar"; si cancela, no se hace nada
    const confirmado = window.confirm(`¿Seguro que quieres eliminar a ${mascota.nombre}?`);

    if (!confirmado) {
      return;
    }

    // borrar el error anterior, si lo había
    setErrorGeneral('');

    const token = localStorage.getItem('token');

    try {
      // el id de la mascota va al final de la dirección para indicar cuál borrar
      // API_URL cambia segun donde corra la app: localhost o Vercel
      const respuesta = await fetch(`${API_URL}/api/mascotas/${mascota._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // quitar la mascota de la lista en pantalla, sin volver a pedir todo al backend
        // listaActual es la lista más reciente; filter deja todas menos la eliminada
        setMascotas((listaActual) => listaActual.filter((m) => m._id !== mascota._id));
      } else {
        setErrorGeneral(datos.error || 'No se pudo eliminar la mascota.');
      }
    } catch {
      // el servidor no respondió (backend apagado o sin conexión)
      setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
    }
  }

  return (
    <div>
      <h1 className={styles.titulo}>Mis mascotas</h1>

      {cargando && <p className={styles.estado}>Cargando mascotas...</p>}

      {errorGeneral && <p className={styles.error}>{errorGeneral}</p>}

      {/* mensaje de lista vacía: solo si terminó de cargar, sin error y sin mascotas */}
      {!cargando && !errorGeneral && mascotas.length === 0 && (
        <MensajeVacio texto="Aún no tienes mascotas registradas." />
      )}

      <div className={styles.cuadricula}>
        {/* una tarjeta por mascota; key es un identificador único  */}
        {/* alEditar y alEliminar son las funciones que la tarjeta ejecuta al pulsar cada botón */}
        {mascotas.map((mascota) => (
          <TarjetaMascota
            key={mascota._id}
            mascota={mascota}
            alEditar={alEditar}
            alEliminar={eliminarMascota}
          />
        ))}
      </div>
    </div>
  );
}