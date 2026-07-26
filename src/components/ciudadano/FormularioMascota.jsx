import { useState } from 'react';
import styles from './FormularioMascota.module.css';

// formulario para que un ciudadano ya logueado registre una mascota
export default function FormularioMascota() {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('PERRO');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('MACHO');

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

    // sacamos el token que guardamos en el navegador cuando el usuario inicio sesion
    const token = localStorage.getItem('token');

    if (!token) {
      // esto pasa si alguien intenta registrar una mascota sin haber iniciado sesion
      setErrorGeneral('Debes iniciar sesión antes de registrar una mascota.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:8000/api/mascotas/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // esto es lo que le prueba al backend quien esta haciendo la peticion
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, especie, raza, edad, sexo }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensajeExito(datos.message);
        // limpiamos el formulario para que quede listo por si quiere registrar otra
        setNombre('');
        setRaza('');
        setEdad('');
        setEspecie('PERRO');
        setSexo('MACHO');
      } else {
        // si el token vencio o no es valido, el backend contesta 401 y aqui lo mostramos
        setErrorGeneral(datos.error || 'No se pudo registrar la mascota.');
      }
    } catch (error) {
      setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
    }
  }

  return (
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

      <button type="submit" className={styles['btn-appet']}>Registrar mascota</button>

      <span className={styles.error}>{errorGeneral}</span>
      {mensajeExito && <p className={styles['mensaje-exito']}>{mensajeExito}</p>}

    </form>
  );
}