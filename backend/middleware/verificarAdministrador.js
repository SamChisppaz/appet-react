// reviso que el usuario que hace la peticion sea administrador
// va siempre despues de verificarToken, porque se usa req.usuario que ese middleware llena
function verificarAdministrador(req, res, next) {
    if (req.usuario.rol !== "ADMINISTRADOR") {
        return res.status(403).json({
            error: "No tienes permiso para realizar esta acción"
        });
    }

    next(); // es administrador, la peticion sigue su camino
}

module.exports = verificarAdministrador;