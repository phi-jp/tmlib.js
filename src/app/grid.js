


;(function() {


    /**
     * @class tm.app.Grid
     * @extends tm.app.Object2d
     * グリッド
     */
    tm.define("tm.app.Grid", {
        superClass: "tm.app.Object2D",

        cellWidth: 64,
        cellHeight: 64,
        maxPerLine: 8,
        arrangement: "horizontal", // vertical
        margin: 0,
        
        /**
         * @constructor
         */
        init: function(param) {
            this.superInit();

        },

        reposition: function() {
            var childs = this.children;

            if(this.margin < 0) { this.margin = 0; }

            if (this.arrangement == "horizontal") {
                childs.each(function(child, i) {
                    var xIndex = (i%this.maxPerLine);
                    var yIndex = (i/this.maxPerLine)|0;
                    var x = (this.cellWidth+this.margin)*xIndex;
                    var y = (this.cellHeight+this.margin)*yIndex;
                    child.setPosition(x, y);
                }, this);
            }
            else {
                childs.each(function(child, i) {
                    var xIndex = (i/this.maxPerLine)|0;
                    var yIndex = (i%this.maxPerLine);
                    var x = (this.cellWidth+this.margin)*xIndex;
                    var y = (this.cellHeight+this.margin)*yIndex;
                    child.setPosition(x, y);
                }, this);
            }
        },
    });

})();

