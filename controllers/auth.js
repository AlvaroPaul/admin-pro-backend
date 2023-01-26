const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async( req, res = response) => {

    const { email, password } = req.body;

    try {

        //verificar email
       const usuarioDB = await Usuario.findOne({ email });

       if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            });
       }

       //verificar contraseña
       const validPassword = bcrypt.compareSync( password, usuarioDB.password );

       if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'contraseña no valida'
            });
       }

       //generar el token - JWT
       const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'hable con el admi'
            }); 
    }

}

const googleSignIn = async( req, res = response) => {

    try {
        const { email, name, picture } = await googleVerify( req.body.token );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //guardar usuario
        await usuario.save();

        //generar el token - JWT
       const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            email, name, picture,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'token google invalido'
        });
    }
    
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    //generar el token - JWT
    const token = await generarJWT( uid );

    //obtener el usuario por el uid
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        token,
        usuario
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}