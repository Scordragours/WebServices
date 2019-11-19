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

// Ce contrôleur retourne le nombre de produit en stocke :
exports.getProduitStocke = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL SelectionnerStocke(?, ?)', [
            Requete.params.IdentifiantProduit,
            Requete.params.IdentifiantLocalisation
        ]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0][0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux membres du BDE d'ajouter du stocke à un produit sur un campus :
exports.postProduitStocke = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL AjouterLocalisationProduit(?, ?, ?)', [
                Requete.params.IdentifiantProduit,
                Requete.params.IdentifiantLocalisation,
                Requete.body.Stocke
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "Le stocke a été ajouter."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }
};
// Ce contrôleur permet aux membres du BDE de modifier le stocke d'un produit sur un campus :
exports.putProduitStocke = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL ChangerStocke(?, ?, ?)', [
                Requete.params.IdentifiantLocalisation,
                Requete.params.IdentifiantProduit,
                Requete.body.Stocke
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "Le stocke a été modifier."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à modifier le stocke."});
    }
};