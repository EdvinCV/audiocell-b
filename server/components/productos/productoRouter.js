const express = require('express');
const productoRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
const { getProductosVentaController } = require('../ventas/ventasController');
// Controllers
const {getProductosController, 
    postProductoController,
    postProductoStockController,
    putProductoController, 
    deleteProductoController, 
    getTotalProductosController,
    postVerificarPassword,
    getReporteProductos,
    getListadoStockController,
    getReporteStockController,
    deleteStockController,
    getCategoryReport
} = require('./productoController');

productoRouter
    .get('/', getProductosController)
    .get('/total', getTotalProductosController)
    .get('/stock', getListadoStockController)
    .put('/stock', deleteStockController)
    .post('/verificar', postVerificarPassword)
    .post('/', postProductoController)
    .post('/stock', postProductoStockController)
    .put('/', putProductoController)
    .put('/delete', deleteProductoController)
    .get('/reporte', getReporteProductos)
    .get('/reporteStock', getReporteStockController)
    .get('/categories', getCategoryReport);

module.exports = productoRouter;