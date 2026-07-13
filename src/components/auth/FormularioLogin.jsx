import { useState } from 'react';
import Usuario from '../../models/Usuario.js';
import styles from './FormularioLogin.module.css';

// formulario de login valida el correo y la contraseña antes de continuar
export default function FormularioLogin() {
  // lo que el usuario va escribiendo en cada campo
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  // mensajes de error que se muestran debajo de cada campo
  const [errorEmail, setErrorEmail] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');

  // mensaje que aparece solo cuando todo pasó la validación
  const [mensajeExito, setMensajeExito] = useState('');

  // se ejecuta cuando el usuario le da clic a Iniciar Sesión
  function manejarEnvio(evento) {
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

    // si todo pasó, por ahora solo lo confirmamos (todavía no hay backend)
    if (esValido) {
      setMensajeExito('datos válidos (falta conectar con el backend para iniciar sesión de verdad)');
    }
  }

  // los campos correo y contrasena con su mensaje de error debajo, el botón, el link de recuperar contraseña, y el mensaje
  // de exito que solo aparece si el formulario pasó la validación
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
      <a href="#" className={styles['link-olvide']}>¿Olvidaste tu contraseña?</a>

      {mensajeExito && <p className={styles['mensaje-exito']}>{mensajeExito}</p>}

    </form>
  );
}