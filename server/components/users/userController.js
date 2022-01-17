/*
    USER CONTROLLER: Here there are the functions to manage all the endpoints of the users, also
    the functions to manage the login and logout endpoints.
*/
// Models
const db = require('../../config/dbconnection');
const User = db.users;
// Express validator
const {validationResult} = require('express-validator');
// Bcryptjs
const bcrypt = require('bcryptjs');
// JWT
const jwt = require('jsonwebtoken');

// Obtener informacón del usuario logueado.
exports.getMeController = async (req, res) => {
    try {
        const usuario = await User.findOne({
            where: {
                id: req.body.id,
                status: true
            }
        });
        if(usuario){
            res.status(200).json({
                ok: true,
                usuario
            });
        } else {
            res.status(200).json({
                ok: false,
                message: "Usuario no encontrado."
            });
        }
    }catch(error){
        console.log(error);
    }
}

// Obtener listado de todos los usuarios activos.
exports.getUsersController = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                status: true
            }
        });
        res.status(200).json({
            ok: true,
            users
        });
    } catch(error){
        console.log(error);
    }
}

// Controlador para registrar usuarios.
exports.registerUserController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    
    let {name, username, password, rol} = req.body;

    // Find if a username o email already exists
    const usernameFound = await User.findOne({where: {username}});
    if(usernameFound){
        return res.status(400).json({
            ok: false,
            msg: "This username already exists"
        });
    }

        // Hash the password
    var salt = await bcrypt.genSalt(10);
    password = await bcrypt.hashSync(password, salt);
    // Create the user
    User.create({name, username, password, rol})
        .then((data) => {
            const access_token = jwt.sign({user: username, name: name}, "CHAT", {});
            res.status(200).json({
                ok: true,
                msg: 'User created',
                data: {
                    data,
                    access_token
                }
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({
                ok: false,
                message: "Thesre was an error"
            });
        })
}

// Controlador para loguearse.
exports.loginUserController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    const {username, password} = req.body;
    try {
        const user = await User.findOne({ where: {username, status: true} });
        // If the user doesn't exists
        if(!user){
            return res.status(400).json({
                ok: true,
                msg: "User or password incorrect"
            });
        }
        // Verify if the passwords match
        const valid = bcrypt.compareSync(password, user.password);
        if(!valid){
            return res.status(400).json({
                ok: true,
                msg: "User or password incorrect"
            });
        }
        // Generate a new access_token
        const access_token = jwt.sign({user: user.username, id: user.id}, "CHAT", {});

        res.status(200).json({
            ok: true,
            msg: "Login successful",
            access_token,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: "There was an error"
        });
    }
}

// Actualizar el usuario
exports.putUserController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        if(req.body.password === null){
            console.log("CONTRASEÑA NO CAMBIO");
            usuario = {
                id: req.body.id,
                name: req.body.name,
                rol: req.body.rol
            }
        }else{
            // Hash the password
            var salt = await bcrypt.genSalt(10);
            password = await bcrypt.hashSync(req.body.password, salt);
            usuario = {
                id: req.body.id,
                name: req.body.name,
                password,
                rol: req.body.rol
            }
        }
        // Buscar el producto
        const usuarioEditado = await User.update(usuario, {
            where: {
                id: usuario.id
            }
        });
        if(usuarioEditado[0] == 1){
            res.status(200).json({
                ok: true,
                message: "Usuario editado correctamente.",
                data: usuarioEditado[0]
            });
        } else {
            res.status(200).json({
                ok: true,
                message: "Usuario no encontrado.",
                data: usuarioEditado[0]
            });
        }
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error, vuelva a intentar mas tarde.",
            error
        });
    }
}

// Eliminar al usuario, únicamente cambia de estado
exports.deleteUserController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const usuario = {
            id: req.body.id,
            status: false
        }
        // Buscar el producto
        const usuarioEditado = await User.update(usuario, {
            where: {
                id: usuario.id
            }
        });
        if(usuarioEditado[0] == 1){
            res.status(200).json({
                ok: true,
                message: "Usuario editado correctamente.",
                data: usuarioEditado[0]
            });
        } else {
            res.status(200).json({
                ok: true,
                message: "Usuario no encontrado.",
                data: usuarioEditado[0]
            });
        }
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error, vuelva a intentar mas tarde.",
            error
        });
    }
}