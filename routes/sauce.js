// Import des packages requis

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer');

// Creation des routes pour le CRUD, le like/dislike, puis exports router

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.readSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.readAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeDislike);

module.exports = router;