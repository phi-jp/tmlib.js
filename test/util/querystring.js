/*
 *
 */

describe('tm.util.QueryString', function() {

    it('stringify', function() {
        var str = tm.util.QueryString.stringify({foo: 'bar', baz: 'bob'}, ';', ':');
        assert(str == 'foo:bar;baz:bob');
    });

    it('parse', function() {
        var obj = tm.util.QueryString.parse('a=b&b=c');
        assert(obj.a === 'b');
        assert(obj.b === 'c');
    });

});
