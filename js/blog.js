

/***** Get URL Parameter *****/
function getURLParameter(getVar) {
  var pageURL = window.location.search.substring(1),
  		pageVars = pageURL.split('&');
  for (var i = 0; i < pageVars.length; i++) {
    var varInfo = pageVars[i].split('=');
    if (varInfo[0] == getVar) return varInfo[1];
  }
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
  var main = $('#main');
  for (var i = the_start; i < the_finish; i++) {
    post_obj = buildPostHTML(all_posts[i]); // build html object from post
    main.append(post_obj); // add post to Main Content
  }// for each item in array
  if (all_posts.length == the_finish) {
    main.animate({'padding-bottom':'0'});
    $('#load_more').remove();
  }
}


/***** Build Posts for Blog of Specified Category ***********************/
function loadThisCategoryPosts(theCategory) {

  var thisCategoryPosts = [];
  $.get("posts/posts.xml", function(posts) {
    $(posts).find('post').each(function() {
      var this_post = $(this);
      // if post category is category being loaded
      if (this_post.attr('category') == theCategory) {
        thisCategoryPosts.push( buildPostObj(this_post) );
      }
    });// end each post
  }).complete(function() {
    $('#main').empty();
    thisCategoryPosts.sort(date_sort_desc);
    buildPosts(thisCategoryPosts, 0, thisCategoryPosts.length);

    var catInfo = 'Category: ' + theCategory.replace(/_/g, ' ').capAllWords() + ' <span>' + thisCategoryPosts.length + ' ';
    catInfo+= (thisCategoryPosts.length > 1) ? 'Posts' : 'Post';
    var catTitle = $('<h4>').html(catInfo+'</span>');
    $(catTitle).insertBefore('.post:first-of-type');
  });
}


/***** Build Posts for Blog of Specified Tag ****************************/
function loadThisTagsPosts(theTag) {

  theTag = theTag.replace(/_/g, ' ');
  var thisTagPosts = [];
  $.get("posts/posts.xml", function(posts) {
    $(posts).find('post').each(function(i) {
      var this_post = $(this);
      // if post has tag being loaded
      this_post.find('tags').find('tag').each(function() {
        if ($(this).text() == theTag) {
          thisTagPosts.push( buildPostObj(this_post) );
        }
      }); // end each tag of post
    }); // end each post
  }).complete(function() {
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
  $.get("posts/posts.xml", function(posts) {
    $(posts).find('post').each(function(i) {
      var this_post = $(this),
        postYear = this_post.find('date').text().split('-')[0],
        postMonth = this_post.find('date').text().split('-')[1];
      // if post has archive being loaded
      if (theYear == postYear && theMonth == postMonth) {
        thisArchivePosts.push( buildPostObj(this_post) );
      }
    }); // end each post
  }).complete(function() {
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


/***** Load Sidebar Items ***********************************************/
function loadSidebar() {

  var feat_posts = [], all_tags = [], all_categories = [], archives = [];
  $.get("posts/posts.xml", function(posts){
    $(posts).find('post').each(function() {

      var post = $(this);
      /* build array for featured post */
      if ( post.find('embeded').attr('type') == 'photo' || post.find('embeded').attr('type') == 'soundcloud'
      ) {

        feat_posts.push({
          'title' : post.find('title').text(),
          'date' : post.find('date').text(),
          'embed_type' : post.find('embeded').attr('type'),
          'embeded' : post.find('embeded').text()
        });// add object of item
      }// end if post has embeded content

      /* build array of all categories and count of posts */
      var category_found = false,
          this_cat = post.attr('category');
      for (i = 0; i < all_categories.length; i++) {
        if (all_categories[i].name == this_cat) {
          all_categories[i].count++;
          category_found = true;
        }
      }
      if (!category_found) all_categories.push({'name': this_cat, 'count': 1});

      /* cycle post tags and build all tags array */
      post.find('tags').find('tag').each(function() {
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
        post_date = post.find('date').text(),
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
  }).complete(function() {
    buildSidebarCategories(all_categories);
    buildSidebarTags(all_tags);
    buildSidebarArchives(archives);
    buildSidebarFeatured(feat_posts);
    console.log('Possible Featured Posts: '+feat_posts.length);
  });
}


/***** Load Featured Post with Pic or Song ******************************/
function buildSidebarFeatured(feat_posts, refresh, lastRandomNumber) {

  /*
  * REWORK
  * incorporate check that featured post num is not same number as last number of all posts // isnt the last post // no doubles
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
  if (randomNumber == 'undefined' || randomNumber < 0)
    randomNumber = 1;

  // set 'last' / current used number for refreshing
  var lastRandomNumber = randomNumber;
  console.log('Featured Number Used: ' + randomNumber);

  // get random item of array... needs improvement...
  var feat_post = feat_posts[randomNumber];
  // create variables
  var feat_date = new Date(feat_post.date),
      the_date = convertMonthNumShort(feat_date.getMonth()+1) +' '+  feat_date.getDate();
  // vary output if song or pic
  if (feat_post.embed_type === 'soundcloud') {
    var feat_embed = buildSoundCloud(feat_post.embeded,true,false);
  } else if (feat_post.embed_type === 'photo') {
    var feat_embed = '<img src="posts/' +feat_post.embeded+ '" alt="' +feat_post.title+ '"/>';
  }
  // provide post info and link
  var feat_info = '<figcaption>'
    + '<time datetime="'+ feat_post.date + '">' +the_date+ '</time>'
    + '<a href="posts/post.html?id=">' +feat_post.title+ '</a></figcaption>';
  // add featured item to section of sidebar
  $('#featured_post').empty().append(feat_embed,feat_info);

  // if song loaded, add refresh icon to load another random
  if (feat_post.embed_type === 'soundcloud') {
    var refresh_link = $('<span>').addClass('ion-refresh feat_refresh');
    refresh_link.click(function() {
      buildSidebarFeatured(feat_posts,true,lastRandomNumber);
    });
    $('#featured_post').prepend(refresh_link);
    $('#featured_post').prev('h5').text('Random Song');
  } else {
    $('#featured_post').prev('h5').text('Random Picture');
  }
}



/***** Load Categories for Sidebar **************************************/
function buildSidebarCategories(all_categories) {
  var sideCat = $('ul#sidebar_categories').empty();
  all_categories.sort(sortName);
  for(i = 0; i < all_categories.length; i++) {
    var cat_item = $('<li>').addClass('hvr-bounce-to-right')
      .append( $('<a>')
        .attr('href', 'blog.html?category=' + all_categories[i].name)
        .html(all_categories[i].name.replace(/_/g,' ').capFirstLetter())
        .append( $('<span>').html(all_categories[i].count) )
      );
    sideCat.append(cat_item);
  }
  $('<div>').addClass('load_all').append(
    $('<a>').attr('href','posts/categories.html').html('All Categories')
  ).insertAfter('ul#sidebar_categories');
}


/***** Load Tags for Sidebar ****************************************/
function buildSidebarTags(all_tags) {
  var sideTags = $('ul#sidebar_tags').empty();
  all_tags.sort(sortCount);
  for (i = 0; i < all_tags.length; i++) {
    var tag_item = $('<li>').html(' - '+all_tags[i].count)
      .prepend( $('<a>')
        .attr('href', 'blog.html?tag=' + all_tags[i].name.replace(/ /g,'_'))
        .html(all_tags[i].name)
      );
    sideTags.append(tag_item);
  }
  $('<div>').addClass('load_all').append(
    $('<a>').attr('href','posts/tags.html').html('All Tags')
  ).insertAfter('ul#sidebar_tags');
}


/***** Load Archives for Sidebar ****************************************/
function buildSidebarArchives(archives) {

  var sideArch = $('ul#sidebar_archives').empty();
  archives.sort(archiveDateSort);
  var currDate = new Date();
  for (i = 0; i < archives.length; i++) {
    var archive_item = $('<li>').addClass('hvr-bounce-to-right')
      .append( $('<a>')
        .attr('href','blog.html?archive='+archives[i].year+'.'+archives[i].month)
        .html( convertMonthNum(archives[i].month.replace(/^0+/, '') ) )
      );
    if (archives[i].year != currDate.getFullYear()) {
      archive_item.find('a').append( $('<i>').html(archives[i].year.slice(2,4)) );
    }
    archive_item.find('a').append( $('<span>').html(archives[i].count) );
    sideArch.append(archive_item);
  }
  $('<div>').addClass('load_all').append(
    $('<a>').attr('href','posts/archives.html').html('Full Archives')
  ).insertAfter('ul#sidebar_archives');
}



/* generate random number from min to max */
function randomNum(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
