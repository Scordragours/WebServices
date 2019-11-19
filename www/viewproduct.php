<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Boutique</title>
    
               <link rel="stylesheet" href="css/style.css"/>
        <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" integrity="sha256-46qynGAkLSFpVbEBog43gvNhfrOj+BmwXdxFgVK/Kvc=" crossorigin="anonymous" />
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    </head>
    <body>
        <?php require_once('./include/nav.php'); ?>
        <?php require_once('./include/search.php'); ?>
            <ul class="categorie_name">
                <li><a href="allProduct.php">Tous les produits</a></li>
            </ul>
            <select class="categorie_mobile">
                   <option><a href="allProduct.php">Tous les produits</a></option>
            </select>
            <h1 class="titre_vue_princip"></h1>
           <div class="content">
            <div class="position_vue_produit">
              
            </div>
            <div class="infos_vue_produit">
                     
            </div>
            <div class="desc_produit">
               
            </div>
            <h1 class="produit_simil">Produits similaires :</h1>
            <div class="container">
          
                    <div class="slider-wrapper">
                      <div class="inner-wrapper2">

                      </div>
                    </div>
                    <div class="button prev2"></div>
                          <div class="button next2"></div>
             </div>
           </div>
             <?php require_once('./include/footer.php');?>
             <script src="js/caroussel.js"></script>
            <script src="js/script.js"></script>
            <script src="js/categorie.js"></script>
            <script src="js/search.js"></script>
            <script src="js/product.js"></script>
    </body>
</html>








