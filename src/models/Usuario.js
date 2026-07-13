// clase usuario: es el padre de ciudadano y administrador (ellos heredan de aquí)

export default class Usuario {

  // contraseña privada, no se puede leer desde afuera de la clase
  #contrasena;

  /** crea un usuario nuevo con sus datos básicos y su rol ('CIUDADANO' o 'ADMINISTRADOR'). */
  constructor(nombre, apellido, celular, direccion, email, contrasena, rol = 'CIUDADANO') {
    this.id = Usuario.generarId();
    this.nombre = nombre;
    this.apellido = apellido;
    this.celular = celular;
    this.direccion = direccion;
    this.email = email;
    this.rol = rol;
    this.contrasena = contrasena;
  }

  // getters 

  /** @returns {string} nombre y apellido juntos. */
  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  /** @returns {boolean} true si es administrador. */
  get esAdministrador() {
    return this.rol === 'ADMINISTRADOR';
  }

  // setters 

  /** cambia la contraseña, si cumple la política de seguridad. */
  set contrasena(valorNuevo) {
    if (!Usuario.validarSeguridadContrasena(valorNuevo)) {
      throw new Error(
        'la contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.'
      );
    }

    this.#contrasena = valorNuevo;
  }

  //  métodos 

  /** @returns {boolean} true si el correo tiene formato válido. */
  validarCorreo() {
    return Usuario.validarFormatoCorreo(this.email);
  }

  /** @returns {boolean} true si la contraseña ingresada coincide con la guardada. */
  verificarContrasena(contrasenaIngresada) {
    return contrasenaIngresada === this.#contrasena;
  }

  /** actualiza el celular y/o la dirección del usuario. */
  actualizarPerfil(nuevosCampos = {}) {
    if (nuevosCampos.celular) this.celular = nuevosCampos.celular;
    if (nuevosCampos.direccion) this.direccion = nuevosCampos.direccion;
  }

  /** @returns {object} los datos del usuario que sí se pueden mostrar (sin la contraseña). */
  obtenerDatosPublicos() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      celular: this.celular,
      direccion: this.direccion,
      rol: this.rol,
    };
  }

  /** @returns {string[]} permisos del usuario. ciudadano y administrador lo sobrescriben. */
  obtenerPermisosAcceso() {
    return [];
  }

  // estáticos 

  /** @returns {string} id único generado. */
  static generarId() {
    return `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  /** @returns {boolean} true si el correo tiene formato válido. */
  static validarFormatoCorreo(correo) {
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof correo === 'string' && expresionCorreo.test(correo.trim());
  }

  /** @returns {boolean} true si cumple: mínimo 8 caracteres, una mayúscula y un número. */
  static validarSeguridadContrasena(contrasena) {
    const tieneLongitudMinima = typeof contrasena === 'string' && contrasena.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(contrasena);
    const tieneNumero = /[0-9]/.test(contrasena);

    return tieneLongitudMinima && tieneMayuscula && tieneNumero;
  }

}