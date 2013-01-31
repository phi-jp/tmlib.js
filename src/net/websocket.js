tm.net = tm.net || {};
tm.net.event = tm.net.event || {};

(function() {

    tm.net.WebSocket = tm.createClass({
        superClass: tm.event.EventDispatcher,
        socket: null,
        init: function(url) {
            this.superInit();
            this.url = url;
        },
        connect: function() {
            if (this.isOpen()) {
                return;
            }

            this.socket = new WebSocket(this.url);

            var self = this;
            this.socket.onopen = function() {
                self.dispatchEvent(tm.net.event.Open());
            };
            this.socket.onmessage = function(e) {
                self.dispatchEvent(tm.net.event.Message(e.data));
            };
            this.socket.onclose = function() {
                self.dispatchEvent(tm.net.event.Close());
                self.socket = null;
            };
            this.socket.onerror = function(e) {
                self.dispatchEvent(tm.net.event.Error(e.data));
            };
        },
        disconnect: function() {
            if (this.isOpen()) {
                this.socket.close();
                this.socket = null;
            }
        },
        send: function(message) {
            if (this.isOpen()) {
                this.socket.send(message);
            } else {

            }
        },
        sendData: function(object) {
            this.send(JSON.stringify(object));
        },
        close: function() {
            if (this.socket !== null) {
                this.socket.close();
            }
            this.socket = null;
        },
        isOpen: function() {
            return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
        }
    });

    tm.net.event.WebSocketEvent = tm.createClass({        
        superClass: tm.event.Event,    
        init: function(type) {
            this.superInit(type);
        }
    });

    tm.net.event.Open = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        init: function() {
            this.superInit("open");
        }
    });

    tm.net.event.Message = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        message: null,
        init: function(message) {
            this.superInit("message");
            this.message = message;
        },
        getData: function() {
            return JSON.parse(this.message);
        }
    });

    tm.net.event.Close = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        init: function() {
            this.superInit("close");
        }
    });

    tm.net.event.Error = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        data: null,
        init: function(data) {
            this.superInit("error");
            this.data = data;
        }
    });

})();
