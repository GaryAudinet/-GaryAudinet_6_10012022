// Import des packages requis

const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Creation des routes pour le signup et login , puis exports router

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;