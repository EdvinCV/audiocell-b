const express = require('express');
const productoRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
const { verifyToken } = require('../../middlewares/autenticacion');
// Controllers
const {
    getVentasController, 
    postVentaController, 
    deleteVentaController, 
    getTotalVentasController, 
    getVentasCanceladasController, 
    getReporteVentasController, 
    getVentasHoyController, 
    getProductosVentaController, 
    getReporteUsuarioVentasController, 
    getReporteVentasCategoriaHoy, 
    getReporteGanancias, 
    getVentasEncabezadosHoyController,
    getVentasEncabezadosController,
    getVentaController,
    getVentasEncabezadosCanceladosController,
    getTotalInvertidoController,
    getVentaCanceladaController
} = require('./ventasController');

productoRouter
    .get('/', getVentasController)
    .get('/recibo', getVentaController)
    .get('/cancelada', getVentaCanceladaController)
    .get('/productos', getProductosVentaController)
    .get('/hoy', getVentasHoyController)
    .get('/hoyEncabezado', getVentasEncabezadosHoyController)
    .get('/ganancias', getReporteGanancias)
    .get('/invertido', getTotalInvertidoController)
    .get('/canceladas', getVentasEncabezadosCanceladosController)
    .get('/total', getTotalVentasController)
    .post('/', postVentaController)
    .post('/delete',deleteVentaController)
    .get('/reporte', getReporteVentasController)
    .get('/reporteEncabezados', getVentasEncabezadosController)
    .get('/usuarios', getReporteUsuarioVentasController)
    .get('/categoria', getReporteVentasCategoriaHoy);

module.exports = productoRouter;