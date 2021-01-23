//instalar npm i express --save para servicios web
const express = require('express');
//instalar npm i bcrypt --save  para encriptar contraseñas con un hash de una sola vía
const bcrypt = require('bcrypt');

//instalar npm install jsonwebtoken --save para generar y usar webtoken
let jwt = require('jsonwebtoken');

const Usuario = require('../server/models/usuario');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;


    let password = body.password;
    // findOne sirve para regresar solo un valor
    //se puede poner condicion dentro de los parentesis
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            })
        };

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            })

        }


        //=======================
        //   creacion de token
        //=======================
        //primer parametro es el objeto con la información que llevará,
        //'secret' es el segundo parametro, y ultimo parametro es cuando expirara
        // los numeros son segundos, minutos, horas, dias; se le puede agregar 
        // o quitar números según lo que necesite el programador.
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    })


})



module.exports = app;