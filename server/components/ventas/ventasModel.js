module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define('Venta', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        correlativo: {
            type: Sequelize.STRING(2000),
            defaultValue: ""
        },
        total: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        tipoVenta: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        nombreCliente: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        dpi: {
            type: Sequelize.STRING(13),
            allowNull: true
        },
        direccion: {
            type: Sequelize.STRING(30),
            allowNull: true
        },
        nit: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        cancelado: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        razonCancelacion: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        usuarioVentaCancelada: {
            type: Sequelize.DECIMAL,
            allowNull: true
        }
    }, {
        timestamps: true
    });
    return Venta;
}