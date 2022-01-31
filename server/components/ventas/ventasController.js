/*
    USER CONTROLLER: Here there are the functions to manage all the endpoints of the users, also
    the functions to manage the login and logout endpoints.
*/
// Models
const db = require('../../config/dbconnection');
const Producto = db.productos;
const Stock = db.stocks;
const Categoria = db.categorias;
const Venta = db.ventas;
const VentaDetalle = db.detalles;
const Caja = db.cajas;
const User = db.users;
const moment = require('moment');
// Express validator
const {validationResult} = require('express-validator');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/dbconnection');

exports.getProductosVentaController = async (req, res) => {
    try {
        const query = "SELECT P.id, P.proveedor, P.name as producto, C.name, P.color, P.precioVenta, P.precioVenta2, P.precioVenta3, SUM(S.cantidadRestante) as stock FROM Productos as P INNER JOIN Categoria as C ON P.CategoriumId=C.id INNER JOIN Stocks as S ON P.id=S.ProductoId WHERE cantidadRestante > 0 AND P.status = true GROUP BY P.id";
        const [results, metadata] = await 
        sequelize.query(query);
        res.status(200).json({
            ok: true,
            results
        });
    } catch(error) {
        console.log(error);
    }
}
exports.getTotalVentasController = async (req, res) => {
    try {
        const total = await Venta.count({
            where: {status: true},
        });
        res.status(200).json({
            ok: true,
            total
        });
    } catch(error){
        console.log(error);
    }
}
exports.getVentaController = async (req, res) => {
    try {
        // Listado de ventas dentro del rango de fechas
        let encabezado = await Venta.findOne({
            where: {
                id: req.query.id,
                status: true, 
                cancelado: false,
            }
        });
        // Conteo de ventas por usuario
        let productosVendidos = await VentaDetalle.findAll({
            include: [{
                model: Producto,
                include: [Categoria]
            }],
            where: {
                VentumId: req.query.id
            },
        });

        res.status(200).json({
            ok: true,
            encabezado,
            productosVendidos
        });
    }catch(error){
        console.log("ERROR AL OBTENER PRODUCTO:::",error);
        res.status(400).json({
            ok: false,
            message: "No se ha podido obtener el producto."
        });
    }
}
exports.getVentaCanceladaController = async (req, res) => {
    try {
        // Listado de ventas dentro del rango de fechas
        console.log("REQ.QUERY:::",req.query.id);
        let encabezado = await Venta.findOne({
            where: {
                id: req.query.id,
                cancelado: true,
            }
        });
        // Conteo de ventas por usuario
        let productosVendidos = await VentaDetalle.findAll({
            include: [{
                model: Producto,
                include: [Categoria]
            }],
            where: {
                VentumId: req.query.id
            },
        });

        res.status(200).json({
            ok: true,
            encabezado,
            productosVendidos
        });
    }catch(error){
        console.log("ERROR AL OBTENER PRODUCTO:::",error);
        res.status(400).json({
            ok: false,
            message: "No se ha podido obtener el producto."
        });
    }
} 
exports.getVentasController = async (req, res) => {
    try {
        const fechaInicio = req.query.inicio;
        const fechaFin = req.query.fin;
        const query = `SELECT VD.id as VD, V.correlativo, P.id, P.name as Producto, P.color, C.name as Categoria, VD.precioFinal as Total, U.name, V.createdAt FROM Venta as V INNER JOIN VentaDetalles as VD ON V.id=VD.VentumId INNER JOIN Productos as P ON VD.ProductoId=P.id INNER JOIN Categoria as C ON C.id=P.CategoriumId INNER JOIN Users as U ON V.UserId=U.id WHERE V.createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}';`
        const [results, metadata] = await 
            sequelize.query(query);
            res.status(200).json({
                ok: true,
                ventas: results
            });   
    }catch(error){
        console.log("ERROR AL GENERAR REPORTE:", error);
        res.status(400).json({
            ok: false,
            error: "No se ha podido obtener el reporte"
        });
    }
}
exports.getVentasHoyController = async (req, res) => {
    try {
        const fechaInicio = moment().format('YYYY-MM-DD 00:00');
        const fechaFin = moment().format('YYYY-MM-DD 23:59');
        const query = `SELECT VD.id as VD, V.correlativo, P.id, P.name as Producto, P.color, C.name as Categoria, VD.precioFinal as Total, U.name, V.createdAt FROM Venta as V INNER JOIN VentaDetalles as VD ON V.id=VD.VentumId INNER JOIN Productos as P ON VD.ProductoId=P.id INNER JOIN Categoria as C ON C.id=P.CategoriumId INNER JOIN Users as U ON V.UserId=U.id WHERE V.cancelado=false AND V.createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}';`
        const [results, metadata] = await 
            sequelize.query(query);
            res.status(200).json({
                ok: true,
                ventas: results
            });   
    }catch(error){
        console.log("ERROR AL GENERAR REPORTE:", error);
        res.status(400).json({
            ok: false,
            error: "No se ha podido obtener el reporte"
        });
    }
}
exports.getVentasEncabezadosHoyController = async (req, res) => {
    try {
        const fechaInicio = moment().format('YYYY-MM-DD 00:00');
        const fechaFin = moment().format('YYYY-MM-DD 23:59');
        const query = `SELECT * FROM Venta WHERE cancelado=false AND createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}';`
        const [results, metadata] = await 
            sequelize.query(query);
            res.status(200).json({
                ok: true,
                ventas: results
            });   
    }catch(error){
        console.log("ERROR AL GENERAR REPORTE:", error);
        res.status(400).json({
            ok: false,
            error: "No se ha podido obtener el reporte"
        });
    }
}
exports.getVentasEncabezadosController = async (req, res) => {
    try {
        const fechaInicio = req.query.fechaInicio;
        const fechaFin = req.query.fechaFin;
        const query = `SELECT * FROM Venta WHERE cancelado=false AND createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}';`
        const [results, metadata] = await 
            sequelize.query(query);
            res.status(200).json({
                ok: true,
                ventas: results
            });   
    }catch(error){
        console.log("ERROR AL GENERAR REPORTE:", error);
        res.status(400).json({
            ok: false,
            error: "No se ha podido obtener el reporte"
        });
    }
}

exports.getVentasEncabezadosCanceladosController = async (req, res) => {
    try {
        const fechaInicio = req.query.fechaInicio;
        const fechaFin = req.query.fechaFin;
        const query = `SELECT * FROM Venta WHERE cancelado=true AND createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}';`
        const [results, metadata] = await 
            sequelize.query(query);
            res.status(200).json({
                ok: true,
                ventas: results
            });   
    }catch(error){
        console.log("ERROR AL GENERAR REPORTE:", error);
        res.status(400).json({
            ok: false,
            error: "No se ha podido obtener el reporte"
        });
    }
}
exports.getVentasCanceladasController = async (req, res) => {
    const query = `SELECT V.correlativo,P.name as producto, P.color as color,U.name as usuario,C.name as categoria, V.razonCancelacion, V.createdAt FROM Venta as V INNER JOIN Productos as P ON V.ProductoId=P.id INNER JOIN Categoria as C ON C.id=P.CategoriumId INNER JOIN Users as U ON V.usuarioVentaCancelada=U.id`;
    try {
        const [results, metadata] = await 
            sequelize.query(query);
            res.status(200).json({
                ok: true,
                ventas: results
            });   
    }catch(error){
        console.log("ERROR AL GENERAR REPORTE:", error);
        res.status(400).json({
            ok: false,
            error: "No se ha podido obtener el reporte"
        });
    }
}
/* CREAR VENTA */
exports.postVentaController = async (req, res) => {
    // Si existen errores son retornados.
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }

    try
    {
        // Obtener información de la venta
        var venta = req.body.venta;
        // Obtener productos de la venta
        const productos = req.body.productos;
        // Verificar que exista caja abierta
        const ultimaCaja = await Caja.findAll({
            limit: 1,
            order: [['createdAt', 'DESC']]
        });
        if(ultimaCaja.length > 0)
        {
            // Si la caja está abierta se procede a realizar la venta.
            if(ultimaCaja[0].status === "ABIERTO")
            {
                // TRANSACCIÓN PARA LA VENTA
                const result = await sequelize.transaction(async (t) => 
                {
                    // Obtener la última caja abierta
                    const cajaAbierta = await Caja.findOne({
                        where: {id: ultimaCaja[0].id}
                    }, {transaction: t});
                    // Generar venta
                    const ventaCrear = {
                        tipoVenta: venta.venta.metodoPago,
                        nombreCliente: venta.venta.nombre,
                        dpi: venta.venta.dpi,
                        total: venta.total,
                        nit: venta.venta.nit,
                        direccion: venta.venta.direccion,
                        UserId: venta.usuario.id
                    };
                    // Crear la venta
                    var ventaCreada = await Venta.create(ventaCrear, {transaction: t});
                    // Recorrer listado de productos para restar el stock y crear detalle
                    for(const p of productos)
                    {
                        const productoEncontrado = await Producto.findOne({
                            include: Categoria, 
                            where: {id: p.id}
                        }, {transaction: t});
                        var detalle = {};
                        // Si el producto si existe.
                        if(productoEncontrado !== null){
                            if(productoEncontrado.Categorium.name.includes("Epin"))
                            {
                                // Si es una recarga se suman todos los stocks disponibles para
                                // poder hacer la resta
                                var stockDisponible = await Stock.sum('cantidadRestante', {where: {cantidadRestante: {[Op.gt]: 0}, ProductoId: p.id}});
                                if(stockDisponible >= p.precioFinal)
                                {
                                    var stocksDisponibles = await Stock.findAll({order: [['createdAt','ASC']], where: {cantidadRestante: {[Op.gt]: 0}, ProductoId: p.id}});
                                    var stockRestar = p.precioFinal;
                                    for(var s of stocksDisponibles)
                                    {
                                        let stock = await Stock.findOne({where: {id: s.id}});
                                        if(stockRestar != 0)
                                        {
                                            if(stock.cantidadRestante - stockRestar < 0)
                                            {
                                                stockRestar -= stock.cantidadRestante;
                                                stock.cantidadRestante = 0;
                                            }
                                            else if(stock.cantidadRestante - stockRestar >= 0)
                                            {
                                                stock.cantidadRestante -= stockRestar;
                                                stockRestar = 0;
                                            }
                                        }
                                        await stock.save({transaction: t});
                                    }
                                }
                                detalle = {
                                    ...p,
                                    ProductoId: p.idProducto,
                                    VentumId: ventaCreada.id,
                                    subTotal: p.precioFinal,
                                    precioCompra: s.precioCompra
                                };
                            }
                            else 
                            {
                                // Buscar el stock más antiguo del producto
                                const ultimoStock = await Stock.findAll({
                                    limit: 1,
                                    order: [['createdAt','ASC']],
                                    where: {
                                        ProductoId: p.id,
                                        cantidadRestante: {
                                            [Op.gt]: 0
                                        }
                                    }
                                });
                                // Si existe stock
                                if(ultimoStock.length > 0 && ultimoStock[0].dataValues.cantidadRestante > 0)
                                {
                                    const stockEncontrado = await Stock.findOne({
                                        where: {id: ultimoStock[0].dataValues.id}
                                    }, {transaction: t});
                                    if(stockEncontrado === null){
                                        res.status(400).json({
                                            ok: false,
                                            message: "Stock no encontrado.",
                                        });
                                    }
                                    // RESTAR STOCK DE PRODUCTO
                                    if(productoEncontrado.Categorium.name.includes("Kit") || productoEncontrado.Categorium.name.includes("Accesorios") || productoEncontrado.Categorium.name.includes("SIM"))
                                    {
                                        stockEncontrado.cantidadRestante -= 1;
                                        p.precioCompra = stockEncontrado.precioCompra;
                                        await stockEncontrado.save({transaction: t});
                                    }
                                    detalle = {
                                        ...p,
                                        ProductoId: p.idProducto,
                                        VentumId: ventaCreada.id,
                                        subTotal: p.precioFinal,
                                        imei: venta.venta.imei,
                                        icc: venta.venta.icc,
                                        numero: venta.venta.numero,
                                        precioCompra: stockEncontrado.precioCompra
                                    };
                                }
                                else 
                                {
                                    res.status(400).json({
                                        ok: false,
                                        message: "No hay stock ingresado o stock insuficiente.",
                                    });
                                }
                            }
                        }
                        else 
                        {
                            return res.status(400).json({
                                ok: false,
                                message: "Producto no existente.",
                            });
                        }
                        delete detalle.id;
                        await VentaDetalle.create(detalle, {transaction: t});
                        // SE AGREGA A LA CAJA
                        if(venta.venta.metodoPago === "EFECTIVO")
                        {
                            cajaAbierta.cantidadEfectivo = parseInt(cajaAbierta.cantidadEfectivo) + parseInt(detalle.precioFinal);
                            cajaAbierta.cantidadEfectivoDia = parseInt(cajaAbierta.cantidadEfectivoDia) + parseInt(detalle.precioFinal);
                        }
                        else if(venta.venta.metodoPago === "TARJETA")
                        {
                            cajaAbierta.cantidadTarjeta = parseInt(cajaAbierta.cantidadTarjeta) + parseInt(detalle.precioFinal);
                        }
                        await cajaAbierta.save();
                    };
                    return ventaCreada.id;
                });
                
                var ventaRecibo = await Venta.findOne({
                    where: {id: result}}
                );
                var productosVendidos = await VentaDetalle.findAll({
                    include: [{model: Producto, include: Categoria}],
                    where: {VentumId: result}
                });
                res.status(200).json({
                    ok: true,
                    message: "Venta realizada correctamente.",
                    recibo: ventaRecibo,
                    productosVendidos
                });
            } 
            else if(ultimaCaja[0].status === "CERRADO") 
            {
                res.status(400).json({
                    ok: true,
                    message: "No existe caja abierta.",
                });
            }
        } 
        else 
        {
            res.status(400).json({
                ok: true,
                message: "No existen cajas registradas.",
            });
        };
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error al realizar la venta.",
            error
        });
    }
}
exports.deleteVentaController = async (req, res) => {
    // Si existen errores se retornan.
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    // Obtener información de venta
    const {razon,venta,id} = req.body;
    const ventaActualizada = {
        id: venta.id,
        cancelado: true,
        razonCancelacion: razon,
        usuarioVentaCancelada: id
    };
    // Obtener la última caja para verificar que 
    // hay caja abierta
    const ultimaCaja = await Caja.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']]
    });
    try {
        if(ultimaCaja.length > 0){
            // Si la caja está abierta se procede a realizar la venta.
            if(ultimaCaja[0].dataValues.status === "ABIERTO"){
                try {
                    const ventaCancelada = await Venta.update(ventaActualizada, {
                        where: {
                            id: ventaActualizada.id
                        }
                    });
                    // Actualizar la venta.
                    // Si se actualizo correctamente
                    if(ventaCancelada[0] == 1){
                        try {
                            const productosVendidos = await VentaDetalle.findAll({where: {VentumId: venta.id}})
                            for(const p of productosVendidos){
                                const productoEncontrado = await Producto.findOne({include: [{model: Categoria}], where: {id: p.dataValues.ProductoId}});
                                // Se busca el producto para regresar el stock de la venta
                                // Si el producto si existe.
                                if(productoEncontrado !== null){
                                    // Buscar el stock más antiguo
                                    const stocks = await Stock.findAll({
                                        limit: 1,
                                        order: [['createdAt', 'DESC']],
                                        where: {
                                            ProductoId: productoEncontrado.id
                                        }
                                    });
                                    if(stocks.length > 0){
                                        if((productoEncontrado.Categorium.name).includes("Kit") || (productoEncontrado.Categorium.name).includes("Accesorios") || (productoEncontrado.Categorium.name).includes("Epin") || (productoEncontrado.Categorium.name).includes("SIM")){
                                            const stockEncontrado = await Stock.findOne({
                                                where: {
                                                    id: stocks[0].dataValues.id
                                                }
                                            });
                                            if((productoEncontrado.Categorium.name).includes("Epin")){
                                                stockEncontrado.cantidadRestante += parseFloat(p.dataValues.precioFinal);    
                                            } else {
                                                stockEncontrado.cantidadRestante += 1;
                                            }
                                            await stockEncontrado.save();
                                        }
                                    } else {
                                        res.status(400).json({
                                            ok: false,
                                            message: "Stock no disponible.",
                                        });
                                    }
                                } 
                                // Si el producto no existo
                                else {
                                    res.status(400).json({
                                        ok: true,
                                        message: "Producto no encontrado.",
                                    });
                                }
                            }
                            // Se busca la venta para ver si es en EFECTIVO o TARJETA.
                            const ventaEncontrada = await Venta.findOne({where: {id: venta.id}});
                            if(ventaEncontrada === null){
                                res.status(400).json({
                                    ok: false,
                                    message: "Venta no existente.",
                                });
                            } else {
                                const cajaEncontrada = await Caja.findOne({where: {id:ultimaCaja[0].dataValues.id}});
                                if(ventaEncontrada.tipoVenta === "EFECTIVO"){
                                    cajaEncontrada.cantidadEfectivoDia -= ventaEncontrada.total;
                                    cajaEncontrada.cantidadEfectivo -= ventaEncontrada.total;
                                } else if(ventaEncontrada.tipoVenta === "TARJETA"){
                                    cajaEncontrada.cantidadTarjeta -= ventaEncontrada.total;
                                }
                                await cajaEncontrada.save();
                                // Eliminar la cantidad vendida de caja
                                res.status(200).json({
                                    ok: true,
                                    message: "Venta cancelada correctamente",
                                });
                            }
                        }catch(error){
                            console.log(error);
                            res.status(400).json({
                                ok: false,
                                message: "Ha ocurrido un error",
                            });
                        }
                    }
                }catch(error){
                    console.log(error);
                    res.status(400).json({
                        ok: false,
                        message: "La venta no se pudo actualizar",
                    });
                }
            } else if(ultimaCaja[0].dataValues.status === "CERRADO") {
                res.status(400).json({
                    ok: true,
                    message: "No existe una caja abierta.",
                });
            };
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
exports.getReporteVentasController = async (req, res) => {
    try {
        const {fechaInicio, fechaFin} = req.query;
        // Listado de ventas dentro del rango de fechas
        let ventas = await Venta.findAll({
            include: [{
                model: Producto,
                include: [Categoria]
            },{
                model: User
            }
            ],
            where: {
                status: true, 
                cancelado: false,
                createdAt: {
                    [Op.gte]: fechaInicio,
                    [Op.lte]: fechaFin
                }
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        // Conteo de ventas por usuario
        let ventasUsuario = await Venta.findAll({
            include: [{
                model: User,
                as: 'User'
            }],
            attributes: [
                'UserId',
                [sequelize.fn('count', sequelize.col('User.id')), 'numero_ventas'],
            ],
            group: 'UserId',
            where: {
                status: true, 
                cancelado: false,
                createdAt: {
                    [Op.gte]: fechaInicio,
                    [Op.lte]: fechaFin
                }
            },
        });

        let ganancias = 0;
        ventas.forEach((venta) => {
            ganancias += (parseFloat(venta.dataValues.Producto.dataValues.precioVenta) - parseFloat(venta.dataValues.Producto.dataValues.precioCompra));
        })

        res.status(200).json({
            ok: true,
            ventas,
            ventasUsuario,
            ganancias
        });
    } catch(error){
        console.log(error);
    }
}
exports.getReporteUsuarioVentasController = async (req, res) => {
    const {inicio,fin} = req.query;
    const query = `SELECT S.name, SUM(total) as cantidad, COUNT(V.id) as total FROM Venta as V INNER JOIN Users as S ON V.UserId=S.id WHERE V.cancelado=false AND V.createdAt BETWEEN "${inicio}" AND "${fin}" GROUP BY S.name`;
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
exports.getReporteVentasCategoriaHoy = async (req,res) => {
    const fechaInicio = moment().format('YYYY-MM-DD 00:00');
    const fechaFin = moment().format('YYYY-MM-DD 23:59');
    const query = `SELECT C.name, COUNT(C.id) as cantidad, SUM(V.total) as total FROM Venta as V INNER JOIN Productos as P ON P.id=V.ProductoId INNER JOIN Categoria as C ON C.id=P.CategoriumId WHERE V.cancelado=false AND V.createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}' GROUP BY C.id;`;
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
exports.getReporteGanancias = async (req,res) => {
    const {fechaInicio,fechaFin} = req.query;
    // const query = `SELECT P.id, SUM((V.precio-V.precioCompra)) as ganancia, P.name as producto, P.color, C.name as categoria  FROM Venta as V INNER JOIN Productos as P ON P.id=V.ProductoId INNER JOIN Categoria as C ON C.id=P.CategoriumId GROUP BY P.id;`;
    const query = `SELECT P.id, COUNT(P.id) as Vendidos, SUM((VD.precioFinal-VD.precioCompra)) as Ganancia, P.name as Producto, P.color, C.name as Categoria FROM VentaDetalles as VD INNER JOIN Productos as P ON VD.ProductoId=P.id INNER JOIN Categoria as C ON C.id=P.CategoriumId INNER JOIN Venta as V ON V.id=VD.VentumId WHERE V.cancelado=false AND VD.createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}' GROUP BY P.id;`;
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
exports.getTotalInvertidoController = async (req, res) => {
    try {
        const query = "SELECT SUM(precioCompra * cantidadRestante) as Invertido FROM Stocks as S INNER JOIN Productos as P ON S.ProductoId=P.id INNER JOIN Categoria as C ON C.id=P.CategoriumId WHERE cantidadRestante>0 AND C.name!='Epin Claro' AND C.name!='Epin Tigo' AND P.status=true;"
        const [results, metadata] = await 
            sequelize.query(query);
            res.status(200).json({
                ok: true,
                results
            });   
    }catch(error){
        console.log("ERROR AL GENERAR REPORTE DE INVERTIDO:", error);
        res.status(400).json({
            ok: false,
            error: "No se ha podido obtener el reporte"
        });
    }
}