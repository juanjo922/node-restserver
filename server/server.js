//instalar npm i express --save para servicios web
//importacion del puerto ubicado en server/config/config.js
//se pone en primera linea para que lea el puerto al inicio
require('./config/config');

//Todos los require tienen que ir arriba según el estandar
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//adquirimos las rutas de las peticiones en el archivo usuario de la carpeta routes
app.use(require('../routes/usuario'));

// ==============================
// Conexión a la base de datos
// ==============================
let url = process.env.URLDB;
// "node":"12.6.0",
mongoose.connect(url, {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

}, (err, res) => {
    if (err) {
        throw err
    };
    throw message = 'Base de datos ONLINE'
});

let getConexion = async(url) => {
    await mongoose.connect(url, {});

    // return `Base de datos ONLINE`;

}


// ======================
// Conexion con promesas
// ======================
// let getConexion = (url) => {

//     return new Promise((resolve, reject) => {

//         let conexion = mongoose.connect(url, {});

//         if (!conexion || conexion == null) {
//             reject(`Error en la base`)
//         } else {
//             resolve(conexion);
//         }
//     });
// }

// getConexion(url)
//     .then(resp => {
//         console.log(`Conexion exitosa`);
//     })
//     .catch(err => {
//         console.log(err);
//     })

getConexion(url).then(mensaje => console.log(mensaje)).catch(err => console.log(err));




app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT)
});