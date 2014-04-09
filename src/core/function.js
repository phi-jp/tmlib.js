/*
 * function.js
 */

(function() {
    
    /**
     * @class   global.Function
     * Functionの拡張
     */
    if (!Function.prototype.bind) {
        /**
         * @member  global.Function
         * @method  bind
         * バインド
         */
        Function.defineInstanceMethod("bind", function(obj) {
            var self = this;
            
            return function() {
                self.apply(obj, arguments);
            };
        });
    }


    // 関数名（無名関数は空文字列）を取得 (IE用パッチ)
    if (!Function.prototype.$has("name")) {
        Function.prototype.getter("name", function() {
            return (''+this).replace(/^\s*function\s*([^\(]*)[\S\s]+$/im, '$1');
        });
    }
    

    /**
     * @method  toArrayFunction
     * 関数を配列対応関数に変換.
     * forEach の逆アプローチ的な感じ.
     * 配列を継承したクラスなどに使用する.
     * ## Example
     *      var hoge = function(n) { console.log(this*n); return this*n; };
     *      var arr = [5, 10, 15];
     *      arr.hogeArray = hoge.toArrayFunction();
     *      var result = arr.hogeArray(100);
     *      console.log(result);
     */
    Function.defineInstanceMethod("toArrayFunction", function() {
        var self = this;
        return function() {
            var resultList = [];
            for (var i=0,len=this.length; i<len; ++i) {
                resultList.push( self.apply(this[i], arguments) );
            }
            return resultList;
        }
    });
    
    // forEach や map はもう標準化されてきてるので実装しないよん♪
    
})();

