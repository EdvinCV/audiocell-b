// Models
const db = require('../../config/dbconnection');
const Company = db.companies;
// Express validator
const {validationResult} = require('express-validator');

// GET: Obtener dispositivos
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll({
            where: {
                status: true
            }
        });
        res.status(200).json({
            ok: true,
            companies
        });
    } catch(error){
        console.log(error);
    }
}