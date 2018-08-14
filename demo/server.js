var logging = require('../../py-logging');
var commonkit = require('../../py-logging/commonkit');
var wsh = require('../lib/WebSocketHandler');

commonkit.install(logging);
wsh.install(logging);

var LOGGING = {
	'version': 1,
	'formatters': {
		'json': {
			'class': 'logging.JsonFormatter',
		},
	},
	'handlers': {
		'socket': {
			'class': 'logging.WebSocketHandler',
			'level': 'INFO',
			'formatter': 'json',
		},
	},
	'loggers': {
		'': {
			'handlers': ['socket'],
			'level': 'INFO',
		},
	},
};


logging.config(LOGGING);

setInterval(function () {
	logging.getLogger().info('Some message');
}, 1000);
