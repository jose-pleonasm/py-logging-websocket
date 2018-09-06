
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
	 * @param {boolean} [onlyWhenConnected]
	 */
	function WebSocketHandler(options, onlyWhenConnected) {
		options = options || {};
		onlyWhenConnected = typeof onlyWhenConnected === 'boolean' ? onlyWhenConnected : true;
		options.host = options.host || WebSocketHandler.DEFAULT_HOST;
		options.port = options.port || WebSocketHandler.DEFAULT_PORT;

		logging.Handler.call(this);

		/**
		 * @type {WebSocketServer}
		 */
		this.wss = new WebSocket.Server(options);

		/**
		 * @private
		 * @type {boolean}
		 */
		this._onlyWhenConnected = onlyWhenConnected;

		/**
		 * @private
		 * @type {Array<module:py-logging.LogRecord>}
		 */
		this._queue = [];

		this.handleError = this.handleError.bind(this);
		this.wss.on('error', this.handleError);
		if (this._onlyWhenConnected) {
			this._handleConnection = this._handleConnection.bind(this);
			this.wss.once('connection', this._handleConnection);
		}
	}
	util.inherits(WebSocketHandler, logging.Handler);

	WebSocketHandler.DEFAULT_HOST = '127.0.0.1';
	WebSocketHandler.DEFAULT_PORT = 9030;

	/** @inheritdoc */
	WebSocketHandler.prototype.emit = function(record) {
		this._queue.push(record);

		if (this.wss.clients.size || !this._onlyWhenConnected) {
			this._process();
		}
	};

	WebSocketHandler.prototype._process = function() {
		var record = null;
		while (record = this._queue.shift()) {
			this._send(record);
		}
	};

	WebSocketHandler.prototype._send = function(record) {
		var data = this.format(record);

		this.wss.clients.forEach(function each(client) {
			if (client.readyState !== WebSocket.OPEN) {
				return;
			}
			client.send(data);
		});
	};

	WebSocketHandler.prototype._handleConnection = function() {
		this._process();
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
