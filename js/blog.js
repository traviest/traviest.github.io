$(document).ready(function() {

});// document ready


/***** Get items from XML and build Posts *******************************/
function loadPosts(all_posts, the_start, the_finish) {

  var get_posts = $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function() {

      var post_tags = [];
      $(this).find('tags').find('tag').each(function() {
        post_tags.push( $(this).text() );
      });

      var post_links = [];
      $(this).find('links').find('link').each(function() {
        var link = [];
        link['link_text'] = $(this).attr('text');
        link['source'] = $(this).attr('source');
        post_links.push(link);
      });

      var post = [];
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
    // remove loading icons
    $('.fa-stack').remove();
    // build posts from start to finish
    buildPosts(all_posts, the_start, the_finish);
  });
}

/***** Build Posts from Array *******************************************/
function buildPosts (all_posts, the_start, the_finish) {

  all_posts.sort(date_sort_desc);
  var start = the_start, finish = the_finish;
  if (finish > all_posts.length) finish = all_posts.length;
  for (var i = start; i < finish; i++) {

    var category		= all_posts[i].category,
        title				= all_posts[i].title,
        date 				= all_posts[i].date,
        embed				= all_posts[i].embed,
        embed_type	= all_posts[i].embed_type,
        content			= all_posts[i].content,
        tags				= all_posts[i].tags,
        links				= all_posts[i].links;

    // Start Post
    var post_html = $('<article>').addClass('post').addClass(category);
    // Category
    var cat_link = $('<a>').attr('href', 'blog.html?category='+category)
      .html( category.replace("_"," ").capFirstLetter() );
    post_html.append( $('<small>').html(cat_link) );
    // Date
    var date_html = convertDate(date);
    post_html.append( $('<time>').attr('datetime',date).html(date_html) );
    // Tags
    if (tags != '' && tags != undefined && tags.length > 0) {
      tags.sort();
      var post_tags = $('<ul>').addClass('post_tags');
      for (var x = 0; x < tags.length; x++) {
        var link = $('<a>').attr('href','blog.html?tag='+tags[x])
              .html(tags[x].capFirstLetter());
        post_tags.append( $('<li>').append(link) );
      }
      post_html.append(post_tags);
    }

    // Title
    if (title != '' && title != undefined) post_html.append( $('<h3>').html( title ) );
    // Embeded Elements
    switch (embed_type) {
      case 'soundcloud':
        var post_embed = buildSoundCloud(embed, false, false, false);
        post_html.append( '<section>'+post_embed+'</section>' );
        break;
      case 'soundcloud_playlist':
        var post_embed = buildSoundCloud(embed, false, false, true);
        post_html.append( '<section>'+post_embed+'</section>' );
        break;
      case 'youtube':
        post_html.append( '<section>'+buildYouTube(embed)+'</section>' );
        break;
      case 'photo':
        post_html.append( '<section><img src="posts/'+embed+'" alt="'+title+'" />' );
        break;
      //default:
    }
    // Content
    if (content) {
      /*
      if (content.length > 400) {
        var content_text = content.substring(0,400) + '&hellip;';
        content_text += '<div class="read_full"><a href="post?id=">Read Full Post</a></div>';
      }  else content_text = content;
      */
      post_html.append( $('<article>').html(content) );
    }
    // Links
    if (links != undefined && links.length > 0) {
      var post_links = $('<ul>').addClass('post_links');
      for (var x = 0; x < links.length; x++) {
        var the_link = '<a href="' + links[x]['source'] + '">'
              + links[x]['link_text'] + '</a>';
        post_links.append( $('<li>').append(the_link) );
      }
      post_html.append(post_links);
    }

    // add post to Main Content
    $('#main').append(post_html);

  }// for each item in array

  if (all_posts.length == finish) $('#load_more').remove();

}// end build posts function


/***** Load Sidebar Items ***********************************************/
function loadSidebar() {

  var feat_posts = [], all_tags = [], all_categories = [], archives = [];
  var getSidebarInfo = $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function(i) {

      /* build array for featured post */
      if ( $(this).find('embeded').attr('type') == 'photo' ||
          $(this).find('embeded').attr('type') == 'soundcloud' ) {
        feat_posts.push({
          'title' : $(this).find('title').text(),
          'date' : $(this).find('date').text(),
          'embed_type' : $(this).find('embeded').attr('type'),
          'embeded' : $(this).find('embeded').text()
        });// add object of item
      }// end if post has embeded content

      /* cycle post tags and build all tags array */
      $(this).find('tags').find('tag').each(function() {
        var tag_found = false,
            this_tag = $(this).text().trim();
        for (var i = 0; i < all_tags.length; i++) {
          if (this_tag == all_tags[i].name) {
            all_tags[i].count++;
            tag_found = true;
          }
        }
        if (!tag_found) {
          all_tags.push({'name' : this_tag, 'count' : 1});
        }
      });// end for each tag of post




    });
  });// end get featured
  getSidebarInfo.complete(function() {

    // build featured post
    var random = randomIntFromInterval(0,feat_posts.length);
    buildFeatured(feat_posts[random]);

    // build all categories
    buildCategories();

    // build all post tags
    buildAllTags(all_tags);
  });

//  loadCategories();
//  loadArchives();
}
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


/***** Load Featured Post with Pic **************************************/
function buildFeatured(feat_post) {
  // create vars
  var feat_info = '',
      feat_date = new Date(feat_post.date),
      the_date = convertMonthNumShort(feat_date.getMonth()) +' '+  feat_date.getDate();
  // vary output if song or pic
  if (feat_post.embed_type === 'soundcloud') {
    feat_info = '<a href="posts/post.html?id=">'
      + '<span class="feat_date">' +the_date+ '</span>'
      + '<span class="feat_title">' +feat_post.title+ '</span>' + '</a>'
      + buildSoundCloud(feat_post.embeded,false,true,false);
  }
  else if (feat_post.embed_type === 'photo') {
    feat_info = '<img src="posts/' +feat_post.embeded+ '" alt="' +feat_post.title+ '"/>'
    + '<a href="posts/post.html?id=">'
    + '<span class="feat_date">' +the_date+ '</span>'
    + '<span class="feat_title">' +feat_post.title+ '</span>' + '</a>';
  }
  $('#featured_post').append(feat_info);
}


/***** Load Categories for Sidebar **************************************/
function buildCategories(all_categories) {


  var all_categories = [];

  var getSidebarInfo = $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function(i) {

      var category_found = false,
          this_cat = $(this).attr('category');
      for (i = 0; i < all_categories.length; i++) {
        if (this_cat == all_categories[i].name) {
          all_categories[i].count+=1;
          category_found = true;
        }
      }
      if (!category_found) {
        all_categories.push({'name' : this_cat, 'count' : 1});
      }

    });
  });
  getSidebarInfo.complete(function () {

    $('ul#sidebar_categories').empty(300);
    all_categories.sort(sortName);
    var cat_html = '';
    for(i = 0; i < all_categories.length; i++) {
      var cat_name = all_categories[i].name,
          cat_count = all_categories[i].count;
      cat_html += '<li><a href=blog.html?category="' +cat_name+ '">'
        +cat_name.replace('_',' ')+ '<span>' +cat_count+ '</span></a></li>';
    }
    $('ul#sidebar_categories').append(cat_html);
  });
}


/***** Load All Tags for Sidebar ****************************************/
function buildAllTags(all_tags) {

  $('ul#sidebar_tags').empty(300);
  all_tags.sort(sortCount);
  var tag_html = '';
  for (var i = 0; i < all_tags.length; i++) {
    tag_html += '<li><a href=blog.html?tag="' +all_tags[i].name+ '">'
      +all_tags[i].name+ '</a> - ' +all_tags[i].count+ '</li>';
  }
  $('ul#sidebar_tags').append(tag_html);
}


function sortName(a,b) {
  if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
  else if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
  else if (a['name'].toLowerCase() == b['name'].toLowerCase()) return 0;
}
function sortCount(a,b) {
  if (a['count'] > b['count']) return -1;
  else if (a['count'] < b['count']) return 1;
  else {
    if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
    else if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
    else return 0;
  }
}


/***** Load Archives for Sidebar ****************************************/
function buildArchives() {


/*
post = {
  'dateMo' : ,
  'dateYr' : ,
  'count' :
}


allDates[x].dateMo
allDates[x].dateYr
allDates[x].count
}
*/

}
