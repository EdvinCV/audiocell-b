module.exports = (sequelize, Sequelize) => {
    const VentaDetalle = sequelize.define('VentaDetalle', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        precioVenta: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        precioFinal: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        precioCompra: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        subTotal: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        imei: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        icc: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        numero: {
            type: Sequelize.STRING(16),
            allowNull: true
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
    }, {
        timestamps: true
    });
    return VentaDetalle;
}