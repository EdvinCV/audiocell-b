/**
 * SISTEMA WEB - LA BUBA 
 * 
 * EDVIN CALDERÓN - 2021
 * 
 */

 //Express
const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./config/dbconnection');
const Producto = db.productos;
const Categoria = db.categorias;
const Venta = db.ventas;
const bcrypt = require('bcryptjs');
const Stock = db.stocks;
const VentaDetalle = db.detalles;
const User = db.users;
const cors = require('cors'); 
// ENV
require('dotenv').config();
// CORS
const corsOptions = {
    origin: "*"
};

// Middlewares and routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use('/api/users', require('./components/users/userRouter'));
app.use('/api/categoria', require('./components/categorias/categoriasRouter'));
app.use('/api/producto', require('./components/productos/productoRouter'));
app.use('/api/venta', require('./components/ventas/ventasRouter'));
app.use('/api/caja', require('./components/caja/cajaRouter'));

// DB Connection
// Categoria -> Producto
Producto.belongsTo(Categoria);
Categoria.hasMany(Producto);
// Stock -> Producto
Stock.belongsTo(Producto);
Producto.hasMany(Stock);
// Venta -> Producto
// Producto.hasMany(Venta);
// Venta.belongsTo(Producto);
// Usuario -> Venta
Venta.belongsTo(User);
User.hasMany(Venta);
// Producto -> VentaDetalle -> VentaEncabezado
Producto.hasMany(VentaDetalle);
VentaDetalle.belongsTo(Producto);
VentaDetalle.belongsTo(Venta);
Venta.hasMany(VentaDetalle);

// CAMBIOS
const forzar = false;
db.sequelize.sync({force: forzar}).then(async () => {
    try {
        if(forzar){
            await Categoria.create({name: "Kit Liberado Claro"});
            await Categoria.create({name: "Kit Liberado Tigo"});
            await Categoria.create({name: "Kit Claro"});
            await Categoria.create({name: "Kit Tigo"});
            await Categoria.create({name: "Kit Liberado"});
            await Categoria.create({name: "Epin Claro"});
            await Categoria.create({name: "Epin Tigo"});
            await Categoria.create({name: "SIM Claro"});
            await Categoria.create({name: "SIM Tigo"});
            await Categoria.create({name: "Accesorios"});
            var salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hashSync("admin",salt);
            await User.create({name:"admin",username:"admin",password,rol:"ADMIN"});
        }
        console.log("DATABASE CONNECTED...");
    } catch(error){
        console.log(error);
    }
});

app.listen(3001, (err) => {
    if(err){
        console.log(err);
        process.exit(1);
    }
    console.log(process.env.DB_PASS);
    console.log('Server running');
});
