
describe('tm.event.EventDispatcher', function() {
    
    it('init', function() {
        var elm  = tm.event.EventDispatcher();
    });
    
    it('on', function() {
        var elm  = tm.event.EventDispatcher();
        var flag = false;
        elm.on("hoge", function() {
        	flag = true;
        });

        var e = tm.event.Event("hoge");
        elm.fire(e);

        assert(flag === true);
    });
    
    it('off', function() {
        var elm  = tm.event.EventDispatcher();
        var flag = false;
        var func = function() {
        	flag = true;
        };
        elm.on("hoge", func);
        elm.off("hoge", func);

        var e = tm.event.Event("hoge");
        elm.fire(e);

        assert(flag === false);
    });

    it('fire', function() {
        var elm  = tm.event.EventDispatcher();
        var num = 0;
        var func = function() {
        	++num;
        };
        elm.on("eventname", func);
        elm.on("eventname", func);
        elm.oneventname = func;

        var e = tm.event.Event("eventname");
        elm.fire(e);

        assert(num === 3);
    });

    it('one', function() {
    	var test = tm.event.EventDispatcher();
    	var count = 0;
    	var flags = [false, false, false, false, false];

    	test.one("testevent", function() { count += 1; flags[0] = true; });
    	test.one("testevent", function() { count += 1; flags[1] = true; });
    	test.one("testevent", function() { count += 1; flags[2] = true; });
    	test.one("testevent", function() { count += 1; flags[3] = true; });
    	test.one("testevent", function() { count += 1; flags[4] = true; });

    	test.fire( tm.event.Event("testevent") );

    	assert(count === 5);
    	assert(flags.equals([true, true, true, true, true]));
    });

});

