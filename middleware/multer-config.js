// multer est un package de gestion de fichiers. Sa méthode diskStorage() configure le chemin et le nom de fichier pour les fichiers entrant
const multer = require('multer');
// Création de notre mimetype pour génerer les extensions de fichier
const MIME_TYPES = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
};

// Création de la constante storage , à passer à multer comme configuration.
const storage = multer.diskStorage({
	// enregistrer les fichiers dans le dossier image.
	destination: (req, file, callback) => {
		callback(null, 'image');
	},
	/* La fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores 
	 et de rajouter les extensions du mimetype et d'ajouter un timestamp  */
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_');
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + '.' + extension);
	},
});
// Exportation de notre middleware multer pour les routes create et modify
module.exports = multer({ storage }).single('image');
