<?php
session_start();

function showModal()
{
if(empty($_COOKIE['user']))
{
    //Initialise un cookie d'une durée de 24 heures
    setcookie('user', '1', time()+86400); 
    echo(
     "
    <!-- Modal HTML embedded directly into document -->
    <div id='ex2' class='modal'>
    <p>En poursuivant votre navigation sur ce site, vous acceptez l’utilisation de Cookies pour mettre en place des sécurité interne.</p>
    <a href='#' rel='modal:close' class='modal_linker'>Accepter</a>
    <a href='#' class='modal_linker refus' rel='modal:close'>Refuser</a>
    </div>

    ");
}
}

?>
<!DOCTYPE html>
	<html lang="fr">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" integrity="sha256-46qynGAkLSFpVbEBog43gvNhfrOj+BmwXdxFgVK/Kvc=" crossorigin="anonymous" />
		<link rel="shortcut icon" type="image/x-icon" href="./img/imgSite/General/logofav.ico">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />

		<title>Acceuil</title>
	</head>

	<body>
		<?php require_once('./include/nav.php'); 
            showModal();
        ?>
		<div class="main_div">
			<div class="main_text_bde">
				<h1>BDE Cesi Rouen</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec est metus. Etiam sed risus lectus. 
				Curabitur bibendum varius risus, nec elementum erat vestibulum vel. Pellentesque eleifend, libero congue 
				euismod tempus, lacus risus sollicitudin lectus, id consequat neque arcu sed libero. Fusce vitae justo id 
				lacus fermentum interdum vel quis diam. Nulla non dolor eget nibh sodales pharetra. Vestibulum posuere 
				sollicitudin arcu at dictum. Nunc augue velit, ultricies at fringilla sed, consectetur at lacus. Lorem ipsum 
				dolor sit amet, consectetur adipiscing elit. Suspendisse ultricies placerat nunc, ut faucibus lacus. Nam 
				quam leo, commodo eget velit eu, bibendum aliquet felis. Proin vulputate luctus laoreet. Pellentesque 
				ligula nibh, pellentesque non dui nec, maximus posuere mauris.</p>
			</div>

		<div class="main_event_article">
			<h1><a href="liste_activites.php">Evènements les plus récents</a></h1>
			<div class="main_event">
				<div class="main_block">
					<img src="./img/imgSite/General/Affiche_event.png" alt="Event">
					<p><a href="">Soirée Electro</a></p>
				</div>					
				<div class="main_block">
					<img src="./img/imgSite/General/Affiche_event.png" alt="Event">
					<p><a href="">Soirée Electro</a></p>
				</div>
				<div class="main_block">
					<img src="./img/imgSite/General/Affiche_event.png" alt="Event">
					<p><a href="">Soirée Electro</a></p>
				</div>
			</div>

			<h1><a href="boutique.php">Articles les plus populaires de la boutique</a></h1>
			<div class="main_event">
				<div class="main_block">
					<img src="./img/imgSite/General/pull.jpg" alt="Pull">
					<p><a href="">Pull Cesi Chrismath</a></p>
				</div>					
				<div class="main_block">
					<img src="./img/imgSite/General/decaps.jpg" alt="Décapsuleur">
					<P><a href="">Super Decapsuleur</a></p>
				</div>
				<div class="main_block">
					<img src="./img/imgSite/General/pull.jpg" alt="Pull">
					<p><a href="">Pull Cesi Chrismath</a></p>
				</div>
			</div>
		</div>

		<?php require_once('./include/footer.php'); ?>
		<script src="js/script.js"></script>
        <script src="js/modal.js"></script>
	</body>
</html>