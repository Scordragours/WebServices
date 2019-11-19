$.ajax({
    dataType: "json",
    url : 'http://10.176.128.178:8080/Produits/Categorie/',
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
        for(let i=0; i<data['Message'].length; i++)
        {
            $('<li>'+data['Message'][i]['CAT_NOM']+'</li>').appendTo('.categorie_name');
            $('<option value="'+data['Message'][i]['CAT_NOM']+'">'+data['Message'][i]['CAT_NOM']+'</option>').appendTo('.categorie_mobile');


        }
    
    }
);