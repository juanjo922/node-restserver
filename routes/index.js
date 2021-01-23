//Todos los require tienen que ir arriba según el estandar
const express = require('express');
const app = express();


//adquirimos las rutas de las peticiones de los archivos de la carpeta routes
app.use(require('./usuario'));
app.use(require('./login'));


//exportamos todas las configuraciones y metodos de la constante App
//de inicio de express
module.exports = app;