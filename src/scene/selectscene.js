/*
 * menudialog.js
 */

(function() {
    
    /**
     * @class tm.scene.SelectScene
     * 選択シーン
     * @extends tm.app.Scene
     */
    tm.define("tm.scene.SelectScene", {
        superClass: "tm.app.Scene",

        /** @type {string} タイトル */
        titleText: null,
        /** @type {Array.<string>} メニュー名リスト */
        texts: null,
        /** @type {Array.<string>} メニュー画像リスト */
        images: null,
        /** @type {Array.<string>} メニュー詳細リスト */
        descriptions: null,
        /** @type {boolean} exit の表示/非表示 */
        showExit: false,

        /** @type {tm.display.Label} dummy */
        title: null,
        /** @type {Array.<tm.ui.LabelButton>} dummy */
        selections: [],
        /** @type {tm.display.Label} dummy */
        description: null,
        /** @type {tm.display.RectangleShape} dummy */
        box: null,
        /** @type {tm.display.RectangleShape} dummy */
        cursor: null,

        /** @private */
        _selected: 0,
        /** @private */
        _opened: false,
        /** @private */
        _finished: false,

        /** @private */
        _screenWidth: 0,
        /** @private */
        _screenHeight: 0,

        /**
         * @constructor
         * @param {Object} params
         */
        init: function(params) {
            this.superInit();

            this._screenWidth = params.screenWidth || 640;
            this._screenHeight = params.screenHeight || 960;

            this.filterColor = params.filterColor || "rgba(0, 0, 0, 0.8)";

            this.titleText = params.title;
            this.texts = [].concat(params.texts);
            this._selected = ~~params.selected;
            this.showExit = !!params.showExit;
            if (params.menuDesctiptions) {
                this.descriptions = params.menuDesctiptions;
            } else {
                this.descriptions = [].concat(params.texts);
            }

            if (this.showExit) {
                this.texts.push("exit");
                this.descriptions.push("前の画面へ戻ります");
            }

            this.fromJSON({
                children: {
                    filter: {
                        type: "tm.display.Shape",
                        init: {
                            width: this._screenWidth,
                            height: this._screenHeight,
                            bgColor: this.filterColor,
                        },
                        originX: 0,
                        originY: 0,
                    },
                    box: {
                        type: "tm.display.Shape",
                        init: {
                            width: this._screenWidth * 0.8,
                            bgColor: "rgba(43,156,255, 0.8)",
                        },
                        x: this._screenWidth*0.5,
                        y: this._screenHeight*0.5,
                        width: 1,
                        height: 1,
                        boundingType: "rect",
                    },
                    description: {
                        type: "tm.display.Label",
                        align: "center",
                        baseline: "middle",
                        x: this._screenWidth*0.5,
                        y: this._screenHeight-10,
                    },
                }
            });

            this.open();
        },

        open: function() {
            var height = Math.max((1+this.texts.length)*50, 50) + 40;
            this.box.tweener
                .to({ width: this._screenWidth*0.8, height: height }, 200, "easeOutExpo")
                .call(this._open.bind(this));
        },

        /**
         * @private
         */
        _open: function() {
            var self = this;
            var y = this._screenHeight*0.5 - this.texts.length * 25;

            this.title = tm.display.Label(this.titleText, 30)
                .setPosition(this._screenWidth*0.5, y)
                .addChildTo(this);

            this.cursor = this._createCursor();

            this.selections = this.texts.map(function(text, i) {
                var self = this;
                y += 50;
                var selection = tm.ui.LabelButton(text)
                    .setPosition(this._screenWidth*0.5, y)
                    .addChildTo(this);
                selection.interactive = true;
                selection.on("click", function() {
                    if (self._selected === i) {
                        self.close(self._selected);
                    } else {
                        self._selected = i;
                        var e = tm.event.Event("select");
                        e.selectValue = self.texts[self._selected];
                        e.selectIndex = i;
                        self.dispatchEvent(e);
                    }
                });
                selection.width = this._screenWidth * 0.7;
                return selection;
            }.bind(this));

            this.cursor.y = this.selections[this._selected].y;

            this._opened = true;

            // close window when touch bg outside
            this.on("pointingend", function(e) {
                var p = e.app.pointing;
                if (!self.box.isHitPoint(p.x, p.y)) {
                    self.close(self._selected);
                }
            });

            // dispatch opened event
            var e = tm.event.Event("menuopened");
            this.dispatchEvent(e);
        },

        /**
         * @private
         */
        _createCursor: function() {
            var cursor = tm.display.Shape({
                width: this._screenWidth*0.7,
                height: 30,
                bgColor: "rgba(12,79,138,1)"
            }).addChildTo(this);
            cursor.x = this._screenWidth*0.5;
            cursor.target = this._selected;
            
            cursor.update = function() {
                if (this.target !== this.parent._selected) {
                    this.target = this.parent._selected;
                    this.tweener.clear();
                    this.tweener.to({
                        y: this.parent.selections[this.parent._selected].y
                    }, 200, "easeOutExpo");
                }
            };

            return cursor;
        },

        /**
         * 更新
         */
        update: function(app) {
            this.description.text = this.descriptions[this._selected];
        },

        /**
         * 閉じる
         */
        close: function(result) {
            this._finished = true;

            var e = tm.event.Event("selected");
            e.selectIndex = result;
            this.dispatchEvent(e);

            this.tweener
                .clear()
                .wait(200)
                .call(function() {
                    this.cursor.remove();
                    this.title.remove();
                    this.selections.each(function(sel) {
                        sel.remove();
                    });
                    this.box.tweener.clear();
                    this.box.tweener
                        .to({ width: 1, height: 1 }, 200, "easeInExpo")
                        .call(function() {
                            this.app.popScene();
                            var e = tm.event.Event("menuclosed");
                            e.selectIndex = result;
                            this.dispatchEvent(e);
                        }.bind(this));
                }.bind(this));
            this.cursor.tweener
                .clear()
                .call(function() {
                    this.visible = !this.visible;
                }.bind(this.cursor))
                .setLoop(true);
        },

    });

})();
