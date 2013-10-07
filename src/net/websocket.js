/*
 * websocket.js
 */

tm.net = tm.net || {};
tm.net.event = tm.net.event || {};

(function() {

    /**
     * @class tm.net.WebSocket
     * WebSocket対応クラス
     * @extends tm.event.EventDispatcher
     */
    tm.net.WebSocket = tm.createClass({
        superClass: tm.event.EventDispatcher,
        socket: null,
        /**
         * @constructor
         * コンストラクタ.
         */
        init: function(url) {
            this.superInit();
            this.url = url;
        },
        /**
         * @property
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
         * @property
         * 切断する.
         */
        disconnect: function() {
            if (this.isOpen()) {
                this.socket.close();
                this.socket = null;
            }
        },

        /*
         * @property
         * @TODO 重複している関数 念のためコメントアウト
         */
        // send: function(message) {
        //     if (this.isOpen()) {
        //         this.socket.send(message);
        //     } else {

        //     }
        // },

        /*
         * @property
         * @TODO 重複している関数 念のためコメントアウト
         */
        sendData: function(object) {
            this.send(JSON.stringify(object));
        },

        /**
         * @property
         * @TODO ?
         */
        close: function() {
            if (this.socket !== null) {
                this.socket.close();
            }
            this.socket = null;
        },
        /**
         * @property
         * テキストメッセージを送信する.  
         */
        send: function(message) {
            if (this.isOpen()) {
                this.socket.send(message);
            }
        },
        /**
         * @property
         * オブジェクトを送信する.
         *
         * JSONに変換し、テキストメッセージとして送信する.
         */
        sendData: function(object) {
            this.send(JSON.stringify(object));
        },
        /**
         * @property
         * 接続中.
         */
        isOpen: function() {
            return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
        }
    });

    /**
     * @class tm.net.event.WebSocketEvent
     * @TODO ?
     * @extends tm.event.Event
     */
    tm.net.event.WebSocketEvent = tm.createClass({        
        superClass: tm.event.Event,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type) {
            this.superInit(type);
        }
    });

    /**
     * @class tm.net.event.Open
     * 接続時に発生するイベント.
     * @extends tm.net.event.WebSocketEvent
     */
    tm.net.event.Open = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.superInit("open");
        }
    });

    /**
     * @class tm.net.event.Message
     * メッセージ受信時に発生するイベント.
     * @extends tm.net.event.WebSocketEvent
     */
    tm.net.event.Message = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        /**
         * @property
         * 受信したメッセージを文字列として取り出す.
         */
        message: null,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(message) {
            this.superInit("message");
            this.message = message;
        },
        /**
         * @property
         * 受信したメッセージをオブジェクトとして取り出す.
         * JSONとしてパースする.
         */
        getData: function() {
            return JSON.parse(this.message);
        }
    });

    /**
     * @class tm.net.event.Close
     * 接続解除時に発生するイベント.
     * @extends tm.net.event.WebSocketEvent
     */
    tm.net.event.Close = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.superInit("close");
        }
    });

    /**
     * @class tm.net.event.Error
     * エラー時に発生するイベント.
     * @extends tm.net.event.WebSocketEvent
     */
    tm.net.event.Error = tm.createClass({
        superClass: tm.net.event.WebSocketEvent,
        /**
         * エラー情報.
         */
        data: null,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(data) {
            this.superInit("error");
            this.data = data;
        }
    });

})();
