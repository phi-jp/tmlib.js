/*
 * dom/evnet.js
 */

tm.dom = tm.dom || {};

(function() {
    
    /**
     * @class Event
     * 既存のEventオブジェクト拡張
     */
    
    // 仕方なしの IE 対応(これ引っかかったら他のもダメだから必要ないかも)
    if (!Event.prototype.stopPropagation) {
        Event.prototype.stopPropagation = function() {
            this.cancelBubble = true;
        };
    }
    if (!Event.prototype.preventDefault) {
        Event.prototype.preventDefault = function() {
            this.returnValue = false;
        };
    }
    
    /**
     * @method
     * イベントのデフォルト処理 & 伝達を止める
     */
    Event.prototype.stop = function() {
        // イベントキャンセル
        this.preventDefault();
        // イベント伝達を止める
        this.stopPropagation();
    };
    
})();


(function() {
    
    /**
     * @class KeyboardEvent
     * KeyboardEvent クラス
     */
    
    /**
     * @property    character
     * 押したキーの文字を取得
     */
    KeyboardEvent.prototype.getter("character", function(){
        return String.fromCharCode(this.keyCode);
    });
    
})();


(function() {
    
    /**
     * @class MouseEvent
     * MouseEvent クラス
     */
    
    /**
     * @property    pointX
     * マウスのX座標.
     */
    MouseEvent.prototype.getter("pointX", function() {
        return this.clientX - this.target.getBoundingClientRect().left;
//        return this.pageX - this.target.getBoundingClientRect().left - window.scrollX;
    });
    
    /**
     * @property    pointY
     * マウスのY座標.
     */
    MouseEvent.prototype.getter("pointY", function() {
        return this.clientY - this.target.getBoundingClientRect().top;
//        return this.pageY - this.target.getBoundingClientRect().top - window.scrollY;
    });
    
})();




(function() {
    
    if (window.TouchEvent === undefined) { return ; }
    
    
    /**
     * @class TouchEvent
     * TouchEvent クラス
     */
    
    /**
     * @property    pointX
     * タッチイベント.
     */
    TouchEvent.prototype.getter("pointX", function() {
        return this.touches[0].clientX - this.target.getBoundingClientRect().left;
//        return this.touches[0].pageX - this.target.getBoundingClientRect().left - tm.global.scrollX;
    });
    
    /**
     * @property    pointY
     * タッチイベント.
     */
    TouchEvent.prototype.getter("pointY", function() {
        return this.touches[0].clientY - this.target.getBoundingClientRect().top;
//        return this.touches[0].pageY - this.target.getBoundingClientRect().top - tm.global.scrollY;
    });
    
    
})();


(function() {
    
    /**
     * @class tm.dom.Event
     * Event クラス
     */
    tm.dom.Event = tm.createClass({

        /**
         * @property
         * DOMエレメント
         */
        element     : null,

        /**
         * @property
         * イベント発火時に実行する関数リスト
         */
        funcList    : null,

        /**
         * @property
         * 関数リストのインデックス　未使用？
         */
        funcIndex   : 0,
        
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element;
            this.domElement = element.element;
            this.funcList = {};
        },
        
        /**
         * @property
         * イベントを追加
         */
        add: function(type, fn, id) {
            var self = this;
            var elm  = this.element;
            
            var temp_fn = function(e) {
                // return fn.apply(self, arguments);
                var result = fn.apply(elm, arguments);
                
                if (result === false) {
                    // デフォルトイベントをキャンセル
                    e.preventDefault();
                    e.returnValue = false;  // IE
                    // イベント伝達をキャンセル
                    e.stopPropagation();
                }
                
                return result;
            }
            
            this._funcIndex = this._funcIndex || 0;
            id = id || this._funcIndex++;
            this.funcList[type] = this.funcList[type] || {};
            this.funcList[type][id] = temp_fn;
            fn._id = id;    // しれっと記録
            
            this.domElement.addEventListener(type, temp_fn, false);
            return this;
        },
        
        /**
         * @property
         * イベントを解除
         */
        remove: function(type, fn_or_id) {
            var id = (typeof(fn_or_id) === "function") ? fn_or_id._id : fn_or_id;
            var fn = this.getFunc(type, id);
            
            this.domElement.removeEventListener(type, fn, false);
            delete this.funcList[type][id];
        },
        
        /**
         * @property
         * クリックイベント
         */
        click: function(fn, id) {
            this.add("click", fn, id);
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        mdlclick: function(fn, id) {
            var temp_fn = function(e) {
                if (e.button == 1) {
                    fn(e);
                }
            }
            this.add("click", temp_fn, id);
        },
        
        /**
         * @property
         * ポインティングスタート
         */
        pointstart: function(fn, id) {
            this.add(tm.dom.Event.POINT_START, fn, id);
        },
        /**
         * @property
         * ポインティング中
         */
        pointmove: function(fn, id) {
            this.add(tm.dom.Event.POINT_MOVE, fn, id);
        },
        /**
         * @property
         * ポインティングエンド
         */
        pointend: function(fn, id) {
            this.add(tm.dom.Event.POINT_END, fn, id);
        },
        
        /**
         * @property
         * ホバーイベント
         */
        hover: function(fn, id) {
            this.add("mouseover", fn, id);
            return this;
        },
        
        /**
         * @property
         * 一度だけ呼ばれるイベントを登録
         */
        one: function(type, fn, id) {
            var self = this;
            var elm  = this.element;
            
            var temp_fn = function() {
                var result = fn.apply(elm, arguments);
                self.remove(type, temp_fn);
                return result;
            };
            
            this.add(type, temp_fn, id);
            
            return this;
        },
        
        /**
         * @property
         * トグルイベント登録
         */
        toggle: function(type, fn_list) {
            var self = this;
            var elm  = this.element;
            var temp_list = [];
            
            for (var i=0; i<fn_list.length; ++i) {
                var temp_fn = (function(i){
                    return function(){
                        var result = fn_list[i].apply(elm, arguments);
                        
                        if (result !== false) {
                            var index = (i+1)%fn_list.length;
                            self.one(type, temp_list[index]);
                        }
                    }
                })(i);
                temp_list.push(temp_fn);
            }
            
            this.one(type, temp_list[0]);
            
            return this;
        },
        
        /**
         * @property
         * 指定したイベントタイプ & id の関数を取得
         */
        getFunc: function(type, id) {
            return this.funcList[type][id];
        },
        
    });
    
    tm.dom.Event.POINT_START    = (tm.isMobile) ? "touchstart" : "mousedown";
    tm.dom.Event.POINT_MOVE     = (tm.isMobile) ? "touchmove" : "mousemove";
    tm.dom.Event.POINT_END      = (tm.isMobile) ? "touchend" : "mouseup";
    
    
    /**
     * @property    event
     * スタイルクラス
     */
    tm.dom.Element.prototype.getter("event", function(){
        return this._event || ( this._event = tm.dom.Event(this) );
    });
    
})();



