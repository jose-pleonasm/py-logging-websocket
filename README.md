# py-logging-websocket
Handler for [py-logging][1] which writes logging records to a WebSocket.

## Installation
```bash
npm install py-logging
```

## Usage
```javascript
var logging = require('py-logging');
var commonkit = require('py-logging/commonkit'); // JsonFormatter
var websocket = require('py-logging-websocket');

commonkit.install(logging);
websocket.install(logging);

var formatter = new logging.JsonFormatter();

var handler = new logging.WebSocketHandler({
	host: '127.0.0.1',
	port: 9030
});

handler.setFormatter(formatter);
logging.getLogger().addHandler(handler);
```

[1]: https://github.com/jose-pleonasm/py-logging
