module.exports = (sequelize, Sequelize) => {
    const Stock = sequelize.define('Stock', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        precioCompra: {
            type: Sequelize.DECIMAL,
            allowNull: true,
        },
        cantidadComprada: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        cantidadRestante: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true
    });
    return Stock;
}