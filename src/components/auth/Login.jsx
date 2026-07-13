import { useState } from 'react';
import FormularioLogin from './FormularioLogin.jsx';
import FormularioRegistro from './FormularioRegistro.jsx';
import logo from '../../assets/Appet.svg';
import styles from './Login.module.css';

// pantalla de bienvenida, con el logo a la izquierda, y a la derecha las pestanas
// para cambiar entre iniciar sesion y registrarse
export default function Login() {
  // guarda cuál pestana está activa ahora mismo, empieza en login
  const [pestanaActiva, setPestanaActiva] = useState('login');

  return (
    <main className={styles.pagina}>
      <div className={styles.tarjeta}>

        {/* el panel izquierdo tiene logo y descripción, siempre igual, no cambia */}
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

          <div className={styles.pestanas}>
            {/* al hacer clic, cambia pestanaActiva y react vuelve a dibujar la pantalla */}
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
            <FormularioLogin />
          ) : (
            <FormularioRegistro />
          )}

        </div>
      </div>
    </main>
  );
}