// Models
const db = require('../../config/dbconnection');
const Dispositivo = db.dispositivos;
const Company = db.companies;
// Express validator
const {validationResult} = require('express-validator');

// GET: Obtener dispositivos
exports.getDispositivos = async (req, res) => {
    try {
        const dispositivos = await Dispositivo.findAll({
            include: [{
                model: Company,
                as: 'Company'
            }],
            where: {
                status: true
            }
        });
        res.status(200).json({
            ok: true,
            dispositivos
        });
    } catch(error){
        console.log(error);
    }
}

// POST: Crear un nuevo dispositivo
exports.postDispositivoController = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const dispositivo = {
            name: req.body.name,
            stock: req.body.saldo ? req.body.saldo : 0,
            CompanyId: req.body.company
        }
        const dispositivos = await Dispositivo.findAll({
            where: {
                name: req.body.name
            }
        });
        if(dispositivos.length > 0){
            res.status(400).json({
                ok: false,
                message: "Nombre de dispositivo existente.",
                error
            });
        }
        const dispositivoCreado = await Dispositivo.create(dispositivo);
        res.status(200).json({
            ok: true,
            message: "Dispositivo creado correctamente",
            data: dispositivoCreado
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

// PUT: Update device
exports.putDeviceController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const device = {
            id: req.body.id,
            name: req.body.name,
            stock: req.body.name,
            CompanyId: req.body.company
        }
        // Buscar el producto
        const editedDevice = await Dispositivo.update(device, {
            where: {
                id: device.id
            }
        });
        if(editedDevice[0] == 1){
            res.status(200).json({
                ok: true,
                msg: "Dispositivo editado correctamente",
                data: editedDevice[0]
            });
        } else {
            res.status(200).json({
                ok: true,
                msg: "Dispositivo no encontrado.",
                data: editedDevice[0]
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

// DELETE: Eliminar dispositivo
exports.deleteDeviceController = async (req, res) => {
    // If there are errors are returned
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.array()
        });
    }
    try {
        const device = {
            id: req.body.id,
            status: false
        }
        // Buscar el producto
        const editedDevice = await Dispositivo.update(device, {
            where: {
                id: device.id
            }
        });
        if(editedDevice[0] == 1){
            res.status(200).json({
                ok: true,
                msg: "Dispositivo eliminado correctamente",
                data: editedDevice[0]
            });
        } else {
            res.status(200).json({
                ok: true,
                msg: "Dispositivo no encontrado.",
                data: editedDevice[0]
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