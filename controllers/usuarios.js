const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0; 

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ),

        Usuario.countDocuments()
    ]);

        res.json({
            ok: true,
            usuarios,
            total
        });
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'el correo ya existe'
            });
        }

        const usuario = new Usuario( req.body );

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        //guardar usuario
        await usuario.save();

        //generar el token - JWT
       const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'La cague'
        })
    }
}

const actualizarUsuario = async ( req, res = response ) => {

    //todo: validar token y comprobar si el uisuario correcto

    const uid = req.params.id;

    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe el usuario por ese id'
            });              
        }

        //actualizaciones
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ){

            const existeEmail = await Usuario.findOne({ email });
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'ya exist un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado'
        });   
    }
}

const borrarUsuario = async(req, res = response ) => {

    const uid = req.params.id; 

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe el usuario por ese id'
            });              
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok:true,
            msg: 'usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el admi'
        });   
    }
    
}

/*var mongoObjectId = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};*/

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}