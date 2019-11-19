var nomProduit = [];

$.ajax({
    dataType: "json",
    url : 'http://10.176.128.178:8080/Produits/4',
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
    console.log(data['Message'][0]['PRO_ID']);
    for(var i=0; i<data['Message'].length; i++)
    {
        nomProduit[i] = (data['Message'][i]['PRO_NOM']);
    }

    $( "#search" ).autocomplete({
      source: nomProduit
    });

});