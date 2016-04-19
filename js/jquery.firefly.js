/*
* jQuery Firefly v0.1
* https://github.com/motyar/firefly

* Licensed under the MIT license.
* Copyright 2011 Dharmveer Motyar
* http://motyar.blogspot.com
*/
(function($) {

	/* Plugin defaults */
	var defaults = {
		target: 'document.body',
		total : 40,
		images : [
			'http://dharmmotyar.googlecode.com/svn/trunk/images/spark.png',
			'http://dharmmotyar.googlecode.com/svn/trunk/images//spark2.png',
			'http://dharmmotyar.googlecode.com/svn/trunk/images/spark3.png',
			'http://dharmmotyar.googlecode.com/svn/trunk/images/spark4.png']
	};

	$.firefly = function(settings) {
		$.firefly.settings = $.extend({}, defaults, settings);
			if($.firefly.preloadImages()){
				for (i = 0; i < $.firefly.settings.total; i++){
					$.firefly.fly($.firefly.create($.firefly.settings.images[$.firefly.random(($.firefly.settings.images).length)]));
				}
			}
		return;
	};

	/* Public Functions */
	$.firefly.create = function(img){
		spark = $('<img>').attr({'src' : img}).hide();
		$($.firefly.settings.target).append(spark);
			return spark.css({
				'position':'absolute',
				'z-index': $.firefly.random(20),
				top: $.firefly.random( $($.firefly.settings.target).height() ),
				left: $.firefly.random( $($.firefly.settings.target).width() )
				}).show();
}

$.firefly.fly = function(sp) {
	$(sp).animate({
		top: $.firefly.random( $($.firefly.settings.target).height() ),
		left: $.firefly.random( $($.firefly.settings.target).width() )
	}, (($.firefly.random(10) + 5) * 1100),function(){ $.firefly.fly(sp) } );
};

$.firefly.preloadImages = function() {
	var preloads = new Object();
	for (i = 0; i < ($.firefly.settings.images).length; i++){
			preloads[i] = new Image(); preloads[i].src = $.firefly.settings.images[i];
		}
	return true;
}

$.firefly.random = function(max) {
	return Math.ceil(Math.random() * max) - 1;
}

})(jQuery);
