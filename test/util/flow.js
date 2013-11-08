/*
 *
 */

describe('tm.util.Flow', function() {
    
    it('init', function() {
        var fn = function() {
            console.log("finish!");
        };
        
        var flow = tm.util.Flow(1, fn);
        
        assert(flow.waits == 1);
        assert(flow.callback == fn);
    });
    
    it('setup', function() {
        var fn = function() {
            console.log("finish!");
        };
        
        var flow = tm.util.Flow();
        
        flow.setup(1, fn);
        
        assert(flow.waits == 1);
        assert(flow.callback == fn);
    });
    
    it('pass', function() {
        var flow = tm.util.Flow(2, function() {
            console.log("finish!");
        });
        flow.pass();
        
        assert(flow.counter == 1);
    });
    
    it('isFinish', function() {
        var flow = tm.util.Flow(2, function() {
            console.log("finish!");
        });
        flow.pass();
        flow.pass();
        
        assert(flow.isFinish() === true);
    });
    
    it('callback', function() {
        var flag = false;
        var flow = tm.util.Flow(3, function() {
            flag = true;
            console.log("finish!");
        });
        
        flow.pass();
        assert(flag === false);
        
        flow.pass();
        assert(flag === false);
        
        flow.pass();
        assert(flag === true);
    });
    
    
    it('onflowfinish', function() {
        var flag = false;
        var flow = tm.util.Flow(2, function() {
            console.log("finish!");
        });
        
        flow.onflowfinish = function() {
            flag = true;
        };
        
        flow.pass();
        assert(flag === false);
        
        flow.pass();
        assert(flag === true);
    });

    it('args', function() {
        var foo = null;
        var bar = null;
        
        var flow = tm.util.Flow(2, function(args) {
            foo = args.foo;
            bar = args.bar;
        });
        
        flow.pass('foo', 100);
        flow.pass('bar', '200');
        
        assert(foo === 100);
        assert(bar === '200');
    });
    
});
    
