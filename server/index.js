const api = require('./api');

// It all starts with starting the API server
(function() {
	// The API is a single-instance class.
	api().start();
})();
