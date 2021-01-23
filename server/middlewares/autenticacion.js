//importar la librería
const jwt = require('jsonwebtoken');

//=================================
//        verificar token
//=================================
//el next es para que siga ejecutando la aplicación
//si no lo toma se congela el proceso
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    //codigo para verificar el token
    jwt.verify(token, process.env.SEMILLA, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next()

    })


};


//=================================
//        verifica AdminRole
//=================================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    };

};







module.exports = {
    verificaToken,
    verificaAdmin_Role
}