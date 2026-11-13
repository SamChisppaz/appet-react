import { useState } from 'react';
import Usuario from '../../models/Usuario.js';
import styles from './Perfil.module.css';

// pantalla para actualizar el celular, la direccion y/o la contraseña del ciudadano 
// "usuario" viene desde App.jsx, se necesita para saber el id del usuario que se va a actualizar
export default function Perfil({ usuario }) {
  const [celular, setCelular] = useState('');
  const [direccion, setDireccion] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');

  const [errorCelular, setErrorCelular] = useState('');
  const [errorPasswordActual, setErrorPasswordActual] = useState('');
  const [errorPasswordNueva, setErrorPasswordNueva] = useState('');
  const [errorPasswordConfirmar, setErrorPasswordConfirmar] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');

  const [mensajeExito, setMensajeExito] = useState('');

  async function manejarEnvio(evento) {
    evento.preventDefault();

    let esValido = true;
    setMensajeExito('');
    setErrorGeneral('');
    setErrorCelular('');
    setErrorPasswordActual('');
    setErrorPasswordNueva('');
    setErrorPasswordConfirmar('');

    // el celular es opcional en este formulario (solo se manda si el
    // usuario escribio algo), pero si escribio algo debe ser valido
    if (celular.trim() && celular.trim().length < 10) {
      setErrorCelular('El celular debe tener mínimo 10 dígitos.');
      esValido = false;
    }

    // el usuario quiere cambiar la contraseña si escribio algo en
    // cualquiera de los tres campos de contraseña
    const quiereCambiarPassword =
      passwordActual.trim() || passwordNueva.trim() || passwordConfirmar.trim();

    if (quiereCambiarPassword) {
      if (!passwordActual.trim()) {
        setErrorPasswordActual('Ingresa tu contraseña actual.');
        esValido = false;
      }

      if (!Usuario.validarSeguridadContrasena(passwordNueva)) {
        setErrorPasswordNueva('Mínimo 8 caracteres, una mayúscula y un número.');
        esValido = false;
      }

      if (passwordConfirmar !== passwordNueva) {
        setErrorPasswordConfirmar('Las contraseñas no coinciden.');
        esValido = false;
      }
    }

    // si no escribio nada en ningun campo, no hay nada que actualizar
    const hayCambios = celular.trim() || direccion.trim() || quiereCambiarPassword;

    if (!hayCambios) {
      setErrorGeneral('Completa al menos un campo para actualizar.');
      esValido = false;
    }

    if (!esValido) return;

    // solo se  manda al backend los campos que el usuario si lleno
    const cambios = {};
    if (celular.trim()) cambios.celular = celular.trim();
    if (direccion.trim()) cambios.direccion = direccion.trim();
    if (quiereCambiarPassword) {
      cambios.contrasenaActual = passwordActual;
      cambios.contrasena = passwordNueva;
    }

    const token = localStorage.getItem('token');

    try {
      const respuesta = await fetch(`http://localhost:8000/api/users/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensajeExito('Perfil actualizado correctamente.');
        //se deja el celular y la direccion escritos para que el usuario vea lo que quedo guardado
        setPasswordActual('');
        setPasswordNueva('');
        setPasswordConfirmar('');
      } else {
        // si la contraseña actual esta mal, el backend lo dice en este campo
        setErrorPasswordActual(datos.error || 'No se pudo actualizar el perfil.');
      }
    } catch (error) {
      setErrorGeneral('No se pudo conectar con el servidor');
    }
  }

  return (
    <div className={styles.tarjeta}>
      <h1 className={styles.titulo}>Actualizar perfil</h1>

      <form className={styles.formulario} onSubmit={manejarEnvio}>

        <div className={styles.campo}>
          <label htmlFor="celular" className={`form-label ${styles.label}`}>
            Actualizar número de celular
          </label>
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
          <label htmlFor="direccion" className={`form-label ${styles.label}`}>
            Actualizar dirección
          </label>
          <input
            type="text"
            id="direccion"
            className="form-control"
            placeholder="Calle 10 # 20-30"
            value={direccion}
            onChange={(evento) => setDireccion(evento.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="password-actual" className={`form-label ${styles.label}`}>
            Contraseña actual
          </label>
          <input
            type="password"
            id="password-actual"
            className="form-control"
            placeholder="Tu contraseña actual"
            value={passwordActual}
            onChange={(evento) => setPasswordActual(evento.target.value)}
          />
          <span className={styles.error}>{errorPasswordActual}</span>
        </div>

        <div className={styles.campo}>
          <label htmlFor="password-nueva" className={`form-label ${styles.label}`}>
            Crear contraseña nueva
          </label>
          <input
            type="password"
            id="password-nueva"
            className="form-control"
            placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
            value={passwordNueva}
            onChange={(evento) => setPasswordNueva(evento.target.value)}
          />
          <span className={styles.error}>{errorPasswordNueva}</span>
        </div>

        <div className={styles.campo}>
          <label htmlFor="password-confirmar" className={`form-label ${styles.label}`}>
            Confirmar contraseña nueva
          </label>
          <input
            type="password"
            id="password-confirmar"
            className="form-control"
            placeholder="Repite la contraseña nueva"
            value={passwordConfirmar}
            onChange={(evento) => setPasswordConfirmar(evento.target.value)}
          />
          <span className={styles.error}>{errorPasswordConfirmar}</span>
        </div>

        <button type="submit" className={styles['btn-appet']}>Actualizar perfil</button>

        <span className={styles.error}>{errorGeneral}</span>
        {mensajeExito && <p className={styles['mensaje-exito']}>{mensajeExito}</p>}

      </form>
    </div>
  );
}