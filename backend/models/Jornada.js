const mongoose = require("mongoose");

// Jornada: dia de vacunacion o esterilizacion con ubicacion y horario definidos
const jornadaSchema = new mongoose.Schema({
    // servicio que se presta en la jornada
    tipoServicio: {
        type: String,
        enum: ["VACUNACION", "ESTERILIZACION"],
        required: true
    },
    // dia de la jornada (solo fecha, sin hora)
    fecha: {
        type: Date,
        required: true
    },
    // ciudad donde se realiza
    ciudad: {
        type: String,
        required: true,
        trim: true // quita espacios al inicio y al final
    },
    // sitio especifico de la jornada dentro de la ciudad
    ubicacion: {
        type: String,
        required: true,
        trim: true
    },
    // horas de inicio y fin en texto con formato "HH:mm" de 24 horas, por ejemplo "09:00"
    horaInicio: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):[0-5]\d$/
    },
    horaFin: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):[0-5]\d$/
    }
});

module.exports = mongoose.model("Jornada", jornadaSchema);