const IPNODE = 'http://10.176.128.178:8080';

/*GETTOKEN*/
let token;
$.ajax({
    dataType: "html",
    url : './get_token.php',
    success: function(data, statut){
        token = data;
    },
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }
});
/*----*/

$.ajax({
dataType: "json",
url : 'http://10.176.128.178:8080/Activites/Tous/0/100',
type: 'GET',
error: function(resultat, statut, erreur){
    console.log(erreur);
}}).then(data => {
    console.log(data['Message'][0]['MAN_ID']);
    console.log(data['Message'].length);
    for(let i=0; i<data['Message'].length; i++)
    {
        $('<div></div>').appendTo('.events').addClass('event1').attr('id', "cont"+i);
        $('<h1><a href="activite.php">'+data['Message'][i]['MAN_TITRE']+'</a></h1>').appendTo('#cont'+i).addClass('event_title');
        $('<div></div>').appendTo('#cont'+i).addClass('activity_list').attr('id', "subcont"+i);
        $('<img src="img/imgManifest/'+data['Message'][i]['IMA_URL']+'"/>').addClass('main_picture_event').appendTo('#subcont'+i);
        $('<p><a href="activite.php">'+data['Message'][i]['MAN_DESCRIPTION']+'</a></p>').appendTo('#subcont'+i).addClass('text_description');
        $('<h4>'+data['Message'][i]['MAN_DATE'].replace("T", " ").substr(0, 16)+'</h4>').appendTo('#subcont'+i).addClass('date_hour');
        $('<a href="'+"#man"+i+'"><img src="./img/imgSite/General/inscription_event.png"/></a>').addClass('add').appendTo('#subcont'+i).attr('id','man'+data['Message'][i]['MAN_ID']).attr('onclick', 'ic(this.id)');
        $('<h3>'+data['Message'][i]['MAN_PRIX']+'€</h3>').appendTo('#subcont'+i).addClass('prix_manif');
    }
});

function ic(id)
{
    id = id.replace("man", "");

    $.ajax({
        dataType: "json",
        url : "http://10.176.128.178:8080/Activites/Inscription/"+id,
        type: 'POST',
        headers: {'token': token},
        error: function(resultat, statut, erreur){
            console.log(erreur);
        }}).then(data => {
            alert(data['Message']);
        }
    );
}