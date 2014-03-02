/*
 *
 */

describe('tm.util.File', function() {
    
	var TEXT_FILE_DATA = "Text Text Text Text\n\
Text Text Text Text\n\
Text Text Text Text\n\
Text Text Text Text\n";
	var JSON_FILE_DATA = {
	    "num": 100,
	    "flag": false,
	    "hoge": "foo",
	    "fuga": "bar"
	};

    it('init(txt)', function(done) {
    	var file = tm.util.File({
    		url: "./util/data/sample.txt",
    	});
    	file.onload = function() {
			assert(this.data == TEXT_FILE_DATA);
			done();
		};
    });

    it('init(json)', function(done) {
    	var file = tm.util.File({
    		url: "./util/data/sample.json",
    		dataType: "json",
    	});
    	file.onload = function() {
			for (var key in JSON_FILE_DATA) {
				assert(JSON_FILE_DATA[key] === this.data[key], key);
			}
			done();
		};
    });

    it('init(xml)', function(done) {
    	var file = tm.util.File({
    		url: "./util/data/sample.xml",
    		dataType: "xml",
    	});
    	file.onload = function() {
			var items = this.data.querySelectorAll("item");

			assert(items[0].innerHTML.trim() == "hoge");
			assert(items[1].innerHTML.trim() == "foo");

			done();
		};
    });

    it('init(script)', function(done) {
    	var file = tm.util.File({
    		url: "./util/data/sample.js",
    		dataType: "script",
    	});
    	file.onload = function() {
			assert(js_sample === 100);

			done();
		};
    });

});
