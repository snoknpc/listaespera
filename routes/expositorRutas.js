const express = require('express');
const router = express.Router();
const controlador = require('../controllers/expositorControlador');

router.post('/registrar', controlador.registrar);

module.exports = router;