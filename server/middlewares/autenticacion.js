// JWT
const jwt = require('jsonwebtoken');
const db = require('../config/dbconnection');
// Modelos
const User = db.users;
/*
* VERIFICAR TOKEN
*/
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, "CHAT", async(err, decoded) => {
        console.log("ERROR TOKEN",err);
        if(err){
            return res.status(401).json({
                ok: false,
                message: "Token inválido",
            });
        }
        // Verificar que el usuario sea un usuario existente y activo en la base de datos
        const usuarioEncontrado = await User.findOne({
            where: {
                username: decoded.user,
                status: true
            }
        });
        console.log("VALIDACION", usuarioEncontrado);
        if(!usuarioEncontrado){
            return res.status(401).json({
                ok: false,
                message: "Token inválido"
            });
        }
        req.usuario = decoded;
        next();
    });
};

module.exports = {
    verifyToken
};
