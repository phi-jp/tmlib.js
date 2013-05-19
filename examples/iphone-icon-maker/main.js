/*
 * phi
 */


var original    = null;
var result      = null;
var currentImage = null;
var param    = {};

/*
 * メイン処理
 */
tm.main(function() {
    var texture = tm.graphics.Texture("../../resource/img/kenkyo.jpg");
    original = tm.graphics.Canvas("#original");
    result   = tm.graphics.Canvas("#result");
    currentImage = texture.getElement();
    
    texture.onload = function() {
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
            paramFolder.add(param, "x", 0, 1024, 1).onChange(refresh);
            paramFolder.add(param, "y", 0, 1024, 1).onChange(refresh);
            paramFolder.add(param, "width", 0, 1024, 1).onChange(refresh);
            paramFolder.add(param, "height", 0, 1024, 1).onChange(refresh);
            paramFolder.open();
        }
        refresh();
    };
    
        
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
                currentImage = image;
                refresh();
            };
        };
        reader.readAsDataURL(file);
    });
});

var refresh = function() {
    // オリジナルの方の画像を更新
    original.clear();
    original.resize(currentImage.width, currentImage.height);
    original.drawImage(currentImage, 0, 0, currentImage.width, currentImage.height);
    
    var iconSize = 256;
    var padding  = 0;
    result.resize(iconSize, iconSize);
    
    // // 影
    // result.save();
    // result.setShadow("black", 2, 2, 3);
    // result.fillRoundRect(padding, padding, iconSize-padding*2, iconSize-padding*2, 10);
    // result.restore();
    
    // // 背景塗りつぶし
    // result.fillRect(0, 0, iconSize, iconSize);
    
    result.roundRect(padding, padding, iconSize-padding*2, iconSize-padding*2, 20);
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
    
    // オリジナルの方に切り取りフレームを描画する
    original.strokeStyle = "#aaa";
    original.strokeRect(param.x, param.y, param.width, param.height);
};

var output = function() {
    result.saveAsImage();
};























