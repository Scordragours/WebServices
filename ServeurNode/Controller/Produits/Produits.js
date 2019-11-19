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

// Ce contrôleur permet de retourner tous les artciles d'un campus :
exports.getIndex = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherProduits(?)', [Requete.params.IdentifiantLocalisation]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur retourne les détails d'un article sur un campus :
exports.getProduit = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherProduit(?, ?)', [
            Requete.params.IdentifiantLocalisation,
            Requete.params.id
        ]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0][0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux membres du BDE de créer un article :
exports.postProduit = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL AjouterProduit(?, ?, ?, ?)', [
                Requete.body.Nom,
                Requete.body.Description,
                Requete.body.Prix,
                Requete.body.InVisible
            ]).then(RowsAjouterProduit => {
                Connection.query('CALL SelectionnerIdentifiantProduit(?, ?, ?)', [
                    Requete.body.Nom,
                    Requete.body.Description,
                    Requete.body.Prix
                ]).then(RowsProduit => {
                    let Tableau = JSON.parse(Requete.body.Categories);
                    for(let i in Tableau){
                        Connection.query('CALL AjouterCategorieProduit(?, ?)', [
                            Tableau[i],
                            RowsProduit[0][0]['PRO_ID']
                        ]).then(RowsCategorieProduit => {});
                    }
                    Connection.query('CALL RechercherUtilisateur(?, ?)', [
                        Requete.params.AdressMail,
                        Requete.params.MotDePasse
                    ]).then(RowsUtilisateur => {
                        Connection.query('CALL AjouterLocalisationProduit(?, ?, ?)', [
                            RowsProduit[0][0]['PRO_ID'],
                            RowsUtilisateur[0][0]['LOC_ID'],
                            Requete.body.Nombre
                        ]).then(RowsCategorieProduit => {
                            return Reponse.status(200).json({Status: 200, Message: "Le produits à été ajouter.", ID: RowsProduit[0][0]['PRO_ID']});
                        }).catch(Erreur => {
                            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                        });
                    }).catch(Erreur => {
                        return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                    });
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à créer un produit."});
    }
};
// Ce contrôleur permet aux membres du BDE de modifier un article :
exports.putProduit = (Requete, Reponse) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL ModifierProduit(?, ?, ?, ?, ?)', [
                Requete.body.Nom,
                Requete.body.Description,
                Requete.body.Prix,
                Requete.body.InVisible,
                Requete.params.id
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "Le produit à été modifié."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à modifier le produit."});
    }
};
// Ce contrôleur permet aux membres du BDE de supprimer un article :
exports.deleteProduit = (Requete, Reponse, Next) => {
    if(Requete.params.Status == 2){
        Pool.then(Connection => {
            Connection.query('CALL SupprimerProduit(?)', [
                Requete.params.id
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: "Le produit à été supprimée."});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
        });
    }else{
        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à supprimer le produit."});
    }
};