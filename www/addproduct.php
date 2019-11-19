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
if(isset($_POST["nom_manifest"]) && isset($_POST["description_manifest"]) && isset($_POST["price"]) && isset($_POST["stock"])) {

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
    if(!is_numeric($_POST["stock"]) || $_POST["stock"] < 0)
    {
        $error .= "Veuillez ajouter un prix valide.<br/>";
    }

    if(empty($error))
    {
        if (isset($_FILES['files']) && $_FILES['files']['name'][0] != "") {

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $IP_NODE."/Produits/");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(
                array(
                    'Nom' => $_POST["nom_manifest"],
                    'Description' => $_POST["description_manifest"],
                    'Prix' => $_POST["price"],
                    'InVisible' => $invisible,
                    'Categories' => "[]",
                    'Nombre' => $_POST["stock"]
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
                    $id = $data->{'ID'};
                    var_dump($id);
                    //echo $id;

                    $target_dir = "img/imgProduits/";
                    $countFiles = count($_FILES['files']['name']);
                    for($i=0; $i<$countFiles;$i++)
                    {
                        $file = $_FILES['files']['name'][$i];
                        $path = pathinfo($file);
                        $filename = $path['filename'];
                        $ext = $path['extension'];
                        $temp_name = $_FILES['files']['tmp_name'][$i];
                        $path_filename_ext = $target_dir.$filename.".".$ext;

                        while(file_exists($path_filename_ext))
                        {
                            $filename .= generateRandomString(1);
                            $path_filename_ext = $target_dir.$filename.".".$ext;
                        }

                        $chi = curl_init();
                        curl_setopt($chi, CURLOPT_URL, $IP_NODE."/Produits/Images/".$id);
                        curl_setopt($chi, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($chi, CURLOPT_CUSTOMREQUEST, "POST");
                        curl_setopt($chi, CURLOPT_POSTFIELDS, http_build_query(
                            array(
                                'URLImage' => $filename.".".$ext
                            )));
                        curl_setopt($chi, CURLOPT_HTTPHEADER,
                            array(
                                'token:'.$_SESSION["Token"]
                            ));

                        $responsei = curl_exec($chi);
                        curl_close($chi);
                        $datai = json_decode($responsei);

                        try{
                            if($datai->{'Status'} != 200)
                            {
                                $error .= $datai->{'Message'}."<br/>";
                            }
                            else{
                                move_uploaded_file($temp_name, $path_filename_ext);
                            }
                        }catch(Exception $err)
                        {
                            $error .= "Une erreur est survenue avec le serveur.<br/>";
                        }

                        move_uploaded_file($temp_name, $path_filename_ext);
                    }
                    header('Location: addproduct.php?up=Success');
                }
            }catch(Exception $err)
            {
                $error .= "Une erreur est survenue avec le serveur.<br/>";
            }
        }
        else{
            $error .= "Veuillez choisir au moins une image.<br/>";
        }
    }
}
?>
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
       <div class="can_inform inf_adm">
            <h1 class="manif_titre">Ajouter un produit :</h1>
           <?php
           if(!empty($error))
           {
               echo "<h3>".$error."</h3>";
           }

           if(isset($_GET["up"]) && $_GET["up"] == "Success")
           {
               echo "<h4>Le produit a bien été ajouté !</h4>";
           }
           ?>
       </div>
            <form action="addproduct.php" method="post" enctype="multipart/form-data">
                <div class="position_ajout_manifest">
                    <input type="text" id="nom_manifest" name="nom_manifest" placeholder="Nom du produit" <?php if(!empty($error)){echo 'value="'.$_POST["nom_manifest"].'"';}?>/>
                </div>
                <div class="position_ajout_manifest">
                    <textarea id="description_manifest" name="description_manifest" placeholder="Descpription du produit"><?php if(!empty($error)){echo $_POST["description_manifest"];}?></textarea>
                </div>
                <div class="position_ajout_manifest baneer_form">
                    <p>Ajouter des images pour le produit</p>
                    <input type="file" accept="image/png, image/jpeg" name="files[]" multiple />
                </div>
                <div class="position_ajout_manifest">
                    <div class="input-group suffix">
                        <input class="num" type="number" step="0.01" min="0" name="price" placeholder="Prix" <?php if(!empty($error)){echo 'value="'.$_POST["price"].'"';}?> />
                        <p class="input-group-addon">€</p>
                    </div>
                </div>
                <div class="position_ajout_manifest">
                    <div class="input-group suffix">
                        <input class="num" type="number" step="1" min="0" name="stock" placeholder="Stock" <?php if(!empty($error)){echo 'value="'.$_POST["stock"].'"';}?> />
                        <p class="input-group-addon">unité(s)</p>
                    </div>
                </div>
                <div class="position_ajout_manifest">
                    <p>Invisible </p>
                    <input type="checkbox" name="invisible" <?php if(!empty($error) && isset($_POST["invisible"])){ echo "checked";} ?> />

                </div>
                <div class="position_ajout_manifest">
                    <input type="submit" class="publish_form" value="Créer"/>
                </div>
            </form>
            <?php require_once('./include/footer.php'); ?>
            <script src="js/script.js"></script>
    </body>
</html>