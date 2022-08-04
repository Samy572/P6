const mongoose = require('mongoose');

// On crée notre schéma pour notre base de donnée
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name : {type: String, required: true},
    manufacturer : {type: String, required: true},
    description : {type: String, required: true},
    mainPepper : {type: String, required: true},
    imageUrl : {type: String, required: true},
    heat : {type: Number, required: true},
    likes : {type: Number},
    dislikes : {type: Number},
    userLiked : {type: [String]},
    userDisliked : {type: [String]},
});
// On exporte notre schéma 
module.exports = mongoose.model('Sauce', sauceSchema); 