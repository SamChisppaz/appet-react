import { useState } from 'react';
import styles from './FormularioMascota.module.css';
import { API_URL } from '../../config.js';

// formulario para que un ciudadano ya logueado registre una mascota
// también sirve para editar una mascota ya registrada
// props (opcionales, solo se usan al editar):
// mascota: datos de la mascota a editar
// alTerminarEdicion: función que regresa a la lista de mascotas, al guardar o al cancelar
export default function FormularioMascota({ mascota, alTerminarEdicion }) {
  // true si el formulario se usa para editar, false si se usa para registrar
  const editando = Boolean(mascota);

  // al editar, los campos empiezan con los datos de la mascota; al registrar, empiezan vacíos
  const [nombre, setNombre] = useState(editando ? mascota.nombre : '');
  const [especie, setEspecie] = useState(editando ? mascota.especie : 'PERRO');
  const [raza, setRaza] = useState(editando ? mascota.raza : '');
  const [edad, setEdad] = useState(editando ? mascota.edad : '');
  const [sexo, setSexo] = useState(editando ? mascota.sexo : 'MACHO');

  const [errorNombre, setErrorNombre] = useState('');
  const [errorRaza, setErrorRaza] = useState('');
  const [errorEdad, setErrorEdad] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');

  const [mensajeExito, setMensajeExito] = useState('');

  async function manejarEnvio(evento) {
    evento.preventDefault();

    let esValido = true;
    setMensajeExito('');
    setErrorGeneral('');

    if (!nombre.trim()) {
      setErrorNombre('El nombre de la mascota es obligatorio.');
      esValido = false;
    } else {
      setErrorNombre('');
    }

    if (!raza.trim()) {
      setErrorRaza('La raza es obligatoria.');
      esValido = false;
    } else {
      setErrorRaza('');
    }

    if (!edad.trim()) {
      setErrorEdad('La edad es obligatoria (ej: "2 años" o "6 meses").');
      esValido = false;
    } else {
      setErrorEdad('');
    }

    if (!esValido) return;

    // saca el token que quedó guardado en el navegador cuando el usuario inició sesion
    const token = localStorage.getItem('token');

    if (!token) {
      // esto pasa si alguien intenta registrar una mascota sin haber iniciado sesion
      setErrorGeneral('Debes iniciar sesión antes de guardar la mascota.');
      return;
    }

    // al editar se usa PUT con el id de la mascota; al registrar se usa POST
    // API_URL cambia segun donde corra la app: localhost o Vercel
    const url = editando
      ? `${API_URL}/api/mascotas/${mascota._id}`
      : `${API_URL}/api/mascotas/register`;
    const metodo = editando ? 'PUT' : 'POST';

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          // esto es lo que le prueba al backend quien esta haciendo la peticion
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, especie, raza, edad, sexo }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // al editar, regresar a la lista de mascotas y terminar aquí
        if (editando) {
          alTerminarEdicion();
          return;
        }

        setMensajeExito(datos.message);
        // limpia el formulario para que quede listo por si quiere registrar otra
        setNombre('');
        setRaza('');
        setEdad('');
        setEspecie('PERRO');
        setSexo('MACHO');
      } else {
        // si el token vencio o no es valido, el backend contesta 401 y aqui se muestra
        setErrorGeneral(datos.error || 'No se pudo guardar la mascota.');
      }
    } catch (error) {
      setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
    }
  }

  return (
    <div className={styles.tarjeta}>
      <h1 className={styles.titulo}>{editando ? 'Editar mascota' : 'Registrar mascota'}</h1>

      <form className={styles.formulario} onSubmit={manejarEnvio}>

      <div className={styles.campo}>
        <label htmlFor="nombre-mascota" className="form-label">Nombre</label>
        <input
          type="text"
          id="nombre-mascota"
          className="form-control"
          value={nombre}
          onChange={(evento) => setNombre(evento.target.value)}
        />
        <span className={styles.error}>{errorNombre}</span>
      </div>

      {/* selector tipo botón gato / perro*/}
      <div className={styles.campo}>
        <label className="form-label">Especie</label>
        <div className={styles.selectorBotones}>
          <button
            type="button"
            className={especie === 'PERRO' ? styles.botonActivo : styles.boton}
            onClick={() => setEspecie('PERRO')}
          >
            🐶 Perro
          </button>
          <button
            type="button"
            className={especie === 'GATO' ? styles.botonActivo : styles.boton}
            onClick={() => setEspecie('GATO')}
          >
            🐱 Gato
          </button>
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="raza" className="form-label">Raza</label>
        <input
          type="text"
          id="raza"
          className="form-control"
          value={raza}
          onChange={(evento) => setRaza(evento.target.value)}
        />
        <span className={styles.error}>{errorRaza}</span>
      </div>

      <div className={styles.campo}>
        <label htmlFor="edad" className="form-label">Edad</label>
        <input
          type="text"
          id="edad"
          className="form-control"
          placeholder='Ej: "2 años" o "6 meses"'
          value={edad}
          onChange={(evento) => setEdad(evento.target.value)}
        />
        <span className={styles.error}>{errorEdad}</span>
      </div>

      {/* selector tipo botón macho / hembra */}
      <div className={styles.campo}>
        <label className="form-label">Sexo</label>
        <div className={styles.selectorBotones}>
          <button
            type="button"
            className={sexo === 'MACHO' ? styles.botonActivo : styles.boton}
            onClick={() => setSexo('MACHO')}
          >
            Macho
          </button>
          <button
            type="button"
            className={sexo === 'HEMBRA' ? styles.botonActivo : styles.boton}
            onClick={() => setSexo('HEMBRA')}
          >
            Hembra
          </button>
        </div>
      </div>

      <button type="submit" className={styles['btn-appet']}>
        {editando ? 'Guardar cambios' : 'Registrar mascota'}
      </button>

      {/* botón cancelar: solo aparece al editar, regresa a la lista sin guardar */}
      {editando && (
        <button type="button" className="btn btn-outline-secondary" onClick={alTerminarEdicion}>
          Cancelar
        </button>
      )}

      <span className={styles.error}>{errorGeneral}</span>
      {mensajeExito && <p className={styles['mensaje-exito']}>{mensajeExito}</p>}

      </form>
    </div>
  );
}