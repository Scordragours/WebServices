<?php 
function showModal()
{
if(empty($_COOKIE['user']))
{
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
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/style.css"/>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <!-- jQuery Modal -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />
    </head>
    <body>
        
           <?php showModal(); ?>

            
        <script src="js/script.js"></script>
    </body>
  </html>
