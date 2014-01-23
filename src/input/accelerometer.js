/*
 * accelerometer.js
 */

tm.input = tm.input || {};


(function() {
    
    /**
     * @class tm.input.Accelerometer
     * スマートフォンのセンサー情報
     */
    tm.input.Accelerometer = tm.createClass({

        /** @property  gravity 重力センサー */
        /** @property  acceleration 加速度センサー */
        /** @property  rotation 回転加速度センサー */
        /** @property  orientation スマートフォンの傾き */
        
        /**
         * @constructor
         * ### Example
         * <a href="http://tmlib-js.googlecode.com/svn/trunk/test/input/touch-test.html">Test Program</a>.
         * 
         * ### Reference
         * - <http://tmlife.net/programming/javascript/javascript-iphone-acceleration.html>
         * - <http://hidekatsu.com/html5/archives/113>
         * - <http://d.hatena.ne.jp/nakamura001/20110209/1297229062>
         * - <http://d.hatena.ne.jp/nakamura001/20101128/1290946966>
         */
        init: function(element) {
            
            this.gravity        = tm.geom.Vector3(0, 0, 0);
            this.acceleration   = tm.geom.Vector3(0, 0, 0);
            this.rotation       = tm.geom.Vector3(0, 0, 0);
            this.orientation    = tm.geom.Vector3(0, 0, 0);
            
            var self = this;
            window.addEventListener("devicemotion", function(e) {
                var acceleration = self.acceleration;
                var gravity = self.gravity;
                var rotation = self.rotation;
                
                if (e.acceleration) {
                    acceleration.x = e.acceleration.x;
                    acceleration.y = e.acceleration.y;
                    acceleration.z = e.acceleration.z;
                }
                if (e.accelerationIncludingGravity) {
                    gravity.x = e.accelerationIncludingGravity.x;
                    gravity.y = e.accelerationIncludingGravity.y;
                    gravity.z = e.accelerationIncludingGravity.z;
                }
                if (e.rotationRate) {
                    rotation.x = rotation.beta  = e.rotationRate.beta;
                    rotation.y = rotation.gamma = e.rotationRate.gamma;
                    rotation.z = rotation.alpha = e.rotationRate.alpha;
                }
            });
            
            window.addEventListener("deviceorientation", function(e) {
                var orientation = self.orientation;
                orientation.alpha   = e.alpha;  // z(0~360)
                orientation.beta    = e.beta;   // x(-180~180)
                orientation.gamma   = e.gamma;  // y(-90~90)
            });
        },
        
    });
    
})();

