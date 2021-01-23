//los "process.env.argumento son utilizadas como variables globales que se pueden usar 
// en toda la aplicación pero es preferible usarlas para configuraciones
//como en este caso

//=================================
//             puerto
//=================================
//no requiere exportarlo, lo hace automaticamente porla variable global
process.env.PORT = process.env.PORT || 3000;


//=================================
//             entorno
//=================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=================================
//      Vencimiento del token
//=================================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=================================
//      SEED de autenticación
//=================================
process.env.SEMILLA = process.env.SEMILLA || 'este-es-el-seet-desarrollo';
//SEED => SEMILLA

//=================================
//         Base de Datos
//=================================
let urlDB;
// el process.env.MONGO_URL lo declaramos en la terminal
//asignando el valor entre comillas a la variable MONGO_URL desde la terminal
//ver sección 9, video variables de entorno heroku, comando para hacerlo es:
//heroku config:set MONGO_URL="argumento"
//para ver todas la variables de entorno escribir en la terminal heroku config
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
};

process.env.URLDB = urlDB;