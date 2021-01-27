//instalar npm i express --save para servicios web
const express = require('express');
//instalar npm i bcrypt --save  para encriptar contraseñas con un hash de una sola vía
const bcrypt = require('bcrypt');

//instalar npm install jsonwebtoken --save para generar y usar webtoken
let jwt = require('jsonwebtoken');


// instalar npm install google-auth-library --save y poner estas dos lineas de código
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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



//configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;
    //si no existe error se obtine un objeto con parte de la información del usuario
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        })

    //llama al esquema Usuario findOne para verificar si en la DB tenemos un usuario con ese correo
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (usuarioDB) { //si existe el usuario.

            //Usuario existe pero no se autenticó por google, entonces uso su correo normal
            //para autenticarse en el método de autenticación normal, si es así no permitir que se autentique por google
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe de usar su autenticación normal'
                    }
                })
            } else { //si se autenticó por google
                //se renueva el token personalizado y se regresa con la información 

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }

        } else {

            //si el usuario no existe en nuestra base de datos
            //y si es la primera vez que el usuario se esté autenticando
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            //metodo save para grabar el usuario en la base de datos
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                };

                //si no existe error se genera un nuevo token y se manda a imprimir
                //como una respuesta del json
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });

            })

        }

    })

});




module.exports = app;