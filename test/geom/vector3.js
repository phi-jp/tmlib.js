
describe('tm.geom.vector3', function() {
    
    it('init', function() {
        var v  = tm.geom.Vector3(0, 1, 2);
        assert(v.equals(0, 1, 2));
    });
    
    it('set', function() {
        var v  = tm.geom.Vector3();
        v.set(0, 1, 2);
        assert(v.equals(0, 1, 2));
    });
    
    it('setNumber', function() {
        var v  = tm.geom.Vector3();
        v.setNumber(2, 1, 0);
        assert(v.equals(2, 1, 0));
    });
    
    it('setObject', function() {
        var v  = tm.geom.Vector3();
        v.setObject({
            x: 2,
            y: 1, 
            z: 0
        });
        assert(v.equals(2, 1, 0));
    });
    
    it('setString', function() {
        var v  = tm.geom.Vector3();
        
        v.setString("(6, 7, 8)")
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


