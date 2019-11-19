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

// Ce contrôleur permet de retourner toutes les images visibles ou non si l'utilisateur connecté est membre du BDE :
exports.getIndex = (Requete, Reponse) => {
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
            Connection.query('CALL AfficherPhotoAlbum(?, ?, ?, ?)', [
                Requete.params.Minimum,
                Requete.params.Maximum,
                Requete.params.IdentifiantManifestation,
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
// Ce contrôleur permet de retourner toutes les images d'une activité :
exports.getIndex2 = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherPhotoAlbum(?, ?, ?, ?)', [
            Requete.params.Minimum,
            Requete.params.Maximum,
            Requete.params.IdentifiantManifestation,
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
// Ce contrôleur permet de retourner toutes les images d'une activité :
exports.getPhoto = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            Connection.query('CALL AfficherPhoto(?)', [
                Requete.params.IdentifiantPhoto
            ]).then(Rows => {
                return Reponse.status(200).json({Status: 200, Message: Rows[0][0]});
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
// Ce contrôleur permet de retourner toutes les images d'une activité :
exports.getPhoto2 = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherPhoto(?)', [
            Requete.params.IdentifinatPhoto
        ]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0][0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de poster une image liée à une activité :
exports.postPhoto = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] >= 1){
                Connection.query('CALL AjouterPhotoDansAlbumManifestation(?, ?, ?)', [
                    Requete.params.IdentifiantManifestation,
                    Requete.body.ImageURL,
                    RowsUtilisateur[0][0]['UTI_ID']
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: "Vous avez ajouté une photo."});
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
// Ce contrôleur permet au membre du BDE de modifier la visibilité d'une image :
exports.putPhoto = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL VisibiliterPhoto(?, ?)', [
                    Requete.body.Visiblite,
                    Requete.params.IdentifiantPhoto
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: "Vous avez modifié une photo."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à modifer une image."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de supprimer une image :
exports.deletePhoto = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            Connection.query('CALL AfficherPhoto(?)', [
                Requete.params.IdentifiantPhoto
            ]).then(RowsImage => {
                if(RowsUtilisateur[0][0]['STA_ID'] >= 1){
                    if((RowsUtilisateur[0][0]['UTI_ID'] == RowsImage[0][0]['UTI_ID'])||(RowsUtilisateur[0][0]['STA_ID'] == 2)){
                        Connection.query('CALL SupprimerPhoto(?)', [
                            Requete.params.IdentifiantPhoto
                        ]).then(Rows => {
                            return Reponse.status(200).json({Status: 200, Message: "L'image a bien été supprimée."});
                        }).catch(Erreur => {
                            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                        });
                    }else{
                        return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à supprimer cette image."});
                    }
                }else{
                    return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas connecté."});
                }
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