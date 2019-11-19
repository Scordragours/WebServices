<?php
if(!isset($_GET['Identifiant_Activite'])){
    header('Location: index.php');
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
		<title>Activité 1</title>
	</head>
	<body>
        <?php require_once('./include/nav.php'); ?>
		<div class="main_part_act"></div>
		<div class="post_com">
			<h2>Commentaires</h2>
			<input type="file" name="button_com" accept="image/png, image/jpeg, image/jpg, image/gif">
			<input type="button" name="post" value="Poster">
		</div>

        <input type="hidden" name="IdentifiantActivite" value="<?php echo $_GET['Identifiant_Activite']; ?>" />
        <input type="hidden" name="url" value="index.php" />

        <script>
            $.ajax({
                dataType: "json",
                url : 'http://88.181.246.174:8080/Activites/'+ $('input[name=IdentifiantActivite]').val(),
                type: 'GET',
                error: (Resultat, Status, Erreur) => {
                    console.log(Status +' = '+ Erreur +' = '+ Erreur);
                }
            }).then(Data => {
                if(Data['Status'] == 200){
                    let URl = $('input[name=url]').val();
                    $('.main_part_act').append('<h1>'+ Data['Message']['MAN_TITRE'] +'</h1>');
                    $('.main_part_act').append('<div class="main_content"><h4>'+ Data['Message']['MAN_DATE'] +'</h4><img src="'+ URl +'/Moteur/Images/General/Manif/'+ Data['Message']['IMA_URL'] +'" class="main_image" alt="Event" /><p>'+ Data['Message']['MAN_DESCRIPTION'] +'</p><h3>'+ Data['Message']['MAN_PRIX'] +' €</h3><div class="lieu"><h4>'+ Data['Message']['LOC_NOM'] +'</h4></div></div><div class="event_sub"><h2>S\'inscrire à l\'évènement</h2><img src="'+ URl +'/Moteur/Images/General/inscription_event.png" alt="plus" /></div>');
                }else{
                    console.error(Data['Message']);
                }
            });

            $.ajax({
                dataType: "json",
                url : 'http://88.181.246.174:8080/Activites/Photo/Tous/'+ $('input[name=IdentifiantActivite]').val() +'/0/100',
                type: 'GET',
                async: false,
                error: (Resultat, Status, Erreur) => {
                    console.log(Status +' = '+ Erreur +' = '+ Erreur);
                }
            }).then(Data => {
                if(Data['Status'] == 200){
                    let URl = $('input[name=url]').val();
                    var Message = ' ';
                    for(let i in Data['Message']){
                        Message += '<div class="com" id="'+ Data['Message'][i]['IMA_ID'] +'"><div class="com_title_content"><h3>'+ Data['Message'][i]['UTI_NOM'] +' '+ Data['Message'][i]['UTI_PRENOM'] +'</h3><h4>'+ Data['Message'][i]['IMA_DATE'] +'</h4></div>';
                        Message += '<div class="img_com"><img src="'+ URl +'/Moteur/Images/General/'+ Data['Message'][i]['IMA_URL'] +'" alt="Commentaire_1"></div>';
                        Message += '<div class="like_com_block"><a href=""><img src="'+ URl +'/Moteur/Images/General/heart.png" alt="like"></a><h3>'+ Data['Message'][i]['NBLIKE'] +'</h3><input type="text" name="ajout_com" placeholder="Ajouter un commentaire"></div>';
                        $(Message).insertAfter('.post_com');

                        $.ajax({
                            dataType: "json",
                            url : 'http://88.181.246.174:8080/Activites/Photo/Commentaires/Tous/0/100/'+ Data['Message'][i]['IMA_ID'],
                            type: 'GET',
                            async: false,
                            error: (Resultat, Status, Erreur) => {
                                console.log(Status +' = '+ Erreur +' = '+ Erreur);
                            }
                        }).then(Data2 => {
                            if(Data2['Status'] == 200){
                                for(let a in Data2['Message']){
                                    $('<div class="com_picture_block"><div class="title_date_com"><h5>'+ Data2['Message'][a]['UTI_PRENOM'] +' '+ Data2['Message'][a]['UTI_NOM'] +'</h5><h6>'+ Data2['Message'][a]['COMME_DATE'] +'</h6></div><p>'+ Data2['Message'][a]['COMME_CONTENU'] +'</p></div>').prepend('#'+ Data['Message'][i]['IMA_ID']);
                                }
                            }else{
                                console.error(Data2['Message']);
                            }
                        });
                    }

                }else{
                    console.error(Data['Message']);
                }
            });

        </script>

        <?php require_once('./include/footer.php');  ?>
		<script src="js/script.js"></script>
	</body>
</html>