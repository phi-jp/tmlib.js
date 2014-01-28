

tm.define("tests.labelarea.test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
    },
    
    onenter: function() {
        var labelArea = tm.ui.LabelArea({
            text: "あいうえおか\nきくけこ",
            width: 200,
            height: 60,
            fillStyle: "red",
//            bgColor: "white",
            fontSize: 22,
//            mode: "vertical",
        }).addChildTo(this).setPosition(320, 240);
        
        var datGUI = new dat.GUI();
        
        datGUI.add(labelArea, "x", 0, 500);
        datGUI.add(labelArea, "y", 0, 500);
        datGUI.add(labelArea, "width", 0, 500);
        datGUI.add(labelArea, "height", 0, 500);
        datGUI.add(labelArea, "fontSize", 0, 100);
        datGUI.add(labelArea, "text");
        
//        labelArea.fillStyle = "blue";
    }

});


