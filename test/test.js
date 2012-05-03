
//var assert = require('assert');
//require('../src/core/object');
//require('../src/core/array');

describe('tmlib Test', function() {
    it('tm.BROWSER', function() {
        assert.equal(tm.BROWSER, "Chrome");
    });
});



describe('Array Test', function() {
    
    describe('first', function() {
        var arr = [1, 2, 3, 4, 5, 6];
        
        it('test', function() {
            assert.equal(arr.first, 1);
            assert.equal(tm.BROWSER, "Chrome");
        });
        
    });
    
    describe('last', function() {
        var arr = [1, 2, 3, 4, 5, 6];
        
        it('test', function() {
            assert.equal(arr.last, 6);
        });
        
    });
    

    describe('equals', function() {
        var arr = [6, 5, 2, 3, 1, 4];
        
        it('test', function() {
            assert(arr.equals([6, 5, 2, 3, 1, 4]));
        });
        
    });
    
    describe('deepEquals', function() {
        var arr = [6, 5, 2, 3, 1, 4];
        var arr2= [
            [5, 2, 1],
            5,
            [2, 2, 2, 3, 4, 5],
            66,
        ];
        
        it('test', function() {
            assert(arr.deepEquals([6, 5, 2, 3, 1, 4]));
            assert(arr2.deepEquals([
                [5, 2, 1],
                5,
                [2, 2, 2, 3, 4, 5],
                66,
            ]));
        });
        
    });
    
    
    describe('at', function() {
        var arr = [1, 2, 3, 4, 5, 6];
        
        it('test', function()
        {
            assert.equal(arr.at(0), 1);
            assert.equal(arr.at(20), 3);
            assert.equal(arr.at(100), 5);
            assert.equal(arr.at(-1), 6);
            assert.equal(arr.at(-10), 3);
        });
        
    });
    
    describe('swap', function() {
        var arr = [1, 2, 3, 4, 5, 6];
        
        it('test', function() {
            arr.swap(0, 5);
            assert(arr.equals([6, 2, 3, 4, 5, 1]));
        });
        
    });
    
});



describe('Vector3 Test', function() {
    
    it('init', function() {
        var v  = tm.geom.Vector3(0, 1, 2);
        assert(v.equals(0, 1, 2));
    });
    
    it('set', function() {
        var v  = tm.geom.Vector3();
        v.set(0, 1, 2);
        assert(v.equals(0, 1, 2));
    });
    
    it('setFromNumber', function() {
        var v  = tm.geom.Vector3();
        v.setFromNumber(2, 1, 0);
        assert(v.equals(2, 1, 0));
    });
    
    it('setFromObject', function() {
        var v  = tm.geom.Vector3();
        v.setFromObject({
            x: 2,
            y: 1, 
            z: 0
        });
        assert(v.equals(2, 1, 0));
    });
    
    it('setFromString', function() {
        var v  = tm.geom.Vector3();
        
        v.setFromString("(6, 7, 8)")
        assert(v.equals(6, 7, 8));
    });
    
    it('setSmart', function() {
        var v  = tm.geom.Vector3();
        
        v.setSmart(6, 7, 8);
        assert(v.equals(6, 7, 8));
        
        v.setSmart([9, 10, 11]);
        assert(v.equals(9, 10, 11));
        
        v.setSmart({x:12, y:13, z: 14});
        assert(v.equals(12, 13, 14));
        
        v.setSmart("(15.012,-16.125, 17.55)");
        assert(v.equals(15.012, -16.125, 17.55));
    });
    
});

















