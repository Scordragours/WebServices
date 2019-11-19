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

// Ce contrôleur permet de retourner un token si les identifiants envoyés sont correctes :
exports.Enregistrer = (Requete, Reponse, Next) => {
   Pool.then(Connection => {
        let AdresseMail = Requete.body.AdresseMail;
        let MotDePasse = Requete.body.MotDePasse;
        Connection.query('CALL RechercherUtilisateur(?, ?)', [
            AdresseMail,
            MotDePasse
        ]).then(Rows => {
            if(Rows[0][0]['STA_ID'] != null){
                let Token = JsonWebToken.sign({
                    AdressMail: AdresseMail,
                    MotDePasse: MotDePasse,
                    Status: Rows[0][0]['STA_ID']
                }, 'secret', {
                    expiresIn: 86400
                });
                return Reponse.status(200).json({Authentification: true, Message: Rows[0][0], Token: Token});
            }else{
                return Reponse.status(500).json({Authentification: false, Message: 'Mauvais utilisateur ou mot de passe.'});
            }
        }).catch(Erreur => {
            return Reponse.status(500).json({Authentification: false, Message: 'Mauvais utilisateur ou mot de passe.'});
        });
    }).catch(Erreur => {
       return Reponse.status(500).json({Authentification: false, Message: 'Problème de connection.'});
    });
};

// Ce contrôleur permet de voir si le token envoyer est correcte et existant :
exports.Login = (Requete, Reponse, Next) => {
    let Token = Requete.headers.token;
    if(!Token){
        return Reponse.status(403).json({Authentification: false, Message: "Le token n'a pas été trouvé."});
    }
    JsonWebToken.verify(Token, 'secret', (Erreur, Decoded) => {
        if(Erreur){
            return Reponse.status(500).json({Authentification: false, Message: "Une erreur a été trouvé."});
        }
        Requete.params.AdressMail = Decoded.AdressMail;
        Requete.params.MotDePasse = Decoded.MotDePasse;
        Requete.params.Status = Decoded.Status;
        Next();
    });
};