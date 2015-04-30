/*
 * touchnumber | tmlib.js tutorial
 */

// 初期化
tm.game.setup({
    title: "Touch Number",
    startLabel: "game",
    // assets: {
    //     'touch': 'sounds/touch.m4a',
    //     'bgm': 'sounds/bgm.mp3',
    // },
});

// 定数
var MAX_PER_LINE    = 5;                            // ピースの横に並ぶ最大数
var MAX_NUM         = MAX_PER_LINE*MAX_PER_LINE;    // ピース全体の数
var PIECE_ALL_WIDTH = SCREEN_GRID_X.span(15);       // ピース全体の幅
var PIECE_MARGIN    = 10;                           // ピースのマージン
var PIECE_SIZE      = (PIECE_ALL_WIDTH-(PIECE_MARGIN*MAX_PER_LINE))/MAX_PER_LINE;  // ピースのサイズ
var PIECE_OFFSET_X  = (SCREEN_WIDTH-PIECE_ALL_WIDTH)/2 + (PIECE_SIZE+PIECE_MARGIN)/2;   // ピースのオフセットX
var PIECE_OFFSET_Y  = (SCREEN_HEIGHT-PIECE_ALL_WIDTH)/2 + (PIECE_SIZE+PIECE_MARGIN)/2;  // ピースのオフセットY
var PIECE_COLOR     = "hsl(200, 76%, 64%)";   // ピースの色
var PIECE_FONT_SIZE = PIECE_SIZE*0.4;

var BUTTON_WIDTH = SCREEN_GRID_X.span(7);
var BUTTON_COLOR = 'hsl(50, 0%, 40%)';

/*
 * ゲームシーン
 */
tm.define("GameScene", {
    // 親クラスを指定
    superClass: "Scene",
    
    // 初期化
    init: function() {
        // 親クラスの初期化
        this.superInit();
        
        // タイマー
        this.time = 0;
        // 最初のインデックス
        this.currentIndex = 1;
        
        // ピース用のグループを追加
        var pieceGroup = CanvasElement().addChildTo(this);
        
        // 1 ~ 25 の数値配列を生成
        var numbers = Array.range(1, MAX_NUM+1).shuffle();
        var self = this;

        var pieceGrid = GridSystem(PIECE_ALL_WIDTH, MAX_PER_LINE);
        
        // 数値ボタンを生成
        numbers.each(function(index, i) {
            // グリッド上でのインデックス
            var xIndex = i%MAX_PER_LINE;
            var yIndex = (i/MAX_PER_LINE).floor();
            // ボタンを生成
            var button = FlatButton({
                width: PIECE_SIZE,
                height: PIECE_SIZE,
                fillStyle: PIECE_COLOR,
                text: index,
                fontSize: PIECE_FONT_SIZE,
            }).addChildTo(pieceGroup);

            // ボタンの位置を設定
            button.x = pieceGrid.span(xIndex) + PIECE_OFFSET_X;
            button.y = pieceGrid.span(yIndex) + PIECE_OFFSET_Y;
            // ボタンを押した際の処理を登録
            button.onpush = function() {
                self.check(this);
            };
            // インデックスを保持
            button.index = index;
        });
        
        // タイマーラベルを生成
        var timerLabel = Label(0).addChildTo(this);
        timerLabel.x = SCREEN_GRID_X.span(-1);
        timerLabel.y = SCREEN_GRID_Y.span(2.5);
        timerLabel.fillStyle = "#444";
        timerLabel.fontSize = 100;
        timerLabel.align = 'right';
        timerLabel.baseline = 'bottom';
        this.timerLabel = timerLabel;
        
        // リセットボタンを生成
        var resetButton = FlatButton({
            text: "RESET",
            width: BUTTON_WIDTH,
            fillStyle: BUTTON_COLOR,
        }).addChildTo(this);
        resetButton.x = SCREEN_GRID_X.span(-4);
        resetButton.y = SCREEN_GRID_Y.span(-1.5);
        resetButton.onpush = function() {
            self.reset();
        };
        // タイトルボタンを生成
        var titleButton = FlatButton({
            text: "TITLE",
            width: BUTTON_WIDTH,
            fillStyle: BUTTON_COLOR,
        }).addChildTo(this);
        titleButton.x = SCREEN_GRID_X.span(4);
        titleButton.y = SCREEN_GRID_Y.span(-1.5);
        titleButton.onpush = function() {
            self.gotoTitle();
        };
    },
    
    // エンター時
    onenter: function() {
        // カウントシーンをプッシュ
        var scene = CountScene({
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            count: ['Ready'],
            fontSize: 100,
        });
        this.app.pushScene(scene);
    },
    // 更新処理
    update: function(app) {
        // タイマーを更新
        this.time += app.deltaTime;
        var sec = this.time/1000; // 秒数に変換
        this.timerLabel.text = sec.toFixed(3);
    },
    // チェック処理
    check: function(piece) {
        // 今の index と一致したら次に進める
        if (this.currentIndex === piece.index) {
            this.currentIndex += 1;
            piece.alpha = 0.5;
            piece.setInteractive(false);
            
            // すべてのボタンを押し終えたらクリア
            if (this.currentIndex > MAX_NUM) {
                this.clear();
            }

            SoundManager.play('touch');
        }
    },
    // クリア処理
    clear: function() {
        // スコアを計算
        var score = 100*1000 - this.time;
        score = (score/10).floor();
        score = Math.max(score, 0);

        this.exit('result', {
            score: score,
        });
    },
    // リセット
    reset: function() {
        this.exit('game');
    },
    // タイトルへ遷移
    gotoTitle: function() {
        this.exit('title');
    },
});
