/*
 * list.js
 */

(function() {
    
    /**
     * @class tm.Item
     * Item クラス
     */
    tm.Item = tm.createClass({
        /** prev */
        prev: null,
        /** next */
        next: null,
        /** data */
        data: null,
        
        /**
         * @constructor
         */
        init: function() {
        }
    });
    
    /**
     * @class tm.List
     * List クラス
     * ### Reference
     * - <http://java.sun.com/javase/ja/6/docs/ja/api/java/util/LinkedList.html>
     * - <http://www.javadrive.jp/start/linkedlist/>
     * - <http://www5c.biglobe.ne.jp/~ecb/cpp/07_08.html>
     * - <http://hextomino.tsukuba.ch/e30895.html>
     * - <http://www.nczonline.net/blog/2009/04/21/computer-science-in-javascript-doubly-linked-lists/>
     * - <http://www.nczonline.net/blog/2009/04/13/computer-science-in-javascript-linked-list/>
     */
    tm.List = tm.createClass({
        
        /**
         * @constructor
         */
        init: function() {
            this._length = 0;
            this._head = tm.Item();
            this._tail = tm.Item();
            
            this._head.next = this._tail;
            this._tail.prev = this._head;
        },
        
        /**
         * 追加
         */
        add: function(data) {
            var item = tm.Item();
            item.data = data;
            
            item.prev = this._tail.prev;
            item.next = this._tail;
            
            this._tail.prev.next = item;
            this._tail.prev = item;
            
            ++this._length;
            
            return this;
        },
        
        /**
         * 削除
         */
        remove: function(index) {
            var current = this.getItem(index);
            
            current.prev.next = current.next;
            current.next.prev = current.prev;
            
            --this._length;
            
            return current;
        },
        
        /**
         * ゲット
         */
        get: function(index) {
            return this.getItem(index).data;
        },
        
        /**
         * アイテムを取得
         */
        getItem: function(index) {
            var current = this._head.next;
            var i=0;
            
            while (i++ < index) {
                current = current.next;
            }
            
            return current;
        },
        
        /**
         * 繰り返し
         */
        forEach: function(fn) {
            // TODO:
        },
        
        /**
         * クリア
         */
        clear: function() {
            // TODO:
        },
        
        /**
         * クローン
         */
        clone: function() {
            // TODO:
        },
        
        /**
         * 最初の要素を取得
         */
        getFirst: function() {
            // TODO:
        },
        
        /**
         * 最後の要素を取得
         */
        getLast: function() {
            // TODO:
        },
        
        /**
         * 最初に一致した位置のインデックスを取得
         */
        indexOf: function(obj) {
            // TODO:
        },
        
        /**
         * 最後に一致した位置のインデックスを取得
         */
        lastIndexOf: function(obj) {
            // TODO:
        },
        
        /**
         * 配列に変換
         */
        toArray: function() {
            if (this._length <= 0) return [];
            
            var current = this._head.next;
            var arr = [];
            
            while (current.data != null) {
                arr.push(current.data);
                current = current.next;
            }
            
            return arr;
        },
        
        /**
         * 文字列に変換
         */
        toString: function() {
            var arr = this.toArray();
            for (var i=0,len=arr.length; i<len; ++i) {
                arr[i] = arr[i].toString();
            }
            
            return arr.join(',');
        },
    });
    
})();

