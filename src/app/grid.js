


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
        
        /**
         * @constructor
         */
        init: function(param) {
            this.superInit();

        },

        reposition: function() {
            var childs = this.children;

            if (this.arrangement == "horizontal") {
                childs.each(function(child, i) {
                    var xIndex = (i%this.maxPerLine);
                    var yIndex = (i/this.maxPerLine)|0;
                    var x = this.cellWidth*xIndex;
                    var y = this.cellHeight*yIndex;
                    child.setPosition(x, y);
                }, this);
            }
            else {
                childs.each(function(child, i) {
                    var xIndex = (i/this.maxPerLine)|0;
                    var yIndex = (i%this.maxPerLine);
                    var x = this.cellWidth*xIndex;
                    var y = this.cellHeight*yIndex;
                    child.setPosition(x, y);
                }, this);
            }
        },
    });

})();

