$(document).ready(function() {

	lineNav();

	// scroll body to top on click
	$("#to_the_top").click(function () {
		$("body,html").animate({scrollTop: 0}, 500);
		return false;
	});
	
	
	$(".sidebar_toggle").click(function() {
		if ($(this).hasClass('hidden_bar')) {
			$(this).removeClass('hidden_bar');
			$("#sidebar").fadeIn(1000);
		}
		else {
			$(this).addClass('hidden_bar');
			$("#sidebar").fadeOut(1000);
			$("#main").css("width",'100%');
		}
	});
	
});


/* Line Nav hover effect */
function lineNav() {	
	$("#lineNav").append("<div id='magic_line'><span></span></div>");
	    
	var $magicLine = $("#magic_line");
	$magicLine
		.width($("li.current").width())
		.css("left", $("li.current").position().left)
		.data("origLeft", $magicLine.position().left)
		.data("origWidth", $magicLine.width());
		        
	$("#lineNav li").hover(function() {	
		$magicLine.stop().animate({left: $(this).position().left, width: $(this).width()});
	}, function() {
		$magicLine.stop().animate({left: $("li.current").position().left, width: $("li.current").width()});
	});
}