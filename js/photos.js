$(document).ready(function() {


  $('#sort_opt').hover(function() {
    $(this).find('span').fadeIn(150);
  }, function() {
    clearTimeout(timer);
    var timer = setTimeout(function() {$('#sort_opt').find('span').fadeOut(250);}, 500);
  });

  $('#sort_opt').click(function() {
    if ($(this).hasClass('sort_alpha')) {
      $(this).find('span').hide().delay(250).text('count').fadeIn(250);
      $(this).addClass('sort_count').removeClass('sort_alpha')
        .find('small').animate({'left': '11px'}, 250);

      $('#alpha_sort').fadeOut(250, function() {
        $(this).css('display','none'|'opacity',0);
        $('#count_sort').css('display','block').animate({'opacity': 1}, 500);
      });
    } else if ($(this).hasClass('sort_count')) {
      $(this).find('span').hide().delay(250).text('alphabetical').fadeIn(250);
      $(this).addClass('sort_alpha').removeClass('sort_count')
        .find('small').animate({'left': '1px'}, 250);

      $('#count_sort').fadeOut(250, function() {
        $(this).css('display','none'|'opacity',0);
        $('#alpha_sort').css('display','block').animate({'opacity': 1}, 500);
      });
    }
  });
});
