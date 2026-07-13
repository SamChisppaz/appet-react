// ciudadano hereda de usuario (extends) y le agrega sus propias mascotas

import Usuario from './Usuario.js';

export default class Ciudadano extends Usuario {

  /** crea un ciudadano nuevo con sus datos básicos. */
  constructor(nombre, apellido, celular, direccion, email, contrasena) {
    // super() llama al constructor de usuario, y siempre va primero
    super(nombre, apellido, celular, direccion, email, contrasena, 'CIUDADANO');

    this.mascotas = [];
  }

  /** agrega una mascota a la lista de este ciudadano. */
  registrarMascota(mascota) {
    this.mascotas.push(mascota);
  }

  /** @returns {string[]} permisos de un ciudadano (sobrescribe el método de usuario). */
  obtenerPermisosAcceso() {
    return ['ver_jornadas', 'registrar_mascota', 'solicitar_participacion'];
  }

}