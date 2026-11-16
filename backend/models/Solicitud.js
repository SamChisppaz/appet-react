const mongoose = require("mongoose");

// Solicitud: inscripcion de una mascota en una jornada (una solicitud por mascota y jornada)
// el numero de solicitud corresponde al _id que Mongo genera automaticamente
const solicitudSchema = new mongoose.Schema({
    // ciudadano que hizo la solicitud (referencia al modelo Usuario)
    ciudadano: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    // jornada a la que se inscribe la mascota (referencia al modelo Jornada)
    jornada: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jornada",
        required: true
    },
    // mascota inscrita (referencia al modelo Mascota)
    mascota: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mascota",
        required: true
    },
    // toda solicitud nueva inicia en PENDIENTE
    // APROBADA y RECHAZADA se asignan cuando el administrador la resuelve
    estado: {
        type: String,
        enum: ["PENDIENTE", "APROBADA", "RECHAZADA"],
        default: "PENDIENTE"
    }
// timestamps agrega createdAt (fecha de la solicitud) y updatedAt (ultima modificacion)
}, { timestamps: true });

module.exports = mongoose.model("Solicitud", solicitudSchema);