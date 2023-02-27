/*

    ruta: '/api/hospitales'

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedicoById } = require('../controllers/medicos');

const router = Router();

router.get( '/', validarJWT, getMedicos );

router.post( '/', 
    [
        validarJWT,
        check('nombre', 'nombre obligatorio').not().isEmpty(),
        check('hospital', 'hospital id invalido').isMongoId(),
        validarCampos
    ],
    crearMedico
);

router.put( '/:id', 
    [
        validarJWT,
        check('nombre', 'nombre obligatorio').not().isEmpty(),
        check('hospital', 'hospital id invalido').isMongoId(),
        validarCampos
    ], 
    actualizarMedico
);

router.delete( '/:id',
    validarJWT,
    borrarMedico
);

router.get( '/:id',
    validarJWT,
    getMedicoById
);

/*//Get doctor
router.get('/:id', [
    JWTValidation,
    check('id','El id del doctor debe ser un ID de Moongo').isMongoId(),
    validateFields
], getDoctorById);*/

module.exports = router;