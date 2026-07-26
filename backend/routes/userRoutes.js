const express = require("express");
const router = express.Router();
const Usuario = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

module.exports = router;