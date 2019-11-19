<?php
include "ip_config.php";
/*curl_setopt($ch, CURLOPT_HTTPHEADER,
    array(
        'Token : '
    ));*/
session_start();
if(isset($_SESSION["Token"]))
{
    header('Location: index.php');
}


$error = "";

if(isset($_POST["mail"]) && isset($_POST["password"]))
{
	if(!preg_match ( " /^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@(via)?(cesi.fr)$/ " , $_POST["mail"] ))
	{
		$error .= "Veuillez entrer une adresse email CESI valide.<br/>";
	}
	if(empty($error))
	{
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $IP_NODE."/Token/");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(
                array(
                    'AdresseMail' => $_POST["mail"],
                    'MotDePasse' => sha1($_POST["password"])
                )
        ));

        $response = curl_exec($ch);
        curl_close($ch);
        $data = json_decode($response);

        try{
            if($data->{'Authentification'} == "true")
            {
                $_SESSION["Token"] = $data->{'Token'};
                $_SESSION["Nom"] = $data->{'Message'}->{'UTI_NOM'};
                $_SESSION["Prenom"] = $data->{'Message'}->{'UTI_PRENOM'};
                $_SESSION["Mail"] = $data->{'Message'}->{'UTI_MAIL'};
                $_SESSION["Status"] = $data->{'Message'}->{'STA_ID'};
                $_SESSION["ID"] = $data->{'Message'}->{'UTI_ID'};
                header('Location: index.php');
            }
            else{
                $error .= $data->{'Message'};
            }
        }catch(Exception $e)
        {
            $error .= "Une erreur est survenue avec le serveur.";
        }
		//header('Location: acceuil.php');
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

		<form class="global_page global_page_conn can_inform" method="post" action="connexion.php" autocomplete="on">
			<h1>Connexion</h1>
			<?php
			if(!empty($error))
			{
				echo "<h3>".$error."</h3>";
			}

			if(isset($_GET["insc"]) && $_GET["insc"] == "Success")
            {
                echo "<h4>Vous êtes désormais inscrit ! Vous pouvez vous connecter avec vos identifiants.</h4>";
            }
			?>
			<div class="form_content form_content_conn">
				<div class="label_form">
					<label for="mail">Adresse mail</label>
					<label for="password">Mot de passe</label>

				</div>

				<div class="input_form">
					<input id="mail" name="mail" type="email" placeholder="Entrez votre adresse mail" <?php if(!empty($error)){echo 'value="'.$_POST["mail"].'"';}?>/>
					<input id="password" name="password" type="password" placeholder="Entrez votre de mot de passe" />
				</div>
				<div class="empty_form"></div>
			</div>

			<div class="text_form">		
				<p class="button_validate"> 
					<input type="submit" value="Se connecter"/> 
				</p>

				<div class="link_page">
					<p><a href="oublie_mp.php">Mot de passe oublié</a></p>
					<p>
						Pas encore inscrit ?
						<a href="inscription.php">Inscription</a>
					</p>
				</div>
			</div>
		</form>
			
		<script src="./js/script.js"></script>
	</body>
</html>