// Chargement des frameworks :
let MariaDB = require('mariadb');
let JsonWebToken = require('jsonwebtoken');

// Connexion à la base de données :
let Pool = MariaDB.createConnection({
    host: '192.168.216.11',
    user: 'Structure',
    password: 'Structure',
    database: 'BD_GESCOM',
    connectionLimit: '100'
});

// Ce contrôleur permet de récupérer toutes les images d'un article :
exports.getProduitImages = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherPhotoProduit(?)', [Requete.params.IdentifiantProduit]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux membres du BDE d'ajouter une image à un article :
exports.postProduitImages = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL AjouterPhotoProduit(?, ?)', [
                Requete.body.URLImage,
                Requete.params.IdentifiantProduit
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "La catégorie à été ajouter au produit."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à ajouter une image au produit."});
    }
};
// Ce contrôleur permet aux membres du BDE de supprimer une image à un article :
exports.deleteProduitImages = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL SupprimmerPhotoProduit(?)', [
                Requete.params.IdentifiantPhoto
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "L'image à été supprimmer."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à supprimer une image du produit."});
    }
};