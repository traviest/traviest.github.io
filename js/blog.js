

/***** Get URL Parameter *****/
function getURLParameter(getVar) {
  var pageURL = window.location.search.substring(1),
  		pageVars = pageURL.split('&');
  for (var i = 0; i < pageVars.length; i++) {
    var varInfo = pageVars[i].split('=');
    if (varInfo[0] == getVar) return varInfo[1];
  }
}


/* generate random number from min to max */
function randomNum(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}


/***** Get items from XML and build Posts *******************************/
function loadPosts(all_posts, the_start, the_finish) {
  $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function() {
      all_posts.push( buildPostObj( $(this) ) );
    });
  }).complete(function() {
    // remove loading icons
    $('.fa-stack').remove();
    // build posts from start to finish
    all_posts.sort(date_sort_desc);
    buildPosts(all_posts, the_start, the_finish);
  });
}


/***** Build Posts from Array *******************************************/
function buildPosts (all_posts, start, finish) {
  var the_start = start, the_finish = finish;
  if (the_finish > all_posts.length) the_finish = all_posts.length;
  for (var i = the_start; i < the_finish; i++) {
    post_obj = buildPostHTML(all_posts[i]); // build html object from post
    $('#main').append(post_obj); // add post to Main Content
  }// for each item in array
  if (all_posts.length == the_finish) {
    $('#main').animate({'padding-bottom':'0'});
    $('#load_more').remove();
  }
}// end build posts function


/***** Build Posts for Blog of Specified Category ***********************/
function loadThisCategoryPosts(theCategory) {

  var thisCategoryPosts = [];
  var getCategory = $.get("posts/posts.xml", function(posts) {
    $(posts).find('post').each(function(i) {

      var post = $(this);
      // if post category is category being loaded
      if ($(this).attr('category') == theCategory) {
        var postObj = buildPostObj(post);
        thisCategoryPosts.push(postObj);
      }
    });// end each post
  });// end get category post
  getCategory.complete(function() {

    $('#main').empty();
    thisCategoryPosts.sort(date_sort_desc);
    buildPosts(thisCategoryPosts, 0, thisCategoryPosts.length);

    var catInfo = 'Category: ' + theCategory.replace(/_/g, ' ') + ' <span>' + thisCategoryPosts.length + ' ';
    catInfo+= (thisCategoryPosts.length > 1) ? 'Posts' : 'Post';
    var catTitle = $('<h4>').html(catInfo+'</span>');
    $(catTitle).insertBefore('.post:first-of-type');
  });
}

/***** Build Posts for Blog of Specified Tag ****************************/
function loadThisTagsPosts(theTag) {

  theTag = theTag.replace(/_/g, ' ');
  var thisTagPosts = [];
  var getTag = $.get("posts/posts.xml", function(posts) {
    $(posts).find('post').each(function(i) {

      var post = $(this);
      // if post has tag being loaded
      $(this).find('tags').find('tag').each(function() {
        if ( $(this).text() == theTag) {
          var postObj = buildPostObj(post);
          thisTagPosts.push(postObj);
        }
      }); // end each tag of post
    }); // end each post
  }); // end get tag posts
  getTag.complete(function() {

    $('#main').empty();
    thisTagPosts.sort(date_sort_desc);
    buildPosts(thisTagPosts, 0, thisTagPosts.length);

    var tagInfo = 'Tag: ' + theTag + ' <span>' + thisTagPosts.length + ' ';
    tagInfo+= (thisTagPosts.length > 1) ? 'Posts' : 'Post';
    var tagTitle = $('<h4>').html(tagInfo+'</span>');
    $(tagTitle).insertBefore('.post:first-of-type');
  });
}

/***** Build Posts for Blog of Specified Archive ************************/
function loadThisArchive(theArchive) {

  var thisArchivePosts = [],
    theYear = theArchive.split('.')[0],
    theMonth = theArchive.split('.')[1];
  var getArchive = $.get("posts/posts.xml", function(posts) {
    $(posts).find('post').each(function(i) {

      var post = $(this),
        postDate = post.find('date').text(),
        postYear = postDate.split('-')[0],
        postMonth = postDate.split('-')[1];
      // if post has archive being loaded
      if (theYear == postYear && theMonth == postMonth) {
        var postObj = buildPostObj(post);
        thisArchivePosts.push(postObj);
      }
    }); // end each post
  }); // end get archive posts
  getArchive.complete(function() {

    $('#main').empty();
    thisArchivePosts.sort(date_sort_asc);
    buildPosts(thisArchivePosts, 0, thisArchivePosts.length);

    var fullMonth = convertMonthNum(theArchive.split('.')[1].replace(/^0+/,''));
    var archiveInfo = 'Archive: ' + fullMonth + ', '
      + theArchive.split('.')[0] + ' <span>' + thisArchivePosts.length + ' ';
    archiveInfo+= (thisArchivePosts.length > 1) ? 'Posts' : 'Post';
    var archiveTitle = $('<h4>').html(archiveInfo+'</span>');
    $(archiveTitle).insertBefore('.post:first-of-type');
  });
}


var feat_posts = [];
/***** Load Sidebar Items ***********************************************/
function loadSidebar() {

  var all_tags = [], all_categories = [], archives = [];
  var getSidebarInfo = $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function(i) {

      /* build array for featured post */
      if ( $(this).find('embeded').attr('type') == 'photo' //|| $(this).find('embeded').attr('type') == 'soundcloud'
      ) {

        feat_posts.push({
          'title' : $(this).find('title').text(),
          'date' : $(this).find('date').text(),
          'embed_type' : $(this).find('embeded').attr('type'),
          'embeded' : $(this).find('embeded').text()
        });// add object of item
      }// end if post has embeded content

      /* build array of all categories and count of posts */
      var category_found = false,
          this_cat = $(this).attr('category');
      for (i = 0; i < all_categories.length; i++) {
        if (all_categories[i].name == this_cat) {
          all_categories[i].count++;
          category_found = true;
        }
      }
      if (!category_found) all_categories.push({'name': this_cat, 'count': 1});

      /* cycle post tags and build all tags array */
      $(this).find('tags').find('tag').each(function() {
        var tag_found = false,
            this_tag = $(this).text().trim();
        for (var i = 0; i < all_tags.length; i++) {
          if (all_tags[i].name == this_tag) {
            all_tags[i].count++;
            tag_found = true;
          }
        }
        if (!tag_found) all_tags.push({'name': this_tag, 'count': 1});
      });

      /* load all archived posts, month and year */
      var date_found = false,
        post_date = $(this).find('date').text(),
        post_month = post_date.split('-')[1],
        post_year = post_date.split('-')[0];
      for (i = 0; i < archives.length; i++) {
        if (archives[i].month == post_month && archives[i].year == post_year) {
          archives[i].count++;
          date_found = true;
        }
      }
      if (!date_found) {
        archives.push({'month': post_month, 'year': post_year, 'count': 1});
      }// end load archives

    });// end for each post
  });// end get xml
  getSidebarInfo.complete(function() {
    buildSidebarCategories(all_categories);
    buildSidebarTags(all_tags);
    buildSidebarArchives(archives);
    buildSidebarFeatured(feat_posts);
    console.log('Possible Featured Posts: '+feat_posts.length);
  });
}


var lastRandomNumber;
/***** Load Featured Post with Pic or Song ******************************/
function buildSidebarFeatured(feat_posts, refresh) {

  /*
  * REWORK
  * incorporate check that featured post num is same number as last number of all posts // isnt the last post // no doubles
  */

  var randomNumber;
  if (refresh) {
    var sameNumber = true, count = 1;
    while (sameNumber) {
      var newRandomNumber = randomNum(0, feat_posts.length-1),
          new_feat = feat_posts[newRandomNumber];
      if (newRandomNumber!=undefined && lastRandomNumber!=newRandomNumber &&
          new_feat.embed_type==='soundcloud') {
        sameNumber = false;
        randomNumber = newRandomNumber;
      } else {
        console.log('Match = ' + randomNumber + ' : random - ' + newRandomNumber +' : newRandom');
      }
      console.log('Looped for New Song: ' + count);
      count++;
    }
  } else {
    randomNumber = randomNum(0, feat_posts.length-1);
  }
  // confirm number gets set
  if (randomNumber == 'undefined' || randomNumber < 0) {
    randomNumber = 1;
  }
  // set 'last' / current used number for refreshing
  lastRandomNumber = randomNumber;
  console.log('Featured Number Used: ' + randomNumber);
  // get random item of array... needs improvement...
  var feat_post = feat_posts[randomNumber];
  // create variables
  var feat_date = new Date(feat_post.date),
      the_date = convertMonthNumShort(feat_date.getMonth()+1) +' '+  feat_date.getDate();
  // vary output if song or pic
  if (feat_post.embed_type === 'soundcloud') {
    var feat_info = buildSoundCloud(feat_post.embeded,true,false);
  } else if (feat_post.embed_type === 'photo') {
    var feat_info = '<img src="posts/' +feat_post.embeded+ '" alt="' +feat_post.title+ '"/>';
  }
  // provide post info and link
  feat_info+= '<figcaption>'
    + '<time datetime="'+ feat_post.date + '">' +the_date+ '</time>'
    + '<a href="posts/post.html?id=">' +feat_post.title+ '</a></figcaption>';
  // add featured item to section of sidebar
  $('#featured_post').empty().append(feat_info);
  // if song loaded, add refresh icon to load another random
  if (feat_post.embed_type === 'soundcloud') {
    var refresh_link = $('<span>').addClass('ion-refresh feat_refresh');
    $('#featured_post').prepend(refresh_link);
    $('#featured_post').prev('h5').text('Random Song');
  } else {
    $('#featured_post').prev('h5').text('Random Picture');
  }
}

$(document).on('click', '.feat_refresh', function() {
  buildSidebarFeatured(feat_posts,true);
});


/***** Load Categories for Sidebar **************************************/
function buildSidebarCategories(all_categories) {

  $('ul#sidebar_categories').empty();
  all_categories.sort(sortName);
  var cat_html = '';
  for(i = 0; i < all_categories.length; i++) {
    cat_html+= '<li class="hvr-bounce-to-right">'
      + '<a href="blog.html?category=' + all_categories[i].name + '">'
      + all_categories[i].name.replace(/_/g,' ')
      + '<span>' + all_categories[i].count + '</span></a></li>';
  }
  $('ul#sidebar_categories').append(cat_html);

  var allLink = $('<a>').attr('href','posts/categories.html').html('All Categories'),
    listAll = $('<div>').addClass('load_all').append(allLink);
  $(listAll).insertAfter('ul#sidebar_categories');
}

/***** Load Tags for Sidebar ****************************************/
function buildSidebarTags(all_tags) {

  $('ul#sidebar_tags').empty();
  all_tags.sort(sortCount);
  var tag_html = '';
  for (i = 0; i < all_tags.length; i++) {
    var tag_name = all_tags[i].name;
    tag_html += '<li><a href="blog.html?tag=' + tag_name.replace(/ /g,'_')
      + '">' + tag_name + '</a> - ' + all_tags[i].count + '</li>';
  }
  $('ul#sidebar_tags').append(tag_html);

  var allLink = $('<a>').attr('href','posts/tags.html').html('All Tags'),
    listAll = $('<div>').addClass('load_all').append(allLink);
  $(listAll).insertAfter('ul#sidebar_tags');
}

/***** Load Archives for Sidebar ****************************************/
function buildSidebarArchives(archives) {

  $('ul#sidebar_archives').empty();
  archives.sort(archiveDateSort);
  var archive_html = '',
      currDate = new Date();
  for (i = 0; i < archives.length; i++) {
    archive_html += '<li class="hvr-bounce-to-right">'
      + '<a href="blog.html?archive='
      + archives[i].year + '.' + archives[i].month + '">'
      + convertMonthNum(archives[i].month.replace(/^0+/, ''));
    if (archives[i].year != currDate.getFullYear()) {
      archive_html += '<i>' + archives[i].year.slice(2,4) + '</i>';
    }
    archive_html += '<span>' + archives[i].count + '</span></a></li>';
  }
  $('ul#sidebar_archives').append(archive_html);

  var allLink = $('<a>').attr('href','posts/archives.html').html('Full Archives'),
    listAll = $('<div>').addClass('load_all').append(allLink);
  $(listAll).insertAfter('ul#sidebar_archives');
}
