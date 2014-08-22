

;(function() {

	tm.define("tm.scene.NumericalInputScene", {
		superClass: "tm.app.Scene",

		init: function(param) {
			this.superInit();

			this.fromJSON({
				children: {
					inputLabel: {
						type: "tm.display.Label",
						fillStyle: "white",
						text: "",
						fontSize: 64,
						x: 320,
						y: 120,
					},
					buttonGroup: {
						type: "tm.display.CanvasElement",
					},
				},
			});


			[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].each(function(n, i) {
				var button = this._createButton(n.toString()).addChildTo(this.buttonGroup);
				var xIndex = i%3;
				var yIndex = (i/3)|0;
				button.x = 190*xIndex + 130;
				button.y = 177*yIndex + 280;
			}, this);

			var self = this;
			var buttons = this.buttonGroup.children;
			buttons.each(function(button) {
				button.setInteractive(true).setBoundingType("circle");
				button.radius = 145/2;
				button.onpointingstart = function() {
					if (this.label.text == 'OK') {
						var e = tm.event.Event("decided");
						e.value = Number(self.inputLabel.text);
						self.fire(e);
					}
					else if (this.label.text == 'C') {
						var e = tm.event.Event("push");
						self.inputLabel.text = "";
						self.flare("clear");
					}
					else {
						self.inputLabel.text += this.label.text;
						self.flare("push", {
							select: this.label.text,
						});
					}
				}
			});
		},

		_createButton: function(n) {
			var button = tm.display.CanvasElement();

			button.fromJSON({
				children: {
					bg: {
						type: "tm.display.CircleShape",
						init: [145, 145, {
							fillStyle: "transparent",
							strokeStyle: "white",
						}],
					},
					label: {
						type: "tm.display.Label",
						text: n,
						fontSize: 64,
						fillStyle: "white",
					},
				},
			});

			return button;
		},
	});

})();
