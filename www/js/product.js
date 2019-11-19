const IPNODE = 'http://10.176.128.178:8080';

/*GETTOKEN*/
let token;
$.ajax({
    dataType: "html",
    url : './get_token.php',
    success: function(data, statut){
        token = data;
        console.log(token);
    },
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }
});
/*----*/


var CheminComplet = document.location.href;
var obtains = CheminComplet.substring(CheminComplet.lastIndexOf("=")+1);
var recup = obtains-1;

function ad(){
    $.ajax({
        dataType: "json",
        url : "http://10.176.128.178:8080/Panier/",
        type: 'POST',
        data: {IdentifiantProduit: recup+1, Quantite: 1},
        headers: {'token': token},
        error: function(resultat, statut, erreur){
            console.log(erreur);
        }}).then(data => {
            alert(data['Message']);
        }
    );
}


$.ajax({
    dataType: "json",
    url : 'http://10.176.128.178:8080/Produits/4',
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
        console.log(data['Message'][recup]['PRO_NOM']);
        console.log(data['Message'].length);
        $('.titre_vue_princip').text(data['Message'][recup]['PRO_NOM']);
        $('<h5>Prix :</h1>').appendTo('.infos_vue_produit');
        $('<p>'+data['Message'][recup]['PRO_PRIX']+'<span>€</span></p>').appendTo('.infos_vue_produit');
        $('<button>Ajouter au panier</button>').appendTo('.infos_vue_produit').attr('onClick', 'ad()');
        $('<h2>Description</h2>').appendTo('.desc_produit');
        $('<p>'+data['Message'][recup]['PRO_DESCRIPTION']+'</p>').appendTo('.desc_produit');
        $.ajax({
    dataType: "json",
    url : 'http://10.176.128.178:8080/Produits/Images/'+data['Message'][recup]['PRO_ID'],
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data2 => {
        console.log(data2['Message'][0]['IMAPRO_URL']);
        
        $('<img src="./img/imgProduits/'+data2['Message'][0]['IMAPRO_URL']+'" alt="Image du produit" />').appendTo('.position_vue_produit');
       
        
    });
    });


$.ajax({
    dataType: "json",
    url : 'http://10.176.128.178:8080/Produits/Ventes/4',
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
        console.log(data['Message'].length);
        for(let i=0; i<data['Message'].length; i++)
        {
            $('<div></div>').appendTo('.inner-wrapper2').addClass('slide2').attr('id', i);
            $('<h2><a href="viewproduct.php?id='+data['Message'][i]['PRO_ID']+'">'+data['Message'][i]['PRO_NOM']+'</a></h2>').appendTo('#'+i).addClass('titre_caroussel');
           
            $.ajax({
                dataType: "json",
                url : 'http://10.176.128.178:8080/Produits/Images/'+data['Message'][i]['PRO_ID'],
                type: 'GET',
                error: function(resultat, statut, erreur){
                    console.log(erreur);
                 }}).then(data2 => {
                            console.log(data2['Message'][0]['IMAPRO_URL']);
                            $('<img src="./img/imgProduits/'+data2['Message'][0]['IMAPRO_URL']+'" alt="Articles les plus vendus" />').appendTo('#'+i).addClass('img_caroussel');

             }              
             );
            


        }
    
    }
);




