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
        <?php require_once('include/nav.php'); ?>
        <div class="content">
        <?php require_once('include/search.php'); ?>
        <ul class="categorie_name">
            <li><a href="allProduct.php">Tous les produits</a></li>
            <!--<li>Les textiles</li>
            <li>Les goodies</li>
            <li>Événement payants</li> -->
        </ul>
        <select class="categorie_mobile">
            <option value="product">Tous les produits</option>
            <!--<option value="textiles">Textiles</option>
            <option value="goodie">Goodies</option>
            <option value="eventsPayant">Événement payants</option> -->
        </select>
        <h2 class="boutique_titre "> Articles les plus vendu de la boutique</h2>
        <div class="container_mobile">
          
                <div class="slider-wrapper">
                  <div class="inner-wrapper">
                   <!-- <div class="slide">
                      <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg" alt="Image produit" class="img_caroussel"/>
                      <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                    </div>
                    <div class="slide">
                          <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>
                    <div class="slide">
                          <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div> -->
                   
                  </div>
                </div>
            
                <div class="button prev"></div>
                <div class="button next"></div>
              </div>
    <div class="position_item">
        <!--<div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div>
        <div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div>
        <div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div> -->
    </div>
        <h2 class="boutique_titre ">Textiles: </h2>
        <div class="container_mobile">
          
                <div class="slider-wrapper">
                  <div class="inner-wrapper1">
                    <!--<div class="slide1">
                      <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg" alt="Image produit" class="img_caroussel"/>
                      <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                    </div>
                    <div class="slide1">
                          <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>
                    <div class="slide1">
                          <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>
                    <div class="slide1">
                          <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>
                    <div class="slide1">
                          <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>-->
                  </div>
                </div>
                <div class="button prev1"></div>
                      <div class="button next1"></div>
         </div>
    <div class="position_item">
        <div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div>
        <div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div>
        <div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div>
    </div>
        <h2 class="boutique_titre">Goodies : </h2>
        <div class="container_mobile">
          
                <div class="slider-wrapper">
                  <div class="inner-wrapper2">
                   <!-- <div class="slide2">
                      <img src="./img/imgSite/General/boutique/photoProduit/decaps.jpg" alt="Image produit" class="img_caroussel"/>
                      <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                    </div>
                    <div class="slide2">
                          <img src="./img/imgSite/General/boutique/photoProduit/decaps.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>
                    <div class="slide2">
                          <img src="./img/imgSite/General/boutique/photoProduit/decaps.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>
                    <div class="slide2">
                          <img src="./img/imgSite/General/boutique/photoProduit/decaps.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>
                    <div class="slide2">
                          <img src="./img/imgSite/General/boutique/photoProduit/decaps.jpg" alt="Image produit" class="img_caroussel"/>
                          <h2 class="titre_caroussel"><a href="#">Pull cesi</a></h2>
                  </div>-->
                  </div>
                </div>
                <div class="button prev2"></div>
                      <div class="button next2"></div>
         </div>
         <div class="position_item">
        <div class="other_product">
            <div class="bann">
                <h4>Super decapsuleur</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img class="img_prod" src="./img/imgSite/General/boutique/photoProduit/decaps.jpg"/>
        </div>
        <div class="other_product">
            <div class="bann">
                <h4>Super decapsuleur</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img class="img_prod" src="./img/imgSite/General/boutique/photoProduit/decaps.jpg"/>
        </div>
        <div class="other_product">
            <div class="bann">
                <h4>Super decapsuleur</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img class="img_prod" src="./img/imgSite/General/boutique/photoProduit/decaps.jpg"/>
        </div>
        </div>
      </div>
        <?php require_once('include/footer.php'); ?>
        <script src="js/caroussel.js"></script>
        <script src="js/script.js"></script>
        <script src="js/search.js"></script>
        <script src="js/boutique.js"></script>
</body>
</html>