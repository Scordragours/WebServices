$(function() {

  var inWrap = $('.inner-wrapper');

  $('.prev').on('click', function() {

    inWrap.animate({left: '0%'}, 300, function(){

      inWrap.css('left', '-100%');

      $('.slide').first().before($('.slide').last());

    });


  });



  $('.next').on('click', function() {

    inWrap.animate({left: '-200%'}, 300, function(){

      inWrap.css('left', '-100%');

      $('.slide').last().after($('.slide').first());

    });


  });


})

//Deuxieme caroussel

$(function() {

  var inWrap = $('.inner-wrapper1');

  $('.prev1').on('click', function() {

    inWrap.animate({left: '0%'}, 300, function(){

      inWrap.css('left', '-100%');

      $('.slide1').first().before($('.slide1').last());

    });


  });



  $('.next1').on('click', function() {

    inWrap.animate({left: '-200%'}, 300, function(){

      inWrap.css('left', '-100%');

      $('.slide1').last().after($('.slide1').first());

    });


  });


})

//Troisieme caroussel 
$(function() {

  var inWrap = $('.inner-wrapper2');

  $('.prev2').on('click', function() {

    inWrap.animate({left: '0%'}, 300, function(){

      inWrap.css('left', '-100%');

      $('.slide2').first().before($('.slide2').last());

    });


  });



  $('.next2').on('click', function() {

    inWrap.animate({left: '-200%'}, 300, function(){

      inWrap.css('left', '-100%');

      $('.slide2').last().after($('.slide2').first());

    });


  });


})