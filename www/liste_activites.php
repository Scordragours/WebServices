<?php
   session_start();
?>
<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="./css/style.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" integrity="sha256-46qynGAkLSFpVbEBog43gvNhfrOj+BmwXdxFgVK/Kvc=" crossorigin="anonymous" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>
        <link rel="shortcut icon" type="image/x-icon" href="./img/imgSite/General/logofav.ico">
		<title>Liste des Activités</title>
	</head>
		
	<body>
		<?php require_once('./include/nav.php'); ?>
        <?php
        if(isset($_SESSION['Status']) && $_SESSION['Status'] == 2)
        {
            echo '<p><a class="pdf" href="#" style="color : black;">Télecharger pdf</a></p>';
        }
        ?>

		<section class="events">

		</section>

		<?php require_once('./include/footer.php'); ?>
		<script src="./js/script.js"></script>
		<script src="./js/script_1.js"></script>
        <script src="./js/signal.js"></script>
	</body>
</html>