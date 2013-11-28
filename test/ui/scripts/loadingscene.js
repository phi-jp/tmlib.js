

tm.define("tests.loadingscene.test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
    },
    
    onenter: function() {
        
        var loading = tm.ui.LoadingScene({
            assets: {
                "image0": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image1": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image2": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image3": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image4": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image5": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image6": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image7": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image8": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
                "image9": "https://pbs.twimg.com/profile_images/484079620/kenkyo.jpg",
            },
            width: 640,
            height: 480,
        });
        this.app.replaceScene(loading);
        
        this.onenter =  null;
        
        loading.onprogress = function(e) {
            console.log(e.progress);
        };
        var self = this;
        loading.onload = function() {
            this.app.replaceScene(self);
            
            tm.display.Sprite("image0").addChildTo(self);
        };
        
    }

});


