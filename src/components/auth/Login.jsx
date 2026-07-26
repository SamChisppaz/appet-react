import { useState } from 'react';
import FormularioLogin from './FormularioLogin.jsx';
import FormularioRegistro from './FormularioRegistro.jsx';
import RecuperarContrasena from './RecuperarContrasena.jsx';
import logo from '../../assets/Appet.svg';
import styles from './Login.module.css';

// pantalla de bienvenida, con el logo a la izquierda, y a la derecha las pestanas
// para cambiar entre iniciar sesion y registrarse
// "alAutenticar" viene desde App.jsx: la llamamos cuando el login o el registro
// salen bien para que App.jsx cambie a la pantalla de registrar mascota
export default function Login({ alAutenticar }) {
  // guarda cuál pestana está activa ahora mismo, empieza en login
  const [pestanaActiva, setPestanaActiva] = useState('login');

  // si es true, se muestra la pantalla de recuperar contraseña en vez de las pestanas
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false);

  return (
    <main className={styles.pagina}>
      <div className={styles.tarjeta}>

        {/* el panel izquierdo tiene logo y descripción siempre igual no cambia */}
        <div className={styles['panel-izquierdo']}>
          <h1>Bienvenido a</h1>
          <img src={logo} alt="Logo APPET" className={styles.logo} />
          <p className={styles.descripcion}>
            Accede a los servicios gratuitos de esterilización,
            vacunación y adopción que la alcaldía tiene para ti.
          </p>
          <p className={styles.eslogan}>¡Cuidemos juntos a los más pequeños de la casa!</p>
        </div>

        {/* en el panel derecho pestanas y el formulario que corresponda */}
        <div className={styles['panel-derecho']}>
          <h2>Accede a tu cuenta</h2>

          {mostrarRecuperar ? (
            <RecuperarContrasena alVolver={() => setMostrarRecuperar(false)} />
          ) : (
            <>
              <div className={styles.pestanas}>
                {/* al hacer clic, cambia pestanaActiva  */}
                <button
                  className={`${styles.pestana} ${pestanaActiva === 'login' ? styles.activa : ''}`}
                  onClick={() => setPestanaActiva('login')}
                >
                  Iniciar Sesión
                </button>
                <button
                  className={`${styles.pestana} ${pestanaActiva === 'registro' ? styles.activa : ''}`}
                  onClick={() => setPestanaActiva('registro')}
                >
                  Registrarse
                </button>
              </div>

              {/* según la pestaña activa muestra un formulario u otro */}
              {pestanaActiva === 'login' ? (
                <FormularioLogin
                  alOlvidarContrasena={() => setMostrarRecuperar(true)}
                  alIniciarSesionExitoso={alAutenticar}
                />
              ) : (
                // el registro no da un token asi que  aqui solo se cambia a la pestaña de iniciar sesion
                // el sistema redirige al ciudadano a la  pantalla de login, cuando inicie sesion de verdad,
                // ese login llevara a la pantalla de Registrar mascota
                <FormularioRegistro alRegistroExitoso={() => setPestanaActiva('login')} />
              )}
            </>
          )}

        </div>
      </div>
    </main>
  );
}