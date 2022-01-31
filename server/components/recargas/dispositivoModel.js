module.exports = (sequelize, Sequelize) => {
    const Dispositivo = sequelize.define('Dispositivo', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        stock: {
            type: Sequelize.DECIMAL,
            allowNull: false,
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true
    });
    return Dispositivo;
}