/*
 * array.js
 */


(function() {
    
    /**
     * @class   Array
     * 配列
     */
    
    /**
     * @property    first
     * 最初の要素
     */
    Array.prototype.accessor("first", {
        "get": function()   { return this[0]; },
        "set": function(v)  { this[0] = v; }
    });
    
    /**
     * @property    last
     * 最後の要素
     */
    Array.prototype.accessor("last", {
        "get": function()   { return this[this.length-1]; },
        "set": function(v)  { this[this.length-1] = v; }
    });
    
    
    /**
     * @method  equals
     * 渡された配列と等しいかどうかをチェック
     */
    Array.defineInstanceMethod("equals", function(arr) {
        // // 長さもチェックするかを検討
        // if (this.length !== arr.length) return false;
        
        for (var i=0,len=this.length; i<len; ++i) {
            if (this[i] !== arr[i]) {
                return false;
            }
        }
        return true;
    });
    
    /**
     * @method  deepEquals
     * ネストされている配列含め渡された配列と等しいかどうかをチェック
     * equalsDeep にするか検討. (Java では deepEquals なのでとりあえず合わせとく)
     */
    Array.defineInstanceMethod("deepEquals", function(arr) {
        for (var i=0,len=this.length; i<len; ++i) {
            var result = (this[i].deepEquals) ? this[i].deepEquals(arr[i]) : (this[i] === arr[i]);
            if (result === false) {
                return false;
            }
        }
        return true;
    });
    
    /**
     * @method  at
     * ループ添字アクセス(Ruby っぽいやつ)
     */
    Array.defineInstanceMethod("at", function(i) {
        i%=this.length;
        i+=this.length;
        i%=this.length;
        return this[i];
    });
    
    
    /**
     * @method  swap
     * a番目 と b番目 を入れ替える
     */
    Array.defineInstanceMethod("swap", function(a, b) {
        var temp = this[a];
        this[a] = this[b];
        this[b] = temp;
        return this;
    });
    
    
    /**
     * @method  erase
     * elm と一致する要素を削除
     */
    Array.defineInstanceMethod("erase", function(elm) {
        var index  = this.indexOf(elm);
        this.splice(index, 1);
        return this;
    });
    
    /**
     * @method  eraseAll
     * elm と一致する要素を全て削除
     */
    Array.defineInstanceMethod("eraseAll", function(elm) {
        for (var i=0,len=this.length; i<len; ++i) {
            if (this[i] == elm) {
                this.splice(i--, 1);
            }
        }
        return this;
    });
    
    /**
     * @method  eraseIf
     * 条件にマッチした要素を削除
     */
    Array.defineInstanceMethod("eraseIf", function(fn) {
        for (var i=0,len=this.length; i<len; ++i) {
            if ( fn(this[i], i, this) ) { this.splice(i--, 1); }
        }
        return this;
    });
    
    /**
     * @method  random
     * 要素の中からランダムで取り出す
     */
    Array.defineInstanceMethod("random", function(min, max) {
        min = min || 0;
        max = max || this.length-1;
        return this[ Math.rand(min, max) ];
    });
    
    
    /**
     * @method  uniq
     * 重複削除
     */
    Array.defineInstanceMethod("uniq", function(deep) {
        var arr = [];
        for (var i=0,len=this.length; i<len; ++i) {
            var value = this[i];
            if (value in arr == false) {
                arr.push(value);
            }
        }
        return arr;
    });
    
    /**
     * @method  flatten
     * フラット.
     * Ruby のやつ.
     */
    Array.defineInstanceMethod("flatten", function(deep) {
        var arr = [];
        for (var i=0,len=this.length; i<len; ++i) {
            var value = this[i];
            if (value instanceof Array) {
                arr = arr.concat(value.flatten());
            }
            else {
                arr.push(value);
            }
        }
        return arr;
    });
    
    /**
     * @method  clone
     * 配列をクローン
     */
    Array.defineInstanceMethod("clone", function(deep) {
        if (deep == true) {
            var a = Array(this.length);
            for (var i=0,len=this.length; i<len; ++i) {
                a[i] = (this[i].clone) ? this[i].clone(deep) : this[i];
            }
            return a;
        };
        
        return Array.prototype.slice.apply(this);
    });
    
    /**
     * @method  clear
     * クリア
     */
    Array.defineInstanceMethod("clear", function() {
        this.length = 0;
        return this;
    });
    
    /**
     * @method  fill
     * 特定の値で満たす
     */
    Array.defineInstanceMethod("fill", function(value, start, end) {
        start = start || 0;
        end   = end   || (this.length-1);
        
        for (var i=start; i<end; ++i) {
            this[i] = value;
        }
        
        return this;
    });
    
    /**
     * @method  shuffle
     * シャッフル
     */
    Array.defineInstanceMethod("shuffle", function() {
        for (var i=0,len=this.length; i<len; ++i) {
            this.swap(i, Math.rand(0, len));
        }
        
        return this;
    });
    
    /**
     * @method  toULElement
     * ULElement に変換
     */
    Array.defineInstanceMethod("toULElement", function(){
        // TODO: 
    });

    /**
     * @method  toOLElement
     * OLElement に変換
     */
    Array.defineInstanceMethod("toOLElement", function(){
        // TODO:
    });
    
})();

