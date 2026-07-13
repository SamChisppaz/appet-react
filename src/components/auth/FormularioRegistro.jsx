import { useState } from 'react';
import Usuario from '../../models/Usuario.js';
import Ciudadano from '../../models/Ciudadano.js';
import styles from './FormularioRegistro.module.css';

// formulario de registro que crea un ciudadano nuevo después de validar sus datos
export default function FormularioRegistro() {
  // lo que el usuario va escribiendo en cada campo
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  // mensajes de error debajo de cada campo
  const [errorNombre, setErrorNombre] = useState('');
  const [errorApellido, setErrorApellido] = useState('');
  const [errorCelular, setErrorCelular] = useState('');
  const [errorDireccion, setErrorDireccion] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');

  // mensaje que aparece cuando el registro pasó la validación
  const [mensajeExito, setMensajeExito] = useState('');

  // se ejecuta cuando el usuario le da clic a Crear cuenta
  function manejarEnvio(evento) {
    evento.preventDefault();

    let esValido = true;
    setMensajeExito('');

    // los 4 campos de abajo solo necesitan no estar vacíos
    if (!nombre.trim()) {
      setErrorNombre('El nombre es obligatorio.');
      esValido = false;
    } else {
      setErrorNombre('');
    }

    if (!apellido.trim()) {
      setErrorApellido('El apellido es obligatorio.');
      esValido = false;
    } else {
      setErrorApellido('');
    }

    if (!celular.trim()) {
      setErrorCelular('El celular es obligatorio.');
      esValido = false;
    } else {
      setErrorCelular('');
    }

    if (!direccion.trim()) {
      setErrorDireccion('La dirección es obligatoria.');
      esValido = false;
    } else {
      setErrorDireccion('');
    }

    // el correo y la contrasena si usan las validaciones de la clase Usuario
    if (!Usuario.validarFormatoCorreo(email)) {
      setErrorEmail('Ingresa un correo válido.');
      esValido = false;
    } else {
      setErrorEmail('');
    }

    if (!Usuario.validarSeguridadContrasena(contrasena)) {
      setErrorContrasena('Mínimo 8 caracteres, una mayúscula y un número.');
      esValido = false;
    } else {
      setErrorContrasena('');
    }

    if (esValido) {
      // creamos el ciudadano de verdad con la clase, para probar que sí funciona
      const nuevoCiudadano = new Ciudadano(nombre, apellido, celular, direccion, email, contrasena);
      setMensajeExito(
        `¡Bienvenido, ${nuevoCiudadano.nombreCompleto}! (falta conectar con el backend para guardar tu cuenta)`
      );
    }
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>

      {/* nombre y apellido van en la misma fila, usando la cuadrícula de Bootstrap */}
      <div className="row g-2">
        <div className="col-6">
          <div className={styles.campo}>
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
            />
            <span className={styles.error}>{errorNombre}</span>
          </div>
        </div>

        <div className="col-6">
          <div className={styles.campo}>
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <input
              type="text"
              id="apellido"
              className="form-control"
              value={apellido}
              onChange={(evento) => setApellido(evento.target.value)}
            />
            <span className={styles.error}>{errorApellido}</span>
          </div>
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="celular" className="form-label">Celular</label>
        <input
          type="tel"
          id="celular"
          className="form-control"
          placeholder="300 123 4567"
          value={celular}
          onChange={(evento) => setCelular(evento.target.value)}
        />
        <span className={styles.error}>{errorCelular}</span>
      </div>

      <div className={styles.campo}>
        <label htmlFor="direccion" className="form-label">Dirección</label>
        <input
          type="text"
          id="direccion"
          className="form-control"
          placeholder="Calle 10 # 20-30"
          value={direccion}
          onChange={(evento) => setDireccion(evento.target.value)}
        />
        <span className={styles.error}>{errorDireccion}</span>
      </div>

      <div className={styles.campo}>
        <label htmlFor="email-reg" className="form-label">Correo Electrónico</label>
        <input
          type="email"
          id="email-reg"
          className="form-control"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />
        <span className={styles.error}>{errorEmail}</span>
      </div>

      <div className={styles.campo}>
        <label htmlFor="password-reg" className="form-label">Contraseña</label>
        <input
          type="password"
          id="password-reg"
          className="form-control"
          placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
          value={contrasena}
          onChange={(evento) => setContrasena(evento.target.value)}
        />
        <span className={styles.error}>{errorContrasena}</span>
      </div>

      <button type="submit" className={styles['btn-appet']}>Crear cuenta</button>

      {mensajeExito && <p className={styles['mensaje-exito']}>{mensajeExito}</p>}

    </form>
  );
}