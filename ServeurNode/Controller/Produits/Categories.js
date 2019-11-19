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
// Ce contrôleur permet de récupérer toutes les catégories :
exports.getProduitCategorie = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL SelectionnerCategorie()', []).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux membres du BDE d'ajouter une catégorie à un produit :
exports.postProduitCategorie = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL AjouterCategorieProduit(?, ?)', [
                Requete.params.IdentifiantCathegorie,
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
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à ajouter une catégorie à un produit."});
    }
};
// Ce contrôleur permet aux membres du BDE de créer une catégorie :
exports.postProduitCreeCategorie = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Requete.body.IdentifiantCategorie = parseInt(Requete.body.IdentifiantCategorie);
        if(Requete.body.IdentifiantCategorie == 0){
            Requete.body.IdentifiantCategorie = null;
        }
        Pool.then(Connection => {
            Connection.query('CALL CreeCategorie(?, ?)', [
                Requete.body.Nom,
                Requete.body.IdentifiantCategorie
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "La catégorie à été ajouter."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à créer une catégorie."});
    }
};
// Ce contrôleur permet aux membres du BDE d'enlever une catégorie à un produit :
exports.deleteProduitCategorie = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL EnleverCategorieProduit(?, ?)', [
                Requete.params.IdentifiantCathegorie,
                Requete.params.IdentifiantProduit
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "La catégorie à été enlevé du produits."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à enlever une catégorie du produit."});
    }
};
// Ce contrôleur permet aux membres du BDE de supprimer une catégorie :
exports.deleteProduitCreeCategorie = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL SupprimerCategorie(?)', [
                Requete.params.IdentifiantCathegorie
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "La catégorie à été supprimmer."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à supprimer une catégorie."});
    }
};