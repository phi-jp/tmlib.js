


describe('tm.util.Type Test', function() {
    it('isObject', function() {
    	var fn = tm.util.Type.isObject;
        assert.equal(fn([2, 4, 8]),     true);
        assert.equal(fn(arguments),     true);
        assert.equal(fn(function() {}), true);
        assert.equal(fn('string'),     false);
        assert.equal(fn(6),            false);
        assert.equal(fn(new Date()),    true);
        assert.equal(fn(/hoge/),        true);
        assert.equal(fn(undefined),    false);
        assert.equal(fn(null),         false);
    });

    it('isArray', function() {
    	var fn = tm.util.Type.isArray;
        assert.equal(fn([2, 4, 8]),     true);
        assert.equal(fn(arguments),    false);
        assert.equal(fn(function() {}),false);
        assert.equal(fn('string'),     false);
        assert.equal(fn(6),            false);
        assert.equal(fn(new Date()),   false);
        assert.equal(fn(/hoge/),       false);
        assert.equal(fn(undefined),    false);
        assert.equal(fn(null),         false);
    });

    it('isArguments', function() {
    	var fn = tm.util.Type.isArguments;
        assert.equal(fn([2, 4, 8]),    false);
        assert.equal(fn(arguments),     true);
        assert.equal(fn(function() {}),false);
        assert.equal(fn('string'),     false);
        assert.equal(fn(6),            false);
        assert.equal(fn(new Date()),   false);
        assert.equal(fn(/hoge/),       false);
        assert.equal(fn(undefined),    false);
        assert.equal(fn(null),         false);
    });

    it('isFunction', function() {
    	var fn = tm.util.Type.isFunction;
        assert.equal(fn([2, 4, 8]),    false);
        assert.equal(fn(arguments),    false);
        assert.equal(fn(function() {}), true);
        assert.equal(fn('string'),     false);
        assert.equal(fn(6),            false);
        assert.equal(fn(new Date()),   false);
        assert.equal(fn(/hoge/),       false);
        assert.equal(fn(undefined),    false);
        assert.equal(fn(null),         false);
    });

    it('isString', function() {
    	var fn = tm.util.Type.isString;
        assert.equal(fn([2, 4, 8]),    false);
        assert.equal(fn(arguments),    false);
        assert.equal(fn(function() {}),false);
        assert.equal(fn('string'),      true);
        assert.equal(fn(6),            false);
        assert.equal(fn(new Date()),   false);
        assert.equal(fn(/hoge/),       false);
        assert.equal(fn(undefined),    false);
        assert.equal(fn(null),         false);
    });

    it('isNumber', function() {
    	var fn = tm.util.Type.isNumber;
        assert.equal(fn([2, 4, 8]),    false);
        assert.equal(fn(arguments),    false);
        assert.equal(fn(function() {}),false);
        assert.equal(fn('string'),     false);
        assert.equal(fn(6),             true);
        assert.equal(fn(new Date()),   false);
        assert.equal(fn(/hoge/),       false);
        assert.equal(fn(undefined),    false);
        assert.equal(fn(null),         false);
    });

    it('isDate', function() {
    	var fn = tm.util.Type.isDate;
        assert.equal(fn([2, 4, 8]),    false);
        assert.equal(fn(arguments),    false);
        assert.equal(fn(function() {}),false);
        assert.equal(fn('string'),     false);
        assert.equal(fn(6),            false);
        assert.equal(fn(new Date()),    true);
        assert.equal(fn(/hoge/),       false);
        assert.equal(fn(undefined),    false);
        assert.equal(fn(null),         false);
    });

    it('isRegExp', function() {
    	var fn = tm.util.Type.isRegExp;
        assert.equal(fn([2, 4, 8]),    false);
        assert.equal(fn(arguments),    false);
        assert.equal(fn(function() {}),false);
        assert.equal(fn('string'),     false);
        assert.equal(fn(6),            false);
        assert.equal(fn(new Date()),   false);
        assert.equal(fn(/hoge/),        true);
        assert.equal(fn(undefined),    false);
        assert.equal(fn(null),         false);
    });

    it('isEmpty', function() {
    	var fn = tm.util.Type.isEmpty;
        assert.equal(fn([2, 4, 8]),    false);
        assert.equal(fn(arguments),     true);
        assert.equal(fn(function() {}), true);
        assert.equal(fn('string'),     false);
        assert.equal(fn(6),             true);
        assert.equal(fn(new Date()),    true);
        assert.equal(fn(/hoge/),        true);
        
        assert.equal(fn(undefined),     true);
        assert.equal(fn(null),          true);
        assert.equal(fn(''),            true);
        assert.equal(fn([]),            true);
        assert.equal(fn({}),            true);
    });
});



