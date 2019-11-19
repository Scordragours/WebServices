// Chargement des frameworks :
let Express = require('express');
let Body = require('body-parser')

let App = Express();
let Port = 8080;

// Chargement des contrôleurs liées aux produits :
let Produits = require('./Controller/Produits/Produits.js');
let ProduitsStoke = require('./Controller/Produits/Stockes.js');
let ProduitsCategorie = require('./Controller/Produits/Categories.js');
let ProduitsImages = require('./Controller/Produits/Images.js');
let ProduitsVentes = require('./Controller/Produits/Ventes.js');

// Chargement des contrôleurs liées aux commandes :
let Commandes = require('./Controller/Commandes/Commandes.js');
let CommandesUtilisateur = require('./Controller/Commandes/CommandesUtilisateur.js');

// Chargement des contrôleurs liées aux activités :
let Signaler = require('./Controller/Activites/Signaler.js');
let Activites = require('./Controller/Activites/Activites.js');
let ActivitesPhoto = require('./Controller/Activites/Photo.js');
let ActivitesPhotoCommentaires = require('./Controller/Activites/Commentaires.js');
let ActivitesPhotoLike = require('./Controller/Activites/Like.js');
let ActivitesInscription = require('./Controller/Activites/Inscription.js');

// Chargement des contrôleurs liées aux paniers :
let Paniers = require('./Controller/Paniers/Paniers.js');

// Chargement des contrôleurs liées aux utilisateurs :
let Utilisateurs = require('./Controller/Utilisateurs/Utilisateurs.js');

// Chargement des contrôleurs liées aux tokens :
let Middleware = require('./Middleware/Auth.js');

// On configure l'application pour que nous puissions accéder aux variables des formulaire :
App.use(Body.urlencoded({extended: true}));
// On configure l'application pour que nous puissions y accéder au serveur en ajax depuis l'extérieur :
App.use(function(Requete, Reponse, Next) {
    Reponse.header("Access-Control-Allow-Origin", "*");
    Reponse.header("Access-Control-Allow-Headers", "token, Origin, X-Requested-With, Content-Type, Accept");
    Reponse.header("Access-Control-Allow-Methods", "PUT, DELETE, GET, POST");
    //Reponse.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    Next();
});

// On crée la route qui va servir à se connecter à l'api pour les routes sécurisées.
let RouterToken = Express.Router();
RouterToken.get('/Token/', Middleware.Enregistrer);
App.use(RouterToken);

/*
Les routes liées aux produits :
/Produits
    - Ventes
    - Stocke
    - Categorie
    - Images
*/
// On crée la route qui donne les meilleurs ventes :
let RouterProduitsVentes = Express.Router();
RouterProduitsVentes.get('/Produits/Ventes/:IdentifiantLocalisation', ProduitsVentes.getIndex);
App.use(RouterProduitsVentes);

// On crée les routes qui modifient, crées, donnent les stockes :
let RouterProduitsStocke = Express.Router();
RouterProduitsStocke.get('/Produits/Stocke/:IdentifiantLocalisation/:IdentifiantProduit', ProduitsStoke.getProduitStocke);
RouterProduitsStocke.post('/Produits/Stocke/:IdentifiantLocalisation/:IdentifiantProduit', ProduitsStoke.postProduitStocke);
RouterProduitsStocke.put('/Produits/Stocke/:IdentifiantLocalisation/:IdentifiantProduit', ProduitsStoke.putProduitStocke);
App.use(RouterProduitsStocke);

// On crée les routes qui vont créer, modifier, ajouter et enlever une catégorie à un produit :
let RouterProduitsCategorie = Express.Router();
RouterProduitsStocke.get('/Produits/Categorie/', ProduitsCategorie.getProduitCategorie);
RouterProduitsStocke.post('/Produits/Categorie/:IdentifiantCathegorie/:IdentifiantProduit', Middleware.Login, ProduitsCategorie.postProduitCategorie);
RouterProduitsStocke.post('/Produits/Categorie/', Middleware.Login, ProduitsCategorie.postProduitCreeCategorie);
RouterProduitsStocke.delete('/Produits/Categorie/:IdentifiantCathegorie/:IdentifiantProduit', Middleware.Login, ProduitsCategorie.deleteProduitCategorie);
RouterProduitsStocke.delete('/Produits/Categorie/:IdentifiantCathegorie', Middleware.Login, ProduitsCategorie.deleteProduitCreeCategorie);
App.use(RouterProduitsCategorie);

// On crée les routes qui vont récupérer, ajouter et supprimer une image d'un produit :
let RouterProduitsImages = Express.Router();
RouterProduitsStocke.get('/Produits/Images/:IdentifiantProduit', ProduitsImages.getProduitImages);
RouterProduitsStocke.post('/Produits/Images/:IdentifiantProduit', Middleware.Login, ProduitsImages.postProduitImages);
RouterProduitsStocke.delete('/Produits/Images/:IdentifiantPhoto', Middleware.Login, ProduitsImages.deleteProduitImages);
App.use(RouterProduitsImages);

// On crée les routes qui vont récupérer, ajouter, modifier et supprimer un produit :
let RouterProduits = Express.Router();
RouterProduits.get('/Produits/:IdentifiantLocalisation', Produits.getIndex);
RouterProduits.get('/Produits/:IdentifiantLocalisation/:id', Produits.getProduit);
RouterProduits.post('/Produits/', Middleware.Login, Produits.postProduit);
RouterProduits.put('/Produits/:id', Middleware.Login, Produits.putProduit);
RouterProduits.delete('/Produits/:id', Middleware.Login, Produits.deleteProduit);
App.use(RouterProduits);

/*
Les routes liées aux commandes :
/Commandes
    - Utilisateur
*/
// On crée les routes qui vont récupérer, ajouter et modifier les commandes :
let RouterCommandes = Express.Router();
RouterCommandes.get('/Commandes/:IdentifiantLocalisation', Middleware.Login, Commandes.getIndex);
RouterCommandes.post('/Commandes/', Middleware.Login, Commandes.postCommande);
RouterCommandes.put('/Commandes/:IdentifiantCommande', Middleware.Login, Commandes.putCommande);
App.use(RouterCommandes);

// On crée les routes qui vont récupérer, ajouter et modifier une commande d'un utilisateur :
let RouterCommandesUtilisateur = Express.Router();
RouterCommandesUtilisateur.get('/Commandes/Utilisateur/:Minimum/:Maximum', Middleware.Login, CommandesUtilisateur.getCommandes);
RouterCommandesUtilisateur.get('/Commandes/Utilisateur/:IdentifiantCommande', Middleware.Login, CommandesUtilisateur.getCommande);
App.use(RouterCommandesUtilisateur);

/*
Les routes liées aux activités :
/Activites
    - Photo
        - Commentaires
            - Signaler
        - Like
        - Signaler
    - Inscription
    - Signaler
*/
// On crée les routes réserver au personnel du CESI pour signaler les images, commentaires et activités :
let RouterActivitesSignaler = Express.Router();
RouterActivitesSignaler.get('/Activites/Signaler/:IdentifiantLocalisation', Middleware.Login, Signaler.getManifestation);
RouterActivitesSignaler.post('/Activites/Signaler/:IdentifiantManifestation', Middleware.Login, Signaler.postManifestation);
RouterActivitesSignaler.get('/Activites/Photo/Signaler/:IdentifiantLocalisation', Middleware.Login, Signaler.getManifestationPhoto);
RouterActivitesSignaler.post('/Activites/Photo/Signaler/:IdentifiantPhoto', Middleware.Login, Signaler.postManifestationPhoto);
RouterActivitesSignaler.get('/Activites/Photo/Commentaires/Signaler/:IdentifiantLocalisation', Middleware.Login, Signaler.getManifestationPhotoCommentaires);
RouterActivitesSignaler.post('/Activites/Photo/Commentaires/Signaler/:IdentifiantCommentaire', Middleware.Login, Signaler.postManifestationPhotoCommentaires);
App.use(RouterActivitesSignaler);

// On crée les routes pour ajouter, modifier et modifier les images :
let RouterActivitesPhoto = Express.Router();
RouterActivitesPhoto.get('/Activites/Photo/Tous/:IdentifiantManifestation/:Minimum/:Maximum/', ActivitesPhoto.getIndex2);
RouterActivitesPhoto.get('/Activites/Photo/:IdentifiantManifestation/:Minimum/:Maximum/:Visibiliter', Middleware.Login, ActivitesPhoto.getIndex);
RouterActivitesPhoto.get('/Activites/Photo/Tous/:IdentifinatPhoto', ActivitesPhoto.getPhoto2);
RouterActivitesPhoto.get('/Activites/Photo/:IdentifinatPhoto', Middleware.Login, ActivitesPhoto.getPhoto);
RouterActivitesPhoto.post('/Activites/Photo/:IdentifiantManifestation', Middleware.Login, ActivitesPhoto.postPhoto);
RouterActivitesPhoto.put('/Activites/Photo/:IdentifiantPhoto', Middleware.Login, ActivitesPhoto.putPhoto);
RouterActivitesPhoto.delete('/Activites/Photo/:IdentifiantPhoto', Middleware.Login, ActivitesPhoto.deletePhoto);
App.use(RouterActivitesPhoto);

// On crée les routes pour ajouter, modifier et modifier les commentaires liés aux images :
let RouterActivitesPhotoCommentaires = Express.Router();
RouterActivitesPhotoCommentaires.get('/Activites/Photo/Commentaires/Tous/:Minimum/:Maximum/:IdentifiantPhoto', ActivitesPhotoCommentaires.getPhotoCommentaires2);
RouterActivitesPhotoCommentaires.get('/Activites/Photo/Commentaires/:Minimum/:Maximum/:IdentifiantPhoto/:Visibiliter', Middleware.Login, ActivitesPhotoCommentaires.getPhotoCommentaires);
RouterActivitesPhotoCommentaires.post('/Activites/Photo/Commentaires/:IdentifiantPhoto', Middleware.Login, ActivitesPhotoCommentaires.postPhotoCommentaires);
RouterActivitesPhotoCommentaires.put('/Activites/Photo/Commentaires/:IdentifiantCommentaires', Middleware.Login, ActivitesPhotoCommentaires.putPhotoCommentaires);
RouterActivitesPhotoCommentaires.delete('/Activites/Photo/Commentaires/:IdentifiantCommentaires', Middleware.Login, ActivitesPhotoCommentaires.deletePhotoCommentaires);
App.use(RouterActivitesPhotoCommentaires);

// On crée les routes pour ajouter ou supprimer un like sur une images :
let RouterActivitesPhotoLike = Express.Router();
RouterActivitesPhotoLike.post('/Activites/Photo/Like/:IdentifiantPhoto', Middleware.Login, ActivitesPhotoLike.postPhotoLike);
RouterActivitesPhotoLike.delete('/Activites/Photo/Like/:IdentifiantPhoto', Middleware.Login, ActivitesPhotoLike.deletePhotoLike);
App.use(RouterActivitesPhotoLike);

// On crée les routes pour ajouter, supprimer ou regarder les inscrits sur une activité :
let RouterActivitesIncription = Express.Router();
RouterActivitesIncription.get('/Activites/Inscription/', Middleware.Login, ActivitesInscription.getManifestationInscriptions);
RouterActivitesIncription.get('/Activites/Inscription/:IdentifiantManifestation', Middleware.Login, ActivitesInscription.getIndex);
RouterActivitesIncription.post('/Activites/Inscription/:IdentifiantManifestation', Middleware.Login, ActivitesInscription.postManifestationInscriptions);
RouterActivitesIncription.delete('/Activites/Inscription/:IdentifiantManifestation', Middleware.Login, ActivitesInscription.deleteManifestationInscriptions);
App.use(RouterActivitesIncription);

// On crée les routes pour ajouter, supprimer, modifier ou voir une activité :
let RouterActivites = Express.Router();
RouterActivites.get('/Activites/Tous/:Minimum/:Maximum', Activites.getIndex2);
RouterActivites.get('/Activites/:Minimum/:Maximum/:Visibiliter', Middleware.Login, Activites.getIndex);
RouterActivites.get('/Activites/:IdentifiantManifestation', Activites.getManifestation);
RouterActivites.post('/Activites/', Middleware.Login, Activites.postManifestation);
RouterActivites.put('/Activites/:IdentifiantManifestation', Middleware.Login, Activites.putManifestation);
RouterActivites.delete('/Activites/:IdentifiantManifestation', Middleware.Login, Activites.deleteManifestation);
App.use(RouterActivites);

// On crée les routes pour ajouter, voir ou supprimer un utilisateur :
let RouterUtilisateurs = Express.Router();
RouterUtilisateurs.get('/Utilisateurs/:IdentifiantLocalisation', Middleware.Login, Utilisateurs.getUtilisateurs);
RouterUtilisateurs.post('/Utilisateurs/', Utilisateurs.postUtilisateur);
RouterUtilisateurs.delete('/Utilisateurs/', Middleware.Login, Utilisateurs.deleteUtilisateur);
App.use(RouterUtilisateurs);

// On crée les routes pour ajouter, voir, modifier ou supprimer un panier d'un utilisateur :
let RouterPanier = Express.Router();
RouterPanier.get('/Panier/', Middleware.Login, Paniers.getPanier);
RouterPanier.post('/Panier/', Middleware.Login, Paniers.postPanier);
RouterPanier.delete('/Panier/:IdentifiantProduit', Middleware.Login, Paniers.deletePanier);
RouterPanier.put('/Panier/:IdentifiantProduit', Middleware.Login, Paniers.putPanier);
App.use(RouterPanier);

// On démarre le serveur pour qu'il puisse écouter toutes les adresses IP avec le port 8080 :
App.listen(Port, "0.0.0.0", () => {
    console.log("Ouverture du serveur sur le port : "+ Port);
});