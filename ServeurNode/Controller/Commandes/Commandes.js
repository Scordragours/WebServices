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

// Ce contrôleur permet de retourner toutes les commandes confirmées, mais pas livrée d'un campus :
exports.getIndex = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL AfficherCommandePasser(?)', [
                    RowsUtilisateur[0][0]['LOC_ID']]
                ).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: Rows[0]});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à voir les commandes."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de transformer le panier en commande confirmée :
exports.postCommande = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] >= 1){
                Connection.query('CALL AfficherPanier(?)', [
                    RowsUtilisateur[0][0]['UTI_ID']
                ]).then(RowsPanier => {
                    let NumberRow = 0;
                    for(let i in RowsPanier[0]){
                        if(RowsPanier[0][i]['PRO_ID'] != null){
                            NumberRow++;
                        }
                    }
                    for(let i in RowsPanier[0]){
                        if(RowsPanier[0][i]['PRO_ID'] != null){
                            Connection.query('CALL AfficherProduit(?, ?)', [
                                RowsUtilisateur[0][0]['LOC_ID'],
                                RowsPanier[0][i]['PRO_ID']
                            ]).then(RowsProduit => {
                                if(RowsProduit[0][0]['LOC_PRO_LOC_STOCK'] < 1){
                                    return Reponse.status(500).json({Status: 500, Message: "L'article demandé n'est plus en stock."});
                                }else if(RowsProduit[0][0]['LOC_PRO_LOC_STOCK'] < RowsPanier[0][i]['STOCKUTI']){
                                    return Reponse.status(500).json({Status: 500, Message: "La quantité demandé dépasse celle du stock disponible pour cet article."});
                                }else if(i == NumberRow - 1){
                                    Connection.query('CALL ConfirmerPanier(?, ?)', [
                                        RowsUtilisateur[0][0]['UTI_ID'],
                                        RowsUtilisateur[0][0]['LOC_ID']
                                    ]).then(Rows => {
                                        return Reponse.status(200).json({Status: 200, Message: "Le pannier a été comfirmer."});
                                    }).catch(Erreur => {
                                        return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                                    });
                                }
                            }).catch(Erreur => {
                                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                            });
                        }
                    }
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas connecté."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de changer le statu de la commande confirmée en envoyer :
exports.putCommande = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL ChangerStatusCommande(?, ?)', [
                    Requete.body.IdentifiantStatusCommande,
                    Requete.params.IdentifiantCommande
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: "Le pannier a été comfirmer."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à modifier la commande."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};