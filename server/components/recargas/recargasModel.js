module.exports = (sequelize, Sequelize) => {
    const Recarga = sequelize.define('Recargas', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vendido: {
            type: Sequelize.DECIMAL,
            allowNull: true,
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true
    });
    return Recarga;
}