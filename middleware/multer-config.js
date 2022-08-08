const multer = require('multer');
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
	// La fonction filename indique à multer d'utiliser le nom d'origine.
	filename: (req, file, callback) => {
		let name = file.originalname.split('.')[0];
		name = name.split(' ').join('_');
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + '.' + extension);
	},
});
// Exportation de la constante storage.
module.exports = multer({ storage }).single('image');
