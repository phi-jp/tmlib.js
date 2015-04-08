/*
 * scene.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class tm.app.Scene
     * シーンとして使用するゲームエレメントクラス
     * @extends tm.app.Object2D
     */
    tm.app.Scene = tm.createClass({
        superClass: tm.app.Object2D,

        app: null,

        /** ManagerScene 経由で生成された際に次にどのシーンに遷移するかのラベル */
        nextLabel: "",

        /** ManagerScene 経由で生成された際に次のシーンに渡す引数 */
        nextArguments: null,

        /**
         * @constructor
         */
        init: function() {
            this.superInit();
            
            this.boundingType = "none";
            
            // タッチに反応させる
            this.setInteractive(true);
        },

        exit: function(param) {
            if (!this.app) return ;

            if (typeof param !== 'object') {
                var temp = {};
                temp.nextLabel = arguments[0];
                temp.nextArguments = arguments[1];
                param = temp;
            }

            if (param.nextLabel) {
                this.nextLabel = param.nextLabel;
            }
            if (param.nextArguments) {
                this.nextArguments = param.nextArguments;
            }

            this.app.popScene();

            return this;
        },

    });
    
})();


