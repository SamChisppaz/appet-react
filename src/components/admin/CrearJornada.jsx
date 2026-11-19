import { useState } from 'react';
import BotonCargando from '../comunes/BotonCargando.jsx';
import MensajeError from '../comunes/MensajeError.jsx';
import styles from './CrearJornada.module.css';
import { API_URL } from '../../config.js';

// valores con los que empieza el formulario (y con los que queda al guardar)
const datosVacios = {
  tipoServicio: 'VACUNACION',
  fecha: '',
  ciudad: '',
  ubicacion: '',
  horaInicio: '',
  horaFin: '',
};

// campos de texto obligatorios y el nombre con el que aparecen en el mensaje de error
const camposObligatorios = {
  fecha: 'La fecha',
  ciudad: 'La ciudad',
  ubicacion: 'La ubicación',
  horaInicio: 'La hora de inicio',
  horaFin: 'La hora de fin',
};

// fecha mínima para crear una jornada: hoy + 1 mes, en formato "AAAA-MM-DD"
// si el mes de destino tiene menos días (31 de enero + 1 mes), queda en el último día de ese mes
function obtenerFechaMinima() {
  const minima = new Date();
  const diaDeHoy = minima.getDate();

  // primero se pasa al día 1 para que setMonth no salte al mes siguiente
  minima.setDate(1);
  minima.setMonth(minima.getMonth() + 1);

  // el día 0 del mes siguiente es el último día del mes de destino
  const ultimoDia = new Date(minima.getFullYear(), minima.getMonth() + 1, 0).getDate();
  minima.setDate(Math.min(diaDeHoy, ultimoDia));

  return minima.toLocaleDateString('en-CA');
}

// formulario para que el administrador cree una jornada de vacunación o esterilización
export default function CrearJornada() {
  const [datos, setDatos] = useState(datosVacios);
  const [errores, setErrores] = useState({}); // un mensaje por campo con error
  const [errorGeneral, setErrorGeneral] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const fechaMinima = obtenerFechaMinima();

  // actualiza el campo que cambió, usando el "name" del input como clave
  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  // revisa los datos y devuelve un objeto con los errores encontrados (vacío si todo está bien)
  function validar() {
    const nuevosErrores = {};

    Object.keys(camposObligatorios).forEach((campo) => {
      if (!datos[campo].trim()) {
        nuevosErrores[campo] = `${camposObligatorios[campo]} es obligatoria.`;
      }
    });

    if (!nuevosErrores.fecha && datos.fecha < fechaMinima) {
      nuevosErrores.fecha = 'La jornada debe crearse con al menos un mes de anticipación.';
    }

    if (!nuevosErrores.horaInicio && !nuevosErrores.horaFin && datos.horaFin <= datos.horaInicio) {
      nuevosErrores.horaFin = 'La hora de fin debe ser posterior a la de inicio.';
    }

    return nuevosErrores;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setMensajeExito('');
    setErrorGeneral('');

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setCargando(true);

    try {
      // API_URL cambia segun donde corra la app: localhost o Vercel
      const respuesta = await fetch(`${API_URL}/api/jornadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // el token le dice al backend quién es y qué rol tiene
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(datos),
      });

      const datosRespuesta = await respuesta.json();

      if (respuesta.ok) {
        setMensajeExito(datosRespuesta.message);
        setDatos(datosVacios); // deja el formulario listo para crear otra jornada
      } else {
        // el backend responde con el motivo (sesión vencida, no es administrador, etc.)
        setErrorGeneral(datosRespuesta.error);
      }
    } catch {
      setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
    }

    setCargando(false);
  }

    return (
    // tarjeta blanca que envuelve todo el formulario
    <div className={styles.tarjeta}>
      <h1 className={styles.titulo}>Crear jornada</h1>

      <form className={styles.formulario} onSubmit={manejarEnvio}>

        {/* lista desplegable para elegir el servicio, empieza en Vacunación */}
        <div className={styles.campo}>
          <label htmlFor="tipoServicio" className="form-label">Tipo de servicio</label>
          {/* name debe ser igual a la clave de datos, así manejarCambio sabe qué campo actualizar */}
          <select
            id="tipoServicio"
            name="tipoServicio"
            className="form-select"
            value={datos.tipoServicio}
            onChange={manejarCambio}
          >
            {/* value es lo que se envía al backend, el texto es lo que ve el administrador */}
            <option value="VACUNACION">Vacunación</option>
            <option value="ESTERILIZACION">Esterilización</option>
          </select>
        </div>

        {/* calendario para elegir el día de la jornada */}
        <div className={styles.campo}>
          <label htmlFor="fecha" className="form-label">Fecha</label>
          {/* min bloquea en el calendario las fechas con menos de un mes de anticipación */}
          <input
            type="date"
            id="fecha"
            name="fecha"
            className="form-control"
            min={fechaMinima}
            value={datos.fecha}
            onChange={manejarCambio}
          />
          {/* muestra el error de la fecha solo si existe */}
          <MensajeError texto={errores.fecha} />
        </div>

        {/* campo de texto para la ciudad donde se hace la jornada */}
        <div className={styles.campo}>
          <label htmlFor="ciudad" className="form-label">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            className="form-control"
            value={datos.ciudad}
            onChange={manejarCambio}
          />
          <MensajeError texto={errores.ciudad} />
        </div>

        {/* campo de texto para el sitio exacto dentro de la ciudad */}
        <div className={styles.campo}>
          <label htmlFor="ubicacion" className="form-label">Ubicación</label>
          {/* placeholder es un ejemplo gris que desaparece al escribir */}
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            className="form-control"
            placeholder="Ej: Parque principal"
            value={datos.ubicacion}
            onChange={manejarCambio}
          />
          <MensajeError texto={errores.ubicacion} />
        </div>

        {/* las dos horas van una al lado de la otra en la misma fila */}
        <div className={styles.filaHoras}>
          {/* selector de hora de inicio, guarda el valor en formato HH:mm */}
          <div className={styles.campo}>
            <label htmlFor="horaInicio" className="form-label">Hora de inicio</label>
            <input
              type="time"
              id="horaInicio"
              name="horaInicio"
              className="form-control"
              value={datos.horaInicio}
              onChange={manejarCambio}
            />
            <MensajeError texto={errores.horaInicio} />
          </div>

          {/* selector de hora de fin, debe ser posterior a la de inicio (se valida en validar) */}
          <div className={styles.campo}>
            <label htmlFor="horaFin" className="form-label">Hora de fin</label>
            <input
              type="time"
              id="horaFin"
              name="horaFin"
              className="form-control"
              value={datos.horaFin}
              onChange={manejarCambio}
            />
            <MensajeError texto={errores.horaFin} />
          </div>
        </div>

        {/* botón de envío, mientras cargando es true muestra el texto de espera y no deja pulsar de nuevo */}
        <BotonCargando cargando={cargando} texto="Crear jornada" />

        {/* error que llega del backend o de la conexión (sesión vencida, fecha repetida, etc.) */}
        <MensajeError texto={errorGeneral} />

        {/* mensaje verde que aparece solo cuando la jornada se creó bien */}
        {mensajeExito && <p className={styles['mensaje-exito']}>{mensajeExito}</p>}
      </form>
    </div>
  );
}