const express = require("express");
const router = express.Router();
const Usuario = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verificarToken = require("../middleware/verificarToken");

// registrar un usuario nuevo
router.post("/register", async (req, res) => {
    try {
        const { nombre, apellido, celular, direccion, email, contrasena } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({
                error: "Ese correo ya está registrado"
            });
        }

        const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = new Usuario({
            nombre, apellido, celular, direccion, email,
            contrasena: contrasenaEncriptada
        });

        await nuevoUsuario.save();

        res.status(201).json({
            message: "Usuario registrado correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al guardar usuario"
        });
    }
});

// iniciar sesion
router.post("/login", async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                error: "Usuario no encontrado"
            });
        }

        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!coincide) {
            return res.status(400).json({
                error: "Credenciales inválidas"
            });
        }

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al iniciar sesión"
        });
    }
});

// Solicitar recuperacion de contrasena
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                error: "No existe una cuenta con ese correo"
            });
        }

        const token = crypto.randomBytes(3).toString("hex").toUpperCase();
        const expira = new Date(Date.now() + 24 * 60 * 60 * 1000);

        usuario.resetToken = token;
        usuario.resetTokenExpira = expira;
        await usuario.save();

        res.status(200).json({
            message: "Revisa tu correo",
            tokenSimulado: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al procesar la solicitud"
        });
    }
});

// cambiar la contrasena usando el codigo
router.post("/reset-password", async (req, res) => {
    try {
        const { email, token, nuevaContrasena } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                error: "No existe una cuenta con ese correo"
            });
        }

        if (usuario.resetToken !== token) {
            return res.status(400).json({
                error: "Código inválido"
            });
        }

        if (usuario.resetTokenExpira < new Date()) {
            return res.status(400).json({
                error: "Enlace expirado, solicite uno nuevo"
            });
        }

        usuario.contrasena = await bcrypt.hash(nuevaContrasena, 10);
        usuario.resetToken = null;
        usuario.resetTokenExpira = null;
        await usuario.save();

        res.status(200).json({
            message: "Contraseña actualizada correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar la contraseña"
        });
    }
});

// actualizar los datos de un usuario va con verificarToken 
router.put("/:id", verificarToken, async (req, res) => {
    try {
        // el id de la url debe ser el mismo que el del token, si no, alguien
        // esta tratando de editar los datos de otro usuario
        if (req.usuario.id !== req.params.id) {
            return res.status(403).json({
                error: "No tienes permiso para editar este usuario"
            });
        }

        // solo se aceptan estos campos del body, asi nadie puede mandar
        // por ejemplo "rol": "ADMINISTRADOR" y auto-asignarse permisos
        const { celular, direccion, contrasenaActual, contrasena } = req.body;

        const cambios = {};
        if (celular !== undefined) cambios.celular = celular;
        if (direccion !== undefined) cambios.direccion = direccion;

        // si quiere cambiar la contraseña, primero se revisa que la
        // contraseña actual que mando sea la correcta
        if (contrasena) {
            const usuarioActual = await Usuario.findById(req.params.id);

            const coincide = await bcrypt.compare(contrasenaActual || "", usuarioActual.contrasena);
            if (!coincide) {
                return res.status(400).json({
                    error: "La contraseña actual no es correcta"
                });
            }

            cambios.contrasena = await bcrypt.hash(contrasena, 10);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            cambios,
            { new: true } // con esto, la respuesta trae el usuario ya actualizado, no el de antes
        );

        if (!usuarioActualizado) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            message: "Usuario actualizado correctamente",
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar el usuario"
        });
    }
});

// eliminar un usuario tambien va con verificarToken
router.delete("/:id", verificarToken, async (req, res) => {
    try {
        // mismo chequeo que en PUT: un usuario solo puede eliminar su propia cuenta
        if (req.usuario.id !== req.params.id) {
            return res.status(403).json({
                error: "No tienes permiso para eliminar este usuario"
            });
        }

        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!usuarioEliminado) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar el usuario"
        });
    }
});

module.exports = router;