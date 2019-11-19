// Chargement des frameworks :
let MariaDB = require('mariadb');
let JsonWebToken = require('jsonwebtoken');
let Mailer = require('nodemailer');

// Connexion à la base de données :
let Pool = MariaDB.createConnection({
    host: '192.168.216.11',
    user: 'Structure',
    password: 'Structure',
    database: 'BD_GESCOM',
    connectionLimit: '100'
});

// Ce contrôleur permet aux membres du BDE de voir les activités signalées par le personnel du CESI :
exports.getManifestation = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL AfficherNotificationManifestation(?)', [
                    Requete.params.IdentifiantLocalisation
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: Rows[0]});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à voir les manifestations signalées."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux personnelles du CESI de signaler une activité :
exports.postManifestation = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 3){
                Connection.query('CALL SignalerManifestation(?)', [
                    Requete.params.IdentifiantManifestation
                ]).then(Rows => {
                    EnvoyerMail('une activité');
                    return Reponse.status(200).json({Status: 200, Message: "La manifestation a été signalé."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à signalé une manifestations."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux membres du BDE de voir les images signalées par le personnel du CESI :
exports.getManifestationPhoto = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL AfficherNotificationPhoto(?)', [
                    Requete.params.IdentifiantLocalisation
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: Rows[0]});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à voir les photo signalées."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux personnelles du CESI de signaler une image :
exports.postManifestationPhoto = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 3){
                Connection.query('CALL SignalerPhoto(?)', [
                    Requete.params.IdentifiantPhoto
                ]).then(Rows => {
                    EnvoyerMail('une image');
                    return Reponse.status(200).json({Status: 200, Message: "La photo a été signalé."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à signalé une photo."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux membres du BDE de voir les commentaires signalées par le personnel du CESI :
exports.getManifestationPhotoCommentaires = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 2){
                Connection.query('CALL AfficherNotificationCommentaire(?)', [
                    Requete.params.IdentifiantLocalisation
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: Rows[0]});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à voir les commentaires signalées."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet aux personnelles du CESI de signaler un commentaire :
exports.postManifestationPhotoCommentaires = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] == 3){
                Connection.query('CALL SignalerMessage(?)', [
                    Requete.params.IdentifiantCommentaire
                ]).then(Rows => {
                    EnvoyerMail('un commentaire');
                    return Reponse.status(200).json({Status: 200, Message: "Le commentaire a été signalé."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à signalé un commentaire."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};

// Fonction permettant d'envoyer des mails :
function EnvoyerMail(Commentaire){
    Pool.then(Connection => {
        Connection.query('SELECT T_UTILISATEUR.UTI_MAIL FROM T_UTILISATEUR WHERE T_UTILISATEUR.STA_ID = 2', []).then(RowsUtilisateur => {
            for(let i in RowsUtilisateur){
                var SMTPTransport = Mailer.createTransport("SMTP", {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // use SSL
                    auth: {
                        user: "adress2.essaye@gmail.com",
                        pass: "tutur2408"
                    }
                });
                console.log(RowsUtilisateur[0][0]['UTI_MAIL']);
                var Mail = {
                    from: "adress2.essaye@gmail.com",
                    to: RowsUtilisateur[0][0]['UTI_MAIL'],
                    subject: "Signaler"+ Commentaire +" :",
                    html: "Nous vous signalons que "+ Commentaire +" a été signalé."
                }
                SMTPTransport.sendMailt(Mail, (Erreur, Reponse) => {
                   if(Erreur){
                       return Reponse.status(500).json({Status: 500, Message: "Le mail n'a pas été envoyé."});
                   }else{
                       return Reponse.status(500).json({Status: 500, Message: "Le mail a été envoyé."});
                   }
                    SMTPTransport.close();
                });
            }
        });
    });
}