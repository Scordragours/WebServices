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

// Ce contrôleur permet de retourner les meilleurs ventes :
exports.getIndex = (Requete, Reponse) => {
    Pool.then(Connection => {
        Connection.query('CALL AfficherMeilleuresVentes(?, ?)', [
            3,
            Requete.params.IdentifiantLocalisation,
        ]).then(Rows => {
            return Reponse.status(200).json({Status: 200, Message: Rows[0]});
        }).catch(Erreur => {
            return Reponse.status(500).json({Status: 500, Message: "Erreur sur la base de données."});
        });
    }).catch(Erreur => {
        return Reponse.status(500).json({Status: 500, Message: "Impossible de se connecter à la base de données."});
    });
};