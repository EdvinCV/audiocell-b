/*
    USER CONTROLLER: Here there are the functions to manage all the endpoints of the users, also
    the functions to manage the login and logout endpoints.
*/
// Models
const db = require('../../config/dbconnection');
const Categoria = db.categorias;
// Express validator
const {validationResult} = require('express-validator');
// Bcryptjs
const bcrypt = require('bcryptjs');
// JWT
const jwt = require('jsonwebtoken');


exports.getCategoriasController = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            where: {
                status: true
            }
        });
        res.status(200).json({
            ok: true,
            categorias
        });
    } catch(error){
        console.log(error);
    }
}

exports.postCategoriaController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const categoria = {
            name: req.body.name,
            descripcion: req.body.name ? req.body.name : ''
        }
        const categoriaCreada = await Categoria.create(categoria);
        res.status(200).json({
            ok: true,
            message: "Categoria creada correctamente",
            data: categoriaCreada
        });
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error",
            error
        });
    }
}

exports.putCategoriaController = (req, res) => {

}

exports.deleteCategoriaController = (req, res) => {
    
}