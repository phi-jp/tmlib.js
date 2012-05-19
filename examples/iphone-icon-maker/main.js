/*
 * phi
 */


var original = null;
var result   = null;
var param    = {};

/*
 * プレロード
 */
tm.preload(function() {
    tm.graphics.TextureManager.add("sample", "../../resource/img/kenkyo.jpg");
});

/*
 * メイン処理
 */
tm.main(function() {
    original = tm.graphics.Canvas("#original");
    result   = tm.graphics.Canvas("#result");
    var texture  = tm.graphics.TextureManager.get("sample");
    
    original.resize(texture.width, texture.height);
    original.drawTexture(texture, 0, 0, texture.width, texture.height);
    
    // パラメータ設定
    param.x = 0;
    param.y = 0;
    param.width = texture.width;
    param.height= texture.height;
    
    // dat.GUI
    var gui = new dat.GUI();
    if (gui) {
        gui.add(window, "output");
        
        // param
        var paramFolder = gui.addFolder("param");
        paramFolder.add(param, "x", 0, 512, 1).onChange(refreshResult);
        paramFolder.add(param, "y", 0, 512, 1).onChange(refreshResult);
        paramFolder.add(param, "width", 0, 512, 1).onChange(refreshResult);
        paramFolder.add(param, "height", 0, 512, 1).onChange(refreshResult);
        paramFolder.open();
    }
    
    refreshResult();
    
    // ドラッグ & ドロップ
    tm.dom.Element(window).event.add("dragover", function(e) {
        e.stop();
    });
    tm.dom.Element(window).event.add("drop", function(e) {
        e.stop();
        
        var file = e.dataTransfer.files[0];
        
        var reader = new FileReader();
        reader.onload = function() {
            var image = new Image();
            image.src = reader.result;
            image.onload = function() {
                refreshOriginal(this);
                refreshResult();
            };
        };
        reader.readAsDataURL(file);
    });
});

var refreshOriginal = function(image) {
    original.resize(image.width, image.height);
    original.drawImage(image, 0, 0, image.width, image.height);
};

var refreshResult = function() {
    var iconSize = 256;
    var padding  = 4;
    result.resize(iconSize, iconSize);
    
    // 影
    result.save();
    result.setShadow("black", 2, 2, 3);
    result.fillRoundRect(padding, padding, iconSize-padding*2, iconSize-padding*2, 10);
    result.restore();
    
    result.roundRect(padding, padding, iconSize-padding*2, iconSize-padding*2, 10);
    result.clip();
    result.drawImage(original.canvas, param.x, param.y, param.width, param.height, 0, 0, iconSize, iconSize);
    
    var circleX = iconSize/2;
    var circleY =-iconSize*0.65;
    var radius  = iconSize*1.2;
    var gradient = tm.graphics.RadialGradient(circleX, circleY, 0, circleX, circleY, radius);
    gradient.addColorStop(0.0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.85)");
    gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.65)");
    gradient.addColorStop(0.8, "rgba(255, 255, 255, 0.25)");
    result.setGradient(gradient);
    result.fillCircle(circleX, circleY, radius);
};

var output = function() {
    result.saveAsImage();
};























