//instalar npm i express --save para servicios web
const express = require('express');
//instalar npm i bcrypt --save  para encriptar contraseñas con un hash de una sola vía
const bcrypt = require('bcrypt');

//instalar npm install jsonwebtoken --save para generar y usar webtoken
let jwt = require('jsonwebtoken');

// instalar npm install underscore --save para filtrar campos de objetos
const _ = require('underscore')

const Usuario = require('../server/models/usuario');
const { verificaToken } = require('../server/middlewares/autenticacion');
const { verificaAdmin_Role } = require('../server/middlewares/autenticacion');
const usuario = require('../server/models/usuario');

const app = express();


//en las peticiones cuando el callback es el segundo parametro se debe de hacer como una funcion normal
//de lo contrario, si es el tercer argumento lo podemos usar como funcion de flecha
//app.get('/usuario', function(req, res) {});
//en este caso el segundo argumento es un middleware
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    //el primer parametro es para condiciones "especificar que es lo que queremos traer"
    //el segundo parametro es un string especificando que campos son los que se mostraran   
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            };

            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            })

        })

});


app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        //   usuarioDB.password = null;

        // let token = jwt.sign({
        //     usuario: usuarioDB
        // }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});



app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //segundo parametro es el objeto que vamos actualizar "buscar en documentacion de mongoose findIdAndUpdate"
    //tercer parametro es para las opciones: es un objeto new de tipo boolean con valor true, sirve para obtener la nueva informacion actualizada
    //runValidators cuando esta en true ejecuta todas las validaciones definidas en el esquema, osea, las que estan predeterminadas como en el caso de lo roles
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    })

}); //fin de app.put

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;


    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        //codigo para deshabilitar usuario
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    })


    //codigo para eliminar registro fisico
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });

    // })

});


module.exports = app;