import styles from './TarjetaMascota.module.css';

// la base de datos guarda "PERRO" y "MACHO" en mayúscula
// estos objetos sirven para mostrarlos como "Perro" y "Macho"
const nombresEspecie = { PERRO: 'Perro', GATO: 'Gato' };
const nombresSexo = { MACHO: 'Macho', HEMBRA: 'Hembra' };

// tarjeta con los datos de una sola mascota
// props recibidas desde MisMascotas.jsx:
// mascota: los datos a mostrar
// alEditar: función que se ejecuta al pulsar "Editar"
// alEliminar: función que se ejecuta al pulsar "Eliminar"
export default function TarjetaMascota({ mascota, alEditar, alEliminar }) {
  return (
    <div className={styles.tarjeta}>
      {/* ícono de huella que representa a la mascota */}
      <div className={styles.icono}>
        <i className="fa-solid fa-paw"></i>
      </div>

      <div className={styles.info}>
        <h2 className={styles.nombre}>{mascota.nombre}</h2>

        {/* datos de la mascota: cada etiqueta con su valor */}
        {/* en especie y sexo se busca el valor en los objetos de arriba, ej: nombresEspecie["PERRO"] da "Perro" */}
        <div className={styles.datos}>
          <span className={styles.etiqueta}>Raza:</span>
          <span className={styles.valor}>{mascota.raza}</span>
          <span className={styles.etiqueta}>Edad:</span>
          <span className={styles.valor}>{mascota.edad}</span>
          <span className={styles.etiqueta}>Especie:</span>
          <span className={styles.valor}>{nombresEspecie[mascota.especie]}</span>
          <span className={styles.etiqueta}>Sexo:</span>
          <span className={styles.valor}>{nombresSexo[mascota.sexo]}</span>
        </div>

        <div className={styles.acciones}>
          {/* al hacer clic, se envía la mascota completa a App.jsx, que abre el formulario de edición */}
          <button type="button" className={styles.botonEditar} onClick={() => alEditar(mascota)}>
            <i className="fa-solid fa-pen"></i> Editar
          </button>
          {/* al hacer clic, se envía la mascota completa a MisMascotas.jsx, que pide la confirmación */}
          <button type="button" className={styles.botonEliminar} onClick={() => alEliminar(mascota)}>
            <i className="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}