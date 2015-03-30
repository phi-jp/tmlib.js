/*
 * グリッドシステム
 */
tm.define("tm.util.GridSystem", {
    width: 640, // 幅
    col: 12,    // 列数
    
    init: function(width, col) {
        if (typeof arguments[0] === 'object') {
            var param = arguments[0];
            width = param.width;
            col = param.col;
        }
        
        this.width = width;
        this.col = col;
        this.unitWidth = this.width/this.col;
    },
    
    // スパン指定で値を取得(負数もok)
    span: function(index) {
        index += this.col;
        index %= this.col;

        return this.unitWidth * index;
    },
    
    // 真ん中
    center: function() {
        return this.unitWidth * (this.col/2);
    },
});
