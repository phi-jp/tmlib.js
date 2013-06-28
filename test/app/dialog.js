

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
        this.openMenuDialog(
            "メニュー",
            menu,
            function(result) {
                alert(menu[result] + "が選択されました");
                this.lastSelection = result;
            },
            this.lastSelection,
            [
                "スパイシーでゴージャスなカレーライス",
                "透き通ったスープの滋味豊かなしょうゆラーメン",
                "ジュージュー焼けたソースが香ります。青のりに気をつけろ！",
                "慌てて食べるとキーンとくるよ",
                "緑色はメロン。抹茶は認めない"
            ],
            false
        );
    },

});
