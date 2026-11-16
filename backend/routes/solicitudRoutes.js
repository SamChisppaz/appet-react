const express = require("express");
const router = express.Router();
const Solicitud = require("../models/Solicitud");
const verificarToken = require("../middleware/verificarToken");
const verificarAdministrador = require("../middleware/verificarAdministrador");


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

module.exports = router;