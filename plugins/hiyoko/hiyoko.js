(function() {
    tm.main(function() {
        var div = document.createElement("div");
        var hiyoko = tm.dom.Element(div);
        hiyoko.classList.add("hiyoko");
        document.body.appendChild(hiyoko.element);
        
        hiyoko.anim.start();
        
        hiyoko.x = 80;
        hiyoko.y = -50;

        var r = Math.rand(0, 100);
        if (r < 10) {
            hiyoko.classList.add("hiyoko-girl");
        }
        else if (r < 20) {
            hiyoko.classList.add("hiyoko-tamago");
        }
        else if (r < 30) {
            hiyoko.classList.add("hiyoko-waru");
        }
        else if (r < 40) {
            hiyoko.classList.add("niwatori");
        }
        
        var vx = 0;
        var vy = 0;
        var floor = window.innerHeight - 120;
        var key = tm.input.Keyboard();
        key.run();

        window.onresize = function() {
            floor = window.innerHeight - 120;
        };
        
        tm.setLoop(function() {
            vy += 0.5;
            hiyoko.y += vy;
            if (hiyoko.y > floor) {
                hiyoko.y = floor;
                vy = 0;
            }
            else if (hiyoko.y < 0) {
                hiyoko.y = 0;
            }
            if (key.getKey("up")) {
                vy -= 1;
            }
            
            vx *= 0.80;
            hiyoko.x += vx;

            var left = -32;
            var right = window.innerWidth;

            if (hiyoko.x < left) {
                hiyoko.x = right;
            }
            else if (hiyoko.x > right) {
                hiyoko.x = left;
            }

            var maxSpeed = (key.getKey("B")) ? 12 : 4;
            var speed = (key.getKey("B")) ? 4 : 1;

            if (Math.abs(vx) < maxSpeed) {
                if (key.getKey("left")) {
                    vx += -speed;
                    hiyoko.style.set("webkitTransform", "scaleX(2) scaleY(2)");
                    hiyoko.anim.setName("walk");
                }
                else if (key.getKey("right")) {
                    vx += speed;
                    hiyoko.style.set("webkitTransform", "scaleX(-2) scaleY(2)");
                    hiyoko.anim.setName("walk");
                }
            }
            
            if (Math.abs(vx) <= 0.1) {
                hiyoko.anim.setName("stand");
            }
        }, 1000/30);
    });
})();
