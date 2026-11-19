require("dotenv").config();

// librerias que usa el servidor
const express = require("express");   
const mongoose = require("mongoose"); 
const cors = require("cors");       

const app = express();

// middleware: funciones que se ejecutan en cada peticion antes de llegar a las rutas
app.use(cors());         // acepta las peticiones que vienen del frontend
app.use(express.json()); // convierte el cuerpo de la peticion de JSON a un objeto (req.body)
app.use((req, res, next) => {
    console.log("📡", req.method, req.url); // muestra en la consola cada peticion: metodo y direccion
    next(); // deja que la peticion siga hacia la ruta que le corresponde
});

// usuarios: registro, inicio de sesion, perfil y recuperacion de contraseña
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// mascotas: registrar, listar, editar y eliminar las mascotas del ciudadano
const mascotaRoutes = require("./routes/mascotaRoutes");
app.use("/api/mascotas", mascotaRoutes);

// jornadas: crear jornadas (administrador) y consultar las disponibles (ciudadano)
const jornadaRoutes = require("./routes/jornadaRoutes");
app.use("/api/jornadas", jornadaRoutes);

// solicitudes: crear solicitudes de participacion (ciudadano) y consultarlas (administrador)
const solicitudRoutes = require("./routes/solicitudRoutes");
app.use("/api/solicitudes", solicitudRoutes);

// conecta con la base de datos 
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado a MongoDB")) 
    .catch((error) => console.error(error));        

const puerto = 8000;
app.listen(puerto, () => console.log("Escuchando en el puerto", puerto));

// Vercel necesita que este archivo entregue la app para poder usarla
module.exports = app;