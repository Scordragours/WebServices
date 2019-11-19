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

function dl(id)
{
    id = id.replace("del", "");

    if(token != null) {
        //Supprimer du panier
        $.ajax({
            dataType: "json",
            url: IPNODE + '/Panier/',
            type: 'GET',
            headers: {'token': token},
            error: function (resultat, statut, erreur) {
                console.log(erreur);
            }
        }).then(data => {
            console.log(data['Message'][id]['PRO_ID']);
            $.ajax({
                dataType: "json",
                url: IPNODE + '/Panier/' + data['Message'][id]['PRO_ID'],
                type: 'DELETE',
                headers: {'token': token},
                success: function (message) {
                    console.log(message);

                    let stbefore = document.getElementById("st" + id).innerText.replace('€', '').replace("Sous-total : ", "");
                    document.getElementById("tt").innerText = ((document.getElementById("tt").innerText.replace('€', '') - stbefore).toFixed(2)) + '€';

                    document.getElementById("cont" + id).outerHTML = "";
                    let rows = document.getElementsByClassName("ligne_panier");

                    Array.prototype.forEach.call(rows, e =>
                    {
                        let ide = e.id.replace("cont", "");
                        if (ide > id) {
                            document.getElementById("inc" + ide).id = "inc" + (ide - 1);
                            document.getElementById("dec" + ide).id = "dec" + (ide - 1);
                            document.getElementById("st" + ide).id = "st" + (ide - 1);
                            document.getElementById("del" + ide).id = "del" + (ide - 1);
                            document.getElementById("qty" + ide).setAttribute("name", "quantity" + (ide - 1));
                            document.getElementById("qty" + ide).id = "qty" + (ide - 1);
                            e.id = "cont" + (ide - 1);
                        }
                    });
                },
                error: function (resultat, statut, erreur) {
                    console.log(erreur);
                }
            });
        });
    }
}

function rc(id)
{
    var qtyDirection = "1";

    if(id.substr(0,3) == "dec")
    {
        qtyDirection = "-1";
    }

    id = id.replace("inc", "").replace("dec", "");

    var inputName = 'input[name="quantity'+id+'"]';
    var buttonName = '#dec'+id;

    var currentQty = $(inputName).val();

    var newQty = 0;

    if (qtyDirection == "1") {
        newQty = parseInt(currentQty) + 1;
    }
    else if (qtyDirection == "-1") {
        newQty = parseInt(currentQty) - 1;
    }

    if (newQty == 1) {
        $(buttonName).attr("disabled", "disabled");
    }

    if (newQty > 1) {
        $(buttonName).removeAttr("disabled");
    }

    if (newQty > 0) {
        newQty = newQty.toString();
        $(inputName).val(newQty);

        if(token != null)
        {
            //Modifier nombre dans panier
            $.ajax({
                dataType: "json",
                url : IPNODE+'/Panier/',
                type: 'GET',
                headers: {'token': token},
                error: function(resultat, statut, erreur){
                    console.log(erreur);
                }
            }).then(data => {
                console.log(data['Message'][id]['PRO_ID']);
                $.ajax({
                    dataType: "json",
                    url : IPNODE+'/Panier/'+data['Message'][id]['PRO_ID'],
                    type: 'PUT',
                    data: {Quantite: newQty},
                    headers: {'token': token},
                    success: function(message){
                        console.log(message);
                        let stbefore = document.getElementById("st"+id).innerText.replace('€', '').replace("Sous-total : ", "");
                        document.getElementById("st"+id).innerText = "Sous-total : " + (data['Message'][id]['PRO_PRIX']*newQty).toFixed(2) +"€";
                        document.getElementById("tt").innerText = ((document.getElementById("tt").innerText.replace('€', '')-stbefore+(data['Message'][id]['PRO_PRIX']*newQty)).toFixed(2))+'€';
                    },
                    error: function(resultat, statut, erreur){
                        console.log(erreur);
                    }
                });
            });
        }
        console.log(newQty);
    }
    else {
        $(inputName).val("1");
    }
}