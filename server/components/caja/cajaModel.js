// Models
// Models

module.exports = (sequelize, Sequelize) => {
    const Caja = sequelize.define('Caja', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cantidadEfectivoApertura: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        cantidadEfectivoCierre: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        },
        cantidadEfectivo: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        },
        cantidadEfectivoDia: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        },
        cantidadTarjeta: {
            type: Sequelize.DECIMAL,
            defaultValue: 0
        },
        status: {
            type: Sequelize.STRING(100),
            defaultValue: "ABIERTO"
        }
    }, {
        timestamps: true
    });
    return Caja;
}