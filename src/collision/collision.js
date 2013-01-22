/*
 * collision.js
 */


(function() {
    
    /**
     * 
     */
    tm.collision.testCircleCircle = function(circle0, circle1)
    {
        var distanceSquared = tm.geom.Vector2.distanceSquared(circle0, circle1);
        return distanceSquared <= Math.pow(circle0.radius + circle1.radius, 2);
    }
    
    /**
     * 
     */
    tm.collision.testRectRect = function(rect0, rect1)
    {
        return (rect0.left < rect1.right) && (rect0.right > rect1.left) &&
               (rect0.top < rect1.bottom) && (rect0.bottom > rect1.top);
    }
 
})();