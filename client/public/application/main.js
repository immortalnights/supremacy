require.config({
	baseUrl: '/application',

	paths: {
		'requireLib': '../node_modules/requirejs/require',
		'jquery': '../node_modules/jquery/dist/jquery',
		'cookies': '../node_modules/js-cookie/src/js.cookie',
		'underscore': '../node_modules/underscore/underscore',
		'text': '../node_modules/requirejs-text/text',
		'tpl': '../node_modules/requirejs-underscore-tpl/underscore-tpl',
		'backbone': '../node_modules/backbone/backbone',
		'backbone.marionette': '../node_modules/backbone.marionette/lib/backbone.marionette',
		'backbone.radio': '../node_modules/backbone.radio/build/backbone.radio',
		'backbone.poller': '../node_modules/backbone-poller/backbone.poller.min'
	}
});

requirejs(['application'], function(application) {
	'use strict';

	var app = application();

	_.defer(app.start.bind(app));
}, function(err) {
	// $('main').text("ERROR " + err);
	document.getElementsByTagName('main')[0].innerHTML = err;
	console.error(err);
});
