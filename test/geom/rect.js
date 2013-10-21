
describe('tm.geom.Rect', function() {
    
    it('init', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);

        assert(rect.x === 32);
        assert(rect.y === 64);
        assert(rect.width  === 100);
        assert(rect.height === 200);
    });
    
    it('set', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);
        rect.set(32, 64, 100, 200);

        assert(rect.x === 32);
        assert(rect.y === 64);
        assert(rect.width  === 100);
        assert(rect.height === 200);
    });
    
    it('move', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);
        rect.move(50, 100);

        assert(rect.x === 50);
        assert(rect.y === 100);
        assert(rect.width  === 100);
        assert(rect.height === 200);
    });
    
    it('moveBy', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);
        rect.moveBy(100, 200);

        assert(rect.x === 132);
        assert(rect.y === 264);
        assert(rect.width  === 100);
        assert(rect.height === 200);
    });
    
    it('resize', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);
        rect.resize(50, 100);

        assert(rect.x === 32);
        assert(rect.y === 64);
        assert(rect.width  === 50);
        assert(rect.height === 100);
    });
    
    it('resizeBy', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);
        rect.resizeBy(50, 100);

        assert(rect.x === 32);
        assert(rect.y === 64);
        assert(rect.width  === 150);
        assert(rect.height === 300);
    });
    
    it('padding', function() {
        var rect  = tm.geom.Rect(50, 100, 150, 200);

        rect.set(50, 100, 150, 200);
        rect.padding(10);
        assert(rect.x === 60);
        assert(rect.y ===110);
        assert(rect.width  === 130);
        assert(rect.height === 180);

        rect.set(50, 100, 150, 200);
        rect.padding(10, 20);
        assert(rect.x === 70);
        assert(rect.y ===110);
        assert(rect.width  === 110);
        assert(rect.height === 180);

        rect.set(50, 100, 150, 200);
        rect.padding(10, 20, 30);
        assert(rect.x === 70);
        assert(rect.y ===110);
        assert(rect.width  === 110);
        assert(rect.height === 160);

        rect.set(50, 100, 150, 200);
        rect.padding(10, 20, 30, 40);
        assert(rect.x === 90);
        assert(rect.y ===110);
        assert(rect.width  === 90);
        assert(rect.height === 160);
    });
    
    it('clone', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);
        var rect2 = rect.clone();

        assert(rect2.x === 32);
        assert(rect2.y === 64);
        assert(rect2.width  === 100);
        assert(rect2.height === 200);
    });

    it('toCircle', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);
        var circle = rect.toCircle();

        assert(circle.x === 82);
        assert(circle.y === 164);
        assert(circle.radius  === 50);
    });
    
    it('toArray', function() {
        var rect  = tm.geom.Rect(32, 64, 100, 200);
        var arr   = rect.toArray();

        assert(arr.equals([32, 64, 100, 200]));
    });
});
