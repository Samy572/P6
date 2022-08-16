const mongoose = require('mongoose');
// S'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});
// On ajoute le plugin unique validator à notre schéma
userSchema.plugin(uniqueValidator);
// On exporte notre schéma user
module.exports = mongoose.model('User', userSchema);
