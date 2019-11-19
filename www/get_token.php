<?php
session_start();
if(!isset($_SESSION["Token"]))
{
    header('Location: index.php');
}else{
    echo $_SESSION["Token"];
}