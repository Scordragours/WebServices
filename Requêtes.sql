/*
===========================
== RechercherUtilisateur ==
===========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS RechercherUtilisateur //
CREATE DEFINER='Structure'@'%' PROCEDURE RechercherUtilisateur(
	IN AdresseMail	VARCHAR(30),
	IN Password 	VARCHAR(100)
)
BEGIN

	PREPARE RechercherUtilisateur FROM 'SELECT T_STATUS.STA_ID, T_UTILISATEUR.UTI_PRENOM, T_UTILISATEUR.UTI_NOM, T_UTILISATEUR.LOC_ID, T_UTILISATEUR.UTI_MAIL, T_UTILISATEUR.UTI_ID FROM T_UTILISATEUR INNER JOIN T_STATUS ON T_UTILISATEUR.STA_ID = T_STATUS.STA_ID WHERE T_UTILISATEUR.UTI_MAIL = ? AND T_UTILISATEUR.UTI_MDP = ?';
	EXECUTE RechercherUtilisateur USING AdresseMail, Password;

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AfficherManifestation`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherManifestation` (IN m_low INT(11), IN m_high INT(11), IN m_take_invisible BOOLEAN, IN m_loc_id INT(11))
BEGIN
	PREPARE Request FROM
	'SELECT T_MANIFESTATION.*, TI.IMA_URL, COUNT(TLIU.IMA_ID) AS NBLIKE FROM `T_MANIFESTATION`
    LEFT JOIN T_IMAGE TI ON T_MANIFESTATION.IMA_ID = TI.IMA_ID
    LEFT JOIN TJ_LIKER_IMA_UTI TLIU ON TI.IMA_ID = TLIU.IMA_ID
    WHERE LOC_ID = ? AND MAN_INVISIBLE <= ? AND MAN_NOTIFIE <= ? GROUP BY T_MANIFESTATION.MAN_ID LIMIT ?,? ';
	EXECUTE Request USING m_loc_id, m_take_invisible, m_take_invisible, m_low, m_high;
END$$

/*
===================================
== AfficherManifestationDetaille ==
===================================
*/
DROP PROCEDURE IF EXISTS AfficherManifestationDetaille;
DELIMITER // #OK
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherManifestationDetaille(
    IN IdentifinatManifestation INT(11)
)
BEGIN
	PREPARE AfficherManifestationDetaille FROM
	'SELECT TL.LOC_NOM, T_MANIFESTATION.*, T_IMAGE.IMA_URL, COUNT(TJ_LIKER_IMA_UTI.IMA_ID) AS NBLIKE FROM `T_MANIFESTATION`
    LEFT JOIN T_IMAGE ON T_MANIFESTATION.IMA_ID = T_IMAGE.IMA_ID
    LEFT JOIN TJ_LIKER_IMA_UTI ON T_IMAGE.IMA_ID = TJ_LIKER_IMA_UTI.IMA_ID
    INNER JOIN T_LOCALISATION TL on T_MANIFESTATION.LOC_ID = TL.LOC_ID
    WHERE T_MANIFESTATION.MAN_ID = ?';
	EXECUTE AfficherManifestationDetaille USING IdentifinatManifestation;
END //
DELIMITER ;
/*
==========================
== AjouterManifestation ==
==========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AjouterManifestation //
CREATE DEFINER='Structure'@'%' PROCEDURE AjouterManifestation(
	IN Titre					VARCHAR(50),
	IN Description 				TEXT,
	IN Date 					DATETIME,
	IN Recurrente 				BOOLEAN,
	IN Prix 					FLOAT,
	IN InVisible 				BOOLEAN,
	IN ImageURL 				TEXT,
	IN IdentifiantLocalisation 	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE AjouterImage FROM 'INSERT INTO T_IMAGE(IMA_URL, IMA_DATE, IMA_INVISIBLE, IMA_NOTIFIE, UTI_ID) VALUES(?, NOW(), FALSE, FALSE, NULL)';
	EXECUTE AjouterImage USING ImageURL;
	COMMIT;

	START TRANSACTION;
	SET @Identifiants := 0;
	PREPARE SelectionnerIdentifiantImage FROM 'SELECT (@Identifiants := T_IMAGE.IMA_ID) FROM T_IMAGE WHERE T_IMAGE.IMA_URL = ?';
	EXECUTE SelectionnerIdentifiantImage USING ImageURL;

	PREPARE AjouterManifestation FROM 'INSERT INTO T_MANIFESTATION(MAN_TITRE, MAN_DESCRIPTION, MAN_DATE, MAN_RECURRENTE, MAN_PRIX, MAN_INVISIBLE, LOC_ID, IMA_ID) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
	EXECUTE AjouterManifestation USING Titre, Description, Date, Recurrente, Prix, InVisible, IdentifiantLocalisation, @Identifiants;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
===========================
== ModifierManifestation ==
===========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS ModifierManifestation //
CREATE DEFINER='Structure'@'%' PROCEDURE ModifierManifestation(
	IN Titre					VARCHAR(50),
	IN Description				TEXT,
	IN Date						DATETIME,
	IN Recurrente				BOOLEAN,
	IN Prix						FLOAT,
	IN Invisible				BOOLEAN,
	IN ImageURL					TEXT,
	IN IdentifiantLocalisation 	INT(11),
	IN IdentifiantManifestation	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	SET @IdentifiantImage := 0;
	PREPARE ModifierPhoto FROM 'SELECT (@IdentifiantImage := T_MANIFESTATION.IMA_ID) FROM T_MANIFESTATION WHERE T_MANIFESTATION.MAN_ID = ?';
	EXECUTE ModifierPhoto USING IdentifiantManifestation;


	START TRANSACTION;
	PREPARE ModifierPhoto FROM 'UPDATE T_IMAGE SET T_IMAGE.IMA_URL = ? WHERE T_IMAGE.IMA_ID = ?';
	EXECUTE ModifierPhoto USING ImageURL, @IdentifiantImage;
	COMMIT;

	START TRANSACTION;
	PREPARE ModifierManifestation FROM 'UPDATE T_MANIFESTATION SET T_MANIFESTATION.MAN_TITRE = ?, T_MANIFESTATION.MAN_DESCRIPTION = ?, T_MANIFESTATION.MAN_DATE = ?, T_MANIFESTATION.MAN_RECURRENTE = ?, T_MANIFESTATION.MAN_PRIX = ?, T_MANIFESTATION.MAN_INVISIBLE = ?, T_MANIFESTATION.LOC_ID = ? WHERE T_MANIFESTATION.MAN_ID = ?';
	EXECUTE ModifierManifestation USING Titre, Description, Date, Recurrente, Prix, Invisible, IdentifiantLocalisation, IdentifiantManifestation;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
============================
== SupprimerManifestation ==
============================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SupprimerManifestation //
CREATE DEFINER='Structure'@'%' PROCEDURE SupprimerManifestation(
	IN IdentifiantManifestation INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE SupprimerInscriptionManifestation FROM 'DELETE FROM TJ_INSCRIRE_UTI_MAN WHERE TJ_INSCRIRE_UTI_MAN.MAN_ID = ?';
	EXECUTE SupprimerInscriptionManifestation USING IdentifiantManifestation;
	COMMIT;

	START TRANSACTION;
	PREPARE SupprimerCommentaireManifestation FROM 'DELETE FROM T_COMMENTAIRE WHERE T_COMMENTAIRE.IMA_ID IN (SELECT T_IMAGE.IMA_ID FROM TJ_RASSEMBLER_IMA_MAN INNER JOIN T_IMAGE ON TJ_RASSEMBLER_IMA_MAN.IMA_ID = T_IMAGE.IMA_ID WHERE TJ_RASSEMBLER_IMA_MAN.MAN_ID = ?)';
	EXECUTE SupprimerCommentaireManifestation USING IdentifiantManifestation;
	COMMIT;

	START TRANSACTION;
	PREPARE SupprimerLikeManifestation FROM 'DELETE FROM TJ_LIKER_IMA_UTI WHERE TJ_LIKER_IMA_UTI.IMA_ID IN (SELECT T_IMAGE.IMA_ID FROM TJ_RASSEMBLER_IMA_MAN INNER JOIN T_IMAGE ON TJ_RASSEMBLER_IMA_MAN.IMA_ID = T_IMAGE.IMA_ID WHERE TJ_RASSEMBLER_IMA_MAN.MAN_ID = ?)';
	EXECUTE SupprimerLikeManifestation USING IdentifiantManifestation;
	COMMIT;

	START TRANSACTION;
	PREPARE SupprimerImageManifestation FROM 'DELETE FROM T_IMAGE WHERE T_IMAGE.IMA_ID IN (SELECT TJ_RASSEMBLER_IMA_MAN.IMA_ID FROM TJ_RASSEMBLER_IMA_MAN WHERE TJ_RASSEMBLER_IMA_MAN.MAN_ID = ?)';
	EXECUTE SupprimerImageManifestation USING IdentifiantManifestation;
	COMMIT;

	START TRANSACTION;
	PREPARE SupprimerImagePresentationManifestation FROM 'DELETE FROM T_IMAGE WHERE T_IMAGE.IMA_ID IN (SELECT T_MANIFESTATION.IMA_ID FROM T_MANIFESTATION WHERE T_MANIFESTATION.MAN_ID = ?)';
	EXECUTE SupprimerImagePresentationManifestation USING IdentifiantManifestation;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AjouterCommentaire`;
DELIMITER $$ #OK
CREATE PROCEDURE `AjouterCommentaire` (IN m_contenu TEXT, IN m_invisible BOOLEAN, IN m_uti_id INT(11), IN m_ima_id INT(11))
BEGIN
	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'INSERT INTO `T_COMMENTAIRE` (COMME_CONTENU, COMME_DATE, COMME_INVISIBLE, UTI_ID, IMA_ID) VALUES (?, NOW(), ?, ?, ?)';
	EXECUTE Request USING m_contenu, m_invisible, m_uti_id, m_ima_id;
	COMMIT;
	SET AUTOCOMMIT = 1;
END$$

/*
======================
== VisibiliterPhoto ==
======================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS VisibiliterPhoto //
CREATE DEFINER='Structure'@'%' PROCEDURE VisibiliterPhoto(
	IN InVisibiliter	BOOLEAN,
	IN IdentifiantPhoto INT(11)
)
BEGIN
	SET autocommit = FALSE;
	START TRANSACTION;

	PREPARE VisibiliterPhoto FROM 'UPDATE T_IMAGE SET T_IMAGE.IMA_INVISIBLE = ? WHERE T_IMAGE.IMA_ID = ?';
	EXECUTE VisibiliterPhoto USING InVisibiliter, IdentifiantPhoto;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
============================
== VisibiliterCommentaire ==
============================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS VisibiliterCommentaire //
CREATE DEFINER='Structure'@'%' PROCEDURE VisibiliterCommentaire(
	IN InVisibiliter			BOOLEAN,
	IN IdentifiantCommentaire	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE VisibiliterCommentaire FROM 'UPDATE T_COMMENTAIRE SET T_COMMENTAIRE.COMME_INVISIBLE = ? WHERE T_COMMENTAIRE.COMME_ID = ?';
	EXECUTE VisibiliterCommentaire USING InVisibiliter, IdentifiantCommentaire;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
==========================
== SupprimerCommentaire ==
==========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SupprimerCommentaire //
CREATE DEFINER='Structure'@'%' PROCEDURE SupprimerCommentaire(
	IN IdentifiantCommentaire	INT(11)
)
BEGIN
	SET autocommit = FALSE;
	START TRANSACTION;

	PREPARE SupprimerCommentaire FROM 'DELETE FROM T_COMMENTAIRE WHERE T_COMMENTAIRE.COMME_ID = ?';
	EXECUTE SupprimerCommentaire USING IdentifiantCommentaire;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
================================
== AfficherUtilisateurInscrit ==
================================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AfficherUtilisateurInscrit //
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherUtilisateurInscrit(
	IN IdentifiantManifestation INT(11)
)
BEGIN
	PREPARE AfficherUtilisateurInscrit FROM 'SELECT T_UTILISATEUR.UTI_NOM AS "Noms", T_UTILISATEUR.UTI_PRENOM AS "Prenoms", T_UTILISATEUR.UTI_MAIL AS "Adresse mail", T_STATUS.STA_NOM AS "Status" FROM T_UTILISATEUR INNER JOIN T_STATUS ON T_UTILISATEUR.STA_ID = T_STATUS.STA_ID INNER JOIN TJ_INSCRIRE_UTI_MAN ON T_UTILISATEUR.UTI_ID = TJ_INSCRIRE_UTI_MAN.UTI_ID WHERE TJ_INSCRIRE_UTI_MAN.MAN_ID = ? ORDER BY T_STATUS.STA_NOM ASC, T_UTILISATEUR.UTI_NOM ASC';
	EXECUTE AfficherUtilisateurInscrit USING IdentifiantManifestation;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AfficherInscriptionManifestation`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherInscriptionManifestation` (IN m_uti_id INT(11))
BEGIN
	PREPARE Request FROM
	'SELECT tm.MAN_TITRE AS titre, tm.MAN_DATE AS date FROM TJ_INSCRIRE_UTI_MAN
    INNER JOIN T_MANIFESTATION tm on TJ_INSCRIRE_UTI_MAN.MAN_ID = tm.MAN_ID
    WHERE TJ_INSCRIRE_UTI_MAN.UTI_ID = ?';
	EXECUTE Request USING m_uti_id;
END$$

DROP PROCEDURE IF EXISTS `InscriptionManifestation`;
DELIMITER $$ #OK
CREATE PROCEDURE `InscriptionManifestation` (IN m_id_uti INT(11), IN m_id_man INT(11))
BEGIN
	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'INSERT INTO TJ_INSCRIRE_UTI_MAN (MAN_ID, UTI_ID)  VALUES (?, ?)';
	EXECUTE Request USING m_id_man, m_id_uti;
	COMMIT;
	SET AUTOCOMMIT = 1;
END$$

/*
================================
== DeinscriptionManifestation ==
================================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS DeinscriptionManifestation //
CREATE DEFINER='Structure'@'%' PROCEDURE DeinscriptionManifestation(
	IN IdentifiantManifestation	INT(11),
	IN IdentifiantUtilisateur   INT(11)
)
BEGIN
	SET autocommit = FALSE;
	START TRANSACTION;

	PREPARE SupprimerCommentaire FROM 'DELETE FROM TJ_INSCRIRE_UTI_MAN WHERE TJ_INSCRIRE_UTI_MAN.MAN_ID = ? AND TJ_INSCRIRE_UTI_MAN.UTI_ID = ?';
	EXECUTE SupprimerCommentaire USING IdentifiantManifestation, IdentifiantUtilisateur;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AjouterLike`;
DELIMITER $$ #OK
CREATE PROCEDURE `AjouterLike` (IN m_ima_id INT(11), IN m_uti_id INT(11))
BEGIN
	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'INSERT INTO `TJ_LIKER_IMA_UTI` (IMA_ID, UTI_ID) VALUES (?, ?)';
	EXECUTE Request USING m_ima_id, m_uti_id;
	COMMIT;
	SET AUTOCOMMIT = 1;
END$$

DROP PROCEDURE IF EXISTS `SupprimerLike`;
DELIMITER $$ #OK
CREATE PROCEDURE `SupprimerLike` (IN m_ima_id INT(11), IN m_uti_id INT(11))
BEGIN
	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'DELETE FROM `TJ_LIKER_IMA_UTI` WHERE IMA_ID = ? AND UTI_ID = ?';
	EXECUTE Request USING m_ima_id, m_uti_id;
	COMMIT;
	SET AUTOCOMMIT = 1;
END$$

DROP PROCEDURE IF EXISTS `AfficherPhotoAlbum`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherPhotoAlbum` (IN m_id_low INT(11), IN m_id_high INT(11), IN m_man_id INT(11), IN m_take_invisible BOOLEAN)
BEGIN
	PREPARE Request FROM
	'SELECT TU.UTI_NOM, TU.UTI_PRENOM, T_IMAGE.*, COUNT(TLIU.IMA_ID) AS NBLIKE FROM `T_IMAGE`
    INNER JOIN TJ_RASSEMBLER_IMA_MAN TRIM ON T_IMAGE.IMA_ID = TRIM.IMA_ID
    LEFT JOIN TJ_LIKER_IMA_UTI TLIU ON T_IMAGE.IMA_ID = TLIU.IMA_ID
    INNER JOIN T_UTILISATEUR TU on T_IMAGE.UTI_ID = TU.UTI_ID
    WHERE TRIM.MAN_ID = ? AND IMA_INVISIBLE <= ? AND IMA_NOTIFIE <= ? GROUP BY T_IMAGE.IMA_ID LIMIT ?,?';
	EXECUTE Request USING m_man_id, m_take_invisible, m_take_invisible, m_id_low, m_id_high;
END$$

/*
===================
== AfficherPhoto ==
===================
*/
DROP PROCEDURE IF EXISTS AfficherPhoto;
DELIMITER // #OK
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherPhoto(
    IN IdentifinatPhoto INT(11)
)
BEGIN
	PREPARE AfficherPhoto FROM 'SELECT T_IMAGE.*, COUNT(TJ_LIKER_IMA_UTI.IMA_ID) AS NBLIKE FROM T_IMAGE INNER JOIN TJ_LIKER_IMA_UTI ON T_IMAGE.IMA_ID = TJ_LIKER_IMA_UTI.IMA_ID WHERE T_IMAGE.IMA_ID = ?';
	EXECUTE AfficherPhoto USING IdentifinatPhoto;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AjouterPhotoDansAlbumManifestation`;
DELIMITER $$ #OK
CREATE PROCEDURE `AjouterPhotoDansAlbumManifestation` (IN m_id_uti INT(11), IN m_url VARCHAR(100), IN m_id_man INT(11))
BEGIN
	DECLARE add_time DATETIME;

	SET add_time = NOW();

	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'INSERT INTO `T_IMAGE` (IMA_URL, IMA_DATE, UTI_ID) VALUES (?, ?, ?)';
	EXECUTE Request USING m_url, add_time, m_id_uti;
	COMMIT;
	START TRANSACTION;
	SET @ima_id = (SELECT IMA_ID FROM `T_IMAGE` WHERE IMA_URL=m_url AND IMA_DATE=add_time AND UTI_ID=m_id_uti ORDER BY IMA_ID DESC LIMIT 1);
	PREPARE Request2 FROM
	'INSERT INTO `TJ_RASSEMBLER_IMA_MAN` (IMA_ID, MAN_ID) VALUES (?, ?)';
	EXECUTE Request2 USING @ima_id, m_id_man;
	COMMIT;
	SET AUTOCOMMIT = 1;
END$$

/*
====================
== SupprimerPhoto ==
====================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SupprimerPhoto //
CREATE DEFINER='Structure'@'%' PROCEDURE SupprimerPhoto(
	IN IdentifiantPhoto	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE SupprimerLikesPhoto FROM 'DELETE FROM TJ_LIKER_IMA_UTI WHERE TJ_LIKER_IMA_UTI.IMA_ID = ?';
	EXECUTE SupprimerLikesPhoto USING IdentifiantPhoto;
	COMMIT;

	START TRANSACTION;
	PREPARE SupprimerRassemblerPhoto FROM 'DELETE FROM TJ_RASSEMBLER_IMA_MAN WHERE TJ_RASSEMBLER_IMA_MAN.IMA_ID = ?';
	EXECUTE SupprimerRassemblerPhoto USING IdentifiantPhoto;
	COMMIT;

	START TRANSACTION;
	PREPARE SupprimerCommentairePhoto FROM 'DELETE FROM T_COMMENTAIRE WHERE T_COMMENTAIRE.IMA_ID = ?';
	EXECUTE SupprimerCommentairePhoto USING IdentifiantPhoto;
	COMMIT;

	START TRANSACTION;
	PREPARE SupprimerPhoto FROM 'DELETE FROM T_IMAGE WHERE T_IMAGE.IMA_ID = ?';
	EXECUTE SupprimerPhoto USING IdentifiantPhoto;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
=======================================
== AfficherNotificationManifestation ==
=======================================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AfficherNotificationManifestation //
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherNotificationManifestation(
    IN IdentifiantLocalisation  INT(11)
)
BEGIN

	PREPARE AfficherNotificationManifestation FROM 'SELECT  T_MANIFESTATION.*, T_LOCALISATION.LOC_NOM AS "Localiser", T_IMAGE.IMA_URL AS "Image" FROM T_MANIFESTATION INNER JOIN T_LOCALISATION ON T_MANIFESTATION.LOC_ID = T_LOCALISATION.LOC_ID INNER JOIN T_IMAGE ON T_MANIFESTATION.IMA_ID = T_IMAGE.IMA_ID WHERE T_MANIFESTATION.MAN_NOTIFIE = TRUE AND T_MANIFESTATION.LOC_ID = ? ORDER BY T_MANIFESTATION.MAN_DATE ASC';
	EXECUTE AfficherNotificationManifestation USING IdentifiantLocalisation;

END //
DELIMITER ;

/*
===========================
== SignalerManifestation ==
===========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SignalerManifestation //
CREATE DEFINER='Structure'@'%' PROCEDURE SignalerManifestation(
	IN IdentifiantManifestation	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE SignalerManifestation FROM 'UPDATE T_MANIFESTATION SET T_MANIFESTATION.MAN_NOTIFIE = TRUE WHERE T_MANIFESTATION.MAN_ID = ?';
	EXECUTE SignalerManifestation USING IdentifiantManifestation;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
===============================
== AfficherNotificationPhoto ==
===============================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AfficherNotificationPhoto //
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherNotificationPhoto(
    IN IdentifiantLocalisation INT(11)
)
BEGIN

	PREPARE AfficherNotificationPhoto FROM 'SELECT T_IMAGE.*, T_UTILISATEUR.UTI_MAIL FROM T_IMAGE INNER JOIN T_UTILISATEUR ON T_IMAGE.UTI_ID = T_UTILISATEUR.UTI_ID WHERE T_IMAGE.IMA_NOTIFIE = TRUE AND T_UTILISATEUR.LOC_ID = ?';
	EXECUTE AfficherNotificationPhoto USING IdentifiantLocalisation;

END //
DELIMITER ;

/*
===================
== SignalerPhoto ==
===================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SignalerPhoto //
CREATE DEFINER='Structure'@'%' PROCEDURE SignalerPhoto(
	IN IdentifiantPhoto	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE SignalerPhoto FROM 'UPDATE T_IMAGE SET T_IMAGE.IMA_NOTIFIE = TRUE WHERE T_IMAGE.IMA_ID = ?';
	EXECUTE SignalerPhoto USING IdentifiantPhoto;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
=====================
== SignalerMessage ==
=====================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SignalerMessage //
CREATE DEFINER='Structure'@'%' PROCEDURE SignalerMessage(
	IN IdentifiantMessage	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE SignalerMessage FROM 'UPDATE T_COMMENTAIRE SET T_COMMENTAIRE.COMME_NOTIFIE = TRUE WHERE T_COMMENTAIRE.COMME_ID = ?';
	EXECUTE SignalerMessage USING IdentifiantMessage;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
=====================================
== AfficherNotificationCommentaire ==
=====================================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AfficherNotificationCommentaire //
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherNotificationCommentaire(
    IN IdentifiantLocalisation INT(11)
)
BEGIN

	PREPARE AfficherNotificationCommentaire FROM 'SELECT T_COMMENTAIRE.*, T_UTILISATEUR.UTI_MAIL FROM T_COMMENTAIRE INNER JOIN T_UTILISATEUR ON T_COMMENTAIRE.UTI_ID = T_UTILISATEUR.UTI_ID WHERE T_COMMENTAIRE.COMME_NOTIFIE = TRUE AND T_UTILISATEUR.LOC_ID = ?';
	EXECUTE AfficherNotificationCommentaire USING IdentifiantLocalisation;

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AfficherProduit`;
DELIMITER $$ #A TESTER
CREATE PROCEDURE `AfficherProduit` (IN m_loc_id INT(11), IN m_pro_id INT(11))
BEGIN
    PREPARE Request FROM
    'WITH RECURSIVE CTE(START_ID, CHILD, PARENT, NOM) AS (
        SELECT T.CAT_ID, T.CAT_ID AS CHILD, T.CAT_ID_T_CATEGORIE, T.CAT_NOM AS PARENT
        FROM T_CATEGORIE T
        UNION ALL
        SELECT START_ID, T.CAT_ID AS CHILD, T.CAT_ID_T_CATEGORIE, CONCAT(CTE.NOM, \';\' , T.CAT_NOM) AS PARENT
        FROM T_CATEGORIE T
        INNER JOIN CTE ON CTE.PARENT = T.CAT_ID
    )SELECT T_PRODUIT.*, TLPL.LOC_PRO_LOC_STOCK, GROUP_CONCAT(CTE.NOM SEPARATOR \';\') AS CATEGORIES FROM T_PRODUIT
    INNER JOIN TJ_APPARTENIR_PRO_CAT TAPC ON T_PRODUIT.PRO_ID = TAPC.PRO_ID
    INNER JOIN TJ_LOCALISER_PRO_LOC TLPL ON T_PRODUIT.PRO_ID = TLPL.PRO_ID
    INNER JOIN CTE ON CTE.START_ID = TAPC.CAT_ID
    WHERE CTE.PARENT IS NULL AND TLPL.LOC_ID = ? AND T_PRODUIT.PRO_ID = ?
    GROUP BY T_PRODUIT.PRO_ID';
    EXECUTE Request USING m_loc_id, m_pro_id;
END$$

DROP PROCEDURE IF EXISTS `AfficherCommandes`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherCommandes` (IN m_id_low INT(11), IN m_id_high INT(11), IN m_uti_id INT(11), IN m_loc_id INT(11))
BEGIN
	PREPARE Request FROM
	'SELECT T_COMMANDE.COMMA_ID, T_COMMANDE.COMMA_DATE, TLPL.LOC_PRO_LOC_STOCK AS STOCK, TE.*, SUM(TRPC.RAS_PRO_COMMA_NOMBRE*TP.PRO_PRIX) AS TOTAL_PRIX FROM T_COMMANDE
    INNER JOIN T_ETATCOMMANDE TE ON T_COMMANDE.ETA_ID = TE.ETA_ID
    INNER JOIN TJ_RASSEMBLER_PRO_COMMA TRPC ON T_COMMANDE.COMMA_ID = TRPC.COMMA_ID
    INNER JOIN T_PRODUIT TP ON TRPC.PRO_ID = TP.PRO_ID
    INNER JOIN TJ_LOCALISER_PRO_LOC TLPL ON TP.PRO_ID = TLPL.PRO_ID
    WHERE T_COMMANDE.UTI_ID = ? AND TLPL.LOC_ID = ?
    GROUP BY T_COMMANDE.COMMA_ID LIMIT ?,?';
	EXECUTE Request USING m_uti_id, m_loc_id, m_id_low, m_id_high;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `AfficherDetailCommande`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherDetailCommande` (IN m_uti_id INT(11), IN m_comma_id INT(11), IN m_loc_id INT(11))
BEGIN
	PREPARE Request FROM
	'SELECT T_COMMANDE.COMMA_ID, T_COMMANDE.COMMA_DATE, TLPL.LOC_PRO_LOC_STOCK AS STOCK, TP.*, TP.PRO_PRIX*TRPC.RAS_PRO_COMMA_NOMBRE AS SOUS_TOTAL FROM T_COMMANDE
    INNER JOIN TJ_RASSEMBLER_PRO_COMMA TRPC ON T_COMMANDE.COMMA_ID = TRPC.COMMA_ID
    INNER JOIN T_PRODUIT TP ON TRPC.PRO_ID = TP.PRO_ID
    INNER JOIN TJ_LOCALISER_PRO_LOC TLPL ON TP.PRO_ID = TLPL.PRO_ID
    WHERE T_COMMANDE.UTI_ID = ? AND T_COMMANDE.COMMA_ID = ? AND TLPL.LOC_ID = ?';
	EXECUTE Request USING m_uti_id, m_comma_id, m_loc_id;
END$$
DELIMITER ;

/*
============================
== AfficherCommandePasser ==
============================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AfficherCommandePasser //
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherCommandePasser(
    IN IdentifiantLocalisation INT(11)
)
BEGIN

	PREPARE AfficherCommandePasser FROM 'SELECT T_UTILISATEUR.UTI_MAIL AS "Adress Mail", GROUP_CONCAT(CONCAT(T_PRODUIT.PRO_NOM, ";", TJ_RASSEMBLER_PRO_COMMA.RAS_PRO_COMMA_NOMBRE, ";", T_PRODUIT.PRO_PRIX, ";", T_PRODUIT.PRO_PRIX * TJ_RASSEMBLER_PRO_COMMA.RAS_PRO_COMMA_NOMBRE) SEPARATOR "\n") AS "Description", SUM(T_PRODUIT.PRO_PRIX * TJ_RASSEMBLER_PRO_COMMA.RAS_PRO_COMMA_NOMBRE) FROM T_COMMANDE INNER JOIN T_UTILISATEUR ON T_COMMANDE.UTI_ID = T_UTILISATEUR.UTI_ID INNER JOIN TJ_RASSEMBLER_PRO_COMMA ON T_COMMANDE.COMMA_ID = TJ_RASSEMBLER_PRO_COMMA.COMMA_ID INNER JOIN T_PRODUIT ON TJ_RASSEMBLER_PRO_COMMA.PRO_ID = T_PRODUIT.PRO_ID INNER JOIN TJ_LOCALISER_PRO_LOC ON T_PRODUIT.PRO_ID = TJ_LOCALISER_PRO_LOC.PRO_ID WHERE TJ_LOCALISER_PRO_LOC.LOC_ID = ? AND T_UTILISATEUR.LOC_ID = ? GROUP BY T_UTILISATEUR.UTI_MAIL';
	EXECUTE AfficherCommandePasser USING IdentifiantLocalisation, IdentifiantLocalisation;

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AfficherPanier`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherPanier` (IN m_uti_id INT(11))
BEGIN
	PREPARE Request FROM
	'SELECT T_PRODUIT.*, TLPL.LOC_PRO_LOC_STOCK AS STOCK, TRUP.RAS_UTI_PRO_NOMBRE AS STOCKUTI, TRUP.RAS_UTI_PRO_NOMBRE*T_PRODUIT.PRO_PRIX AS SOUS_TOTAL FROM T_PRODUIT
    INNER JOIN TJ_RASSEMBLER_UTI_PRO TRUP ON T_PRODUIT.PRO_ID = TRUP.PRO_ID
    INNER JOIN TJ_LOCALISER_PRO_LOC TLPL ON T_PRODUIT.PRO_ID = TLPL.PRO_ID
    INNER JOIN T_UTILISATEUR ON T_UTILISATEUR.LOC_ID = TLPL.LOC_ID AND T_UTILISATEUR.UTI_ID = TRUP.UTI_ID
    WHERE TRUP.UTI_ID = ?';
	EXECUTE Request USING m_uti_id;
END$$

DROP PROCEDURE IF EXISTS `AfficherProduit`;
DELIMITER $$ #A TESTER
CREATE PROCEDURE `AfficherProduit` (IN m_loc_id INT(11), IN m_pro_id INT(11))
BEGIN
    PREPARE Request FROM
    'WITH RECURSIVE CTE(START_ID, CHILD, PARENT, NOM) AS (
        SELECT T.CAT_ID, T.CAT_ID AS CHILD, T.CAT_ID_T_CATEGORIE, T.CAT_NOM AS PARENT
        FROM T_CATEGORIE T
        UNION ALL
        SELECT START_ID, T.CAT_ID AS CHILD, T.CAT_ID_T_CATEGORIE, CONCAT(CTE.NOM, \';\' , T.CAT_NOM) AS PARENT
        FROM T_CATEGORIE T
        INNER JOIN CTE ON CTE.PARENT = T.CAT_ID
    )SELECT T_PRODUIT.*, TLPL.LOC_PRO_LOC_STOCK, GROUP_CONCAT(CTE.NOM SEPARATOR \';\') AS CATEGORIES FROM T_PRODUIT
    INNER JOIN TJ_APPARTENIR_PRO_CAT TAPC ON T_PRODUIT.PRO_ID = TAPC.PRO_ID
    INNER JOIN TJ_LOCALISER_PRO_LOC TLPL ON T_PRODUIT.PRO_ID = TLPL.PRO_ID
    INNER JOIN CTE ON CTE.START_ID = TAPC.CAT_ID
    WHERE CTE.PARENT IS NULL AND TLPL.LOC_ID = ? AND T_PRODUIT.PRO_ID = ?
    GROUP BY T_PRODUIT.PRO_ID';
    EXECUTE Request USING m_loc_id, m_pro_id;
END$$

DROP PROCEDURE IF EXISTS `ConfirmerPanier`;
DELIMITER $$ #OK
CREATE PROCEDURE `ConfirmerPanier` (IN m_uti_id INT(11), IN m_loc_id INT(11))
BEGIN
    DECLARE add_time DATETIME;
    SET add_time = NOW();
	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'INSERT INTO T_COMMANDE (COMMA_DATE, UTI_ID) VALUES (?, ?)';
	EXECUTE Request USING add_time, m_uti_id;
	COMMIT;
	START TRANSACTION;
	SET @id_co = (SELECT COMMA_ID FROM T_COMMANDE WHERE UTI_ID = M_UTI_ID AND COMMA_DATE = ADD_TIME ORDER BY COMMA_ID DESC LIMIT 1);
	PREPARE Request4 FROM
	'UPDATE TJ_LOCALISER_PRO_LOC
	INNER JOIN TJ_RASSEMBLER_UTI_PRO TRUP ON TRUP.PRO_ID = TJ_LOCALISER_PRO_LOC.PRO_ID
	SET LOC_PRO_LOC_STOCK = LOC_PRO_LOC_STOCK-TRUP.RAS_UTI_PRO_NOMBRE
	WHERE TRUP.UTI_ID = ? AND TJ_LOCALISER_PRO_LOC.LOC_ID = ?';
	EXECUTE Request4 USING m_uti_id, m_loc_id;
	PREPARE Request2 FROM
	'INSERT INTO TJ_RASSEMBLER_PRO_COMMA (PRO_ID, COMMA_ID, RAS_PRO_COMMA_NOMBRE)
    SELECT S1.PRO_ID, ?, S1.RAS_UTI_PRO_NOMBRE
    FROM TJ_RASSEMBLER_UTI_PRO S1 WHERE S1.UTI_ID = ?';
	EXECUTE Request2 USING @id_co, m_uti_id;
	COMMIT;
    START TRANSACTION;
    PREPARE Request3 FROM
    'DELETE FROM TJ_RASSEMBLER_UTI_PRO WHERE UTI_ID = ?';
    EXECUTE Request3 USING m_uti_id;
    COMMIT;
	SET AUTOCOMMIT = 1;
END$$

/*
===========================
== ChangerStatusCommande ==
===========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS ChangerStatusCommande //
CREATE DEFINER='Structure'@'%' PROCEDURE ChangerStatusCommande(
	IN IdentifiantStatusCommande	INT(11),
	IN IdentifiantCommande			INT(11)
)
BEGIN
	SET autocommit = FALSE;
	START TRANSACTION;

	PREPARE ChangerStatusCommande FROM 'UPDATE T_COMMANDE SET ETA_ID = ? WHERE COMMA_ID = ?';
	EXECUTE ChangerStatusCommande USING IdentifiantStatusCommande, IdentifiantCommande;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AjouterAuPanier`;
DELIMITER $$ #OK
CREATE PROCEDURE `AjouterAuPanier` (IN m_uti_id INT(11), IN m_pro_id INT(11), IN m_nombre_pro INT(11))
BEGIN
	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'INSERT INTO TJ_RASSEMBLER_UTI_PRO (PRO_ID, UTI_ID, RAS_UTI_PRO_NOMBRE) VALUES (?,?,?)';
	EXECUTE Request USING m_pro_id, m_uti_id, m_nombre_pro;
	COMMIT;
	SET AUTOCOMMIT = 1;
END$$

DROP PROCEDURE IF EXISTS `ModifierNombreProduitPanier`;
DELIMITER $$ #OK
CREATE PROCEDURE `ModifierNombreProduitPanier` (IN m_uti_id INT(11), IN m_pro_id INT(11), IN m_nombre INT(11))
BEGIN
	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'UPDATE TJ_RASSEMBLER_UTI_PRO SET RAS_UTI_PRO_NOMBRE = ? WHERE UTI_ID = ? AND PRO_ID = ?';
	EXECUTE Request USING m_nombre, m_uti_id, m_pro_id;
	COMMIT;
	SET AUTOCOMMIT = 1;
END$$

DROP PROCEDURE IF EXISTS `RetirerDuPanier`;
DELIMITER $$ #OK
CREATE PROCEDURE `RetirerDuPanier` (IN m_uti_id INT(11), IN m_pro_id INT(11))
BEGIN
	SET AUTOCOMMIT = 0;
	START TRANSACTION;
	PREPARE Request FROM
	'DELETE FROM TJ_RASSEMBLER_UTI_PRO WHERE UTI_ID = ? AND PRO_ID = ?';
	EXECUTE Request USING m_uti_id, m_pro_id;
	COMMIT;
	SET AUTOCOMMIT = 1;
END$$

/*
===========================
== SelectionnerCategorie ==
===========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SelectionnerCategorie //
CREATE DEFINER='Structure'@'%' PROCEDURE SelectionnerCategorie()
BEGIN

	PREPARE SelectionnerCategorie FROM 'SELECT T_CATEGORIE.CAT_ID, T_CATEGORIE.CAT_NOM, T_CATEGORIE.CAT_ID_T_CATEGORIE FROM T_CATEGORIE';
	EXECUTE SelectionnerCategorie;

END //
DELIMITER ;

/*
=============================
== AjouterCategorieProduit ==
=============================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AjouterCategorieProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE AjouterCategorieProduit(
	IN IdentifiantCategorie	INT(11),
	IN IdentifiantProduit	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE AjouterCategorieProduit FROM 'INSERT INTO TJ_APPARTENIR_PRO_CAT(CAT_ID, PRO_ID) VALUES (?, ?)';
	EXECUTE AjouterCategorieProduit USING IdentifiantCategorie, IdentifiantProduit;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
===================
== CreeCategorie ==
===================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS CreeCategorie //
CREATE DEFINER='Structure'@'%' PROCEDURE CreeCategorie(
	IN Nom						VARCHAR(255),
	IN IdentifiantSousCategorie	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE CreeCategorie FROM 'INSERT INTO T_CATEGORIE(CAT_NOM, CAT_ID_T_CATEGORIE) VALUES (?, ?)';
	EXECUTE CreeCategorie USING Nom, IdentifiantSousCategorie;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
=============================
== EnleverCategorieProduit ==
=============================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS EnleverCategorieProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE EnleverCategorieProduit(
	IN IdentifiantCategorie	INT(11),
	IN IdentifiantProduit 	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE EnleverCategorieProduit FROM 'DELETE FROM TJ_APPARTENIR_PRO_CAT WHERE CAT_ID = ? AND PRO_ID = ?';
	EXECUTE EnleverCategorieProduit USING IdentifiantCategorie, IdentifiantProduit;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
========================
== SupprimerCategorie ==
========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SupprimerCategorie //
CREATE DEFINER='Structure'@'%' PROCEDURE SupprimerCategorie(
	IN IdentifiantCategorie	INT(11)
)
BEGIN
	SET autocommit = FALSE;
	START TRANSACTION;

	PREPARE SupprimerProduitCategorie FROM 'DELETE FROM TJ_APPARTENIR_PRO_CAT WHERE TJ_APPARTENIR_PRO_CAT.CAT_ID = ?';
	EXECUTE SupprimerProduitCategorie USING IdentifiantCategorie;
	COMMIT;

	PREPARE SupprimerCategorie FROM 'DELETE FROM T_CATEGORIE WHERE T_CATEGORIE.CAT_ID = ?';
	EXECUTE SupprimerCategorie USING IdentifiantCategorie;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
==========================
== AfficherPhotoProduit ==
==========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AfficherPhotoProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherPhotoProduit(
    IN IdentifiantProduits  INT(11)
)
BEGIN

	PREPARE AfficherPhotoProduit FROM 'SELECT T_IMAGEPRODUIT.IMAPRO_ID, T_IMAGEPRODUIT.IMAPRO_URL FROM T_IMAGEPRODUIT INNER JOIN TJ_DECRIRE_PRO_IMAPRO ON T_IMAGEPRODUIT.IMAPRO_ID = TJ_DECRIRE_PRO_IMAPRO.IMAPRO_ID WHERE TJ_DECRIRE_PRO_IMAPRO.PRO_ID = ?';
	EXECUTE AfficherPhotoProduit USING IdentifiantProduits;

END //
DELIMITER ;

/*
=========================
== AjouterPhotoProduit ==
=========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AjouterPhotoProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE AjouterPhotoProduit(
	IN URLImage				TEXT,
	IN IdentifiantProduit	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE AjouterPhotoProduit FROM 'INSERT INTO T_IMAGEPRODUIT(IMAPRO_URL) VALUES (?)';
	EXECUTE AjouterPhotoProduit USING URLImage;
	COMMIT;

	START TRANSACTION;
	SET @Identifiants := 0;
	PREPARE SelectionnerIdentifiantImage FROM 'SELECT (@Identifiants := T_IMAGEPRODUIT.IMAPRO_ID) FROM T_IMAGEPRODUIT WHERE T_IMAGEPRODUIT.IMAPRO_URL = ?';
	EXECUTE SelectionnerIdentifiantImage USING URLImage;

	PREPARE AjouterPhotoProduit FROM 'INSERT INTO TJ_DECRIRE_PRO_IMAPRO(IMAPRO_ID, PRO_ID) VALUES (?, ?)';
	EXECUTE AjouterPhotoProduit USING @Identifiants, IdentifiantProduit;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
============================
== SupprimmerPhotoProduit ==
============================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SupprimmerPhotoProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE SupprimmerPhotoProduit(
	IN IdentifiantImage INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE SupprimmerPhotoProduitProduit FROM 'DELETE FROM TJ_DECRIRE_PRO_IMAPRO WHERE IMAPRO_ID = ?';
	EXECUTE SupprimmerPhotoProduitProduit USING IdentifiantImage;
	COMMIT;

	START TRANSACTION;
	PREPARE SupprimmerPhotoProduit FROM 'DELETE FROM T_IMAGEPRODUIT WHERE IMAPRO_ID = ?';
	EXECUTE SupprimmerPhotoProduit USING IdentifiantImage;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS `AfficherProduits`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherProduits` (IN m_loc_id VARCHAR(255))
BEGIN
	PREPARE Request FROM
	'WITH RECURSIVE CTE(START_ID, CHILD, PARENT, NOM) AS (
		SELECT T.CAT_ID, T.CAT_ID AS CHILD, T.CAT_ID_T_CATEGORIE, T.CAT_NOM AS PARENT
		FROM T_CATEGORIE T
		UNION ALL
		SELECT START_ID, T.CAT_ID AS CHILD, T.CAT_ID_T_CATEGORIE, CONCAT(CTE.NOM, \';\' , T.CAT_NOM) AS PARENT
		FROM T_CATEGORIE T
		INNER JOIN CTE ON CTE.PARENT = T.CAT_ID
	)SELECT T_PRODUIT.*, TLPL.LOC_PRO_LOC_STOCK, GROUP_CONCAT(CTE.NOM SEPARATOR \';\') AS CATEGORIES FROM T_PRODUIT
	INNER JOIN TJ_APPARTENIR_PRO_CAT TAPC ON T_PRODUIT.PRO_ID = TAPC.PRO_ID
	INNER JOIN TJ_LOCALISER_PRO_LOC TLPL ON T_PRODUIT.PRO_ID = TLPL.PRO_ID
	INNER JOIN CTE ON CTE.START_ID = TAPC.CAT_ID
	WHERE CTE.PARENT IS NULL AND TLPL.LOC_ID = ?
	GROUP BY T_PRODUIT.PRO_ID';
	EXECUTE Request USING m_loc_id;
END$$
DELIMITER ;

/*
====================
== AjouterProduit ==
====================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AjouterProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE AjouterProduit(
	IN Nom			VARCHAR(50),
	IN Description	TEXT,
	IN Prix			FLOAT,
	IN InVisible	BOOLEAN
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE AjouterProduit FROM 'INSERT INTO T_PRODUIT(PRO_NOM, PRO_DESCRIPTION, PRO_PRIX, PRO_INVISIBLE) VALUES (?, ?, ?, ?)';
	EXECUTE AjouterProduit USING Nom, Description, Prix, InVisible;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
====================================
== SelectionnerIdentifiantProduit ==
====================================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SelectionnerIdentifiantProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE SelectionnerIdentifiantProduit(
	IN Nom			VARCHAR(50),
	IN Description	TEXT,
	IN Prix			FLOAT
)
BEGIN

	PREPARE SelectionnerIdentifiantProduit FROM 'SELECT T_PRODUIT.PRO_ID FROM T_PRODUIT WHERE T_PRODUIT.PRO_NOM = ? AND T_PRODUIT.PRO_DESCRIPTION = ? AND T_PRODUIT.PRO_PRIX = ?';
	EXECUTE SelectionnerIdentifiantProduit USING Nom, Description, Prix;

END //
DELIMITER ;

/*
================================
== AjouterLocalisationProduit ==
================================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AjouterLocalisationProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE AjouterLocalisationProduit(
	IN IdentifiantProduit	    INT(11),
	IN IdentifiantLocalisation  INT(11),
	IN Stocke                   INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE AjouterLocalisationProduit FROM 'INSERT INTO TJ_LOCALISER_PRO_LOC(PRO_ID, LOC_ID, LOC_PRO_LOC_STOCK) VALUES (?, ?, ?)';
	EXECUTE AjouterLocalisationProduit USING IdentifiantProduit, IdentifiantLocalisation, Stocke;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
=====================
== ModifierProduit ==
=====================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS ModifierProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE ModifierProduit(
	IN Nom					VARCHAR(50),
	IN Description			TEXT,
	IN Prix					FLOAT,
	IN InVisible			BOOLEAN,
	IN IdentifiantProduit 	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE ModifierProduit FROM 'UPDATE T_PRODUIT SET T_PRODUIT.PRO_NOM = ?, T_PRODUIT.PRO_DESCRIPTION = ?, T_PRODUIT.PRO_PRIX = ?, T_PRODUIT.PRO_INVISIBLE = ? WHERE T_PRODUIT.PRO_ID = ?';
	EXECUTE ModifierProduit USING Nom, Description, Prix, InVisible, IdentifiantProduit;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
======================
== SupprimerProduit ==
======================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SupprimerProduit //
CREATE DEFINER='Structure'@'%' PROCEDURE SupprimerProduit(
	IN IdentifiantProduit	INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE SupprimerProduit FROM 'UPDATE T_PRODUIT SET T_PRODUIT.PRO_INVISIBLE = TRUE WHERE T_PRODUIT.PRO_ID = ?';
	EXECUTE SupprimerProduit USING IdentifiantProduit;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
========================
== SelectionnerStocke ==
========================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS SelectionnerStocke //
CREATE DEFINER='Structure'@'%' PROCEDURE SelectionnerStocke(
	IN IdentifiantProduit 		INT(11),
	IN IdentifiantLocalisation 	INT(11)
)
BEGIN

	PREPARE SelectionnerStocke FROM 'SELECT T_PRODUIT.PRO_NOM, TJ_LOCALISER_PRO_LOC.LOC_PRO_LOC_STOCK FROM T_PRODUIT INNER JOIN TJ_LOCALISER_PRO_LOC ON T_PRODUIT.PRO_ID = TJ_LOCALISER_PRO_LOC.PRO_ID WHERE TJ_LOCALISER_PRO_LOC.LOC_ID = ? AND TJ_LOCALISER_PRO_LOC.PRO_ID = ?';
	EXECUTE SelectionnerStocke USING IdentifiantLocalisation, IdentifiantProduit;

END //
DELIMITER ;

/*
===================
== ChangerStocke ==
===================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS ChangerStocke //
CREATE DEFINER='Structure'@'%' PROCEDURE ChangerStocke(
	IN IdentifiantLocalisation 	INT(11),
	IN IdentifiantProduits		INT(11),
	IN Stocke                   INT(11)
)
BEGIN
	SET autocommit = FALSE;

	START TRANSACTION;
	PREPARE ChangerStocke FROM 'UPDATE TJ_LOCALISER_PRO_LOC SET TJ_LOCALISER_PRO_LOC.LOC_PRO_LOC_STOCK = ? WHERE TJ_LOCALISER_PRO_LOC.LOC_ID = ? AND TJ_LOCALISER_PRO_LOC.PRO_ID = ?';
	EXECUTE ChangerStocke USING Stocke, IdentifiantLocalisation, IdentifiantProduits;
	COMMIT;

	SET autocommit = TRUE;
END //
DELIMITER ;

/*
==============================
== AfficherTousUtilisateurs ==
==============================
*/
DELIMITER //
DROP PROCEDURE IF EXISTS AfficherTousUtilisateurs //
CREATE DEFINER='Structure'@'%' PROCEDURE AfficherTousUtilisateurs(
    IN IdentifiantLocalistation INT(11)
)
BEGIN

    PREPARE AfficherTousUtilisateurs FROM 'SELECT T_UTILISATEUR.LOC_ID, T_LOCALISATION.LOC_NOM, T_UTILISATEUR.UTI_NOM, T_UTILISATEUR.UTI_PRENOM, T_UTILISATEUR.UTI_MAIL, T_STATUS.STA_NOM
                                            FROM T_UTILISATEUR
                                            INNER JOIN T_STATUS ON T_STATUS.STA_ID = T_UTILISATEUR.STA_ID
                                            INNER JOIN T_LOCALISATION ON T_UTILISATEUR.LOC_ID = T_LOCALISATION.LOC_ID
                                            WHERE T_UTILISATEUR.LOC_ID = ?
                                            ORDER BY T_STATUS.STA_ID ASC, T_UTILISATEUR.UTI_NOM ASC';
	EXECUTE AfficherTousUtilisateurs USING IdentifiantLocalistation;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS `CreerCompte`;
DELIMITER $$ #OK
CREATE PROCEDURE `CreerCompte` (IN m_nom VARCHAR(30), IN m_prenom VARCHAR(30), IN m_mail VARCHAR(100), IN m_mdp VARCHAR(100), IN m_loc_id INT(11))
BEGIN
    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    PREPARE Request FROM
    'INSERT INTO `T_UTILISATEUR` (UTI_NOM, UTI_PRENOM, UTI_MAIL, UTI_MDP, LOC_ID) VALUES (?, ?, ?, ?, ?)';
    EXECUTE Request USING m_nom, m_prenom, m_mail, m_mdp, m_loc_id;
    COMMIT;
    SET AUTOCOMMIT = 1;
END$$

DROP PROCEDURE IF EXISTS `SupprimerUtilisateur`;
DELIMITER $$ #A TESTER
CREATE PROCEDURE `SupprimerUtilisateur` (IN m_uti_id INT(11))
BEGIN
    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    PREPARE Request FROM
    'DELETE FROM TJ_LIKER_IMA_UTI WHERE TJ_LIKER_IMA_UTI.IMA_ID IN (SELECT T_IMAGE.IMA_ID FROM T_IMAGE WHERE T_IMAGE.UTI_ID = ?)';
    PREPARE Request2 FROM
    'DELETE FROM T_COMMENTAIRE WHERE T_COMMENTAIRE.IMA_ID IN (SELECT T_IMAGE.IMA_ID FROM T_IMAGE WHERE T_IMAGE.UTI_ID = ?)';
    PREPARE Request3 FROM
    'DELETE FROM T_COMMENTAIRE WHERE T_COMMENTAIRE.UTI_ID = ?';
    PREPARE Request4 FROM
    'DELETE FROM TJ_INSCRIRE_UTI_MAN WHERE TJ_INSCRIRE_UTI_MAN.UTI_ID = ?';
    PREPARE Request5 FROM
    'DELETE FROM TJ_LIKER_IMA_UTI WHERE TJ_LIKER_IMA_UTI.UTI_ID = ?';
    PREPARE Request6 FROM
    'DELETE FROM TJ_RASSEMBLER_IMA_MAN WHERE TJ_RASSEMBLER_IMA_MAN.IMA_ID IN (SELECT T_IMAGE.IMA_ID FROM T_IMAGE WHERE T_IMAGE.UTI_ID = ?)';
    PREPARE Request7 FROM
    'DELETE FROM TJ_RASSEMBLER_UTI_PRO WHERE TJ_RASSEMBLER_UTI_PRO.UTI_ID = ?';
    PREPARE Request8 FROM
    'DELETE FROM T_IMAGE WHERE T_IMAGE.UTI_ID = ?';
    PREPARE Request9 FROM
    'DELETE FROM T_UTILISATEUR WHERE T_UTILISATEUR.UTI_ID = ?';
    EXECUTE Request USING m_uti_id;
    EXECUTE Request2 USING m_uti_id;
    EXECUTE Request3 USING m_uti_id;
    EXECUTE Request4 USING m_uti_id;
    EXECUTE Request5 USING m_uti_id;
    EXECUTE Request6 USING m_uti_id;
    EXECUTE Request7 USING m_uti_id;
    EXECUTE Request8 USING m_uti_id;
    EXECUTE Request9 USING m_uti_id;
    COMMIT;
    SET AUTOCOMMIT = 1;
END$$

DROP PROCEDURE IF EXISTS `AfficherMeilleuresVentes`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherMeilleuresVentes` (IN m_range INT(11), IN m_loc_id INT(11))
BEGIN
    PREPARE Request FROM
	'SELECT T_PRODUIT.PRO_ID, T_PRODUIT.PRO_NOM, SUM(TRPC.RAS_PRO_COMMA_NOMBRE) AS TOTAL_VENDU FROM T_PRODUIT
	INNER JOIN TJ_RASSEMBLER_PRO_COMMA TRPC ON T_PRODUIT.PRO_ID = TRPC.PRO_ID
    INNER JOIN TJ_LOCALISER_PRO_LOC TLPL ON T_PRODUIT.PRO_ID = TLPL.PRO_ID
    WHERE TLPL.LOC_ID = ?
    GROUP BY T_PRODUIT.PRO_ID ORDER BY TOTAL_VENDU DESC LIMIT ?';
    EXECUTE Request USING m_loc_id, m_range;
END$$

DROP PROCEDURE IF EXISTS `AfficherCommentaires`;
DELIMITER $$ #OK
CREATE PROCEDURE `AfficherCommentaires` (IN m_id_low INT(11), IN m_id_high INT(11), IN m_take_invisible BOOLEAN, IN m_ima_id INT(11))
BEGIN
	PREPARE Request FROM
	'SELECT TU.*, T_COMMENTAIRE.* FROM `T_COMMENTAIRE`
    INNER JOIN T_UTILISATEUR TU on T_COMMENTAIRE.UTI_ID = TU.UTI_ID
    WHERE IMA_ID = ? AND COMME_INVISIBLE <= ? AND COMME_NOTIFIE <= ? LIMIT ?,?';
	EXECUTE Request USING m_ima_id, m_take_invisible, m_take_invisible, m_id_low, m_id_high;
END$$