<html>
    <head>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="css/style.css"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" integrity="sha256-46qynGAkLSFpVbEBog43gvNhfrOj+BmwXdxFgVK/Kvc=" crossorigin="anonymous" />
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <title>Intégration CSS/HTML</title>
    </head>
    <body>
        <?php require_once('./include/nav.php'); ?>
            <h1 class="manif_titre">Modifier un événement :</h1>
            <form method="post">
                <div class="position_ajout_manifest">
                    <input type="text" id="nom_manifest" placeholder="Nom de l'événement"/>
                </div>
                <div class="position_ajout_manifest">
                    <textarea id="description_manifest" placeholder="Descpription de l'événement"></textarea>
                </div>
                <div class="position_ajout_manifest baneer_form">
                    <p>Modifier l'image pour cet événement</p>
                    <input type="file" accept="image/png, image/jpeg" name="img_produit"/>
                </div>
                <div class="position_ajout_manifest">
                    <input type="number" name="price"/>
                    <p>-€</p>
                </div>
                <div class="position_ajout_manifest">
                       <p>Événement reccurent : </p>
                        <input type="radio" name="reccurent" value="oui"/>
                        <p class="choice_recurent">Oui</p>
                       <input type="radio" name="reccurent" value="non"/>
                       <p class="choice_recurent">Non</p>

                </div>
                <div class="position_ajout_manifest">
                    <input type="submit" class="publish_form" value="Modifier"/>
                </div>
            </form>
            <?php require_once('./include/footer.php'); ?>
            <script src="js/script.js"></script>
    </body>
</html>