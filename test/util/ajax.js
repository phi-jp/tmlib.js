/*
 *
 */

describe('tm.util.Ajax', function() {

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

    it('load', function(done) {
    	tm.util.Ajax.load({
    		url: "./util/data/sample.txt",
    		success: function(data) {
    			assert(data == TEXT_FILE_DATA);
    			done();
    		}
    	});
    });

    it('load({dataType:"json"})', function(done) {
    	tm.util.Ajax.load({
    		url: "./util/data/sample.json",
    		dataType: "json",
    		success: function(data) {
    			for (var key in JSON_FILE_DATA) {
    				assert(JSON_FILE_DATA[key] === data[key]);
    			}
    			done();
    		}
    	});
    });

    it('load({dataType:"xml"})', function(done) {
    	tm.util.Ajax.load({
    		url: "./util/data/sample.xml",
    		dataType: "xml",
    		success: function(data) {
    			var items = data.querySelectorAll("item");

    			assert(items[0].innerHTML.trim() == "hoge");
    			assert(items[1].innerHTML.trim() == "foo");

    			done();
    		}
    	});
    });

    it('load({dataType:"script"})', function(done) {
    	tm.util.Ajax.load({
    		url: "./util/data/sample.js",
    		dataType: "script",
    		success: function(data) {
    			assert(js_sample === 100);

    			done();
    		}
    	});
    });
    
});

