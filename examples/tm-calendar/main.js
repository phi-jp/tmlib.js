/*
 * phi
 */


var app = null;

/*
 * 定数(パラメータ)
 */
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 720;



/*
 * メイン
 */
tm.main(function() {
    var eTest       = tm.dom.Element("#test");
    var eCalendar   = createDOMCalendar();
    eTest.append(eCalendar);
    
    
    
    var eCalendar = Calendar("#test2");
});


var Calendar = tm.createClass({
    superClass: tm.dom.Element,
    
    init: function(id) {
        this.superInit(id);
        this.setup();
    },
    
    setup: function() {
        var table = this.create("table");
    }
});


var HEADER = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

var createDOMCalendar = function() {
    var eCalendar   = tm.dom.Element( document.createElement("table") );
    
    eCalendar.attr.set("class", "tm-calendar");
    eCalendar.attr.set("border", "1");
    
    var tr = eCalendar.create("tr");
    for (var i=0; i<7; ++i) {
        var th = tr.create("th");
        th.html = HEADER[i];
    }
    
    for (var i=0; i<5; ++i) {
        var tr = eCalendar.create("tr");
        for (var j=0; j<7; ++j) {
            var td = tr.create("td");
            td.html = i;
        }
    }
    
    return eCalendar;
};

