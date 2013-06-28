(function() {
    
    tm.define("tm.app.MenuDialog", {
        superClass: tm.app.Scene,

        /** @type {string} */
        titleText: null,
        /** @type {Array.<string>} */
        menu: null,
        /** @type {Array.<string>} */
        descriptions: null,
        /** @type {boolean} */
        showExit: false,

        /** @type {tm.app.Label} */
        title: null,
        /** @type {Array.<tm.app.LabelButton>} */
        selections: [],
        /** @type {tm.app.Label} */
        description: null,
        /** @type {tm.app.RectangleShape} */
        box: null,
        /** @type {tm.app.RectangleShape} */
        cursor: null,

        _selected: 0,
        _opened: false,
        _finished: false,

        _sc_w: 0,
        _sc_h: 0,

        /**
         * @constructs
         * @param {number} app アプリケーション
         * @param {Object} params
         */
        init: function(app, params) {
            this.superInit();

            this._sc_w = app.width;
            this._sc_h = app.height;

            this.titleText = params.title;
            this.menu = [].concat(params.menu);
            this._selected = ~~params.defaultSelected;
            this.showExit = !!params.showExit;
            if (params.menuDesctiptions) {
                this.descriptions = params.menuDesctiptions;
            } else {
                this.descriptions = [].concat(params.menu);
            }

            if (this.showExit) {
                this.menu.push("exit");
                this.descriptions.push("前の画面へ戻ります");
            }

            var height = Math.max((1+this.menu.length)*50, 50) + 40;
            this.box = tm.app.RectangleShape(this._sc_w * 0.8, height, {
                strokeStyle: "rgba(0,0,0,0)",
                fillStyle: "rgba(43,156,255, 0.8)",
            }).setPosition(this._sc_w*0.5, this._sc_h*0.5);
            this.box.width = 1;
            this.box.height = 1;
            this.box.tweener
                .to({ width: this._sc_w*0.8, height: height }, 200, "easeOutExpo")
                .call(this._onOpen.bind(this));
            this.box.addChildTo(this);

            this.description = tm.app.Label("", 14)
                .setAlign("center")
                .setBaseline("middle")
                .setPosition(this._sc_w*0.5, this._sc_h-10)
                .addChildTo(this);
        },

        _onOpen: function() {
            var y = this._sc_h*0.5 - this.menu.length * 25;

            this.title = tm.app.Label(this.titleText, 30)
                .setAlign("center")
                .setBaseline("middle")
                .setPosition(this._sc_w*0.5, y)
                .addChildTo(this);

            this.cursor = this._createCursor();

            this.selections = this.menu.map(function(text, i) {
                var self = this;
                y += 50;
                var selection = tm.app.LabelButton(text)
                    .setPosition(this._sc_w*0.5, y)
                    .addChildTo(this);
                selection.interactive = true;
                selection.addEventListener("touchend", function() {
                    if (self._selected === i) {
                        self.closeDialog(self._selected);
                    } else {
                        self._selected = i;
                    }
                });
                selection.width = this._sc_w * 0.7;
                return selection;
            }.bind(this));

            this.cursor.y = this.selections[this._selected].y;

            this._opened = true;
        },

        _createCursor: function() {
            var cursor = tm.app.RectangleShape(this._sc_w*0.7, 30, {
                strokeStyle: "rgba(0,0,0,0)",
                fillStyle: "rgba(12,79,138,1)"
            }).addChildTo(this);
            cursor.x = this._sc_w*0.5;
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

        update: function(app) {
            this.description.text = this.descriptions[this._selected];
        },

        closeDialog: function(result) {
            this._finished = true;
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
                            this.finish(result);
                        }.bind(this));
                }.bind(this));
            this.cursor.tweener
                .clear()
                .call(function() {
                    this.visible = !this.visible;
                }.bind(this.cursor))
                .setLoop(true);
        },

        draw: function(canvas) {
            canvas.fillStyle = "rgba(0,0,0,0.8)";
            canvas.fillRect(0,0,this._sc_w,this._sc_h);
        },

    });

    tm.app.Scene.prototype.openMenuDialog = function(params) {
        this.startSceneForResult(tm.app.MenuDialog(this.app, params), params.onResult);
    };

})();
