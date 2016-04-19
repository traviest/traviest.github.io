$(document).ready(function() {

  blogCrumbs();


  var navTimer;
  $('#show_post_nav').click(function() {
    if ( $(this).hasClass('showing') ) hideSubNav();
    else showSubNav();
  });
  $('#show_post_nav').hover(function() {
    clearTimeout(navTimer);
  }, function() {
    navTimer = setTimeout(function() {hideSubNav()}, 10000);
  });
  $('.sub_nav').hover(function() {
    clearTimeout(navTimer);
  }, function() {
    navTimer = setTimeout(function() {hideSubNav()}, 10000);
  });

});
function showSubNav () {
  $('#show_post_nav').addClass('showing');
  $('.sub_nav').css('display','block').animate({'right':'75px', 'opacity':1}, 300);
}
function hideSubNav () {
  $('#show_post_nav').removeClass('showing');
  $('.sub_nav').animate({'right':'0px','opacity':0},300).fadeOut(100);
}


/***** Build Breadcrumb Trail *******************************************/
function blogCrumbs() {
  var curr_page = window.location.pathname.split("/").pop().split(".")[0],
      trail = $('<ul>').addClass('trail'),
      home_link = $('<a>').attr('href','../index.html').html('Home'),
      blog_link = $('<a>').attr('href','../blog.html').html('Blog'),
      home_crumb = $('<li>').append( home_link ),
      blog_crumb = $('<li>').append( blog_link );


  var curr_link = curr_page.capFirstLetter().replace(/_/g,' ');
  var curr_crumb = $('<li>').html(curr_page.capAllWords());

  trail.append(home_crumb).append(blog_crumb).append(curr_crumb);
  //trail.insertBefore('main');
  trail.prependTo('main')
}


/***** Load All Posts ***************************************************/
function getAllPosts() {
  var all_posts = [];
  $.get("posts.xml", function(posts){
    $(posts).find('post').each(function() {
      all_posts.push( buildPostObj($(this)) );
    });
  }).complete(function() {
    all_posts.sort(date_sort_asc);
    var sub_page = true,
        allPosts = $('<div>').attr('id','all_posts');
    for (x = 0; x < all_posts.length; x++) {
      allPosts.append( buildPostHTML(all_posts[x], sub_page) );
    }
    $('main').append(allPosts);
  });
}

/***** Load Alt Sub-Footer for Alternative Posts Pages ******************/
function loadSubNav() {
  var curr_page = window.location.pathname.split("/").pop().split(".")[0],
      sub_nav = $('<nav>').addClass('sub_nav').append($('<h6>').html('Posts')),
      all_link  = $('<a>').attr('href','all_posts.html').html('All'),
      tag_link = $('<a>').attr('href','tags.html').html('Tags'),
      cat_link = $('<a>').attr('href','categories.html').html('Categories'),
      arch_link = $('<a>').attr('href','archives.html').html('Archives'),
      nav_show = $('<span>').attr('id','show_post_nav').html('&#xf4a6;');

  if (curr_page == 'tags') tag_link.addClass('current');
  else if (curr_page == 'categories') cat_link.addClass('current');
  else if (curr_page == 'archives') arch_link.addClass('current');
  else if (curr_page == 'all_posts') all_link.addClass('current');

  sub_nav.append(tag_link).append(cat_link).append(arch_link);
  $('main').append(nav_show).append(sub_nav);
}


/***** Load All Tags for Tags Page **************************************/
function getAllTags() {
  var allTags = [];
  var loadTags = $.get("posts.xml", function(posts){
    $(posts).find('post').each(function() {

      /* cycle post tags and build all tags array */
      $(this).find('tags').find('tag').each(function() {
        var tag_found = false,
            this_tag = $(this).text().trim();
        for (var i = 0; i < allTags.length; i++) {
          if (allTags[i].name == this_tag) {
            allTags[i].count++;
            tag_found = true;
          }
        }
        if (!tag_found)
          allTags.push({'name': this_tag, 'count': 1});
      });
    });//end each post
  });// end get
  loadTags.complete(function() {

    allTags.sort(sortName);

    var tagList = $('<ul>').addClass('full_tag_list');

    for (i=0; i<allTags.length; i++) {

      var name = allTags[i].name.replace(/_/g,' ').capFirstLetter(),
          count = $('<span>').html(allTags[i].count),
          list_item = $('<li>').html(name).append(count);
      // add item to full list
      tagList.append( list_item );
    }

    $('main').append(tagList);
    loadSubNav();
  });
}

/***** Load All Categories for Categories Page **************************/
function getAllCategories() {
  var allCategories = [];
  var loadCats = $.get("posts.xml", function(posts){
    $(posts).find('post').each(function() {

      var category_found = false,
          this_cat = $(this).attr('category');
      for (i = 0; i < allCategories.length; i++) {
        if (allCategories[i].name == this_cat) {
          allCategories[i].count++;
          category_found = true;
        }
      }
      if (!category_found)
        allCategories.push({'name': this_cat, 'count': 1});
    });//end each post
  });// end get
  loadCats.complete(function() {

    allCategories.sort(sortName);

    var catList = $('<ul>').addClass('full_category_list');

    for (i=0; i<allCategories.length; i++) {

      var name = allCategories[i].name.replace(/_/g,' ').capFirstLetter(),
          count = $('<span>').html(allCategories[i].count),
          list_item = $('<li>').html(name).append(count);
      // add item to full list
      catList.append( list_item );
    }

    $('main').append(catList);
    loadSubNav();
  });
}


/***** Load Archives for Archives Page **********************************/
function getAllArchives() {
  var allArchives = [];
  var loadArchives = $.get("posts.xml", function(posts){
    $(posts).find('post').each(function() {

      var date_found = false,
        post_month = $(this).find('date').text().split('-')[1],
        post_year = $(this).find('date').text().split('-')[0];
      for (i=0; i<allArchives.length; i++) {
        if (allArchives[i].month == post_month && allArchives[i].year == post_year) {
          allArchives[i].count++;
          date_found = true;
        }
      }
      if (!date_found) {
        allArchives.push({'month': post_month, 'year': post_year, 'count': 1});
      }// end load archives

    });//end each post
  });// end get
  loadArchives.complete(function() {

    allArchives.sort(archiveDateSort);

    var archiveList = $('<ul>').addClass('full_archive_list');

    for (i=0; i<allArchives.length; i++) {

      var month = allArchives[i].month.replace(/^0+/,''),
          year = '\''+allArchives[i].year.slice(2,4),
          list_count = $('<span>').html(allArchives[i].count)
          list_item = $('<li>').html(convertMonthNum(month) +' '+ year);

      // add item to full list
      archiveList.append( list_item.append(list_count) );
    }

    $('main').append(archiveList);
    loadSubNav();
  });
}
