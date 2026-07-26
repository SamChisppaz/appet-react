const express = require("express");
const router = express.Router();
const Mascota = require("../models/Mascota");
const verificarToken = require("../middleware/verificarToken");

// registrar una mascota nueva
// verificarToken va antes de la funcion de la ruta, eso hace que esta ruta
// quede protegida, solo un usuario con sesion iniciada puede usarla
router.post("/register", verificarToken, async (req, res) => {
    try {
        const { nombre, especie, raza, edad, sexo } = req.body;

        const nuevaMascota = new Mascota({
            nombre, especie, raza, edad, sexo,
            usuario: req.usuario.id // esto viene del token, no del formulario, asi el usuario
                                     // no podria "hacer trampa" y registrar una mascota a nombre de otro
        });

        await nuevaMascota.save();

        res.status(201).json({
            message: "Mascota registrada correctamente",
            mascota: nuevaMascota
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al guardar la mascota"
        });
    }
});

module.exports = router;