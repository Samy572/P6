// Importation de express après avoir installer le package express
const express = require('express');
// Appel de la méthode express ce qui permet de créer une application express
const app = express();
// Importation de mongoose
const mongoose = require('mongoose');
// Importation de notre router sauces
const saucesRoutes = require('./routes/sauce')
//Importation de notre router user
const userRoutes = require('./routes/user'); 
const path = require('path');
const cors = require('cors');




mongoose
	.connect(
		'mongodb+srv://Samy:samy123@cluster0.r2ogo.mongodb.net/?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));



// Ce middleware permet d'acceder à notre api depuis n'importe quel origine, d'ajouter des headers aux requête envoyées verst notre api
// d'envoyer des requête avec les méthodes mentionnés get, post ect..

app.use(cors()); 
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS'
	);

	next();
});

// Permet de nous donner acces au corps de la requête.
app.use(express.json());


// Utilisation de notre router
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

app.use('/image', express.static(path.join(__dirname, 'image')));
// On exporte notre application pour pouvoir y acceder depuis les autres fichiers de notre projet.
module.exports = app;
