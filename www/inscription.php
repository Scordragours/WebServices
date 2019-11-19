<?php
include "ip_config.php";
/*$url = "http://10.176.128.178:8080/Produits/4";
$handle = curl_init();
curl_setopt($handle, CURLOPT_URL, $url);
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
$data = curl_exec($handle);
curl_close($handle);

$json = json_decode($data);
echo $json[1]->{'PRO_NOM'};*/

/*session_start();
session_destroy();*/
session_start();
if(isset($_SESSION["Token"]))
{
    header('Location: index.php');
}

$error = "";
if(isset($_POST["name"]) && isset($_POST["surname"]) && isset($_POST["mail"]) && isset($_POST["password"]) && isset($_POST["toconfirm"]))
{
    if(strlen($_POST["name"]) < 1)
    {
        $error .= "Le prénom doit contenir au moins 1 caractère.<br/>";
    }
    else if(strlen($_POST["name"]) > 30)
    {
        $error .= "Le prénom ne doit pas dépasser 30 caractères.<br/>";
    }
    if(strlen($_POST["surname"]) < 1)
    {
        $error .= "Le nom doit contenir au moins 1 caractère.<br/>";
    }
    else if(strlen($_POST["surname"]) > 30)
    {
        $error .= "Le nom ne doit pas dépasser 30 caractères.<br/>";
    }
    if(!preg_match ( " /^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@(via)?(cesi.fr)$/ " , $_POST["mail"] ))
    {
        $error .= "Veuillez entrer une adresse email CESI valide.<br/>";
    }
    if(strlen($_POST["password"]) < 8)
    {
        $error .= "Le mot de passe doit contenir au moins 8 caractères.<br/>";
    }
    else if(!preg_match("/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/", $_POST["password"]))
    {
        $error .= "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.<br/>";
    }
    else if($_POST["password"] != $_POST["toconfirm"])
    {
        $error .= "Les mots de passes ne correspondent pas<br/>";
    }

    if(empty($error))
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $IP_NODE."/Utilisateurs/");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(
                array(
                    'Nom' => $_POST["surname"],
                    'Prenom' => $_POST["name"],
                    'Mail' => $_POST["mail"],
                    'MotDePasse' => sha1($_POST["password"]),
                    'Localisation' => 4
                )
        ));
        $response = curl_exec($ch);
        curl_close($ch);
        $data = json_decode($response);

        try{
            if($data->{'Status'} != 200)
            {
                $error .= $data->{'Message'};
            }
            else{
                header('Location: connexion.php?insc=Success');
            }
        }catch(Exception $err)
        {
            $error .= "Une erreur est survenue avec le serveur.";
        }
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

    <body class="body_inscription">
        <?php require_once('./include/nav.php'); ?>

        <img src="./img/imgSite/General/background_connexion_inscription_web.jpg" class="background-image" alt="image de fond">


            <form class="global_page can_inform" method="post" action="inscription.php" autocomplete="on">
                <h1>Inscription</h1>
                <?php
                if(!empty($error))
                {
                    echo "<h3>".$error."</h3>";
                }
                ?>
                <div class="form_content">
                    <div class="label_form">
                        <label for="name">Prénom</label>
                        <label for="surname">Nom</label>
                        <label for="mail">Adresse mail</label>
                        <label for="password">Mot de passe</label>
                        <label for="toconfirm">Confirmer votre mot de passe</label>

                    </div>

                    <div class="input_form">
                        <input id="name" name="name" type="text" placeholder="Entrez votre prénom" <?php if(!empty($error)){echo 'value="'.$_POST["name"].'"';}?>/>
                        <input id="surname" name="surname" type="text" placeholder="Entrez votre nom" <?php if(!empty($error)){echo 'value="'.$_POST["surname"].'"';}?>/>
                        <input id="mail" name="mail" type="email" placeholder="Entrez votre adresse mail" <?php if(!empty($error)){echo 'value="'.$_POST["mail"].'"';}?>/>
                        <input id="password" name="password" type="password" placeholder="Entrez votre de mot de passe" />
                        <input id="toconfirm" name="toconfirm" type="password" placeholder="Confirmer votre de mot de passe"/>
                    </div>
                    <div class="empty_form"></div>
                </div>

                <div class="text_form">
                    <p class="condition">En cliquant sur "S'inscrire", vous acceptez les <a href="mentionslegales.php">mentions légales</a>, la <a href="cvg.php">conditions générales de ventes</a>.</p>
            
                    <p class="button_validate">
                        	<input type="submit" value="S'inscrire"/>
                    </p>

                    <div class="link_page">
                        <p>
                            Déjà inscrit ?
                            <a href="connexion.php">Connexion</a>
                        </p>
                    </div>
                </div>
            </form>


        <script src="./js/script.js"></script>
    </body>
</html>