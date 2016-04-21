$(function() {

	// variables and functions to build page
	var main_pages = ['index','blog','portfolio','about',
				'music','photos','lab'],
			alt_pages = ['resume'],
			sub_pages = ['all_posts','tags','categories','archives'],
			cur_page = window.location.pathname.split("/").pop().split(".")[0],
			pages_info = {main_pages, alt_pages, sub_pages, cur_page};

	buildNav(pages_info).attr('id', 'line_nav').appendTo('header');
	lineNav(pages_info);
	buildFooter(pages_info);
	setupThemes(pages_info);

	// set up firefly images on header
	var fireflyPics = ['imgs/star1.png', 'imgs/star2.png', 'imgs/star3.png', 'imgs/star5.png', 'imgs/star_1.png',  'imgs/star_5.png'];
	if (sub_pages.indexOf(cur_page) >= 0) {
		for (x=0; x < fireflyPics.length; x++)
			fireflyPics[x] = '../'+fireflyPics[x];
	}
	$.firefly({ target : 'header', total : 50, images : fireflyPics });

	/*
	// scroll adjust position of main navigation
	var elementPosition = $('#line_nav').offset();
	$(window).scroll(function(){
	  if ( $(window).scrollTop() > elementPosition.top ) {
	    $('#line_nav').css({position: 'fixed', 'top': 0});
			$('header').css({'padding-bottom': $('#line_nav').height() });
	  } else {
      $('#line_nav').css('position' ,'relative');
			$('header').css('padding-bottom','0px');
	  }
	});
	*/

	// scroll body to top on click
	$("#to_the_top").click(function () {
		$("body,html").animate({scrollTop: 0}, 750); return false;
	});

});// end document ready


/***** Set Up Icon and Click Function for Changing Themes ***************/
function setupThemes(all_pages) {

	var theme = $('<div>').attr('id','settings_icons')
				.append( $('<span>') )
				.append( $('<span>') );
				//.addClass('ion-android-settings');
	$('header').append(theme.addClass('color-theme'));

	theme.click(function() {

		var	icon = $(this), theme_css = $('#theme'),
			is_sub_page = (all_pages.sub_pages.indexOf(all_pages.cur_page) >= 0) ? true : false;

		if (icon.hasClass('white-theme')) {
			if (is_sub_page) {
				theme_css.attr('href', '../css/white_theme.css');
				console.log('change to white theme - from sub page');
			} else {
				theme_css.attr('href', 'css/white_theme.css');
				console.log('change to white theme - from main page');
			}
			icon.removeClass('white-theme').addClass('color-theme');
		} else if (icon.hasClass('color-theme')) {
			if (is_sub_page) {
				theme_css.attr('href', '../css/color_theme.css');
				console.log('change to color theme - from sub page');
			} else {
				theme_css.attr('href', 'css/color_theme.css');
				console.log('change to color theme - from main page');
			}
			icon.removeClass('color-theme').addClass('white-theme');
		}
	});
}


/***** Build Navigation *************************************************/
function buildNav(all_pages) {

	// currently is strict to main pages
	var nav = $('<nav>'), nav_pages = all_pages.main_pages;

	for (i=0; i<nav_pages.length; i++) {
		var page = nav_pages[i],
				page_name = (page=='index')? 'Home' : page.capFirstLetter(),
				page_link = $('<a>').html(page_name);

		// vary links based on location in heiarchy
		if (all_pages.sub_pages.indexOf(all_pages.cur_page) >= 0) {
			if (all_pages.sub_pages.indexOf(page) >= 0)
				page_link.attr('href',page+'.html');
			else page_link.attr('href','../'+page+'.html');
		} else {
			if (all_pages.sub_pages.indexOf(page) >= 0)
				page_link.attr('href','posts/'+page+'.html');
			else page_link.attr('href',page+'.html');
		}
		// check for current page
		if (page==all_pages.cur_page) page_link.addClass('current');
		// add to nav
		nav.append(page_link);

	}
	return nav;
}


/***** Line Nav hover effect ********************************************/
function lineNav(all_pages) {

	if (all_pages.main_pages.indexOf(all_pages.cur_page) >= 0) {
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

	/*
	// site map
	var map = $('<div>').attr('id', 'site_map');
	map.append( $('<h6>').html('Site Map').append('<i class="fa fa-sitemap"></i>') );
	map.append( build Nav (all_pages) );
	*/

	/***** Quick Page Nav *****/
	var pages = $.merge(all_pages.main_pages, all_pages.alt_pages);
	pages = $.merge(pages,all_pages.sub_pages),
			form = $('<form>').attr('id','quick_links');
	form.append( $('<h6>').html('Quick Navigation') );
	var select = $('<select>').attr('name','page').attr('size',1)
			.attr('onchange', 'quickSiteNav(this.value)');
	for (i = 0; i < pages.length; i++) {

		var page = pages[i], option = $('<option>'), title;
		if (page == 'index') title = 'Home';
		else if (page == 'all_posts') title = 'All Posts';
		else title = page.capFirstLetter();
		option.html(title);
		// vary links based on location in heiarchy
		if (all_pages.sub_pages.indexOf(all_pages.cur_page) >= 0) {
			if (all_pages.sub_pages.indexOf(page) >= 0)
				option.attr('value',page+'.html');
			else option.attr('value','../'+page+'.html');
		} else {
			if (all_pages.sub_pages.indexOf(page) >= 0)
				option.attr('value','posts/'+page+'.html');
			else option.attr('value',page+'.html');
		}
		if (page==all_pages.cur_page == page) option.attr('selected','selected');
		select.append(option);
	}
	form.append(select);

	/***** Site Info *****/
	var url = window.location.href,
		link1 = '<a href="about.html#credits">' + '<i class="ion-information-circled"></i></a>',
		link2 = '<a href="https://validator.w3.org/check?uri='+url+'">' + '<i class="ion-social-html5"></i></a>',
		link3 = '<a href="http://www.css-validator.org/validator?uri='+url+'">' +	'<i class="ion-social-css3"></i></a>',
		all_links = link1 + ' &#8226; ' + link2 + ' &#8226; ' + link3;

	var site_info = $('<div>').attr('id', 'site_info'),
		name = $('<h6>').html('Travis Leonard<i>&copy;</i>2015'),
		info = $('<p>').html('Version 1: Plate &#8226; ' + all_links);

	site_info.append( name ).append( info );

	/***** Top Link *****/
	var top = '<div id="to_the_top"><i class="fa fa-arrow-circle-up"></i></div>';

	/***** add info to footer *****/
	$('footer').empty().append( $('<section>').append(form).append(top).append(site_info) );
}


/***** Footer Navigation Select *****/
function quickSiteNav(value) {
	if (value != '' && value != 'undefined') {
		$('main').fadeOut(300).delay(1000, function() {
			window.location.href= value;
		});
	}
}


/***** Build Object of Post Info ****************************************/
function buildPostObj(post) {

  var post_tags = [];
  post.find('tags').find('tag').each(function() {
    post_tags.push( $(this).text() );
  });

  var post_links = [];
  post.find('links').find('link').each(function() {
    post_links.push({
			'link_text' : $(this).attr('text'), 'source' : $(this).attr('source')
		});
  });

  var postObj = {
    'category' : post.attr('category'),
    'title' : post.find('title').text(),
    'date' : post.find('date').text(),
    'embed' : post.find('embeded').text(),
    'embed_type' : post.find('embeded').attr('type'),
    'content' : post.find('content').html(),
    'tags' : post_tags,
    'links' : post_links
  }
  return postObj;
}


/***** Build HTML of Post ***********************************************/
/* accepts post object and creates necessary html object to display */
/****/
function buildPostHTML(post,is_sub_page) {

	var category		= post.category,
			title				= post.title,
			date 				= post.date,
			embed				= post.embed,
			embed_type	= post.embed_type,
			content			= post.content,
			tags				= post.tags,
			links				= post.links;

	console.log(title+ ' '+date);
	// Start Post
	var post_html = $('<article>').addClass('post').addClass(category);
	// Category
	var cat_link = $('<a>').html(category.replace(/_/g," ").capFirstLetter());
	if(is_sub_page) cat_link.attr('href','../blog.html?category='+category);
	else cat_link.attr('href', 'blog.html?category='+category);
	post_html.append( $('<small>').html(cat_link) );
	// Date
	var date_html = convertDate(date);
	post_html.append( $('<time>').attr('datetime',date).html(date_html) );
	// Tags
	if (tags != '' && tags != undefined && tags.length > 0) {
		tags.sort();
		var post_tags = $('<ul>').addClass('post_tags');
		for (var x = 0; x < tags.length; x++) {
			var link = $('<a>').html(tags[x].capFirstLetter()),
					link_url = 'blog.html?tag='+tags[x].replace(/ /g,'_');
			if(is_sub_page) link.attr('href','../'+link_url);
			else link.attr('href',link_url);
			post_tags.append( $('<li>').append(link) );
		}
		post_html.append(post_tags);
	}
	// Title
	if (title != '' && title != undefined)
		post_html.append( $('<h3>').html( title ) );
	// Embeded Elements
	switch (embed_type) {
		case 'soundcloud':
			var post_embed = buildSoundCloud(embed, false, false);
			post_html.append( $('<section>').append(post_embed) );
			break;
		case 'soundcloud_playlist':
			var post_embed = buildSoundCloud(embed, true, true);
			post_html.append( $('<section>').append(post_embed) );
			break;
		case 'youtube':
			post_html.append( $('<section>').append(buildYouTube(embed)) );
			break;
		case 'vevo':
			post_html.append( $('<section>').append(buildVevo(embed)) );
			break;
		case 'photo':
			var img = $('<img>').attr('alt',title);
			if(is_sub_page) img.attr('src','../posts/'+embed);
			else img.attr('src','posts/'+embed);
			post_html.append( $('<section>').append(img) );
			break;
		//default:
	}
	// Content
	if (content) {
		post_html.append( $('<article>').html(content) );
	}


	// star rating **** work in progress ****
	var stars = $('<ul>').addClass('star_rating');
	for (x=0; x<5; x++) stars.append( $('<li>').addClass('fa fa-star') );
	post_html.append(stars);


	// Links
	if (links != undefined && links.length > 0) {
		var post_links = $('<ul>').addClass('post_links');
		for (var x = 0; x < links.length; x++) {
			var the_link = '<a href="' + links[x]['source'] + '" target="_blank">'
						+ links[x]['link_text'] + '</a>';
			post_links.append( $('<li>').append(the_link) );
		}
		post_html.append(post_links);
	}

	return post_html;
}


/***** Build SoundCloud  ************************************************/
function buildSoundCloud(id, visual, playlist) {
	var song_frame = $('<iframe>').attr({
		scrolling : 'no', frameborder : 'no',
		width : '100%', height : ((playlist) ? '450px':'166px')
	});
	var song_src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/'
		+ ((playlist) ? 'playlists/'+id : 'tracks/'+id)
		+'&amp;color=1E739D&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_reposts=false';
	if (visual) {
		song_src+='&amp;visual=true&amp;show_user=false&amp;buying=false&amp;sharing=false&amp;download=false&amp;liking=false';
	}
	return song_frame.attr('src',song_src);
}

/***** Build YouTube ****************************************************/
function buildYouTube(id) {
	var video_frame = $('<iframe>').attr({
		width : '100%', height : '360',
		src : 'https://www.youtube.com/embed/' + id + '?color=white&showinfo=0&controls=1&iv_load_policy=3',
		frameborder : 0,
		allowfullscreen : 'allowfullscreen'
	}).addClass('youtube_embed');
	return video_frame;
}

/***** Build Vevo *******************************************************/
function buildVevo(id) {
	var video_frame = $('<iframe>').attr({
		width : '100%', height : '360',
		src : 'http://cache.vevo.com/assets/html/embed.html?video=' + id + '&autoplay=0',
		frameborder : 0,
		allowfullscreen : 'allowfullscreen'
	});
	return video_frame;
}



// general function to capitalize first letter
String.prototype.capFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capAllWords = function() {
	if (this.indexOf(' ') >= 0) {
		var allWords = this.split(' '), capPhrase = [];
		console.log(allWords.length);
		for (i = 0; i<allWords.length; i++) {
			capPhrase.push( allWords[i].trim().capFirstLetter() );
		}
		return capPhrase.join(' ');
	} else {
		return this.capFirstLetter();
	}
}

/***** Post Object Sort Functions ***************************************/
function sortTitle(a,b) {
	if (a.title < b.title) return -1;
	else if (a.title > b.title) return 1;
	else return 0;
}
function sortName(a,b) {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  else if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
}
function sortCount(a,b) {
  if (a.count > b.count) return -1;
  else if (a.count < b.count) return 1;
  else {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    else return 0;
  }
}
function archiveDateSort(a,b) {
  if (a.year < b.year) return 1;
  else if (a.year > b.year) return -1;
  else if (a.year == b.year) {
    if (a.month < b.month) return 1;
    else if (a.month > b.month) return -1;
    else if (a.month == b.month) return 0;
  }
}
var date_sort_desc = function (date1, date2) {
	if (date1.date > date2.date) return -1;
	else if (date1.date < date2.date) return 1;
	return 0;
}
var date_sort_asc = function (date1, date2) {
	if (date1.date > date2.date) return 1;
	else if (date1.date < date2.date) return -1;
	return 0;
}


/***** Time Conversion **************************************************/
function convertDate(date) {
	//get date bits
	var date_arr = date.split("-"),
			date_month = convertMonthNum(date_arr[1].replace(/^0+/, '')),
			date_day = date_arr[2].split('T')[0].replace(/^0+/, ''),
			date_year = date_arr[0],
			date_time = date_arr[2].split('T')[1];
			date_hour = date_time.split(':')[0].replace(/^0+/, '');
			date_min = date_time.split(':')[1];
			date_ampm = ( date_hour - 12 < 0 ) ?'AM' : 'PM';
	// build date string	var dteNow = new Date();
	if (date_hour > 12) date_hour-=12;
	var currDate = new Date();
	var date_html = date_month+" "+date_day;
	if (date_year != currDate.getFullYear()) date_html += ', ' + date_year;
	date_html += ' @ ' + date_hour + ':' + date_min + ' ' + date_ampm;
	return date_html;
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
