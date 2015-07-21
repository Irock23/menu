(function (window) {
	var WS = WebSocket || MozWebSocket;

	function DewRCON(address, port, secure) {
		if (typeof address === 'boolean') {
			secure = address;
			address = undefined;
		}
		if (typeof address !== 'string') address = '127.0.0.1';
		if (typeof port === 'boolean') {
			secure = port;
			port = undefined;
		}
		if (isNaN(port = +port) || port < 1 || port > 65535) port = 11776;
		this.webSocket = new WS('ws' + (secure ? 's' : '') + '://' + address + ':' + port, 'dew-rcon');
	}

	DewRCON.prototype.isOpen = function () {
		return this.webSocket.readyState === 1;
	};

	DewRCON.prototype.send = function (data) {
		this.webSocket.send(data);
	};

	DewRCON.prototype.close = function (code, reason) {
		this.webSocket.close(code, reason);
	};

	DewRCON.prototype.on = function (event, listener) {
		this.webSocket.addEventListener(event, listener);
	};

	window.DewRCON = DewRCON;
})(this);