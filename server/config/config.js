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
//         Base de Datos
//=================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://juanjo922:KGPLREZfSWWVwyB5@cluster0.znni4.mongodb.net/cafe';
};

process.env.URLDB = urlDB;