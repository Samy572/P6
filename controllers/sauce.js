const Sauce = require('../models/sauce');
const fs = require('fs');

// Requête POST nouvel sauces qui vont être rajouté à la base
exports.createSauce = (req, res, next) => {
	const sauceObjet = JSON.parse(req.body.sauce);
	delete sauceObjet._id;
	// copie des tous les elements de req body

	const sauce = new Sauce({
		...sauceObjet,
		imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
		like: 0,
		dislike: 0,
		usersLiked: [],
		usersDisliked: [],
	});

	// enregistrement des sauces en bdd
	sauce
		.save()
		.then(() => res.status(201).json({ message: 'Sauce enregistré.' }))
		.catch((error) => {
			res.status(400).json({ error });
		});
};

// Utilisation de la méthode findOne() dans notre modèle Sauces pour trouver la Sauce unique ayant le même _id que le paramètre de la requête
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			res.status(200).json(sauce);
		})
		.catch((error) => res.status(400).json({ error }));
};

// Routes put pour la modification des données.

exports.modifySauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }).then((sauce) => {
		const filename = sauce.imageUrl.split('/image/')[1];
		fs.unlink(`image/${filename}`, () => {
			const sauceObjet = req.file
				? {
						...JSON.parse(req.body.sauce),
						imageUrl: `${req.protocol}://${req.get('host')}/image/${
							req.file.filename
						}`,
				  }
				: { ...req.body };
			Sauce.updateOne(
				{ _id: req.params.id },
				{ ...sauceObjet, _id: req.params.id }
			)
				.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
				.catch((error) => res.status(400).json({ error }));
		});
	});
};

exports.like = (req, res, next) => {
	const like = req.body.like;
};

// Route pour la suppresions des données.

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split('/image/')[1];
			fs.unlink(`image/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// L'application utilisera cette fonction pour faire une requete à l'api
//Renvoie un tableau de toutes les sauces de la base de données.
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => {
			res.status(401).json({ error });
		});
};
