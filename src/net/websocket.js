tm.net = tm.net || {};
tm.net.event = tm.net.event || {};

(function() {

    /**
     * WebSocket.
     */
    tm.net.WebSocket = tm.createClass({
        superClass: tm.event.EventDispatcher,
        socket: null,
        /**
         * コンストラクタ.
         */
        init: function(url) {
            this.superInit();
            this.url = url;
        },
        /**
         * 接続する.
         */
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
        /**
         * 切断する.
         */
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
        /**
         * テキストメッセージを送信する.  
         */
        send: function(message) {
            if (this.isOpen()) {
                this.socket.send(message);
            }
        },
        /**
         * オブジェクトを送信する.
         *
         * JSONに変換し、テキストメッセージとして送信する.
         */
        sendData: function(object) {
            this.send(JSON.stringify(object));
        },
        /**
         * 接続中.
         */
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

    /**
     * 接続時に発生するイベント.
     */
    tm.net.event.Open = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        init: function() {
            this.superInit("open");
        }
    });

    /**
     * メッセージ受信時に発生するイベント.
     */
    tm.net.event.Message = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        /**
         * 受信したメッセージを文字列として取り出す.
         */
        message: null,
        init: function(message) {
            this.superInit("message");
            this.message = message;
        },
        /**
         * 受信したメッセージをオブジェクトとして取り出す.
         *
         * JSONとしてパースする.
         */
        getData: function() {
            return JSON.parse(this.message);
        }
    });

    /**
     * 接続解除時に発生するイベント.
     */
    tm.net.event.Close = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        init: function() {
            this.superInit("close");
        }
    });

    /**
     * エラー時に発生するイベント.
     */
    tm.net.event.Error = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        /**
         * エラー情報.
         */
        data: null,
        init: function(data) {
            this.superInit("error");
            this.data = data;
        }
    });

})();
