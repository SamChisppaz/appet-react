const mongoose = require("mongoose");

// Jornada: dia de vacunacion o esterilizacion con lugar y horario definidos
// version minima, con los datos que necesita la consulta de solicitudes
// la creacion y edicion de jornadas se completa en su propia tarea
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
        required: true
    },
    // sitio especifico de la jornada dentro de la ciudad
    lugar: {
        type: String,
        required: true
    },
    // horas de inicio y fin en texto con formato "HH:mm", por ejemplo "09:00"
    horaInicio: {
        type: String,
        required: true
    },
    horaFin: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Jornada", jornadaSchema);