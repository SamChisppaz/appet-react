// administrador hereda de usuario y le agrega sus propias jornadas

import Usuario from './Usuario.js';

export default class Administrador extends Usuario {

  /** crea un administrador nuevo con sus datos básicos. */
  constructor(nombre, apellido, celular, direccion, email, contrasena) {
    super(nombre, apellido, celular, direccion, email, contrasena, 'ADMINISTRADOR');

    this.jornadas = [];
  }

  /** crea una jornada y la agrega a la lista de este administrador. */
  crearJornada(jornada) {
    this.jornadas.push(jornada);
  }

  /** @returns {string[]} permisos de un administrador (sobrescribe el método de usuario). */
  obtenerPermisosAcceso() {
    return ['crear_jornada', 'editar_jornada', 'ver_solicitudes', 'gestionar_usuarios'];
  }

}