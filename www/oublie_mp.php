<?php
$error = "";

if(isset($_POST["mail"]))
{
	if(!preg_match ( " /^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@(via)?(cesi.fr)$/ " , $_POST["mail"] ))
	{
		$error .= "Veuillez entrer une adresse email CESI valide.<br/>";
	}
	if(empty($error))
	{
		header('Location: connexion.php');
	}
}
?>

<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="./css/style.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" integrity="sha256-46qynGAkLSFpVbEBog43gvNhfrOj+BmwXdxFgVK/Kvc=" crossorigin="anonymous" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
		<title>BDE Cesi Rouen</title>
	</head>

	<body class="body_connexion">
		<?php require_once('./include/nav.php'); ?>

		<img src="./img/imgSite/General/background_connexion_inscription_web.jpg" class="background-image" alt="image de fond">

		<form class="global_page global_page_forget" method="post" autocomplete="on">
			<h1>Mot de passe oublié</h1>
			<?php
			if(!empty($error))
			{
				echo "<h3>".$error."</h3>";
			}
			?>
			<div class="form_content form_content_forget">
				<div class="label_form">
					<label for="mail">Adresse mail</label>

				</div>

				<div class="input_form">
					<input id="mail" name="mail" type="email" placeholder="Entrez votre adresse mail" <?php if(!empty($error)){echo 'value="'.$_POST["mail"].'"';}?>/>
				</div>
				<div class="empty_form"></div>
			</div>

			<div class="text_form">		
				<p class="button_validate"> 
					<input type="submit" value="Envoyer"/> 
				</p>
			</div>
		</form>
			
		<script src="./js/script.js"></script>
	</body>
</html>