import { useState } from 'react';
import Usuario from '../../models/Usuario.js';
import styles from './FormularioRegistro.module.css';

// formulario de registro que crea un ciudadano nuevo después de validar sus datos
// "alRegistroExitoso" viene desde Login.jsx, la llamamos cuando el backend
// confirma que el registro funciono, para cambiar a la pestaña de Login
export default function FormularioRegistro({ alRegistroExitoso }) {
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
  async function manejarEnvio(evento) {
    evento.preventDefault();

    let esValido = true;
    setMensajeExito('');

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
    } else if (celular.trim().length < 10) {
    setErrorCelular('El celular debe tener mínimo 10 dígitos.');
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
      // mandamos los datos al backend para que los guarde en la base de datos
      try {
        const respuesta = await fetch('http://localhost:8000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, apellido, celular, direccion, email, contrasena }),
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
          setMensajeExito(datos.message || '¡Registro exitoso!');

          // avisa  a Login.jsx que cambie a la pestaña de "Iniciar Sesión"
          if (alRegistroExitoso) {
            setTimeout(() => {
              alRegistroExitoso();
            }, 1500);
          }
        } else {
          // el backend nos dice que salió mal 
          setErrorEmail(datos.error || 'No se pudo completar el registro.');
        }
      } catch (error) {
        // esto pasa si el servidor no está prendido o no hay internet
        setErrorEmail('No se pudo conectar con el servidor. Intenta más tarde.');
      }
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