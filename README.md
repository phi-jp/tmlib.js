# [tmlib.js](http://phi1618.github.com/tmlib.js)

<img src="https://github.com/phi1618/tmlib.js/raw/master/logo.png" width="320" height="320">

『**JavaScript をより使いやすく, より便利に, そしてより豊かに**』を  
コンセプトに制作した JavaScript ライブラリです.

やってることは

- 生成時に new がいらない class 定義の仕組みを作ってみたり
- jQuery ライクに DOM を扱えるようにしたり
- ajax 機能をサポートしてみたり
- HTML5 Canvas をラップして使いやすくしたり
- アニメーションできるようにしてみたり
- ベクトルや行列をサポートしてみたり
- 音を鳴らせるようにしてみたり
- 入力系をサポートしてみたり
- 1つのコードで PC とスマホ同時対応できるようにしてみたり

と色々やってます.

[Examples](#examples) - [Documentation](#documentation) - [Download](#download)



## Download
- [tmlib.js version 0.1.8](https://raw.github.com/phi-jp/tmlib.js/0.1.8/build/tmlib.js)
- [tmlib.min.js version 0.1.8](https://raw.github.com/phi-jp/tmlib.js/0.1.8/build/tmlib.min.js)
- [tmlib.js version 0.1.6 Starter pack](https://github.com/phi-jp/tmlib.js/raw/0.1.6/starter-0.1.6.zip)


## Documentation
ドキュメントは[こちら](http://phi-jp.github.io/tmlib.js/docs/index.html)

## Usage
使い方
```html
<script src="tmlib.js"></script>
```


読み込み後は下記のような形で使用します.

```html
<!DOCTYPE html>

<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <title>Starter Pack | tmlib.js</title>
        <link rel="apple-touch-icon-precomposed" href="icon.png" />

        <script src="http://rawgithub.com/phi1618/tmlib.js/0.1.6/build/tmlib.js"></script>
        <script>
            // メイン処理(ページ読み込み後に実行される)
            tm.main(function() {
                // アプリケーション作成
                var app = tm.app.CanvasApp("#world");
                app.resizeWindow(); // 画面サイズに合わせる
                app.fitWindow();    // リサイズ対応
                app.background = "rgba(0, 0, 0, 1)";  // 背景色をセット
                
                // 星スプライト
                var star = tm.app.Shape(64, 64);
                star.canvas.setColorStyle("white", "yellow").fillStar(32, 32, 32, 5);
                app.currentScene.addChild(star);    // シーンに追加

                // 更新
                app.currentScene.update = function(app) {
                    // マウス位置 or タッチ位置に移動
                    star.x = app.pointing.x;
                    star.y = app.pointing.y;
                    // クリック or タッチ中は回転させる
                    if (app.pointing.getPointing() == true) { star.rotation += 15; }
                };

                // 実行
                app.run();
            });
        </script>
    </head>
    <body>
        <canvas id="world"></canvas>
    </body>
</html>
```



## Examples

使用例です. 随時追加していきます.  
また, 「こんなん作ってみた」とかあれば教えて下さい.

<a href="http://storage.tmlife.net/libs/tmlib.js/examples/circle/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/circle/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/circle-collision/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/circle-collision/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/filter/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/filter/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/juggling/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/juggling/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/magic-square/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/magic-square/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/paint/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/paint/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/piano/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/piano/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/pursuit/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/pursuit/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/shooting/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/shooting/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/snow/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/snow/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/text-effect/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/text-effect/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/torne-interface/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/torne-interface/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/unit-circle/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/unit-circle/icon.png" /></a>
<a href="http://storage.tmlife.net/libs/tmlib.js/examples/particle/"><img alt="screenshot" width="160" src="http://storage.tmlife.net/libs/tmlib.js/examples/particle/icon.png" /></a>


## License
MIT License


## Browser

対応ブラウザの一覧です.  
IE なんて知りません.
- [Google Chrome](http://www.google.co.jp/chrome/intl/ja/landing_ch.html)
- [Safari](http://www.apple.com/jp/safari/)
- [Firefox](http://mozilla.jp/firefox/)
- [IE9~](#)


## Resource
当プロジェクトで使用させていただいている画像・音楽はこちらの皆様からお借りしております.

### Music
- [魔王魂](http://maoudamashii.jokersounds.com/)
- [ザ・マッチメイカァズ2nd](http://osabisi.sakura.ne.jp/m2/)

## Blog

tmlib.js に関する最新の情報やチュートリアルなどはこちらのブログで紹介していきます.

[TM Life](http://tmlife.net)

