$(function() {

  loadTopTags(10);
  loadRecentPosts(5);

  replaceSvgImg()

  $('#elephant').draggable();
  /*
  mousedown(function() {
    dragged = false;
  }).mousemove(function() {
    dragged = true;
    $('#elephant').style.animationPlayState = "paused";
  }).mouseup(function(){
    $('#elephant').style.webkitAnimationPlayState = "running";
  });
  */

  // Last.fm tracks - dug plugin
  dug({
    endpoint: 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=traviest&api_key=1e4073c181a4694757f19048d0ca5228&limit=9&format=json',
    target: 'lastfmfeed',
    template: '{{#recenttracks}}'
        + '{{#track}}<article>'
          + '<img src="{{image.3.#text|dug.photo}}">'
          + '<a href="{{url}}">'
            + '<span>{{artist.#text}} - <i>{{name}}</i></span>'
            + '<em>{{date.#text|dug.ago}}</em>'
          + '</a>'
        + '</article>{{/track}}'
      + '{{/recenttracks}}' +
      //<h6>{{recenttracks.@attr.user}}&apos;s Recent Last.fm Tracks</h6>\
      '<small>{{recenttracks.@attr.total|dug.total}} Tracks Scrobbled</small>'
  });// end dug get last.fm

  // Instagram Feed Plugin
  var instaFeed = new Instafeed({
    get: 'user', userId: '357448',
    clientId: '2d460779eb934209b6384ae31961e55f',
    resolution: 'standard_resolution',
    limit: '9',
    template: '<article>'
      + '<a href="{{link}}">'
        + '<img src="{{model.user.profile_picture}}" />'
        + '<span class="instauser">{{model.user.username}}</span>'
        + '<span class="instacaption">{{caption}}</span>'
        + '<span class="instatime">{{model.created_time}}</span>'
      + '</a>'
      + '<img src="{{image}}" alt="{{caption}}" />'
      + '</article>',
    after: function() {
      $('.instatime').each(function(i,o) {
        var date = new Date(parseInt( $(this).text() ) * 1000);
        var newDate = convertMonthNum((date.getMonth()+1).toString()) + ' ' + date.getDate() + ', \'' + date.getFullYear().toString().substring(2,4);
        $(this).text(newDate);
      });
    }
  });
  instaFeed.run();

});// end doc ready




/***** Top Posts for Sidebar ********************************************/
function loadTopPosts(count) {

}


/***** Recent Posts for Sidebar *****************************************/
function loadRecentPosts(post_load_count) {
  var all_posts = [];
  $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function() {
      post = {
        'title': $(this).find('title').text(),
        'date': $(this).find('date').text(),
        'category': $(this).attr('category')
      }
      all_posts.push(post);
    });
  }).complete(function() {
    $('ul#sidebar_posts').empty();
    all_posts.sort(date_sort_desc);
    for (i = 0; i < post_load_count; i++) {
      // build text content
      var title = all_posts[i].title,
        date_arr = all_posts[i].date.split('-'),
        date_month = parseInt(date_arr[1].replace(/^0+/, '')),
        post_day = date_arr[2].split('T')[0].replace(/^0+/, ''),
        post_month = convertMonthNumShort(date_month);
      if (/-/i.test(title)) title = title.split('-')[1].trim();
      // build elements
      var post_link = $('<a>').attr('href','posts/post.html?').html(title),
        post_date = $('<span>').html(post_month + ' ' + post_day),
        post_item = $('<li>').append(post_date).append(post_link);
      $('ul#sidebar_posts').append(post_item);
    }
  });
}


/***** Top Tags for Sidebar *********************************************/
function loadTopTags(tag_load_count) {
  var all_tags = [];
  $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function(i) {
      $(this).find('tags').find('tag').each(function() {
        var this_tag = $(this).text().trim(), tag_found = false;
        for (var i = 0; i < all_tags.length; i++) {
          if (all_tags[i].name == this_tag) {
            all_tags[i].count++;
            tag_found = true;
          }
        }
        if (!tag_found) all_tags.push({'name': this_tag, 'count': 1});
      });
    });
  }).complete(function() {
    $('ul#sidebar_tags').empty();
    all_tags.sort(sortCount);
    var tag_html = '';
    for (i = 0; i < tag_load_count; i++) {
      var tag_name = all_tags[i].name;
      tag_html += '<li><a href="blog.html?tag=' + tag_name.replace(/ /g,'_')
        + '">' + tag_name + '</a> - ' + all_tags[i].count + '</li>';
    }
    $('ul#sidebar_tags').append(tag_html);
  });
}


/***** Replace all SVG images with inline SVG ***************************/
function replaceSvgImg() {
  $('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if(typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if(typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass+' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');
  });
}
