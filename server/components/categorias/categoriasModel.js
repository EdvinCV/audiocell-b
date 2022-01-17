// Models
// Models
const db = require('../../config/dbconnection');
const Producto = db.productos;

module.exports = (sequelize, Sequelize) => {
    const Categoria = sequelize.define('Categoria', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });
    return Categoria;
}