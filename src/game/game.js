
;(function() {

    tm.game = tm.game || {};


    tm.game.setup = function(param) {
        param.$safe({
            query: "#world",
            title: "Title",
            background: "rgba(250, 250, 250, 1.0)",
            width: 640,
            height: 960,
            startLabel: 'title',
        });

        tm.globalize();

        this.expand(param);

        var scenes = [
            {
                className: "SplashScene",
                arguments: {
                    width: param.width,
                    height: param.height,
                },
                label: "splash",
                nextLabel: "title",
            },
            {
                className: "TitleScene",
                arguments: {
                    title: param.title,
                },
                label: "title",
            },
            {
                className: "GameScene",
                label: "game",
                nextLabel: "result",
            },
            {
                className: "ResultScene",
                arguments: {
                    message: param.title,
                },
                label: "result",
                nextLabel: "title",
            },

            {
                className: "PauseScene",
                label: "pause",
            },
        ];

        tm.main(function() {
            var app = tm.app.CanvasApp(param.query);       // 生成
            app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);    // サイズ(解像度)設定
            app.fitWindow();                            // 自動フィッティング有効
            app.background = param.background;// 背景色

            if (window.ASSETS) {
                var loading = tm.game.LoadingScene({
                    assets: ASSETS,
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                });
                loading.onload = function() {
                    app.replaceScene(tm.game.ManagerScene({
                        startLabel: param.startLabel,
                        scenes: scenes,
                    }));
                };
                app.replaceScene(loading);
            }
            else {
                app.replaceScene(tm.game.ManagerScene({
                    startLabel: param.startLabel,
                    scenes: scenes,
                }));
            }

            app.run();
        });
    };

    tm.game.expand = function(param) {
        tm.global.$extend({
            SCREEN_WIDTH: param.width,
            SCREEN_HEIGHT: param.height,
            SCREEN_CENTER_X: param.width/2,
            SCREEN_CENTER_Y: param.height/2,
            SCREEN_GRID_X: GridSystem(param.width, 16),
            SCREEN_GRID_Y: GridSystem(param.height, 16),
            QUERY: tm.util.QueryString.parse(location.search.substr(1)),
        });

    };

})();
