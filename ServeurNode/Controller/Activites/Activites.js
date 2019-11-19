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

// Ce contrôleur permet de retourner toutes les activités d'un campus :
exports.getIndex = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] >= 1){
                Requete.params.Visibiliter = Requete.params.Visibiliter;
            }else{
                Requete.params.Visibiliter = false;
            }
            Connection.query('CALL AfficherManifestation(?, ?, ?, 4)', [
                Requete.params.Minimum,
                Requete.params.Maximum,
                Requete.params.Visibiliter
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
// Ce contrôleur permet de retourner toutes les activités visibles ou non si l'utilisateur connecté est membre du BDE :
exports.getIndex2 = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherManifestation(?, ?, ?, 4)', [
            Requete.params.Minimum,
            Requete.params.Maximum,
            false
        ]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de retourner les détails d'une activité :
exports.getManifestation = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherManifestationDetaille(?)', [
            Requete.params.IdentifiantManifestation
        ]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0][0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet d'ajouter une activité :
exports.postManifestation = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL AjouterManifestation(?, ?, ?, ?, ?, ?, ?, ?)', [
                    Requete.body.Titre,
                    Requete.body.Description,
                    Requete.body.Date,
                    Requete.body.Recurrente,
                    Requete.body.Prix,
                    Requete.body.InVisible,
                    Requete.body.ImageURL,
                    RowsUtilisateur[0][0]['LOC_ID']
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: "La manifestation a bien été créée."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à créer la manifestation."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de modifier une activité :
exports.putManifestation = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL ModifierManifestation(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                    Requete.body.Titre,
                    Requete.body.Description,
                    Requete.body.Date,
                    Requete.body.Recurrente,
                    Requete.body.Prix,
                    Requete.body.InVisible,
                    Requete.body.ImageURL,
                    RowsUtilisateur[0][0]['LOC_ID'],
                    Requete.params.IdentifiantManifestation
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: "La manifestation a bien été modifié."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à modifier la manifestation."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de supprimer une activité :
exports.deleteManifestation = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL SupprimerManifestation(?)', [
                    Requete.params.IdentifiantManifestation
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: "La manifestation a bien été supprimée."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à supprimer la manifestation."});
            }

        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};