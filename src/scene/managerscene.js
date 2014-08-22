/*
 *
 */

;(function() {

    /**
     * @class tm.scene.ManagerScene
     * マネージャーシーン
     * @extends tm.app.Scene
     */
    tm.define("tm.scene.ManagerScene", {
        superClass: "tm.app.Scene",

        /**
         * @constructor
         */
        init: function(param) {
            this.superInit();

            this.setScenes(param.scenes);

            this.on("enter", function() {
                var e = tm.event.Event("start");
                this.fire(e);
            }.bind(this));

            this.on("resume", function() {
                var e = tm.event.Event("next");
                this.fire(e);
            }.bind(this));


            this.commonArguments = {};
        },

        /**
         * scenes をセット
         */
        setScenes: function(scenes) {
            this.scenes = scenes;
            this.sceneIndex = 0;

            return this;
        },

        getScene: function(index) {
            index = (typeof index == 'string') ? this.labelToIndex(index) : index||0;
            return this.scenes[index];
        },

        setSceneArguments: function(label, param) {
            this.getScene(label).arguments.$extend(param);
            return this;
        },

        /**
         * index(or label) のシーンへ飛ぶ
         */
        gotoScene: function(index) {
            index = (typeof index == 'string') ? this.labelToIndex(index) : index||0;

            // イベント発火
            var e = tm.event.Event("prepare");
            this.fire(e);


            var data = this.scenes[index];
            var klass = tm.using(data.className);
            var arguments = data.arguments;

            if (!tm.util.Type.isArray(arguments)) arguments = [arguments];

            var scene = klass.apply(null, arguments);
            this.app.pushScene(scene);

            this.sceneIndex = index;
            this.currentScene = scene;

            // イベント発火
            var e = tm.event.Event("goto");
            e.scene = scene;
            this.fire(e);

            return this;
        },

        /**
         * 次のシーンへ飛ぶ
         */
        gotoNext: function() {
            var data = this.scenes[this.sceneIndex];
            var nextIndex = null;

            // 次のラベルが設定されていた場合
            if (data.nextLabel) {
                nextIndex = this.labelToIndex(data.nextLabel);
            }
            // 次のシーンに遷移
            else if (this.sceneIndex+1 < this.scenes.length) {
                nextIndex = this.sceneIndex+1;
            }

            if (nextIndex !== null) {
                this.gotoScene(nextIndex);
            }
            else {
                this.fire(tm.event.Event("finish"));
            }

            return this;
        },

        /**
         * シーンインデックスを取得
         */
        getCurrentIndex: function() {
            return this.sceneIndex;
        },

        /**
         * シーンラベルを取得
         */
        getCurrentLabel: function() {
            return this.scenes[this.sceneIndex].label;
        },

        /**
         * ラベルからインデックスに変換
         */
        labelToIndex: function(label) {
            var data = this.scenes.filter(function(data) {
                return data.label == label;
            })[0];

            return this.scenes.indexOf(data);
        },

        /**
         * インデックスからラベルに変換
         */
        indexToLabel: function(index) {
            return this.scenes[index].label;
        },

        onstart: function() {
            this.gotoScene(0);
        },

        onnext: function() {
            this.gotoNext();
        },
    });

})();