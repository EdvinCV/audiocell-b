const express = require('express');
const categoriaRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
// Controllers
const {getCategoriasController, postCategoriaController, putCategoriaController, deleteCategoriaController} = require('./categoriasController');

categoriaRouter
    .get('/', getCategoriasController)
    .post('/', [
        body('name').not().isEmpty(),
    ],
    postCategoriaController)
    .put('/', putCategoriaController)
    .delete('/', deleteCategoriaController)

module.exports = categoriaRouter;