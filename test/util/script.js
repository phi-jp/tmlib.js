/*
 *
 */

describe('tm.util.Script', function() {
    
    it('loadStats', function(done) {
    	var script = tm.util.Script.loadStats();

    	assert(window.Stats === undefined);

    	script.onload = function() {
	    	assert(window.Stats !== undefined);
    		done();
    	};
    });
    
    it('loadDatGUI', function(done) {
    	var script = tm.util.Script.loadDatGUI();

    	assert(window.dat === undefined);

    	script.onload = function() {
	    	assert(window.dat !== undefined);
    		done();
    	};
    });
    
    it('loadThree', function(done) {
    	var script = tm.util.Script.loadThree();

    	assert(window.THREE === undefined);

    	script.onload = function() {
	    	assert(window.THREE !== undefined);
    		done();
    	};
    });
    
    it('loadBulletML', function(done) {
    	var script = tm.util.Script.loadBulletML();

    	assert(window.bulletml === undefined);

    	script.onload = function() {
	    	assert(window.bulletml !== undefined);
    		done();
    	};
    });

});
