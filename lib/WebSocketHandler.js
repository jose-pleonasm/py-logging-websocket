
/**
 * @module py-logging-websocket
 */


function install(logging) {
	if (!logging || typeof logging !== 'object') {
		throw new Error('Argument 0 of install is not valid.');
	}

	var util = require('util');
	var WebSocket = require('ws');


	/**
	 * @constructor WebSocketHandler
	 * @extends Handler
	 * @param {Object} [options] @see https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback
	 */
	function WebSocketHandler(options) {
		options = options || {};
		options.host = options.host || WebSocketHandler.DEFAULT_HOST;
		options.port = options.port || WebSocketHandler.DEFAULT_PORT;

		logging.Handler.call(this);

		/**
		 * @type {WebSocketServer}
		 */
		this.wss = new WebSocket.Server(options);

		this.wss.on('error', this.handleError.bind(this));
	}
	util.inherits(WebSocketHandler, logging.Handler);

	WebSocketHandler.DEFAULT_HOST = '127.0.0.1';
	WebSocketHandler.DEFAULT_PORT = 9030;

	/** @inheritdoc */
	WebSocketHandler.prototype.emit = function(record) {
		var data = this.format(record);

		this.wss.clients.forEach(function each(client) {
			if (client.readyState !== WebSocket.OPEN) {
				return;
			}
			client.send(data);
		});
	};

	/** @inheritdoc */
	WebSocketHandler.prototype.close = function() {
		if (this.wss) {
			this.wss.close();
		}
	};


	logging.WebSocketHandler = WebSocketHandler;
}


module.exports = {
	install: install,
};
