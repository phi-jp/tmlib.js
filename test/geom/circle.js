
describe('tm.geom.Circle', function() {
    
    it('init', function() {
        var circle  = tm.geom.Circle(32, 64, 128);
        assert(circle.x === 32);
        assert(circle.y === 64);
        assert(circle.radius ===128);
    });
    
    it('set', function() {
        var circle  = tm.geom.Circle();
        circle.set(32, 64, 128);

        assert(circle.x === 32);
        assert(circle.y === 64);
        assert(circle.radius ===128);
    });
    
    it('move', function() {
        var circle  = tm.geom.Circle(32, 64, 128);
        circle.move(100, 200);

        assert(circle.x === 100);
        assert(circle.y === 200);
        assert(circle.radius ===128);
    });
    
    it('moveBy', function() {
        var circle  = tm.geom.Circle(32, 64, 128);
        circle.moveBy(100, 200);

        assert(circle.x === 132);
        assert(circle.y === 264);
        assert(circle.radius ===128);
    });
    
    it('resize', function() {
        var circle  = tm.geom.Circle(32, 64, 128);
        circle.resize(200);

        assert(circle.x === 32);
        assert(circle.y === 64);
        assert(circle.radius ===200);
    });
    
    it('resizeBy', function() {
        var circle  = tm.geom.Circle(32, 64, 128);
        circle.resizeBy(200);

        assert(circle.x === 32);
        assert(circle.y === 64);
        assert(circle.radius ===328);
    });
    
    it('clone', function() {
        var circle  = tm.geom.Circle(32, 64, 128);
        var circle2 = circle.clone();

        assert(circle2.x === 32);
        assert(circle2.y === 64);
        assert(circle2.radius ===128);
    });
    
    it('toRect', function() {
        var circle  = tm.geom.Circle(100, 200, 100);
        var rect = circle.toRect();

        assert(rect.x === 0);
        assert(rect.y === 100);
        assert(rect.width  === 200);
        assert(rect.height === 200);
    });
    
    it('toArray', function() {
        var circle  = tm.geom.Circle(32, 64, 128);
        var arr = circle.toArray();

        assert(arr.equals([32, 64, 128]));
    });
});
