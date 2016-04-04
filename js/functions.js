$(document).ready(function() {
	// variables and functions to build page
	var all_pages = ['index','blog','portfolio','about',
		'music','photos','lab','resume'];
	buildNav(all_pages,true).attr('id', 'line_nav').appendTo('header.main');
	lineNav();
	buildFooter(all_pages);

	/* // scroll adjust position of main navigation
	var elementPosition = $('#line_nav').offset();
	$(window).scroll(function(){
	  if ( $(window).scrollTop() > elementPosition.top ) {
	    $('#line_nav').css({position: 'fixed', 'top': 0});
			$('header.main').css({'padding-bottom': $('#line_nav').height() });
	  } else {
      $('#line_nav').css('position' ,'relative');
			$('header.main').css('padding-bottom','0px');
	  }
	});*/

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
function buildNav(all_pages, main) {

	var cur_page = window.location.pathname.split("/").pop().split(".")[0],
			nav = $('<nav>'),
			num = all_pages.length

	if (main)		num=num-1;
	for (i=0; i<num; i++) {

		var title = (all_pages[i] == 'index') ? 'Home' : all_pages[i].capFirstLetter();
		var link = $('<a>').attr('href', all_pages[i] + '.html').html(title);
		if (all_pages[i] == cur_page) link.addClass('current');

		$(nav).append(link);
	}
	return nav;
}


/***** Line Nav hover effect ********************************************/
function lineNav() {

	var cur_page = window.location.pathname.split("/").pop().split(".")[0];
	if (cur_page != 'resume') {
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
}


/***** Build Footer *****************************************************/
function buildFooter(all_pages) {

	var cur_page = window.location.pathname.split("/").pop().split(".")[0];
	/*
	// site map
	var map = $('<div>').attr('id', 'site_map');
	map.append( $('<h6>').html('Site Map').append('<i class="fa fa-sitemap"></i>') );
	map.append( buildNav(all_pages) );
	*/
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
	var info = $('<div>').attr('id', 'site_info');
	info.append($('<h6>').html('Travis Leonard<i class="fa fa-copyright"></i>2015'));
	var link1 = '<a href="about.html#credits"><i class="fa fa-info-circle"></i></a>',
			link2 = '<a href="https://validator.w3.org/check?uri='+window.location.href+'">\
				<i class="fa fa-html5"></i></a>',
			link3 = '<a href="http://www.css-validator.org/validator?uri='+window.location.href+'">\
				<i class="fa fa-css3"></i></a>';
	info.append( $('<p>').html('Version 1: Plate &#8226; '
			+link1+' &#8226; '+link2+' &#8226; '+link3) );


	var top = '<div id="to_the_top"><i class="fa fa-arrow-circle-up"></i></div>';

	$('footer.main').empty().append( $('<section>').append(form).append(top).append(info) );

}
/***** Footer Navigation Select *****************************************/
function quickSiteNav(value) {
	if (value != '' && value != 'undefined') {
		$('main.main').fadeOut(300).delay(1000, function() {
			window.location.href= value;
		});
	}
}





/***** Load Posts  ******************************************************
function getPostsFromXML( ) {

}// end load posts from xml
*/

/***** Build SoundCloud  ************************************************/
function buildSoundCloud(id, color, visual, playlist) {

	var song_html = '<iframe scrolling="no" frameborder="no" width="100%"';
	song_html+= (playlist) ? ' height="450"' : ' height="166"';
	song_html+= 'src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/';
	song_html+= (playlist) ? 'playlists/'+id : 'tracks/'+id;
	if (color) song_html+= '&amp;color='+color;
	if (visual) song_html+= '&amp;visual=true&amp;buying=false&amp;sharing=false&amp;download=false&amp;liking=false';
	song_html+= '&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_reposts=false&amp;show_user=true&amp;visual=true"></iframe>';

	return song_html;

}


/***** Build YouTube ****************************************************/
function buildYouTube(id) {
	var video_html = '<iframe class="youtube_embed" width="100%" height="300" src="https://www.youtube.com/embed/' + id + '?color=white&showinfo=0&controls=1&iv_load_policy=3" frameborder="0" allowfullscreen></iframe>';

	return video_html;
}

/***** Time Conversion **************************************************/
/* Functions for working with Dates */
function convertDate(date) {
	//get date bits
	var date_arr = date.split("-"),
			date_month = convertMonthNum(date_arr[1].replace(/^0+/, '')),
			date_day = date_arr[2].split('T')[0].replace(/^0+/, ''),
			date_year = date_arr[0],
			date_time = date_arr[2].split('T')[1];
			date_hour = date_time.split(':')[0].replace(/^0+/, '');
			date_min = date_time.split(':')[1];
			date_ampm = ( date_hour - 12 < 0 ) ? "AM" : "PM";
			if (date_ampm == "PM") date_hour-=12;
	// build date string
	var date_html = date_month+" "+date_day+", "+date_year+" @ "
		+date_hour+":"+date_min+" "+date_ampm;
	return date_html;
}
var date_sort_desc = function (date1, date2) {
	if (date1['date'] > date2['date']) return -1;
	if (date1['date'] < date2['date']) return 1;
	return 0;
}
var date_sort_asc = function (date1, date2) {
	if (date1['date'] < date2['date']) return -1;
	if (date1['date'] > date2['date']) return 1;
	return 0;
}
function convertMonth(monthName) {
	var month = '';
	switch(monthName) {
		case 'January' : { month = '01'; break; }
		case 'February' : { month = '02'; break; }
		case 'March' : { month = '03'; break; }
		case 'April' : { month = '04'; break; }
		case 'May' : { month = '05'; break; }
		case 'June' : { month = '06'; break; }
		case 'July' : { month = '07'; break; }
		case 'August' : { month = '08'; break; }
		case 'September' : { month = '09'; break; }
		case 'October' : { month = '10'; break; }
		case 'November' : { month = '11'; break; }
		case 'December' : { month = '12'; break; }
	}
	return month;
}
function convertMonthNum(monthNum) {
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
function convertMonthNumShort(monthNum) {
	var month = '';
	switch(monthNum) {
		case 1 : { month = 'Jan'; break; }
		case 2 : { month = 'Feb'; break; }
		case 3 : { month = 'Mar'; break; }
		case 4 : { month = 'Apr'; break; }
		case 5 : { month = 'May'; break; }
		case 6 : { month = 'June'; break; }
		case 7 : { month = 'July'; break; }
		case 8 : { month = 'Aug'; break; }
		case 9 : { month = 'Sept'; break; }
		case 10 : { month = 'Oct'; break; }
		case 11 : { month = 'Nov'; break; }
		case 12 : { month = 'Dec'; break; }
	}
	return month;
}
