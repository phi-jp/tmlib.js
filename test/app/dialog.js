

tm.define("tests.dialog.MenuDialogScene", {

    superClass: "tm.app.Scene",

    button: null,

    init: function() {
        this.superInit();

        this.lastSelection = 0;

        tm.app.GlossyButton(300, 50, "blue", "Open MenuDialog")
            .setPosition(150+10, 25+10)
            .addChildTo(this)
            .addEventListener("pointingend", function() {
                this.onClickOpenButton();
            }.bind(this));
    },

    onClickOpenButton: function() {
        var menu = ["カレー", "ラーメン", "やきそば", "かき氷(イチゴ)", "かき氷(メロン)"];
        var dialog = tm.app.MenuDialog(this.app, {
            
            title: "メニュー",
            menu: menu,
            defaultSelected: this.lastSelection,
            menuDesctiptions: [
                "スパイシーでゴージャスなカレーライス",
                "透き通ったスープの滋味豊かなしょうゆラーメン",
                "ジュージュー焼けたソースが香ります。青のりに気をつけろ！",
                "慌てて食べるとキーンとくるよ",
                "緑色はメロン。抹茶は認めない"
            ],
            showExit: false,
        });

        this.app.pushScene(dialog);

        dialog.onmenuselect = function(e) {
            console.log(e.selectValue + "を選択中");
        };

        dialog.onmenuselected = function(e) {
            alert(menu[e.selectIndex] + "が選択されました");
            this.lastSelection = e.selectIndex;
        }.bind(this);
    },

});
