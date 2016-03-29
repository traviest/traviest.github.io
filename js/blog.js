$(document).ready(function() {


});// document ready


function loadPosts(count) {

  var all_posts = new Array();
  var get_posts = $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function() {

      var post_tags = new Array();
      $(this).find('tags').find('tag').each(function() {
        post_tags.push( $(this).text() );
      });

      var post_links = new Array();
      $(this).find('links').find('link').each(function() {
        var link = new Array();
        link['url'] = $(this).attr('href');
        link['title'] = $(this).html();
        post_links.push(link);
      });

      var post = new Array();
        post['category'] = $(this).attr('category');
        post['title'] = $(this).find('title').text();
        post['date'] = $(this).find('date').text();
        post['embed'] = $(this).find('embeded').text();
        post['embed_type'] = $(this).find('embeded').attr('type');
        post['content'] = $(this).find('content').html();
        post['tags'] = post_tags;
        post['links'] = post_links;
      all_posts.push(post);
    });
  });
  // get posts load
  get_posts.complete(function() {

    //allPosts.sort(date_sort_desc);

    /*
    sort psts by date descending
    */

    $('#main').empty();

    for (var i = 0; i < all_posts.length; i++) {

      var category		= all_posts[i]['category'],
          title				= all_posts[i]['title'],
          date 				= all_posts[i]['date'],
          embed				= all_posts[i]['embed'],
          embed_type	= all_posts[i]['embed_type'],
          content			= all_posts[i]['content'],
          tags				= all_posts[i]['tags'],
          links				= all_posts[i]['links'];

      // Start Post
      var post_html = $('<article>').addClass('post').addClass(category);

      // Category
      var cat_link = $('<a>').attr('href', 'blog.html?category='+category)
        .html( category.replace("_"," ") );
      post_html.append( $('<small>').html(cat_link) );

      // Title
      if (title != '' && title != undefined)
        post_html.append( $('<h3>').html( title ) );

      // Date
      var date_arr = date.split("-"),
          date_month = convertMonthNum(date_arr[1]),
          date_day = date_arr[2].split('T')[0].replace(/^0+/, ''),
          date_year = date_arr[0],
          date_time = date_arr[2].split('T')[1];
          date_hour = date_time.split(':')[0].replace(/^0+/, '');
          date_min = date_time.split(':')[1];
          date_ampm = ( date_hour - 12 < 0 ) ? "AM" : "PM";
          if (date_ampm == "PM") date_hour-=12;

      var date_html = date_month+" "+date_day+", "+date_year+" "
        +date_hour+":"+date_min+" "+date_ampm;
      post_html.append( $('<time>').attr('datetime',date).html(date_html) );

      // Embeded Elements
      switch (embed_type) {
        case 'soundcloud':
          var post_embed = buildSoundCloud(embed, false, false, false);
          post_html.append( $('<section>').html(post_embed) );
          break;
        case 'soundcloud_playlist':
          var post_embed = buildSoundCloud(embed, false, false, true);
          post_html.append( $('<section>').html(post_embed) );
          break;
        case 'youtube':
          post_html.append( $('<section>').html( buildYouTube(embed) ) );
          break;
        case 'photo':
          post_html.append( $('<section>').html('<img src="posts/'+embed+'"/>') );
          break;
        //default:
      }

      // Content
      if (content) {
        post_html.append( $('<article>').html(content) );
      }

      // Tags
      if (tags != '' && tags != undefined && tags.length > 0) {
        tags.sort();
        var post_tags = $('<ul>').addClass('post_tags');
        for (var x = 0; x < tags.length; x++) {
          var link = $('<a>').attr('href','blog.html?tag='+tags[x])
                .html(tags[x]);
          post_tags.append( $('<li>').append(link) );
        }
        post_html.append(post_tags);
      }

      // Links
      if (links != '' && links != undefined && links.length > 0) {
        var post_links = $('<ul>').addClass('post_links');
        for (var x = 0; x < links.length; x++) {
          var link = $('<a>').attr('href',links[x]['url'])
                .html(links[x]['title']);
          post_links.append( $('<li>').append(link) );
        }
        post_html.append(post_links);
      }

      // add post to Main Content
      $('#main').append(post_html);

      // decrement and check count of posts to load
      count--;
      if (count == 0) break;

    }// for each item in array

    if (all_posts.length > count) {
      $('#main').append( $('<a>').addClass('load_more').text("Load More Posts") );
    }

  });// get posts complete
}
