<?php
include "ip_config.php";

session_start();
if(!isset($_SESSION["Token"]))
{
    header('Location: boutique.php');
}

//echo $_SESSION["Token"];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $IP_NODE."/Panier/");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_HTTPHEADER,
    array(
        'token:'.$_SESSION["Token"]
    ));

$response = curl_exec($ch);
//var_dump($response);
curl_close($ch);
$data = json_decode($response);
?>

<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8"/>
        <link rel="stylesheet" href="./css/style.css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" integrity="sha256-46qynGAkLSFpVbEBog43gvNhfrOj+BmwXdxFgVK/Kvc=" crossorigin="anonymous" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <title>Intégration CSS/HTML</title>
        
    </head>
    <body>
        <?php require_once('./include/nav.php'); ?>
        <h1 class="titre-boutique-panier">Mon panier</h1>
        <?php
        $total_prix = 0;
        $i = 0;
        foreach($data->{'Message'} as $row)
        {
            $ch2 = curl_init();
            curl_setopt($ch2, CURLOPT_URL, $IP_NODE."/Produits/Images/".$row->{'PRO_ID'});
            curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch2, CURLOPT_CUSTOMREQUEST, "GET");

            $response2 = curl_exec($ch2);
            curl_close($ch2);
            $data2 = json_decode($response2);
            ?>
            <div id="cont<?php echo $i; ?>" class="ligne_panier">
                <div class="lpimg">
                    <img src="./img/imgProduits/<?php if(!empty($data2->{'Message'})){echo $data2->{'Message'}[0]->{'IMAPRO_URL'};}else{echo "decaps.jpg";} ?>" alt="image du ligne-panier" class="img_panier"/>
                </div>
                <h4><?php echo $row->{'PRO_NOM'}; ?></h4>
                <p>Prix unitaire : <?php echo $row->{'PRO_PRIX'}; ?>€</p>
                <div class="containerpan">
                    <div class="product-quantity">
                        <h3>Quantité</h3>
                        <input id="qty<?php echo $i; ?>" data-min="1" data-max="0" type="text" name="quantity<?php echo $i; ?>" value="<?php echo $row->{'STOCKUTI'}; ?>" readonly="true"><div class="quantity-selectors-container">
                            <div class="quantity-selectors">
                                <button id="inc<?php echo $i; ?>" onClick="rc(this.id)" type="button" class="increment-quantity" aria-label="En ajouter un" data-direction="1"><span>&#43;</span></button>
                                <button id="dec<?php echo $i; ?>" onClick="rc(this.id)" type="button" class="decrement-quantity" aria-label="En retirer un" data-direction="-1"><span>&#8722;</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <p id="st<?php echo $i; ?>">Sous-total : <?php echo number_format((float)$row->{'SOUS_TOTAL'}, 2, '.', 0);?>€</p>
                <div class="lpimg">
                    <img id="del<?php echo $i; ?>" onClick="dl(this.id)" src="./img/imgSite/General/delete.svg" alt="logo poubelle" class="poubelle"/>
                </div>
            </div>
            <?php
            $total_prix += $row->{'SOUS_TOTAL'};
            $i++;
        }

        ?>

        <hr class="total_hr">
        <div class="total_block">
            <p class="price_denomination">TOTAL :</p>
            <p id="tt" class="price"><?php echo number_format((float)$total_prix, 2, '.', 0); ?>€</p>
            <button class="payer">Payer</button>
        </div>
        <?php require_once('./include/footer.php'); ?>
        <script src="js/script.js"></script>
        <script src="js/panier.js"></script>
    </body>
</html>