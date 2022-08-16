// Permet d'acceder à notre model Sauce
const Sauce = require('../models/sauce');
// donne acces à des methodes file systeme
const fs = require('fs');


// Requête POST nouvel sauces qui vont être rajouté à la base
exports.createSauce = (req, res, next) => {
	const sauceObjet = JSON.parse(req.body.sauce);
	delete sauceObjet._id;
	// copie des tous les elements de req body

	const sauce = new Sauce({
		...sauceObjet,
		imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
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
	
			const sauceObjet = req.file ?
				 {
					...JSON.parse(req.body.sauce),
						imageUrl: `${req.protocol}://${req.get('host')}/image/${
							req.file.filename
						}`,	
				  }: { ...req.body };
				// Mise à jour de la sauce
			Sauce.updateOne(
				{ _id: req.params.id },
				{ ...sauceObjet, _id: req.params.id }
			)
				.then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
				.catch((error) => res.status(400).json({ error }));
		};


// Routes pour les likes et les dislikes 

exports.like = (req, res, next) => {
Sauce.findOne({_id : req.params.id})
.then((sauce) =>{
	// Si l'id de l'utilisateur n'est pas dans userliked dans la bdd et que like est à 1
	if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
		// Maj bdd 
		Sauce.updateOne({_id: sauce._id},{
			// Incrémentation du like 
			$inc: {likes: 1}, 
			// On pousse le like dans userliked
			$push: {usersLiked: req.body.userId}
		})
		.then(() => res.status(201).json({message: 'sauce like +1' }))
		.catch((error) => res.status(400).json({ error }));
		
		// Si l'id de l'utilisateur est dans userliked dans la bdd et que le like est à 0
	}	else if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
		
		Sauce.updateOne({_id: sauce._id},{
			// On enleve 1 like 
			$inc: {likes: -1}, 
			// On supprime du tableau un like en bdd 
			$pull: {usersLiked: req.body.userId}
		})
		.then(() => res.status(201).json({message: 'sauce like -1' }))
		.catch((error) => res.status(400).json({ error }));
	};
		// Si l'id de l'utilisateur n'est pas dans userdisliked dans la bdd et que like est à -1
	if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
		
		Sauce.updateOne({_id: sauce._id},{
			// On ajoute un dislike
			$inc: {dislikes: 1}, 
			// On pousse le dislikes dans la bdd dans userdiliked
			$push: {usersDisliked: req.body.userId}
		})
		.then(() => res.status(201).json({message: 'sauce dislike +1' }))
		.catch((error) => res.status(400).json({ error }));
		
		// Si l'id de l'utilisateur est dans usersDisliked dans la bdd et que le dislikes est à 0
	} else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
		
		Sauce.updateOne({_id: sauce._id},{
			// On enlève un dislike
			$inc: {dislikes: -1}, 
			// On supprime un dislike du tableau en bdd
			$pull: {usersDisliked: req.body.userId}
		})
		.then(() => res.status(201).json({message: 'sauce dislike -1' }))
		.catch((error) => res.status(400).json({ error }));
	};
	

	
}).catch((error) => res.status(404).json({ error }));
}


// Route pour la suppresions des données.

exports.deleteSauce = (req, res, next) => {
	// On cherche l'objet avec l'url de l'image
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split('/image/')[1];
			// Suppression du fichier
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
