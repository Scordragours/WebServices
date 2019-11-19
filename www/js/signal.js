var rows = [];
var doc= new jsPDF('p','pt');
var columns = "Noms";
$.ajax({
    dataType: "json",
    url : 'http://10.176.128.178:8080/Activites/Inscription/9',
    type: 'GET',
    headers : {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBZHJlc3NNYWlsIjoiYXJ0aHVyLmxlY3Jhc0B2aWFjZXNpLmZyIiwiTW90RGVQYXNzZSI6IjEyMzQiLCJTdGF0dXMiOjIsImlhdCI6MTU3NDA2NzkwNiwiZXhwIjoxNTc0MTU0MzA2fQ.4dsxNhUnQaEkAPmRFHdT9qD4HMX_X9FisX3pnoXq-F8"},
    error: function(resultat, statut, erreur){
        console.log(erreur);
    }}).then(data => {
            console.log(data['Message'][1]['Noms']);
            $('.pdf').click(function(){
                    for(let i=0; i<data['Message'].length; i++)
                    {
                        rows[i] =data['Message'][i]['Noms'];
                        
                    }
                    console.log(rows);
                    doc.fromHTML($('<h1>Liste des membres inscrit :</h1>').html(), 250, 15, {
                        'width': 170
                    });
                    for(let j=0; j<rows.length; j++)
                    {
                    doc.fromHTML($('<p>'+rows[j]+'</p>').html(), 15, 30+j*10, {
                        'width': 170
                    });
                }
                    
                    
                   doc.save('membre.pdf');
            });
       
        
    });