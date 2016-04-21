function initProfilePic() {
  // cycying pic
  var pic_counter = 0, total_pics = 7,
      pic_titles = [	"Mellow Muggin\'", "Lush at the Lake", "Festi Fanatic", "Kitty Cuddles", "Fancy Faker", "Rave Reactions", "Party Partners"	];
  //set initial values
  var img_link = "url(imgs/me/me"+pic_counter+".jpg)";
  $('#my_pic_top').css('background-image', img_link);
  $('#my_pic_inner_frame > p > span').empty().html( pic_titles[pic_counter]);
  // interval function to transition pics
  setInterval(function() {
    pic_counter++
    var top_pic = $('#my_pic_top'),
        back_pic = $('#my_pic_back'),
        pic_title = $('#my_pic_inner_frame > p > span');
    // set 'background' image
    var last_pic = top_pic.css('background-image');
    back_pic.css('background-image', last_pic);
    top_pic.css({'opacity': 0});
    // give top image new properties and animate in
    var img_link = "url(imgs/me/me"+ pic_counter%total_pics +".jpg)";
    top_pic.css('background-image', img_link);
    top_pic.animate({'opacity': 1}, 1000);
    // adjust pic title
    var img_title = pic_titles[ pic_counter%total_pics ];
    pic_title.css('opacity', 0).text(img_title).animate({'opacity': 1}, 750);
  }, 5*1000);
}


function initMap() {
  var mapAbout = '<div id="map_about">'
  +'<p>Johnson City is a city in Washington, Carter, and Sullivan counties in the U.S. state of Tennessee, with most of the city being in Washington County. As of the 2010 census, the population of Johnson City was 63,152, and by 2014 the estimated population was 65,813, making it the ninth-largest city in the state.</p>'
  +'<p>Johnson City is ranked the #14 "Best Small Place for Business and Careers" in the USA by Forbes,and #5 in Kiplinger\'s list of "The 10 Least-Expensive Cities For Living in the U.S.A." stating the low cost of living is attributed to affordable homes and below-average utility, transportation and health-care costs.</p>'
  +'<p class="attribution">from <a href="https://en.wikipedia.org/wiki/Johnson_City,_Tennessee">Wikipedia</a></p>'
  +'</div>';

  // city: 36.3472907,-82.4071614
  // university & state of franklin @ etsu: 36.308068, -82.365046
  // random in mid city: 36.316727, -82.367031
  var lat_lng = {lat: 36.308068, lng: -82.365046},
    styles = [
      {
        featureType: "all",
        stylers: [
          { saturation: -50 }
        ]
      }
    ],
    options = {
      center: lat_lng,
      zoom: 8,
      styles: styles,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scaleControl: true,
      streetViewControl: false,
      scrollwheel: false,
      mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position:google.maps.ControlPosition.TOP_RIGHT
      },
      zoomControlOptions: {
        style:google.maps.ZoomControlStyle.SMALL
      }
    },
    map_target = document.getElementById('googleMap'),
    map = new google.maps.Map(map_target, options),
    marker = new google.maps.Marker({
      map: map,
      position: lat_lng,
      title: 'Johnson City',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0
      }
    }),
    infowindow = new google.maps.InfoWindow({
      content: mapAbout
    });
    /*  circle = new google.maps.Circle({
      //map: map,
      center: lat_lng, radius: 15000,
      strokeColor: "#727f8e", strokeOpacity: 0.5, strokeWeight: 1,
      fillColor: "#727f8e", fillOpacity: 0.1
    }); */



  marker.addListener('click', function() {
    map.setZoom(12);
    infowindow.open(map, marker);

    window.setTimeout(function() {
      map.panTo(marker.getPosition());
      map.setZoom(8);
      infowindow.close();
    }, 30*1000);
  });
  map.addListener('click', function(event) {
    var loc = event.latLng,
      loc_marker = new google.maps.Marker({
        map: map, position: loc,
      }),
      loc_infowindow = new google.maps.InfoWindow({
        content: 'Latitude: '+loc.lat().toString().substring(0,6)
        +'<br>Longitude: '+loc.lng().toString().substring(0,6)
      });
    loc_infowindow.open(map, loc_marker);
    window.setTimeout(function() {
      loc_infowindow.close();
      loc_marker.setMap(null);
    }, 5000);
  });
  map.addListener('resize', function() {
    map.setCenter(lat_lng);
    console.log('resize');
  });





}
