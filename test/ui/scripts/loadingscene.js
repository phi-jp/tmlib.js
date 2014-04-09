

tm.define("tests.loadingscene.test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
    },
    
    onenter: function() {
        
        var loading = tm.ui.LoadingScene({
            assets: {
                "image1": "http://dummyimage.com/128x128/aaa/fff.png?&text=1",
                "image2": "http://dummyimage.com/128x128/aaa/fff.png?&text=2",
                "image3": "http://dummyimage.com/128x128/aaa/fff.png?&text=3",
                "image4": "http://dummyimage.com/128x128/aaa/fff.png?&text=4",
                "image5": "http://dummyimage.com/128x128/aaa/fff.png?&text=5",
                "image6": "http://dummyimage.com/128x128/aaa/fff.png?&text=6",
                "image7": "http://dummyimage.com/128x128/aaa/fff.png?&text=7",
                "image8": "http://dummyimage.com/128x128/aaa/fff.png?&text=8",
            },
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
        });
        this.app.replaceScene(loading);
        
        this.onenter =  null;
        
        loading.onprogress = function(e) {
            console.log(e.progress);
        };
        var self = this;
        loading.onload = function() {
            this.app.replaceScene(self);
            
            tm.display.Sprite("image1").addChildTo(self);
        };
        
    }

});


