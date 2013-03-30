
describe('Object Test', function() {
    
    it('isObject', function() {
        var arr = [1, 2, 3, 4, 5, 6];
        
        assert.equal(arguments.isObject(), true);
        assert.equal([2, 4, 8].isObject(), true);
        assert.equal(({}).isObject(), true);
        assert.equal((6).isObject(), true);
        assert.equal(('string').isObject(), true);
        assert.equal((function(){}).isObject(), true);
    });

});
