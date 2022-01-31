module.exports = (sequelize, Sequelize) => {
    const Producto = sequelize.define('Producto', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        precioVenta: {
            type: Sequelize.DECIMAL,
            allowNull: true,
        },
        precioVenta2: {
            type: Sequelize.DECIMAL,
            allowNull: true,
        },
        precioVenta3: {
            type: Sequelize.DECIMAL,
            allowNull: true,
        },
        proveedor: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        color: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true
    });
    return Producto;
}