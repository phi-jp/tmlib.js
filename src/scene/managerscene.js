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
                this.gotoScene(param.startLabel || 0);
            }.bind(this));

            this.on("resume", this.onnext.bind(this));

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

        /**
         * index(or label) のシーンへ飛ぶ
         */
        gotoScene: function(index, args) {
            index = (typeof index == 'string') ? this.labelToIndex(index) : index||0;

            // イベント発火
            var e = tm.event.Event("prepare");
            this.fire(e);

            var data = this.scenes[index];
            var klass = tm.using(data.className);
            var initArguments = data.arguments;
            var initArguments = {}.$extend(initArguments, args);
            var scene = klass.call(null, initArguments);
            if (!scene.nextLabel) {
                scene.nextLabel = data.nextLabel;
            }
            if (!scene.nextArguments) {
                scene.nextArguments = data.nextArguments;
            }
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
        gotoNext: function(args) {
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
                this.gotoScene(nextIndex, args);
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

        onnext: function(e) {
            var nextLabel = e.prevScene.nextLabel;
            var nextArguments = e.prevScene.nextArguments;
            if (nextLabel) {
                this.gotoScene(nextLabel, nextArguments);
            }
            else {
                this.gotoNext(nextArguments);
            }
        },
    });

})();