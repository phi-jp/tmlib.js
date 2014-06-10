
describe('core.Object', function() {
    
    it('$forIn', function() {
        var obj = { name: 'phi', age: 25, bloodType: 'O' };
        var temp = {};

        obj.$forIn(function(key, value) {
            temp[key] = value;
        });

        assert.equal(temp['name'], 'phi');
        assert.equal(temp['age'], 25);
        assert.equal(temp['bloodType'], 'O');
    });
    
    it('$has', function() {
        var obj = { name: 'phi', age: 24 };
        assert(obj.$has("name"));
        assert(!obj.$has("bloodType"));
    });
    
    it('$extend', function() {
        var obj = { name: 'phi' };
        obj.$extend({age:24});
        assert.equal(JSON.stringify(obj), '{"name":"phi","age":24}');
        obj.$extend({bloodType:'O'}, {birthday:'1988/a/bb'});
        assert.equal(JSON.stringify(obj), '{"name":"phi","age":24,"bloodType":"O","birthday":"1988/a/bb"}');
        assert.equal(JSON.stringify({}.$extend(obj)), '{"name":"phi","age":24,"bloodType":"O","birthday":"1988/a/bb"}');
    });
    
    it('$safe', function() {
        var obj = { name: 'phi' };
        obj.$safe({age:24});
        assert.equal(JSON.stringify(obj), '{"name":"phi","age":24}');
        obj.$safe({bloodType:'O'}, {birthday:'1988/a/bb'});
        assert.equal(JSON.stringify(obj), '{"name":"phi","age":24,"bloodType":"O","birthday":"1988/a/bb"}');
        obj.$safe({name: 'hoge'});
        assert.equal(JSON.stringify(obj), '{"name":"phi","age":24,"bloodType":"O","birthday":"1988/a/bb"}');
    });
    
    it('$strict', function() {
        var obj = { name: 'phi' };
        obj.$strict({age:24});
        assert.equal(JSON.stringify(obj), '{"name":"phi","age":24}');
        obj.$strict({bloodType:'O'}, {birthday:'1988/a/bb'});
        assert.equal(JSON.stringify(obj), '{"name":"phi","age":24,"bloodType":"O","birthday":"1988/a/bb"}');
//        obj.$strict({name: 'hoge'});
//        assert.equal(JSON.stringify(obj), '{"name":"phi","age":24,"bloodType":"O","birthday":"1988/a/bb"}');
    });
    
    it('$pick', function() {
        var obj = { name: 'phi', age: 24 };
        assert.equal(JSON.stringify(obj.$pick("name")), '{"name":"phi"}');
        assert.equal(JSON.stringify(obj.$pick("name", "age")), '{"name":"phi","age":24}');
    });
    
    it('$omit', function() {
        var obj = { name: 'phi', age: 24 };
        assert.equal(JSON.stringify(obj.$omit("name")), '{"age":24}');
        assert.equal(JSON.stringify(obj.$omit("name", "age")), '{}');
    });

    describe("for vs forEach", function() {
        return ;
        it('for', function() {
            var arr = [].range(1000000);
            var sum = 0;
            for (var i=0,len=arr.length; i<len; ++i) {
                sum += arr[i];
            }
        });
        it('forEach', function() {
            var arr = [].range(1000000);
            var sum = 0;
            arr.forEach(function(v) {
                sum += v;
            });
        });
    });

    describe("cross vs shift vs pow", function() {
        return ;
        var loop = 1000000;
        var count = 10;
        var answer = Math.pow(2, count);
        it('cross', function() {
            [].range(loop).forEach(function() {
                var n = 2;
                for (var i=1,len=count; i<len; ++i) {
                    n *= 2;
                }
                assert(n == answer);
            });
        });
        it('shift', function() {
            [].range(loop).forEach(function() {
                var n = 2;
                for (var i=1,len=count; i<len; ++i) {
                    n = n<<1;
                }
                assert(n == answer);
            });
        });
        it('pow', function() {
            [].range(loop).forEach(function() {
                var n = 2;
                n = Math.pow(n, count);
                assert(n == answer);
            });
        });
    });


    describe("property vs accessor", function() {
        return ;
        it('property', function() {
            var obj = {};
            obj.num = 6;

            var sum = 0;
            for (var i=0; i<100000000; ++i) {
                sum += obj.num;
            }
            assert(sum == 600000000);
        });
        it('accessor', function() {
            var obj = {};
            obj.accessor("num", {
                get: function() { return this._num; },
                set: function(v) { this._num=v; }
            });
            obj.num = 6;

            var sum = 0;
            for (var i=0; i<100000000; ++i) {
                sum += obj.num;
            }
            assert(sum == 600000000);
        });
    });

});






