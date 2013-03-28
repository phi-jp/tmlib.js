;(function() {

    tm.app.Interaction.prototype.setBoundingType = function(type) {
        this.boundingType = type;
    };

    /**
     * @property    boundingType
     * バウンディングタイプ
     */
    tm.app.Interaction.prototype.accessor("boundingType", {
        "get": function()   {
            return this.element.boundingType;
        },
        "set": function(v)  {
            this.element.boundingType = v;
        }
    });

})();
