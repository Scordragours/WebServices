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

// Ce contrôleur permet de retourner le panier d'un utilisateur :
exports.getPanier = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(!RowsUtilisateur.length){
                return Reponse.status(500).json({Status: 500, Message: "Erreur d'identification du compte."});
            }else{
                Connection.query('CALL AfficherPanier(?)', [
                    RowsUtilisateur[0][0]['UTI_ID']
                ]).then(RowsPanier => {
                    return Reponse.status(200).json({Status: 200, Message: RowsPanier[0]});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet d'ajouter un article au panier d'un utilisateur  :
exports.postPanier = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(!RowsUtilisateur.length){
                return Reponse.status(500).json({Status: 500, Message: "Erreur d'identification du compte."});
            }else{
                Connection.query('CALL AfficherProduit(?, ?)', [
                    RowsUtilisateur[0][0]['LOC_ID'],
                    Requete.body.IdentifiantProduit
                ]).then(RowsProduit => {
                    if(!RowsProduit.length){
                        return Reponse.status(500).json({Status: 500, Message: "L'article demandé n'a pas été trouvé ou n'est pas disponible pour votre campus."});
                    }else{
                        if(RowsProduit[0][0]['LOC_PRO_LOC_STOCK'] < 1){
                            return Reponse.status(500).json({Status: 500, Message: "L'article demandé n'est plus en stock."});
                        }else if(RowsProduit[0][0]['LOC_PRO_LOC_STOCK'] < Requete.body.Quantite){
                            return Reponse.status(500).json({Status: 500, Message: "La quantité demandé dépasse celle du stock disponible pour cet article."});
                        }else{
                            Connection.query('CALL AjouterAuPanier(?, ?, ?)', [
                                RowsUtilisateur[0][0]['UTI_ID'],
                                Requete.body.IdentifiantProduit,
                                Requete.body.Quantite
                            ]).then(RowsPanier => {
                                return Reponse.status(200).json({Status: 200, Message: "Le produit a été ajouté au panier."});
                            }).catch(Erreur => {
                                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                            });
                        }
                    }
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de modifier le nombre d'article du panier d'un utilisateur :
exports.putPanier = (Requete, Reponse) => {
    if(Requete.body.Quantite < 1){
        return Reponse.status(500).json({Message: "La quantité sélectionnée n'est pas valide."});
    }
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(!RowsUtilisateur.length){
                return Reponse.status(500).json({Status: 500, Message: "Erreur d'identification du compte."})
            }else{
                Connection.query('CALL AfficherPanier(?)', [
                    RowsUtilisateur[0][0]['UTI_ID']
                ]).then(RowsPanier => {
                    for(let i in RowsPanier[0]){
                        if(RowsPanier[0][i]['PRO_ID'] == Requete.params.IdentifiantProduit){
                            Connection.query('CALL ModifierNombreProduitPanier(?, ?, ?)', [
                                RowsUtilisateur[0][0]['UTI_ID'],
                                Requete.params.IdentifiantProduit,
                                Requete.body.Quantite
                            ]).then(RowsPanier => {
                                return Reponse.status(200).json({Status: 200, Message: "La quantité de l'article a bien été modifiée."});
                            }).catch(Erreur => {
                                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                            });
                        }
                    }
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de supprimer un article du panier d'un utilisateur :
exports.deletePanier = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(!RowsUtilisateur.length){
                return Reponse.status(500).json({Status: 500, Message: "Erreur d'identification du compte."});
            }else{
                Connection.query('CALL AfficherPanier(?)', [
                    RowsUtilisateur[0][0]['UTI_ID']
                ]).then(RowsPanier => {
                    for(let i in RowsPanier[0]){
                        if(RowsPanier[0][i]['PRO_ID'] == Requete.params.IdentifiantProduit){
                            Connection.query('CALL RetirerDuPanier(?, ?)', [
                                RowsUtilisateur[0][0]['UTI_ID'],
                                Requete.params.IdentifiantProduit
                            ]).then(RowsPanier => {
                                return Reponse.status(200).json({Status: 200, Message: "L'article a bien été supprimé du panier."});
                            }).catch(Erreur => {
                                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                            });
                        }
                    }
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};