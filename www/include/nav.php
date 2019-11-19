<header>
            <nav>
                <ul class="pos_nav_elmt">
                    
                    <li><a class="lien_navig" href="liste_activites.php">Events</a></li>
                    <li><a class="lien_navig" href="boutique.php">Boutique</a></li>
                    <li><a href="index.php"><img src="img/imgSite/General/logo.png" alt ="Logo du site" class="logo"/></a></li>
                      <?php
                        if(isset($_SESSION["Token"]))
                        {
                            ?>
                                    <li class="getconnect"><a class="lien_navig" href="panier.php">Panier</a></li>
                                    <li class="getconnect"><a class="lien_navig" href="deconnexion.php">Déconnexion</a></li>

                                      <?php
                        }else{
                            ?>
                            <li><a href="connexion.php" class="lien_navig">Connexion</a></li>
                            <li><a href="inscription.php" class="lien_navig">Inscription</a></li>
                            <?php
                        }?>
                </ul>
                <div class="nav_mob">
                <a href="index.php"><img src="img/imgSite/General/logo.png" class="logo" alt="logo pour mobile"/></a>
                <img src="img/imgSite/nav/mobile/menu.svg" alt="bouton burger" class="burger"/>
                </div>
                <div id="hamburger-sidebar">
					<ul>
                        <li><a class="lien_navig" href="liste_activites.php">Events</a></li>
                        <li><a class="lien_navig" href="boutique.php">Boutique</a></li>
                        <?php
                        if(isset($_SESSION["Token"]))
                        {
                            ?>
                                    <li class="getconnect"><a class="lien_navig" href="panier.php">Panier</a></li>
                                    <li class="getconnect"><a class="lien_navig" href="deconnexion.php">Déconnexion</a></li>

                                
                            <?php
                        }else{
                            ?>
                            <li><a href="connexion.php" class="lien_navig">Connexion</a></li>
                            <li><a href="inscription.php" class="lien_navig">Inscription</a></li>

                            <?php
                        }?>

                    </ul>
				</div>
                <div id="overlay"></div>
            </nav>
            <div class="scroll-line"></div>
        </header>