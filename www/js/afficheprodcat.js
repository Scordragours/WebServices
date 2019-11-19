$.ajax({
    dataType: "json",
    url : 'http://10.176.128.178:8080/Produits/4',
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
        for(let i=0; i<data['Message'].length; i++)
        {
           
        	$('<div></div>').appendTo('.container').addClass('block_product').attr('id', "d"+i);
        	$('<h5>'+data['Message'][i]['PRO_NOM']+'</h5>').appendTo('#d'+i);
        	$.ajax({
                dataType: "json",
                url : 'http://10.176.128.178:8080/Produits/Images/'+data['Message'][i]['PRO_ID'],
                type: 'GET',
                error: function(resultat, statut, erreur){
                    console.log(erreur);
                 }}).then(data => {
                            console.log(data['Message'][0]['IMAPRO_URL']);
                            $('<img src="./img/imgProduits/'+data['Message'][0]['IMAPRO_URL']+'" alt="Articles" />').appendTo('#d'+i);

             }              
             );
                 $('<button><a href="viewproduct.php?id='+data['Message'][i]['PRO_ID']+'">Voir en détail</a></button>').appendTo("#d"+i);
        }
    
    }
);

