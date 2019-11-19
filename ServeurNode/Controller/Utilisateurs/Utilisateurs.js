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

// Ce contrôleur permet de retourner sous le format Json tous les utilisateurs sur un campus :
exports.getUtilisateurs = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(RowsUtilisateur[0][0]['STA_ID'] >= 1){
                Connection.query('CALL AfficherTousUtilisateurs(?)', [
                    Requete.params.IdentifiantLocalisation
                ]).then(Rows => {
                    return Reponse.status(200).json({Status: 200, Message: Rows[0]});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Vous n'êtes pas habilité à voir tous les utilisateurs."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de créer un utilisateur :
exports.postUtilisateur = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('SELECT * FROM T_UTILISATEUR WHERE UTI_MAIL = ?', [
            Requete.body.Mail
        ]).then(RowsMail => {
            if(!RowsMail.length){
                Connection.query('CALL CreerCompte(?, ?, ?, ?, ?)', [
                    Requete.body.Nom,
                    Requete.body.Prenom,
                    Requete.body.Mail,
                    Requete.body.MotDePasse,
                    Requete.body.Localisation
                ]).then(RowsCompte => {
                    return Reponse.status(200).json({Status: 200, Message: "Inscription réussie."});
                }).catch(Erreur => {
                    return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
                });
            }else{
                return Reponse.status(500).json({Status: 500, Message: "Cette adresse e-mail est déjà liée à un compte."});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};
// Ce contrôleur permet de supprimer un utilisateur :
exports.deleteUtilisateur = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            Requete.params.AdressMail,
            Requete.params.MotDePasse
        ]).then(RowsUtilisateur => {
            if(!RowsUtilisateur.length){
                return Reponse.status(500).json({Status: 500, Message: "Erreur d'identification du compte."});
            }else{
                Connection.query('CALL SupprimerUtilisateur(?)', [
                    RowsUtilisateur[0][0]['UTI_ID']
                ]).then(RowsDelete => {
                    return Reponse.status(200).json({Status: 200, Message: "Le compte à bien été supprimé."});
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