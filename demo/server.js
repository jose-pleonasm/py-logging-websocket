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
		'websocket': {
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


var i = 0;
setInterval(function () {
	i++;
	logging.getLogger().info(i);
}, 1000);
