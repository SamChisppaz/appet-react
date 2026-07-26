require("dotenv").config();

const express = require("express");   
const mongoose = require("mongoose"); 
const cors = require("cors"); 

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log("📡", req.method, req.url);
    next(); 
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const mascotaRoutes = require("./routes/mascotaRoutes");
app.use("/api/mascotas", mascotaRoutes);

mongoose
    .connect(process.env.MONGO_URI) 
    .then(() => console.log("Conectado a MongoDB"))
    .catch((error) => console.error(error)); 

    //habilitar el puerto
    const puerto = 8000;
    app.listen(puerto, () => console.log("Escuchando en el puerto", puerto));
