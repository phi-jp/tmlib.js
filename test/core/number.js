
describe('core.Number', function() {
    
    it('round', function() {
        assert.equal((42.1947).round(), 42);
        assert.equal((42.1947).round(0), 42);
        assert.equal((42.1947).round(1), 42.2);
        assert.equal((42.1947).round(2), 42.19);
        assert.equal((42.1947).round(3), 42.195);
    });
    
    it('ceil', function() {
        assert.equal((42.1947).ceil(), 43);
        assert.equal((42.1947).ceil(0), 43);
        assert.equal((42.1947).ceil(1), 42.2);
        assert.equal((42.1947).ceil(2), 42.2);
        assert.equal((42.1947).ceil(3), 42.195);
    });
    
    it('floor', function() {
        assert.equal((42.1947).floor(), 42);
        assert.equal((42.1947).floor(0), 42);
        assert.equal((42.1947).floor(1), 42.1);
        assert.equal((42.1947).floor(2), 42.19);
        assert.equal((42.1947).floor(3), 42.194);
    });

    it('toInt', function() {
        assert.equal((42.195).toInt(), 42);
    });

    it('toHex', function() {
        assert.equal((64).toHex(), '40');
        assert.equal((100).toHex(), '64');
    });

    it('toBin', function() {
        assert.equal((64).toBin(), '1000000');
        assert.equal((100).toBin(), '1100100');
    });
    
    it('toUnsigned', function() {
        assert.equal((0xf0f0f0ff | 0xff000000).toUnsigned(), 0xfff0f0ff);
        assert.equal((0xf0f0f0ff & 0xff000000).toUnsigned(), 0xf0000000);
    });

    it('padding', function() {
        assert.equal((50).padding(10), "0000000050");
    });

    it('times', function() {
        var arr = [];
        (5).times(function(i) {
            arr.push(i);
        });
        assert(arr.equals([0, 1, 2, 3, 4]));
    });

    it('upto', function() {
        var arr = [];
        (6).upto(8, function(i) {
            arr.push(i);
        });
        assert(arr.equals([6, 7, 8]));
    });

    it('downto', function() {
        var arr = [];
        (8).downto(6, function(i) {
            arr.push(i);
        });
        console.log(arr);
        assert(arr.equals([8, 7, 6]));
    });

    it('step', function() {
        var arr = [];
        (2.4).step(5.3, 0.8, function(n) {
            arr.push(n);
        });
        assert(arr.equals([2.4, 3.2, 4.0, 4.8]));
    });

});
