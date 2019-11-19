<?php 
    session_start();
    $_SESSION['Status'] = 2;
    
?>
<html>
    <head>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>
    </head>
    <body>
    <?php
    if($_SESSION['Status'] == 2) 
    {
        echo '<p><a class="pdf" href="#">Télecharger pdf</a></p>';
    }
    ?>
    <script src="signal.js"></script>
    </body>
    </html>