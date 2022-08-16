// Permet l'échange et la verification des données 
const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    // Récuperation de notre token 
       const token = req.headers.authorization.split(' ')[1];
       // Utilisation de la methode verify pour decoder notre token
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       // Extraction de l'id utilisateur de notre token et on l'ajoute à l'obj request
       // pour que nos routes puissent l'exploiter
       req.auth = {
           userId: userId
       };
       next();
   } catch(error) {
       res.status(401).json({ error });
   }
  
};

