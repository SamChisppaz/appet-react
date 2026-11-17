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

// listar las mascotas del usuario con sesion iniciada
// el id sale del token y no de la peticion, asi cada usuario solo puede ver las suyas
router.get("/", verificarToken, async (req, res) => {
    try {
        const mascotas = await Mascota.find({ usuario: req.usuario.id });

        res.status(200).json(mascotas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener las mascotas"
        });
    }
});

// editar una mascota del usuario con sesion iniciada
router.put("/:id", verificarToken, async (req, res) => {
    try {
        // solo se leen los 5 campos editables del body, asi no se puede cambiar el dueño (usuario)
        const { nombre, especie, raza, edad, sexo } = req.body;

        // la busqueda usa el id de la mascota y el id del token, asi nadie puede editar mascotas de otro usuario
        const mascota = await Mascota.findOne({
            _id: req.params.id,
            usuario: req.usuario.id
        });

        // sin resultado: la mascota no existe o pertenece a otro usuario
        if (!mascota) {
            return res.status(404).json({
                error: "Mascota no encontrada"
            });
        }

        mascota.nombre = nombre;
        mascota.especie = especie;
        mascota.raza = raza;
        mascota.edad = edad;
        mascota.sexo = sexo;

        // save() vuelve a validar: campos obligatorios y valores permitidos de especie y sexo
        await mascota.save();

        res.status(200).json({
            message: "Mascota actualizada correctamente",
            mascota
        });
    } catch (error) {
        // ValidationError: algun dato esta vacio o tiene un valor no permitido
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: "Datos de la mascota no válidos"
            });
        }

        console.error(error);
        res.status(500).json({
            error: "Error al actualizar la mascota"
        });
    }
});

// eliminar una mascota del usuario con sesion iniciada
// la busqueda usa el id de la mascota y el id del token, asi nadie puede borrar mascotas de otro usuario
router.delete("/:id", verificarToken, async (req, res) => {
    try {
        const mascota = await Mascota.findOneAndDelete({
            _id: req.params.id,
            usuario: req.usuario.id
        });

        // sin resultado: la mascota no existe o pertenece a otro usuario, no se borro nada
        if (!mascota) {
            return res.status(404).json({
                error: "Mascota no encontrada"
            });
        }

        res.status(200).json({
            message: "Mascota eliminada correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar la mascota"
        });
    }
});

module.exports = router;