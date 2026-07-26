const jwt = require("jsonwebtoken");

//  funcion que revisa algo antes de dejar pasar la peticion a la ruta final
//  esto revisa que venga un token valido para saber quien esta haciendo la peticion sin esto, cualquiera
// podria registrar mascotas a nombre de otro usuario
function verificarToken(req, res, next) {
    // el token viene en el header "Authorization", con el formato: "Bearer eyJhbGci..."
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            error: "No hay sesión activa, inicia sesión primero"
        });
    }
    
    const token = authHeader.split(" ")[1];

    try {
        // jwt.verify revisa que el token sea valido y que no haya vencido.
        // si todo esta bien, nos regresa los datos que guardamos cuando lo creamos
        // en el login (el id del usuario y su rol)
        const datos = jwt.verify(token, process.env.JWT_SECRET);

        // guardamos esos datos en la peticion, para que la ruta que sigue
        // (por ejemplo, registrar mascota) sepa de quien es la sesion
        req.usuario = datos;

        next(); // todo bien, dejamos que la peticion siga su camino
    } catch (error) {
        return res.status(401).json({
            error: "Sesión inválida o expirada, inicia sesión de nuevo"
        });
    }
}

module.exports = verificarToken;