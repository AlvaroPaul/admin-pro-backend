const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

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




module.exports = router;