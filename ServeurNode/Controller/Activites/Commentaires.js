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

// Ce contrôleur permet de retourner tous les commentaires visibles ou non si l'utilisateur connecté est membre du BDE :
exports.getPhotoCommentaires = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Requete.params.Visibiliter = Requete.params.Visibiliter;
            }else{
                Requete.params.Visibiliter = false;
            }
            Connection.query('CALL AfficherCommentaires(?, ?, ?, ?)', [
                Requete.params.Minimum,
                Requete.params.Maximum,
                Requete.params.Visibiliter,
                Requete.params.IdentifiantPhoto
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: Rows[0]});
            }).catch(Erreur => {
                return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
            });
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de retourner tous les commentaires d'une image :
exports.getPhotoCommentaires2 = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherCommentaires(?, ?, 0, ?)', [
            Requete.params.Minimum,
            Requete.params.Maximum,
            Requete.params.IdentifiantPhoto
        ]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet d'ajouter un commentaire sur une image :
exports.postPhotoCommentaires = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] >= 1){
                Connection.query('CALL AjouterCommentaire(?, ?, ?, ?)', [
                    Requete.body.Commentaire,
                    false,
                    RowsUtilisateur[0][0]['UTI_ID'],
                    Requete.params.IdentifiantPhoto
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: "Le commentaire a bien été créée."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas connecté, vous ne pouvez pas poster un commentaire."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet au membre du BDE de modifier la visibilité d'un commentaire :
exports.putPhotoCommentaires = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL AfficherCommentaire(?)', [
                    Requete.params.IdentifiantCommentaires
                ]).then(Rows => {
                    Connection.query('CALL VisibiliterCommentaire(?, ?)', [
                        Requete.body.Visibiliter,
                        Requete.params.IdentifiantCommentaires
                    ]).then(Rows => {
                        return Reponse.status(200).json({Status: 200, Message: "Le commentaire a bien été modifié."});
                    }).catch(Erreur => {
                        return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                    });
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à modifier le commentaire."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet au membre du BDE de supprimer les commentaires des autres utilisateur :
exports.deletePhotoCommentaires = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL SupprimerCommentaire(?)', [
                    Requete.params.IdentifiantCommentaires
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: "Le commentaire a bien été supprimé."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à modifier le commentaire."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};