// Importation de jsonwebtoken
const jwt = require('jsonwebtoken');
// Importation de bcrypt pour le cryptage des mdp 
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

// Importation du schema user
const User = require('../models/User');

// Pour l'inscription
exports.signup = (req, res, next) => {
  // Hachage du mdp 10 = nombre de tour de hach
    bcrypt.hash(req.body.password, 10)
    // On recupere le hach qu'on va enregistrer dans un nouveau user
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Methode save pour l'enregistrer dans la bdd
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
          
      })
      .catch(error => res.status(500).json({ error }));
     
  };

// Pour la connexion

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
      // Si l'utilisateur n'existe pas dans notre bdd
        if (!user) {
            return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte'});
        }
        // on utilise la méthode compare de bcrypt pour comparer le mdp transmis avec celui de la bdd
        bcrypt.compare(req.body.password, user.password)
          
            .then(valid => {
              // Si le password est incorrect
                if (!valid) {
                    return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                // Si le password est correct
                }else{
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                      {userId: user._id},
                      'RANDOM_TOKEN_SECRET',
                      { expiresIn: '24h'}
                      ),
                })};
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  };