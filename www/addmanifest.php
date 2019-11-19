<?php
include "ip_config.php";
session_start();

if(!isset($_SESSION["Token"]) || !isset($_SESSION["Status"]) || $_SESSION["Status"] != 2)
{
    header('Location: connexion.php');
}

function generateRandomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$error = "";
if(isset($_POST["nom_manifest"]) && isset($_POST["description_manifest"]) && isset($_POST["price"]) && isset($_POST["date"])) {

    $reccurrent = 0;
    if(isset($_POST["reccurent"]))
    {
        $reccurrent = 1;
    }

    $invisible = 0;
    if(isset($_POST["invisible"]))
    {
        $invisible = 1;
    }

    if(strlen($_POST["nom_manifest"]) < 1)
    {
        $error .= "Veuillez ajouter un nom.<br/>";
    }
    if(strlen($_POST["description_manifest"]) < 1)
    {
        $error .= "Veuillez ajouter une description.<br/>";
    }
    if(!is_numeric($_POST["price"]) || $_POST["price"] < 0)
    {
        $error .= "Veuillez ajouter un prix valide.<br/>";
    }
    if (!preg_match("/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$/",$_POST["date"])) {
        $error .= "Veuillez ajouter une date valide.<br/>";
    }


    if(empty($error))
    {
        if (isset($_FILES['files']) && $_FILES['files']['name'] != "") {
            $target_dir = "img/imgManifest/";
            $file = $_FILES['files']['name'];
            $path = pathinfo($file);
            $filename = $path['filename'];
            $ext = $path['extension'];
            $temp_name = $_FILES['files']['tmp_name'];
            $path_filename_ext = $target_dir . $filename . "." . $ext;

            while(file_exists($path_filename_ext))
            {
                $filename .= generateRandomString(1);
                $path_filename_ext = $target_dir.$filename.".".$ext;
            }

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $IP_NODE."/Activites/");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(
                array(
                    'Titre' => $_POST["nom_manifest"],
                    'Description' => $_POST["description_manifest"],
                    'Date' => str_replace("T", " ", $_POST["date"]).":00",
                    'Recurrente' => $reccurrent,
                    'Prix' => $_POST["price"],
                    'InVisible' => $invisible,
                    'ImageURL' => $filename.".".$ext
                )));
            curl_setopt($ch, CURLOPT_HTTPHEADER,
                array(
                    'token:'.$_SESSION["Token"]
                ));

            $response = curl_exec($ch);
            curl_close($ch);
            $data = json_decode($response);

            try{
                if($data->{'Status'} != 200)
                {
                    $error .= $data->{'Message'}."<br/>";
                }
                else{
                    move_uploaded_file($temp_name, $path_filename_ext);
                    header('Location: addmanifest.php?up=Success');
                }
            }catch(Exception $err)
            {
                $error .= "Une erreur est survenue avec le serveur.<br/>";
            }


        }
        else{
            $error .= "Veuillez choisir une image.<br/>";
        }
    }

}
    /*$countFiles = count($_FILES['files']['name']);
    for($i=0; $i<$countFiles;$i++)
    {
        $file = $_FILES['files']['name'][$i];
        $path = pathinfo($file);
        $filename = $path['filename'];
        $ext = $path['extension'];
        $temp_name = $_FILES['files']['tmp_name'][$i];
        $path_filename_ext = $target_dir.$filename.".".$ext;

        if(file_exists($path_filename_ext))
        {
            echo "SORRY PD";
        }else{
            move_uploaded_file($temp_name, $path_filename_ext);
            echo "BG PD";
        }
    }*/

        //var_dump($f);

//}

?>
<html>
    <head>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="css/style.css"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" integrity="sha256-46qynGAkLSFpVbEBog43gvNhfrOj+BmwXdxFgVK/Kvc=" crossorigin="anonymous" />
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <title>Ajouter une manifestation</title>
    </head>
    <body >
        <?php require_once('./include/nav.php'); ?>
        <div class="can_inform inf_adm">
            <h1 class="manif_titre">Ajouter un événement :</h1>
            <?php
            if(!empty($error))
            {
                echo "<h3>".$error."</h3>";
            }

            if(isset($_GET["up"]) && $_GET["up"] == "Success")
            {
                echo "<h4>La manifestation a bien été ajoutée !</h4>";
            }
            ?>
        </div>
            <form action="addmanifest.php" method="post" enctype="multipart/form-data">
                <div class="position_ajout_manifest">
                    <input type="text" id="nom_manifest" name="nom_manifest" placeholder="Nom de l'événement" <?php if(!empty($error)){echo 'value="'.$_POST["nom_manifest"].'"';}?>/>
                </div>
                <div class="position_ajout_manifest">
                    <textarea id="description_manifest" name="description_manifest" placeholder="Descpription de l'événement"><?php if(!empty($error)){echo $_POST["description_manifest"];}?></textarea>
                </div>
                <div class="position_ajout_manifest">
                    <p>Date : </p>
                    <input type="datetime-local" name="date" min="<?php echo str_replace("/", "T", date("Y-m-d/H:i")); ?>" value="<?php if(!empty($error)){echo $_POST["date"];}else{echo str_replace("/", "T", date("Y-m-d/H:i"));} ?>" />
                </div>
                <div class="position_ajout_manifest baneer_form">
                    <p>Ajout d'une image pour cet événement</p>
                    <input type="file" accept="image/png, image/jpeg" name="files"/>
                </div>
                <div class="position_ajout_manifest">
                    <div class="input-group suffix">
                        <input class="num" type="number" step="0.01" min="0" name="price" placeholder="Prix (0 pour gratuit)" <?php if(!empty($error)){echo 'value="'.$_POST["price"].'"';}?> />
                        <p class="input-group-addon">€</p>
                    </div>
                </div>
                <div class="position_ajout_manifest">
                       <p>Événement reccurent </p>
                        <input type="checkbox" name="reccurent" <?php if(!empty($error) && isset($_POST["reccurent"])){ echo "checked";} ?> />

                </div>
                <div class="position_ajout_manifest">
                    <p>Invisible </p>
                    <input type="checkbox" name="invisible" <?php if(!empty($error) && isset($_POST["invisible"])){ echo "checked";} ?> />

                </div>
                <div class="position_ajout_manifest">
                    <input type="submit" class="publish_form" value="Publier"/>
                </div>
            </form>
            <script src="js/script.js"></script>
         <?php require_once('./include/footer.php'); ?>
    </body>
</html>