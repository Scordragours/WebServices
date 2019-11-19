

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
            $('<div></div>').appendTo('.inner-wrapper').addClass('slide').attr('id', i);
            $('<h2><a href="viewproduct.php?id='+data['Message'][i]['PRO_ID']+'">'+data['Message'][i]['PRO_NOM']+'</a></h2>').appendTo('#'+i).addClass('titre_caroussel');
           
            $.ajax({
                dataType: "json",
                url : 'http://10.176.128.178:8080/Produits/Images/'+data['Message'][i]['PRO_ID'],
                type: 'GET',
                error: function(resultat, statut, erreur){
                    console.log(erreur);
                 }}).then(data => {
                            console.log(data['Message'][0]['IMAPRO_URL']);
                            $('<img src="./img/imgSite/General/boutique/photoProduit/'+data['Message'][0]['IMAPRO_URL']+'" alt="Articles les plus vendus" />').appendTo('#'+i).addClass('img_caroussel');

             }              
             );
            


        }
    
    }
);

$.ajax({
    dataType: "json",
    url : 'http://88.181.246.174:8080/Produits/Ventes/4',
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
        for(let i=0; i<data['Message'].length; i++)
        {
           
                $('<div></div>').addClass('product').appendTo('.position_item').attr('id' ,"#a"+i );
                $('<div></div>').addClass('bann').appendTo("#a"+i).attr('id', "#b"+i);
                $('<h4>'+data['Message'][i]['PRO_NOM']+'</h4>').addClass('title_product').appendTo("#b"+i);

                 $.ajax({
                dataType: "json",
                url : 'http://88.181.246.174:8080/Produits/Images/'+data['Message'][i]['PRO_ID'],
                type: 'GET',
                error: function(resultat, statut, erreur){
                    console.log(erreur);
                 }}).then(data => {
                            console.log(data['Message'][0]['IMAPRO_URL']);
                            $('<img src="./img/imgSite/General/boutique/photoProduit/'+data['Message'][0]['IMAPRO_URL']+'" alt="Articles les plus vendus" />').appendTo('#a'+i);

             }              
             );
        }
    
    }
);

$.ajax({
    dataType: "json",
    url : 'http://88.181.246.174:8080/Produits/Ventes/4',
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
        console.log(data['Message'].length);
        for(let i=0; i<data['Message'].length; i++)
        {
            $('<div></div>').appendTo('.inner-wrapper2').addClass('slide2').attr('id', "t"+i);
            $('<h2><a href="viewproduct.php?id='+data['Message'][i]['PRO_ID']+'">'+data['Message'][i]['PRO_NOM']+'</a></h2>').appendTo('#t'+i).addClass('titre_caroussel');
           
            $.ajax({
                dataType: "json",
                url : 'http://88.181.246.174:8080/Produits/Images/'+data['Message'][i]['PRO_ID'],
                type: 'GET',
                error: function(resultat, statut, erreur){
                    console.log(erreur);
                 }}).then(data => {
                            console.log(data['Message'][0]['IMAPRO_URL']);
                            $('<img src="./img/imgSite/General/boutique/photoProduit/'+data['Message'][0]['IMAPRO_URL']+'" alt="Articles les plus vendus" />').appendTo('#t'+i).addClass('img_caroussel');

             }              
             );
            


        }
    
    }
);

    $.ajax({
    dataType: "json",
    url : 'http://88.181.246.174:8080/Produits/Ventes/4',
    type: 'GET',
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
        console.log(data['Message'].length);
        for(let i=0; i<data['Message'].length; i++)
        {
            $('<div></div>').appendTo('.inner-wrapper1').addClass('slide1').attr('id', "y"+i);
            $('<h2><a href="viewproduct.php?id='+data['Message'][i]['PRO_ID']+'">'+data['Message'][i]['PRO_NOM']+'</a></h2>').appendTo('#y'+i).addClass('titre_caroussel');
           
            $.ajax({
                dataType: "json",
                url : 'http://88.181.246.174:8080/Produits/Images/'+data['Message'][i]['PRO_ID'],
                type: 'GET',
                error: function(resultat, statut, erreur){
                    console.log(erreur);
                 }}).then(data => {
                            console.log(data['Message'][0]['IMAPRO_URL']);
                            $('<img src="./img/imgSite/General/boutique/photoProduit/'+data['Message'][0]['IMAPRO_URL']+'" alt="Articles les plus vendus" />').appendTo('#y'+i).addClass('img_caroussel');

             }              
             );
            


        }
    
    }
);
/*<!--<div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div>
        <div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div>
        <div class="product">
            <div class="bann">
                <h4 class="title_product">Pull cesi chrismath</h4>
                <img src="./img/imgSite/General/boutique/cart.svg"/>
            </div>
            <img src="./img/imgSite/General/boutique/photoProduit/pull.jpg">  
        </div> --> */