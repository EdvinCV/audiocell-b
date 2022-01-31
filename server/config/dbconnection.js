const Sequelize = require('sequelize');

const sequelize = new Sequelize('audiocell', 'root', 'Andromeda97as..', {
    host: 'localhost',
    dialect: "mysql",
    operatorAliases: false,
    timezone: "America/Guatemala"
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('../components/users/userModel')(sequelize, Sequelize);
db.categorias = require('../components/categorias/categoriasModel')(sequelize, Sequelize);
db.productos = require('../components/productos/productoModel')(sequelize, Sequelize);
db.stocks = require('../components/productos/stockModel')(sequelize, Sequelize);
db.ventas = require('../components/ventas/ventasModel')(sequelize, Sequelize);
db.detalles = require('../components/ventas/ventaDetalleModel')(sequelize, Sequelize);
db.cajas = require('../components/caja/cajaModel')(sequelize, Sequelize);
db.companies = require('../components/recargas/companyModel')(sequelize, Sequelize);
db.dispositivos = require('../components/recargas/dispositivoModel')(sequelize, Sequelize);
db.recargas = require('../components/recargas/recargasModel')(sequelize, Sequelize);



module.exports = db;
