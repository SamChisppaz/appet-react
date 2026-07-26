import { useState } from 'react';
import Usuario from '../../models/Usuario.js';
import styles from './FormularioLogin.module.css';

// formulario de login valida el correo y la contraseña antes de continuar
// alIniciarSesionExitoso viene desde Login.jsx: la llamamos cuando el
// backend confirma que el login funciono, para cambiar de pantalla
export default function FormularioLogin({ alOlvidarContrasena, alIniciarSesionExitoso }) {
  // lo que el usuario va escribiendo en cada campo
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  // mensajes de error que se muestran debajo de cada campo
  const [errorEmail, setErrorEmail] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');

  // mensaje que aparece solo cuando todo pasó la validación
  const [mensajeExito, setMensajeExito] = useState('');

  // se ejecuta cuando el usuario le da clic a Iniciar Sesión
  async function manejarEnvio(evento) {
    evento.preventDefault(); // evita que la página se recargue

    let esValido = true;
    setMensajeExito('');

    // verifica que el correo tenga un formato válido
    if (!Usuario.validarFormatoCorreo(email)) {
      setErrorEmail('Ingresa un correo válido.');
      esValido = false;
    } else {
      setErrorEmail('');
    }

    // verifica que la contraseña no esté vacía
    if (!contrasena.trim()) {
      setErrorContrasena('La contraseña es obligatoria.');
      esValido = false;
    } else {
      setErrorContrasena('');
    }

    // si todo pasó la validación, se pregunta al backend si las credenciales son correctas
    if (esValido) {
      try {
        const respuesta = await fetch('http://localhost:8000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, contrasena }),
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          // guardamos el token en el navegador persiste aunque se recargue la pagina
          localStorage.setItem('token', datos.token);
          setMensajeExito(`¡Bienvenido, ${datos.usuario.nombre}!`);

          // despues se avisa a Login.jsx (que a su vez avisa a App.jsx) que  ya puede cambiar a la pantalla de registrar mascota
          if (alIniciarSesionExitoso) {
            setTimeout(() => {
              alIniciarSesionExitoso();
            }, 1000);
          }
        } else {
          // el backend nos dice que salió mal 
          setErrorContrasena(datos.error || 'No se pudo iniciar sesión.');
        }
      } catch (error) {
        // esto pasa si el servidor no está prendido o no hay internet
        setErrorContrasena('No se pudo conectar con el servidor. Intenta más tarde.');
      }
    }
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>

      <div className={styles.campo}>
        <label htmlFor="email" className="form-label">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          className="form-control"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />
        <span className={styles.error}>{errorEmail}</span>
      </div>

      <div className={styles.campo}>
        <label htmlFor="password" className="form-label">Contraseña</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={contrasena}
          onChange={(evento) => setContrasena(evento.target.value)}
        />
        <span className={styles.error}>{errorContrasena}</span>
      </div>

      <button type="submit" className={styles['btn-appet']}>Iniciar Sesión</button>

      {/*  un boton que llama a alOlvidarContrasena, que viene desde Login.jsx */}
      <button type="button" className={styles['link-olvide']} onClick={alOlvidarContrasena}>
        ¿Olvidaste tu contraseña?
      </button>

      {mensajeExito && <p className={styles['mensaje-exito']}>{mensajeExito}</p>}

    </form>
  );
}