const express = require('express');
const cajaRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
// Controllers
const {getCajaController, getCajasController, postCajaController, cerrarCajaController} = require('./cajaController');

cajaRouter
    .get('/', getCajaController)
    .get('/general', getCajasController)
    .post('/', [
    ], postCajaController)
    .post('/cerrar', cerrarCajaController)
    /*.put('/', putCategoriaController)
    .delete('/', deleteCategoriaController)*/

module.exports = cajaRouter;