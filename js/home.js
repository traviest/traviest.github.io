$(function() {

  loadFeatured(4);
  loadTopTags(10);
  loadRecentPosts(5);

  $(window).resize(function() {
    $( "#sizer" ).html( $(window).width() );
  });
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
    clientId: '2d460779eb934209b6384ae31961e55f',
    get: 'user', userId: '357448',
    limit: '10', resolution: 'standard_resolution',
    template: '<article>'
      + '<a href="{{link}}">'
        + '<img src="{{model.user.profile_picture}}" />'
        + '<span class="instauser">{{model.user.username}}</span>'
        + '<span class="instacaption">{{caption}}</span>'
        + '<span class="instatime">{{model.created_time}}</span>'
      + '</a>' + '<img src="{{image}}" alt="{{caption}}" />'
      + '</article>',
    after: function() {
      $('.instatime').each(function(i,o) {
        var item_time = $(this);
        var date = new Date(parseInt( item_time.text() ) * 1000);
        var newDate = convertMonthNum((date.getMonth()+1).toString()) + ' ' + date.getDate() + ', \'' + date.getFullYear().toString().substring(2,4);
        item_time.text(newDate);
      });
    }
  });
  instaFeed.run();

});// end doc ready


function loadFeatured (count) {

  var feature_posts = [];
  $.get("posts/posts.xml", function(posts) {
    $(posts).find('post').each(function() {
      var post = $(this),
        embed_type = post.find('embeded').attr('type'),
        embed_pic_words = post.find('embeded').attr('words');
      if (['photo'].indexOf(embed_type) >= 0
          && !embed_pic_words) {
        feature_posts.push({
          'category' : post.attr('category'),
          'date' : post.find('date').text(),
          'title' : post.find('title').text(),
          'embed' : post.find('embeded').text(),
          'embed_type' : embed_type,
          'content' : post.find('content').text()
        });
      }
    });
  }).complete(function() {

    feature_posts.sort(date_sort_desc);

    var soundcount = 1; // TESTING
    var featured = $('#featured');
    for (x=0; x < feature_posts.length; x++) {

      var item = $('<article>').addClass('featured_item'),
        category = feature_posts[x].category.replace(/_/g,' ').capAllWords(),
        month = convertMonthNum(
          parseInt( feature_posts[x].date.split('-')[1], 10).toString() ),
        date = parseInt(feature_posts[x].date.split('-')[2],10),
        title = feature_posts[x].title,
        embed = feature_posts[x].embed,
        embed_type = feature_posts[x].embed_type,
        content = feature_posts[x].content;

      if (embed_type === 'soundcloud') {

        var sound_iframe = buildSoundCloud(embed,true,false)
          // .attr('src');
        item.append(sound_iframe);

      } else if (embed_type === 'photo') {
        var item_info = $('<p>')
          .append( $('<small>').text(category) )
          .append( $('<h4>').text(title) )
        //  .append( $('<span>').text(month + ' ' + date) );
        item.css('background-image','url(posts/'+embed+')')
          .append(item_info);
      }

      featured.append( item );
    }
  });// complete

}



/***** Top Posts for Sidebar ********************************************/
function loadTopPosts(count) {

}


/***** Recent Posts for Sidebar *****************************************/
function loadRecentPosts(post_load_count) {
  var all_posts = [];
  $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function() {
      var post = $(this);
      all_posts.push({
        'title': post.find('title').text(),
        'date': post.find('date').text(),
        'category': post.attr('category')
      });
    });
  }).complete(function() {
    var sidePosts = $('ul#sidebar_posts').empty();
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
      sidePosts.append(post_item);
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
    var sideTags = $('ul#sidebar_tags').empty();
    all_tags.sort(sortCount);
    var tag_html = '';
    for (i = 0; i < tag_load_count; i++) {
      var tag_name = all_tags[i].name;
      tag_html += '<li><a href="blog.html?tag=' + tag_name.replace(/ /g,'_')
        + '">' + tag_name + '</a> - ' + all_tags[i].count + '</li>';
    }
    sideTags.append(tag_html);
  });
}
