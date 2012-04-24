/*
 * debug
 */


(function() {
    
    /**
     * @class
     * デバッグ用コンソール. 標準である console の dom 版.
     */
    tm.Console = tm.createClass({
        
        element: null,
        indent: "",
        
        init: function(arg) {
            if (typeof arg == "string") {
                this.element = document.querySelector(arg);
            }
            else {
                this.element = arg;
            }
            this.element.style.whiteSpace = "pre";
        },
        
        clear: function() {
            this.element.innerHTML = "";
            return this;
        },
        
        log: function() {
            var str = Array.prototype.join.call(arguments, ' ');
            str = str.split('\n').join('\n    ');
            this.element.innerHTML += this.indent + str + '\n';
            return this;
        },
        
        group: function(name) {
            this.element.innerHTML += "<p>{0}</p>".format(name);
            this.indent += "    ";
            return this;
        },
        
        groupEnd: function() {
            this.indent = "";
        }
        
    });
    
})();

