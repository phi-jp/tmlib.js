/*
 * phi
 */

var RESOURCE_PATH = "../../resource";
var SOUND_FILE_LIST = {
    "C3" : RESOURCE_PATH + "/se/piano/C3.wav",
    "D3" : RESOURCE_PATH + "/se/piano/D3.wav",
    "E3" : RESOURCE_PATH + "/se/piano/E3.wav",
    "F3" : RESOURCE_PATH + "/se/piano/F3.wav",
    "G3" : RESOURCE_PATH + "/se/piano/G3.wav",
    "A3" : RESOURCE_PATH + "/se/piano/A3.wav",
    "B3" : RESOURCE_PATH + "/se/piano/B3.wav",
    "C4" : RESOURCE_PATH + "/se/piano/C4.wav",
    "pC3": RESOURCE_PATH + "/se/piano/pC3.wav",
    "pD3": RESOURCE_PATH + "/se/piano/pD3.wav",
    "pF3": RESOURCE_PATH + "/se/piano/pF3.wav",
    "pG3": RESOURCE_PATH + "/se/piano/pG3.wav",
    "pA3": RESOURCE_PATH + "/se/piano/pA3.wav",
};

var KEY_MAP = {
    'A': "C3",
    'S': "D3",
    'D': "E3",
    'F': "F3",
    'J': "G3",
    'K': "A3",
    'L': "B3",
    ';': "C4",
    'W': "pC3",
    'E': "pD3",
    'U': "pF3",
    'I': "pG3",
    'O': "pA3",
};

window.onload = function() {
    for (var key in SOUND_FILE_LIST) {
        var value = SOUND_FILE_LIST[key];
        tm.sound.SoundManager.add(key, value, 8);
    }
    
    var eKeyList = tm.dom.Element().queryAll(".keyboard");
    
    for (var i=0,len=eKeyList.length; i<len; ++i) {
        eKeyList[i].event.add("mousedown", function() {
            play(this);
        });
    }
    
    document.onkeypress = function(e) {
        var key = String.fromCharCode(e.charCode);
        key = key.toUpperCase();
        
        var name = KEY_MAP[key];
        if (name) {
            var elm  = tm.dom.Element(document.getElementsByName(name)[0]);
            play(elm);
        }
    }
};

var play = function(elm)
{
    var key = elm.element.getAttribute("name");
    tm.sound.SoundManager.get(key).play();
    elm.anim.start();
};
