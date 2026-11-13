import styles from './MensajeVacio.module.css';

// aviso que aparece cuando una lista todavia no tiene nada que mostrar
// por ejemplo (no hay jornadas disponibles) o (aun no tienes mascotas registradas)
export default function MensajeVacio({ texto }) {
  return (
    <div className={styles.contenedor}>
      <p className={styles.texto}>{texto}</p>
    </div>
  );
}