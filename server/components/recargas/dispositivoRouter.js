const express = require('express');
const dispositivoRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
// Controllers
const {getDispositivos, postDispositivoController, putDeviceController, deleteDeviceController} = require('./dispositivoController');

dispositivoRouter
    .get('/', getDispositivos)
    .post('/', postDispositivoController)
    .put('/', putDeviceController)
    .delete('/', deleteDeviceController);

module.exports = dispositivoRouter;