/**
 * PRODUCTOS
 */

// Models
const db = require('../../config/dbconnection');
const {Op} = require("sequelize");
const Producto = db.productos;
const Categoria = db.categorias;
const Stock = db.stocks;
const User = db.users;
const bcrypt = require('bcryptjs');
// Express validator
const {validationResult} = require('express-validator');
const { sequelize } = require('../../config/dbconnection');

// Verify password to edit a product.
exports.postVerificarPassword = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({ where: {username, status: true} });
        // If the user doesn't exists
        if(!user){
            return res.status(400).json({
                isConfirmed: false,
                ok: false,
                msg: "User or password incorrect"
            });
        }
        // Verify if the passwords match
        const valid = bcrypt.compareSync(password, user.password);
        if(!valid){
            return res.status(400).json({
                isConfirmed: false,
                ok: false,
                msg: "User or password incorrect"
            });
        }
        res.status(200).json({
            ok: true,
            isConfirmed: true,
            msg: "Password verified",
        });
    }catch(error){
        console.log(error);
    }
}

exports.getReporteProductos = async (req, res) => {
    try {
        let productos = await Producto.findAll({
            include: [{
                model: Categoria,
                as: 'Categorium'
            }],
            where: {
                status:true,
            },
            order: [
                ['id', 'DESC']
            ]});
        
        res.status(200).json({
            ok: true,
            productos
        });
    } catch(error){
        console.log(error);
    }
}

// Get products with stock and no stock
exports.getProductosController = async (req, res) => {
    try {
        if(req.query.buscador===""){
            var [results, metadata] = await sequelize.query("SELECT P.id, P.proveedor, P.name, C.name as categoria, P.precioVenta, P.precioVenta2, P.precioVenta3, P.color, SUM(S.cantidadRestante) as disponible FROM Stocks as S RIGHT JOIN Productos as P ON S.ProductoId=P.id INNER JOIN Categoria as C ON P.CategoriumId=C.id WHERE P.status=true GROUP BY P.id HAVING disponible>0 ORDER BY P.id;");
            var [resultsNoStock, metadataNoStock] = await sequelize.query("SELECT P.id, P.proveedor, P.name, C.name as categoria, P.precioVenta, P.precioVenta2, P.precioVenta3, P.color, SUM(S.cantidadRestante) as disponible FROM Stocks as S RIGHT JOIN Productos as P ON S.ProductoId=P.id INNER JOIN Categoria as C ON P.CategoriumId=C.id WHERE P.status=true GROUP BY P.id HAVING disponible<=0 OR disponible IS NULL ORDER BY P.id;");
        }else {
            var [results, metadata] = await sequelize.query(
                `SELECT P.id, P.proveedor, P.name, C.name as categoria, P.precioVenta, P.precioVenta2, P.precioVenta3, P.color, SUM(S.cantidadRestante) as disponible FROM Stocks as S RIGHT JOIN Productos as P ON S.ProductoId=P.id INNER JOIN Categoria as C ON P.CategoriumId=C.id WHERE P.status=true AND P.name LIKE '%${req.query.buscador}%' OR C.name LIKE '%${req.query.buscador}%' GROUP BY P.id;`);
            var [resultsNoStock, metadataNoStock] = await sequelize.query("SELECT P.id, P.proveedor, P.name, C.name as categoria, P.precioVenta, P.precioVenta2, P.precioVenta3, P.color, SUM(S.cantidadRestante) as disponible FROM Stocks as S RIGHT JOIN Productos as P ON S.ProductoId=P.id INNER JOIN Categoria as C ON P.CategoriumId=C.id WHERE P.status=true GROUP BY P.id HAVING disponible<=0 OR disponible IS NULL ORDER BY P.id;");
        }
        res.status(200).json({
            ok: true,
            productos: results,
            productosNoDisponibles: resultsNoStock
        });
    } catch(error){
        console.log(error);
    }
}

// Get stock by category report
exports.getCategoryReport = async (req, res) => {
    try {
        console.log("RREEKKK",req);
        var [results, metadata] = await sequelize.query(`SELECT P.id, P.proveedor, P.name, C.name as categoria, P.precioVenta, P.precioVenta2, P.precioVenta3, P.color, SUM(S.cantidadRestante) as disponible FROM Stocks as S RIGHT JOIN Productos as P ON S.ProductoId=P.id INNER JOIN Categoria as C ON P.CategoriumId=C.id WHERE P.status=true AND CategoriumId=${req.query.category} GROUP BY P.id ORDER BY P.id;`);
        res.status(200).json({
            ok: true,
            productos: results
        });
    } catch(error){
        console.log(error);
    }
}

// Get stock of specific product
exports.getListadoStockController = async (req, res) => {
    try {
        const listadoStock = await Stock.findAll({
            where: {
                ProductoId: req.query.id,
                cantidadRestante: {
                    [Op.gt]: 0
                }
            }
        });
        res.status(200).json({
            ok: true,
            listado: listadoStock
        });
    } catch(error){
        console.log(error);
    }
}


exports.getTotalProductosController = async(req, res) => {
    try {
        const total = await Producto.count({
            include: [{
                model: Categoria,
                as: 'Categorium'
            }],
            where: {
                status:true,
                [Op.or]: [
                    {name: {
                        [Op.substring]: req.query.buscador
                    }},
                    {precioVenta: {
                        [Op.eq]: req.query.buscador
                    }},
                    {precioVenta2: {
                        [Op.eq]: req.query.buscador
                    }},
                    {precioVenta3: {
                        [Op.eq]: req.query.buscador
                    }},
                    {'$Categorium.descripcion$': { 
                        [Op.substring]: req.query.buscador 
                    }}
                ]
            },
        });
        res.status(200).json({
            ok: true,
            total
        });
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error"
        });
    }
}

// Create new product.
exports.postProductoController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const categoria = await Categoria.findOne({
            where: {
                name: req.body.categoria
            }
        });
        const producto = {
            name: req.body.name,
            precioVenta: req.body.precioVenta,
            precioVenta2: req.body.precioVenta2,
            precioVenta3: req.body.precioVenta3,
            CategoriumId: categoria.id,
            color: req.body.color,
            proveedor: req.body.proveedor
        }
        const productoCreado = await Producto.create(producto);
        res.status(200).json({
            ok: true,
            msg: "Producto creado correctamente",
            data: productoCreado
        });
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error.",
            error
        });
    }
}

// Create stock of product.
exports.postProductoStockController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const stock = {
            ProductoId: req.body.productoId,
            cantidadComprada: req.body.cantidad,
            cantidadRestante: req.body.cantidad,
            precioCompra: req.body.precio,
        }
        const stockCreado = await Stock.create(stock);
        res.status(200).json({
            ok: true,
            msg: "Stock creado correctamente",
            data: stockCreado
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

// Edit product
exports.putProductoController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const producto = {
            id: req.body.id,
            name: req.body.name,
            color: req.body.color,
            precioVenta: req.body.precioVenta,
            precioVenta2: req.body.precioVenta2,
            precioVenta3: req.body.precioVenta3,
            proveedor: req.body.proveedor
        }
        // Buscar el producto
        const productoEditado = await Producto.update(producto, {
            where: {
                id: producto.id
            }
        });
        if(productoEditado[0] == 1){
            res.status(200).json({
                ok: true,
                msg: "Producto editado correctamente",
                data: productoEditado[0]
            });
        } else {
            res.status(200).json({
                ok: true,
                msg: "Producto no encontrado.",
                data: productoEditado[0]
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

// Delete product
exports.deleteProductoController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const producto = {
            id: req.body.id,
            status: false
        };
        // Buscar el producto
        const productoEliminado = await Producto.update(producto, {
            where: {
                id: producto.id
            }
        });
        if(productoEliminado[0] == 1){
            res.status(200).json({
                ok: true,
                message: "Producto eliminado correctamente",
                data: productoEliminado[0]
            });
        } else {
            res.status(200).json({
                ok: true,
                message: "Producto no encontrado.",
                data: productoEliminado[0]
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

// Delete stock of product
exports.deleteStockController = async (req, res) => {
    try {
        const stockId = req.body.id;
        // Buscar el producto
        await Stock.destroy({
            where: {
                id: stockId
            }
        });
        res.status(200).json({
            ok: true,
            message: "Stock eliminado correctamente",
        });
    } catch(error){
        console.log("ERROR AL ELIMINAR STOCK",error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error, vuelva a intentar mas tarde.",
            error
        });
    }
}

exports.getReporteStockController = async (req, res) => {
    const {inicio,fin} = req.query;
    console.log(req.query);
    const query = `SELECT C.name as categoria,S.id,P.name,P.color,S.cantidadComprada,S.precioCompra,S.createdAt FROM Stocks as S INNER JOIN Productos as P ON S.ProductoId=P.id INNER JOIN Categoria as C ON P.CategoriumId = C.id WHERE P.status=true AND S.createdAt BETWEEN "${inicio}" AND "${fin}"`
    try {
        const [results, metadata] = await 
            sequelize.query(query);
            res.status(200).json({
                ok: true,
                results
            });   
    }catch(error){
        console.log("ERROR AL GENERAR REPORTE:", error);
        res.status(400).json({
            ok: false,
            error: "No se ha podido obtener el reporte"
        });
    }
}
