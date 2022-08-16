const express = require('express');
const router = express.Router();
// Importation de notre controllers user
const userCtrl = require('../controllers/user');


// Router pour l'authentification et l'inscription
router.post('/login',  userCtrl.login); 
router.post('/signup',  userCtrl.signup); 


// exportation de notre router user
module.exports = router; 