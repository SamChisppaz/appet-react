import styles from './BotonCargando.module.css';

// boton de envio para los formularios, mientras "cargando" es true muestra
// otro texto y se desactiva, para que no lo alcancen a presionar dos veces
// mientras se espera la respuesta del backend
export default function BotonCargando({ cargando, texto, textoCargando = 'Guardando...' }) {
  return (
    <button type="submit" className={styles['btn-appet']} disabled={cargando}>
      {cargando ? textoCargando : texto}
    </button>
  );
}