import { useState } from 'react';
import Usuario from '../../models/Usuario.js';
import styles from './RecuperarContrasena.module.css';

// pantalla de recuperar contraseña, va en dos pasos:
// primero el usuario escribe su correo y pedimos el código al backend
// despues escribe ese código junto con su nueva contrasena
export default function RecuperarContrasena({ alVolver }) {
  const [paso, setPaso] = useState('pedir');

  // datos del paso 1 (pedir el código)
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [tokenSimulado, setTokenSimulado] = useState('');

  // datos del paso 2 (cambiar la contraseña)
  const [token, setToken] = useState('');
  const [errorToken, setErrorToken] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [errorNuevaContrasena, setErrorNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [errorConfirmar, setErrorConfirmar] = useState('');

  const [mensajeExito, setMensajeExito] = useState('');
  const [errorGeneral, setErrorGeneral] = useState('');

  // se ejecuta cuando el usuario pulsa Enviar en el paso del correo
  async function manejarEnvioCorreo(evento) {
    evento.preventDefault();
    setMensajeExito('');
    setErrorGeneral('');

    if (!Usuario.validarFormatoCorreo(email)) {
      setErrorEmail('Ingresa un correo válido.');
      return;
    }
    setErrorEmail('');

    try {
      const respuesta = await fetch('http://localhost:8000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // todavia no hay servidor de correo conectado, asi que mostramos
        // el codigo aqui mismo en vez de mandarlo por email
        setTokenSimulado(datos.tokenSimulado || '');
        setPaso('cambiar');
      } else {
        setErrorEmail(datos.error || 'No se pudo procesar la solicitud.');
      }
    } catch (error) {
      // esto pasa si el servidor no está prendido o no hay internet
      setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
    }
  }

  // se ejecuta cuando el usuario pulsa "ambiar contraseña en el paso 2
  async function manejarEnvioCambio(evento) {
    evento.preventDefault();
    setMensajeExito('');
    setErrorGeneral('');

    let esValido = true;

    if (!token.trim()) {
      setErrorToken('El código es obligatorio.');
      esValido = false;
    } else {
      setErrorToken('');
    }

    if (!Usuario.validarSeguridadContrasena(nuevaContrasena)) {
      setErrorNuevaContrasena('Mínimo 8 caracteres, una mayúscula y un número.');
      esValido = false;
    } else {
      setErrorNuevaContrasena('');
    }

    if (confirmarContrasena !== nuevaContrasena) {
      setErrorConfirmar('Las contraseñas no coinciden.');
      esValido = false;
    } else {
      setErrorConfirmar('');
    }

    if (!esValido) return;

    try {
      const respuesta = await fetch('http://localhost:8000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          // el backend siempre genera el codigo en mayusculas, esto evita
          // que falle solo porque el usuario lo escribio en minuscula
          token: token.trim().toUpperCase(),
          nuevaContrasena,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensajeExito(datos.message || 'Contraseña actualizada correctamente.');
        // esperamos un poco para que el usuario alcance a leer el mensaje
        // y despues lo regresamos solo a la pantalla de login
        setTimeout(() => {
          alVolver();
        }, 1500);
      } else {
        setErrorToken(datos.error || 'No se pudo actualizar la contraseña.');
      }
    } catch (error) {
      setErrorGeneral('No se pudo conectar con el servidor. Intenta más tarde.');
    }
  }

  // paso 2: pedir el codigo y la nueva contrasena
  if (paso === 'cambiar') {
    return (
      <div>
        <p className={styles.instrucciones}>
          Ingresa el código que te enviamos y tu nueva contraseña.
        </p>

        {tokenSimulado && (
          <p className={styles['mensaje-exito']}>
            Modo de prueba: tu código es <strong>{tokenSimulado}</strong> (en producción llegaría por correo).
          </p>
        )}

        <form className={styles.formulario} onSubmit={manejarEnvioCambio}>
          <div className={styles.campo}>
            <label htmlFor="token" className="form-label">Código de verificación</label>
            <input
              type="text"
              id="token"
              className="form-control"
              value={token}
              onChange={(evento) => setToken(evento.target.value)}
            />
            <span className={styles.error}>{errorToken}</span>
          </div>

          <div className={styles.campo}>
            <label htmlFor="nueva-contrasena" className="form-label">Nueva contraseña</label>
            <input
              type="password"
              id="nueva-contrasena"
              className="form-control"
              placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número"
              value={nuevaContrasena}
              onChange={(evento) => setNuevaContrasena(evento.target.value)}
            />
            <span className={styles.error}>{errorNuevaContrasena}</span>
          </div>

          <div className={styles.campo}>
            <label htmlFor="confirmar-contrasena" className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmar-contrasena"
              className="form-control"
              value={confirmarContrasena}
              onChange={(evento) => setConfirmarContrasena(evento.target.value)}
            />
            <span className={styles.error}>{errorConfirmar}</span>
          </div>

          <button type="submit" className={styles['btn-appet']}>Cambiar contraseña</button>

          <span className={styles.error}>{errorGeneral}</span>
          {mensajeExito && <p className={styles['mensaje-exito']}>{mensajeExito}</p>}
        </form>

        {/* por si el codigo ya vencio y necesita pedir uno nuevo */}
        <button type="button" className={styles['link-volver']} onClick={() => setPaso('pedir')}>
          ← Volver a pedir el código
        </button>
      </div>
    );
  }

  // paso 1: pedir el correo
  return (
    <div>
      <p className={styles.instrucciones}>
        Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
      </p>

      <form className={styles.formulario} onSubmit={manejarEnvioCorreo}>
        <div className={styles.campo}>
          <label htmlFor="email-recuperar" className="form-label">Correo Electrónico</label>
          <input
            type="email"
            id="email-recuperar"
            className="form-control"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
          <span className={styles.error}>{errorEmail}</span>
        </div>

        <button type="submit" className={styles['btn-appet']}>Enviar</button>

        <span className={styles.error}>{errorGeneral}</span>
      </form>

      {/* botón, no link, para volver a las pestañas de login / registro */}
      <button type="button" className={styles['link-volver']} onClick={alVolver}>
        ← Volver a iniciar sesión
      </button>
    </div>
  );
}