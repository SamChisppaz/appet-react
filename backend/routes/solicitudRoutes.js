const express = require("express");
const router = express.Router();
const Solicitud = require("../models/Solicitud");
const Jornada = require("../models/Jornada");
const Mascota = require("../models/Mascota");
const verificarToken = require("../middleware/verificarToken");
const verificarAdministrador = require("../middleware/verificarAdministrador");
const { fechaMinimaDisponible } = require("../utils/fechas");

// crear las solicitudes de participacion: una por cada mascota elegida, todas en estado PENDIENTE
router.post("/", verificarToken, async (req, res) => {
    try {
        // jornada es el id de la jornada y mascotas es la lista de ids de las mascotas elegidas
        const { jornada, mascotas } = req.body;

        if (!jornada || !Array.isArray(mascotas) || mascotas.length === 0) {
            return res.status(400).json({ error: "Elige al menos una mascota" });
        }

        // la jornada debe existir y estar disponible
        const jornadaDisponible = await Jornada.findOne({
            _id: jornada,
            fecha: { $gte: fechaMinimaDisponible() }
        });

        if (!jornadaDisponible) {
            return res.status(400).json({ error: "La jornada no está disponible" });
        }

        // todas las mascotas deben ser del ciudadano con sesion iniciada (el id sale del token)
        const mascotasDelCiudadano = await Mascota.countDocuments({
            _id: { $in: mascotas },
            usuario: req.usuario.id
        });

        if (mascotasDelCiudadano !== mascotas.length) {
            return res.status(400).json({ error: "Alguna de las mascotas no es válida" });
        }

        // una mascota no puede tener dos solicitudes para la misma jornada
        const repetidas = await Solicitud.find({
            jornada,
            mascota: { $in: mascotas }
        }).populate("mascota", "nombre");

        if (repetidas.length > 0) {
            const nombres = repetidas.map((solicitud) => solicitud.mascota.nombre).join(", ");
            return res.status(400).json({
                error: `Ya existe una solicitud para esta jornada de: ${nombres}`
            });
        }

        const solicitudes = await Solicitud.insertMany(
            mascotas.map((mascota) => ({ ciudadano: req.usuario.id, jornada, mascota }))
        );

        res.status(201).json({
            message: "Solicitud enviada correctamente",
            solicitudes
        });
    } catch (error) {
        // CastError: un id no tiene formato valido de Mongo
        if (error.name === "CastError" || error.name === "ValidationError") {
            return res.status(400).json({ error: "Datos de la solicitud no válidos" });
        }

        console.error(error);
        res.status(500).json({
            error: "Error al guardar la solicitud"
        });
    }
});


// listar las solicitudes del ciudadano con sesion iniciada, de la mas reciente a la mas antigua
// el id sale del token y no de la peticion, asi cada ciudadano solo puede ver las suyas
router.get("/mias", verificarToken, async (req, res) => {
    try {
        // cada solicitud guarda solo los ids de mascota y jornada
        // populate los reemplaza por los datos reales, limitados a los campos indicados
        const solicitudes = await Solicitud.find({ ciudadano: req.usuario.id })
            .populate("mascota", "nombre")
            .populate("jornada", "tipoServicio fecha ciudad ubicacion")
            .sort({ createdAt: -1 });

        // la lista puede estar vacia si el ciudadano aun no ha hecho solicitudes
        res.status(200).json({ solicitudes });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al consultar las solicitudes"
        });
    }
});

// verificarToken valida la sesion y verificarAdministrador valida el rol, en ese orden
router.get("/", verificarToken, verificarAdministrador, async (req, res) => {
    try {
        // cada solicitud guarda solo los ids de ciudadano, mascota y jornada
        // populate los reemplaza por los datos reales, limitados a los campos indicados
        // (la contraseña y otros datos del ciudadano nunca se envian)
        const solicitudes = await Solicitud.find()
            .populate("ciudadano", "nombre apellido")
            .populate("mascota", "nombre")
            .populate("jornada", "tipoServicio fecha ciudad")
            .sort({ createdAt: -1 }); // orden de la mas reciente a la mas antigua

        // respuesta correcta, la lista puede estar vacia si aun no hay solicitudes
        res.status(200).json({ solicitudes });
    } catch (error) {
        // error inesperado, el detalle queda en la consola del backend
        console.error(error);
        res.status(500).json({
            error: "Error al consultar las solicitudes"
        });
    }
});

// aprobar o rechazar una solicitud pendiente, solo para administradores
// la direccion lleva el id de la solicitud (/api/solicitudes/:id/estado)
// el cuerpo de la peticion lleva el nuevo estado: { "estado": "APROBADA" } o { "estado": "RECHAZADA" }
router.put("/:id/estado", verificarToken, verificarAdministrador, async (req, res) => {
    try {
        const { estado } = req.body;

        // solo se permite resolver la solicitud, nunca devolverla a PENDIENTE
        if (estado !== "APROBADA" && estado !== "RECHAZADA") {
            return res.status(400).json({ error: "El estado debe ser APROBADA o RECHAZADA" });
        }

        // busca la solicitud por el id que viene en la direccion
        const solicitud = await Solicitud.findById(req.params.id);

        if (!solicitud) {
            return res.status(404).json({ error: "Solicitud no encontrada" });
        }

        // una solicitud que ya fue aprobada o rechazada no se puede cambiar
        if (solicitud.estado !== "PENDIENTE") {
            return res.status(400).json({ error: "La solicitud ya fue resuelta" });
        }

        // guarda el nuevo estado en la base de datos
        solicitud.estado = estado;
        await solicitud.save();

        res.status(200).json({
            message: "Estado de la solicitud actualizado",
            solicitud
        });
    } catch (error) {
        // CastError: el id de la direccion no tiene formato valido de Mongo
        if (error.name === "CastError") {
            return res.status(404).json({ error: "Solicitud no encontrada" });
        }

        // error inesperado, el detalle queda en la consola del backend
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar la solicitud"
        });
    }
});

module.exports = router;