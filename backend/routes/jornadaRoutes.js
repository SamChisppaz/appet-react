const express = require("express");
const router = express.Router();
const Jornada = require("../models/Jornada");
const verificarToken = require("../middleware/verificarToken");
const verificarAdministrador = require("../middleware/verificarAdministrador");
const { fechaMinimaCreacion, fechaMinimaDisponible } = require("../utils/fechas");

// crear una jornada nueva
// verificarToken valida la sesion y verificarAdministrador valida el rol, en ese orden
router.post("/", verificarToken, verificarAdministrador, async (req, res) => {
    try {
        const { tipoServicio, fecha, ciudad, ubicacion, horaInicio, horaFin } = req.body;

        const nuevaJornada = new Jornada({ tipoServicio, fecha, ciudad, ubicacion, horaInicio, horaFin });

        // validate() revisa campos obligatorios, tipo de servicio y formato de las horas
        // si algo falla lanza un ValidationError, que se atiende en el catch
        await nuevaJornada.validate();

        // fecha minima: hoy + 1 mes, en formato "AAAA-MM-DD" para compararla como texto
        const fechaMinima = fechaMinimaCreacion();

        // fecha de la jornada en texto "AAAA-MM-DD"
        const fechaJornada = nuevaJornada.fecha.toISOString().slice(0, 10);

        if (fechaJornada < fechaMinima) {
            return res.status(400).json({
                error: "La jornada debe crearse con al menos un mes de anticipación"
            });
        }

        // las horas ya tienen formato "HH:mm", por eso se pueden comparar como texto
        if (nuevaJornada.horaFin <= nuevaJornada.horaInicio) {
            return res.status(400).json({
                error: "La hora de fin debe ser posterior a la hora de inicio"
            });
        }

        // solo se permite una jornada por dia, sin importar el tipo de servicio
        // evita que se creen jornadas repetidas por error
        nuevaJornada.fecha = new Date(fechaJornada); // guarda solo el dia, sin hora
        const jornadaDelDia = await Jornada.findOne({ fecha: nuevaJornada.fecha });

        if (jornadaDelDia) {
            return res.status(400).json({
                error: "Ya existe una jornada creada para esa fecha"
            });
        }

        await nuevaJornada.save();

        res.status(201).json({
            message: "Jornada creada correctamente",
            jornada: nuevaJornada
        });
    } catch (error) {
        // ValidationError: falta algun dato o tiene un valor no permitido
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: "Datos de la jornada no válidos, revisa que todos los campos estén completos"
            });
        }

        console.error(error);
        res.status(500).json({
            error: "Error al guardar la jornada"
        });
    }
});

// listar las jornadas disponibles de un servicio, de la mas proxima a la mas lejana
// cualquier usuario con sesion iniciada puede consultarlas
router.get("/", verificarToken, async (req, res) => {
    try {
        const { tipoServicio } = req.query;

        // enumValues son los valores permitidos por el modelo: "VACUNACION" y "ESTERILIZACION"
        if (!Jornada.schema.path("tipoServicio").enumValues.includes(tipoServicio)) {
            return res.status(400).json({ error: "Tipo de servicio no válido" });
        }

        // convierte el texto "AAAA-MM-DD" a fecha al comparar con el campo fecha
        const jornadas = await Jornada.find({
            tipoServicio,
            fecha: { $gte: fechaMinimaDisponible() }
        }).sort({ fecha: 1 });

        res.status(200).json(jornadas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al consultar las jornadas"
        });
    }
});

module.exports = router;