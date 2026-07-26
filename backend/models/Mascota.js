const mongoose = require("mongoose");

const mascotaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    especie: {
        type: String,
        enum: ["PERRO", "GATO"], // solo permite esos dos valores
        required: true
    },
    raza: {
        type: String,
        required: true
    },
    edad: {
        type: String, 
        required: true
    },
    sexo: {
        type: String,
        enum: ["MACHO", "HEMBRA"],
        required: true
    },
    // esto conecta la mascota con su dueño, se guarda el _id del usuario que la registro.
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", // le dice a mongoose que ese id apunta a un documento de la coleccion usuarios
        required: true
    }
});

module.exports = mongoose.model("Mascota", mascotaSchema);