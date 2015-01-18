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

    });
    
})();


