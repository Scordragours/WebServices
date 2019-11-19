

	$(document).ready(function(){
        $("#hamburger-sidebar").hide();
        $(".burger").click(function(){
            $("#hamburger-sidebar").slideToggle();
        });
    });
   
    $(document).ready(function(){
      $('.burger').click(function(){
		$(this).toggleClass('open');
		$('#overlay').show();
      });
	});
	
	$(document).ready(function(){
		$('#overlay').click(function(){
			$("#hamburger-sidebar").hide();
			$(this).hide();
		});
	});

	$(document).ready(function(){
		$('#btn_search').click(function(){
			$('#search').toggle("slide");
		});
	});
