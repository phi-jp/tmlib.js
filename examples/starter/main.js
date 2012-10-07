/*
 * 
 */

tm.preload(function() {
    tm.sound.SoundManager.add("starter", "starter.wav", 1);
});

tm.main(function() {
    tm.dom.Element("#button").event.click(function() {
        alert("test");
        setTimeout(function() {
            tm.sound.SoundManager.get("starter").play();
        }, 4000);
    });
});
