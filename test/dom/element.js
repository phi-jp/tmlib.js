/*
 * element.js
 */

tests.event = {
    add: function() {
        var target = tm.dom.Element( "#target" );
        target.event.add("click", function() {
            alert("click");
        });
    },

    remove: function() {
        var target = tm.dom.Element( "#target" );
        target.event.add("click", function() {
            alert("click");
            this.event.remove("click", arguments.callee);
        });
    },

    click: function() {
        var target = tm.dom.Element( "#target" );
        target.event.click(function() {
            alert("click");
        });
    },

    one: function() {
        var target = tm.dom.Element( "#target" );
        target.event.one("click", function() {
            alert("click");
        });
    },

    toggle: function() {
        var target = tm.dom.Element( "#target" );
        target.event.toggle("click", [
            function() {
                this.backgroundColor = "red";
            },
            function() {
                this.backgroundColor = "green";
            },
            function() {
                this.backgroundColor = "blue";
            },
        ]);
    }
};


tests.element = {
    default: function() {

    },
    html: function() {
        var target = tm.dom.Element( "#target" );
        target.html = "ABC<b>ABC</b>";
    },
    text: function() {
        var target = tm.dom.Element( "#target" );
        target.text = "ABC<b>ABC</b>";
    },
    value: function() {
        var target = tm.dom.Element( "input" );
        target.value = "ABC";
    },
    append: function() {
        var target = tm.dom.Element( "#target" );
        // append test 
        var elm = tm.dom.Element( document.createElement("div") );
        elm.html = "append element";
        elm.attr.set("class", "box append-element");
        target.append(elm);
    },
    prepend: function() {
        var target = tm.dom.Element( "#target" );
        // append test 
        var elm = tm.dom.Element( document.createElement("div") );
        elm.html = "prepend element";
        elm.attr.set("class", "box prepend-element");
        target.prepend(elm);
    },
    after: function() {
        var target = tm.dom.Element( "#target" );
        // append test 
        var elm = tm.dom.Element( document.createElement("div") );
        elm.html = "after element";
        elm.attr.set("class", "box prepend-element");
        target.after(elm);
    },
    before: function() {
        var target = tm.dom.Element( "#target" );
        // append test 
        var elm = tm.dom.Element( document.createElement("div") );
        elm.html = "before element";
        elm.attr.set("class", "box prepend-element");
        target.before(elm);
    },
    create: function() {
        var target = tm.dom.Element( "#target" );
        target.create("div").html  = "default(append)";
        target.create("div", "append").html  = "append";
        target.create("div", "prepend").html = "prepend";
        target.create("div", "before").html  = "before";
        target.create("div", "after").html   = "after";
    },
    query: function() {
        var target = tm.dom.Element( "#target" );
        target.query(".item").html = "****00";
        target.query(".item", 3).html = "****03";
    },
    queryAll: function() {
        var target = tm.dom.Element( "#target" );

        var items = target.queryAll(".item");
        items.forEach(function(elm, i) {
            elm.html = "Hello, world! " + i;
        });
    },
    absolute: function() {
        var target = tm.dom.Element( "#target" );
        target.absolute(150, 150, 250, 200);
    },
};





tests.attr = {
    set: function() {
        var input = tm.dom.Element( ".input" );
        input.attr.set("type", "number");
        input.attr.set("value", 6);
    },
    add: function() {
        var input = tm.dom.Element( ".input" );
        input.attr.set("value", "hoge");
        input.attr.add("value", "foo");
    },
    remove: function() {
        var input = tm.dom.Element( ".input" );
        input.attr.set("value", "hoge");
        input.attr.add("value", "foo");
        input.attr.remove("value", "hoge");
    },
    get: function() {
        var input = tm.dom.Element( ".input" );
        var v = input.attr.get("value");
        console.log(v);
    },
    contains: function() {
        var input = tm.dom.Element( ".input" );
        console.log(input.attr.contains("value", "world!"));
        console.log(input.attr.contains("value", "phi!"));
    },
    toggle: function() {
        var input = tm.dom.Element( ".input" );
        input.attr.toggle("value", "world!");
        input.attr.toggle("value", "phi!");
    },
};






tests.trans = {
    to: function() {
        var target = tm.dom.Element( "#target" );
        
        target.trans.to({"opacity": 0}, 1000);
    },
    
    set: function() {
        var target = tm.dom.Element( "#target" );
        target.trans.set({"background-color": "red"}).duration(1000);
    },
    
    duration: function() {
        var target = tm.dom.Element( "#target" );
        target.trans.set({"background-color": "blue"}).duration(3000);
    },
    
    end: function() {
        var target = tm.dom.Element( "#target" );
        target.trans.set({"background-color": "blue"}).duration(1000).end(function() {
            alert("finish!");
        });
    },
    
    translate: function() {
        var target = tm.dom.Element( "#target" );
        target.trans.translate(100, 300, 1000);
    },
    
    translate3d: function() {
        var target = tm.dom.Element( "#target" );
        target.parent.style.set("webkitPerspective", "600px");
        target.trans.translate3d(100, 100, -500);
    },
    
    rotate: function() {
        var target = tm.dom.Element( "#target" );
        target.trans.rotate(360, 4000);
    },
    
    rotate3d: function() {
        var target = tm.dom.Element( "#target" );
        target.parent.style.set("webkitPerspective", "600px");
        target.trans.rotate3d(0, 1, 0, 360, 4000);
    },
    
    scale: function() {
        var target = tm.dom.Element( "#target" );
        target.trans.scale(0.5, 1.2);
    },
    
};




























