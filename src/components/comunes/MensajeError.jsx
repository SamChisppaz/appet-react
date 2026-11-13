import styles from './MensajeError.module.css';

// texto de error que va debajo de un campo de un formulario
// si no hay nada que mostrar, no dibuja nada 
export default function MensajeError({ texto }) {
  if (!texto) return null;

  return <span className={styles.error}>{texto}</span>;
}