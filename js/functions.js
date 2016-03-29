$(document).ready(function() {
	// variables and functions to build page
	var all_pages = ['index','blog','portfolio','about','music','photos','lab'];
	buildNav(all_pages).attr('id', 'line_nav').appendTo('header.main');
	lineNav();
	buildFooter(all_pages);

	// scroll adjust position of main navigation
	var elementPosition = $('#line_nav').offset();
	$(window).scroll(function(){
	  if ( $(window).scrollTop() > elementPosition.top ) {
	    $('#line_nav').css({position: 'fixed', 'top': 0});
			$('header.main').css({'padding-bottom': $('#line_nav').height() });

	  } else {
      $('#line_nav').css('position','relative');
			$('header.main').css('padding-bottom','0px');
	  }
	});

	/* scroll body to top on click */
	$("#to_the_top i").click(function () {
		$("body,html").animate({scrollTop: 0}, 750);
		return false;
	});

});

// general function to capitalize first letter
String.prototype.capFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/***** Build Navigation *************************************************/
function buildNav(all_pages) {

	var cur_page = window.location.pathname.split("/").pop().split(".")[0];
	var nav = $('<nav>');

	for (i=0; i<all_pages.length; i++) {

		var title = (all_pages[i] == 'index') ? 'Home' : all_pages[i].capFirstLetter();
		var link = $('<a>').attr('href', all_pages[i] + '.html').html(title);
		if (all_pages[i] == cur_page) link.addClass('current');

		$(nav).append(link);
	}
	return nav;
}

/***** Line Nav hover effect ********************************************/
function lineNav() {
	$("#line_nav").append("<div id='magic_line'></div>");

	var $magicLine = $("#magic_line");
	$magicLine.width($(".current").width())
		.css("left", $(".current").position().left)
		.data("origLeft", $magicLine.position().left)
		.data("origWidth", $magicLine.width());

	$("#line_nav a").hover(function() {
		$magicLine.stop().animate({left: $(this).position().left, width: $(this).width()});
	}, function() {
		$magicLine.stop().animate({left: $(".current").position().left, width: $(".current").width()});
	});
}

/***** Build Footer *****************************************************/
function buildFooter(all_pages) {

	var cur_page = window.location.pathname.split("/").pop().split(".")[0];

	// site map
	var map = $('<section>').attr('id', 'site_map');
	map.append( $('<h6>').html('Site Map').append('<i class="fa fa-sitemap"></i>') );
	map.append( buildNav(all_pages) );

	// main page quick link
	var form = $('<form>').attr('id','quick_links').attr('method','post');
	form.append( $('<h6>').html('Quick Navigation') );
	var select = $('<select>').attr('name','page').attr('size',1)
			.attr('onchange', 'quickSiteNav(this.value)');
	for (var i = 0; i < all_pages.length; i++) {
		var title = (all_pages[i] == 'index') ? 'Home' : all_pages[i].capFirstLetter();
		var option = $('<option>').attr('value', all_pages[i]+'.html').html(title);
		if (cur_page == all_pages[i]) option.attr('selected','selected');
		select.append(option);
	}
	form.append(select);

	// site info
	var info = $('<section>').attr('id', 'site_info');
	info.append($('<h6>').html('Travis Leonard<i class="fa fa-copyright"></i>2015'));
	var link1 = '<a href="about.html#credits"><i class="fa fa-info-circle"></i></a>',
			link2 = '<a href="https://validator.w3.org/check?uri='+window.location.href+'">\
				<i class="fa fa-html5"></i></a>',
			link3 = '<a href="http://www.css-validator.org/validator?uri='+window.location.href+'">\
				<i class="fa fa-css3"></i></a>';
	info.append( $('<p>').html('Version 1: Plate &#8226; '
			+link1+' &#8226; '+link2+' &#8226; '+link3) );


	$('footer.main').empty().append(map).append(form).append(info);

}


/***** Footer Navigation Select *****************************************/
function quickSiteNav(value) {
	if (value != '' && value != 'undefined') {
		$('main.main').fadeOut(300).delay(1000, function() {
			window.location.href= value;
		});
	}
}


/***** Time Conversion **************************************************/








/***** Load Posts  ******************************************************/
function loadPostsArray() {
/*
	var allPosts = new Array();
	var getPosts = $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function(i) {

		});
  });
	getPosts.complete(function() {
		return allPosts;
	});
*/
}


/***** Build SoundCloud  ************************************************/
function buildSoundCloud(id, color, visual, playlist) {

	var song_html = '<iframe scrolling="no" frameborder="no" width="100%"';
	song_html+= (playlist) ? ' height="400"' : ' height="166"';
	song_html+= 'src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/';
	song_html+= (playlist) ? 'playlists/'+id : 'tracks/'+id;
	if (color) song_html+= '&amp;color='+color;
	if (visual) song_html+= '&amp;visual=true';
	song_html+= '&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=true&amp;"></iframe>';

	return song_html;
}


/***** Build YouTube ****************************************************/
function buildYouTube(id) {
	var video_html = '<iframe class="youtube_embed" width="100%" height="300" src="https://www.youtube.com/embed/' + id + '?color=white&showinfo=0&controls=1&iv_load_policy=3" frameborder="0" allowfullscreen></iframe>';

	return video_html;
}
/*


//soundcloud playlist album
<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/207287579&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>


// soundcloud playlist soundwave
<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/207287579&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>


song album<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/250467239&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>

// youtube standards vs alt
<iframe width="1280" height="720" src="https://www.youtube.com/embed/JLASUu1Ekqg" frameborder="0" allowfullscreen></iframe>

$song_build = "<iframe class=\"youtube_embed\" width=\"100%\" height=\"300\" src=\"https://www.youtube.com/embed/{$id}?color=white&showinfo=0&controls=1&iv_load_policy=3\" frameborder=\"0\" allowfullscreen></iframe>";

*/






/* Comparison functions that results in dates being sorted ***********************************/
var date_sort_desc = function (date1, date2) {
	var dateBits1 = date1['date'].split(" "),
		dateBits2 = date2['date'].split(" "),
		date1nums = dateBits1[3] + '-' + convertMonth(dateBits1[2]) + '-' + dateBits1[1] + '-' + dateBits1[4].replace(/\:/g,'-'),
		date2nums = dateBits2[3] + '-' + convertMonth(dateBits2[2]) + '-' + dateBits2[1] + '-' + dateBits2[4].replace(/\:/g,'-');
	if (date1nums > date2nums) return -1;
	if (date1nums < date2nums) return 1;
	return 0;
}
var date_sort_asc = function (date1, date2) {
	var dateBits1 = date1['date'].split(" "),
		dateBits2 = date2['date'].split(" "),
		date1nums = dateBits1[3] + '-' + convertMonth(dateBits1[2]) + '-' + dateBits1[1] + '-' + dateBits1[4].replace(/\:/g,'-'),
		date2nums = dateBits2[3] + '-' + convertMonth(dateBits2[2]) + '-' + dateBits2[1] + '-' + dateBits2[4].replace(/\:/g,'-');
	if (date1nums < date2nums) return -1;
	if (date1nums > date2nums) return 1;
	return 0;
}
function convertMonth(monthName) {
	var month = '';
	switch(monthName) {
		case 'Jan' : { month = '01'; break; }
		case 'Feb' : { month = '02'; break; }
		case 'Mar' : { month = '03'; break; }
		case 'Apr' : { month = '04'; break; }
		case 'May' : { month = '05'; break; }
		case 'Jun' : { month = '06'; break; }
		case 'Jul' : { month = '07'; break; }
		case 'Aug' : { month = '08'; break; }
		case 'Sep' : { month = '09'; break; }
		case 'Oct' : { month = '10'; break; }
		case 'Nov' : { month = '11'; break; }
		case 'Dec' : { month = '12'; break; }
	}
	return month;
}
function convertMonthNum(monthNum) {
	monthNum = monthNum.replace(/^0+/, '');
	var month = '';
	switch(monthNum) {
		case '1' : { month = 'January'; break; }
		case '2': { month = 'February'; break; }
		case '3' : { month = 'March'; break; }
		case '4' : { month = 'April'; break; }
		case '5' : { month = 'May'; break; }
		case '6' : { month = 'June'; break; }
		case '7' : { month = 'July'; break; }
		case '8' : { month = 'August'; break; }
		case '9' : { month = 'September'; break; }
		case '10' : { month = 'October'; break; }
		case '11' : { month = 'November'; break; }
		case '12' : { month = 'December'; break; }
	}
	return month;
}
