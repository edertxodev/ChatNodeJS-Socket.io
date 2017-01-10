$(function(){
  /**
    * Muestra el enlace 'inicio' al hacer scrolldown
    */
  $(window).scroll(function(){
    if($(this).scrollTop() > 120){
      $('#inicio').fadeIn();
    } else {
      $('#inicio').fadeOut();
    }
  });

  $('#inicio').click(function () {
    $('body').animate({
      scrollTop: 0
    }, 800);
    return false;
  });

});
