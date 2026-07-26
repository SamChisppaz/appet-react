const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: "CIUDADANO"
    },
    // resetToken guarda el código temporal que se le envía al usuario,
    // resetTokenExpira guarda hasta qué momento es válido ese código (24 h)
    resetToken: {
        type: String,
        default: null // por defecto nadie tiene un codigo activo
    },
    resetTokenExpira: {
        type: Date,
        default: null // se llena cuando se pide un codigo, y se limpia otra vez cuando se usa
    }
});

module.exports = mongoose.model("Usuario", usuarioSchema);