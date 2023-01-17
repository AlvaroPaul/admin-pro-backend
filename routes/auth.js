/*

    Path: '/api/login'

*/
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post( '/', 
    [
        check('email', 'email obligatorio').isEmail(),
        check('password', 'password obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
)

router.post( '/google', 
    [
        check('token', 'token obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
)

router.get( '/renew', 
    validarJWT,
    renewToken
)

module.exports = router;