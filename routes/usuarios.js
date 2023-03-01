/*
    ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', validarJWT, getUsuarios );

router.post( '/', 
    [
        check('nombre', 'nombre obligatorio').not().isEmpty(),
        check('password','password obligatorio').not().isEmpty(),
        check('email', 'email obligatorio').isEmail(),
        //validarCampos,
    ],
    crearUsuario
);

router.put( '/:id', 
    [
        validarJWT,
        validarADMIN_ROLE_o_MismoUsuario,
        check('nombre', 'nombre obligatorio').not().isEmpty(),
        check('email', 'email obligatorio').isEmail(),
        check('role', 'rol obligatorio').not().isEmpty(),
        validarCampos,
    ], 
    actualizarUsuario
);

router.delete( '/:id',
    [ validarJWT, validarADMIN_ROLE ],
    borrarUsuario
);


module.exports = router;