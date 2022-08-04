const express = require('express');
//Permet de créer des routeurs séparés pour chaque route principale de l'application
const router = express.Router();
// importation de notre middleware authentification
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Importation de notre schéma
const sauceCtrl = require('../controllers/sauce');



router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.like);

// On exporte notre router
module.exports = router;

