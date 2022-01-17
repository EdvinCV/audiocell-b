/*
    USER CONTROLLER: Here there are the functions to manage all the endpoints of the users, also
    the functions to manage the login and logout endpoints.
*/
// Models
const db = require('../../config/dbconnection');
const Caja = db.cajas;
// Express validator
const {validationResult} = require('express-validator');

exports.getCajasController = async (req, res) => {
    try {
        const cajas = await Caja.findAll({
            where: {
                status: "CERRADO"
            },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({
            ok: true,
            cajas
        });
    } catch(error){
        console.log(error);
        res.status(200).json({
            ok: false,
            message: "Ha ocurrido un error"
        });
    }
}

exports.getCajaController = async (req, res) => {
    try {
        // Obtener la última caja, ya sea cerrada o abierta
        const ultimaCaja = await Caja.findAll({
            limit: 1,
            order: [['createdAt', 'DESC']]
        });
        // Si existe una caja entonces se obtiene y se retorna
        if(ultimaCaja.length > 0){
            res.status(200).json({
                ok: true,
                cajaActual: ultimaCaja[0]
            });
        } else {
            res.status(200).json({
                ok: false,
                message: "No existe registro de caja."
            });
        }
    } catch(error){
        console.log(error);
    }
}

exports.postCajaController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const ultimaCaja = await Caja.findAll({
            limit: 1,
            order: [['createdAt', 'DESC']]
        });
        if(ultimaCaja.length > 0){
            if(ultimaCaja[0].dataValues.status === "ABIERTO"){
                res.status(400).json({
                    ok: false,
                    message: "Ya existe una caja abierta.",
                });
            } else if(ultimaCaja[0].dataValues.status === "CERRADO") {
                const caja = {
                    cantidadEfectivoApertura: req.body.apertura,
                    cantidadEfectivo: req.body.apertura
                }
                console.log("CAJAAAAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX: ", caja);
                const cajaCreada = await Caja.create(caja);
                res.status(200).json({
                    ok: true,
                    message: "Caja abierta correctamente.",
                    data: cajaCreada
                });
            };
        } else {
            const caja = {
                cantidadEfectivoApertura: req.body.apertura,
                cantidadEfectivo: req.body.apertura
            }
            const cajaCreada = await Caja.create(caja);
            res.status(200).json({
                ok: true,
                message: "Categoria creada correctamente",
                data: cajaCreada
            });
        }
    } catch(error){
        console.log(error);
        res.status(400).json({
            ok: false,
            message: "Ha ocurrido un error",
            error
        });
    }
}

/* CONTROLADOR PARA CERRAR LA CAJA */
exports.cerrarCajaController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        // Buscar la última caja creada.
        const ultimaCaja = await Caja.findAll({
            limit: 1,
            order: [['createdAt', 'DESC']]
        });
        // Si existe última caja.
        if(ultimaCaja.length > 0){
            // Si la última caja es una caja abierta entonces si se puede cerrar.
            if(ultimaCaja[0].dataValues.status === "ABIERTO"){
                const cajaCerrada = await Caja.findOne({
                    where: {id: ultimaCaja[0].dataValues.id}
                });
                cajaCerrada.status = "CERRADO";
                cajaCerrada.cantidadEfectivoCierre = parseFloat(cajaCerrada.cantidadEfectivo) + parseFloat(cajaCerrada.cantidadTarjeta);
                await cajaCerrada.save();
                res.status(200).json({
                    ok: true,
                    message: "Caja cerrada correctamente.",
                    data: cajaCerrada
                });
            // Si la última caja es cerrada entonces no se puede cerrar y se retorna el error
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
            message: "Ha ocurrido un error",
            error
        });
    }
}

exports.putCategoriaController = (req, res) => {

}

exports.deleteCategoriaController = (req, res) => {
    
}