
//var assert = require('assert');
//require('../src/core/object');
//require('../src/core/array');

describe('tmlib', function() {
    it('tm.BROWSER', function() {
        assert.equal(tm.BROWSER, "Chrome");
    });
});


/*
describe('List Test', function() {
    
    var l = tm.List();
    var arr = [ "first", "second", "third" ];
    
    it('test', function() {
        l.add("first");
        l.add("second");
        l.add("third");
        
        assert.equal(l.get(0), "first");
        assert.equal(l.get(1), "second");
        assert.equal(l.get(2), "third");
        
        // console.log(l.toString());
        l.remove(0);
        // console.log(l.toString());
        l.remove(0);
        // console.log(l.toString());
        l.remove(0);
        // console.log(l.toString());
        
        assert.equal(l.toString(), "");
    });
    
});
*/






