# [tmlib.js](http://phi-jp.github.com/tmlib.js)

[![Join the chat at https://gitter.im/phi-jp/tmlib.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/phi-jp/tmlib.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<img src="https://qiita-image-store.s3.amazonaws.com/0/7756/7aa8af56-c678-0146-d101-3064923f95b9.png" width=400 style="text-align: center;">

『**JavaScript をより使いやすく, より便利に, そしてより豊かに**』を  
コンセプトに制作した JavaScript ライブラリです.

簡単にゲームを作ったりリッチなwebページを作ることができます.
公式ページは[こちら](http://phi-jp.github.io/tmlib.js/).


[Gitter](https://gitter.im/phi-jp/tmlib.js#)

## Usage

使い方は tmlib.js を読み込むだけです.
これだけで全ての機能を使う事ができます.

```html
<script src="http://cdn.rawgit.com/phi-jp/tmlib.js/0.5.0/build/tmlib.js"></script>
```


[runstant](http://qiita.com/phi/items/e7fe30156c43a7690c1a) で実際に体験できます.

[[runstant]](http://goo.gl/B2JcWF)


## Documentation
ドキュメントは[こちら](http://phi-jp.github.io/tmlib.js/docs/index.html)


## License

MIT License


## Browser

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

[phiary](http://phiary.me)

## Feature

### 0.6

- tm.game.ResultScene のデザインを変更
- pointing の機能を強化( startPosition 保持したり, 数フレーム分の移動値をキャッシュしたり )
- テスト改修
- リファクタリング
- マルチタッチ対応

## Released

### 0.5

- [getFinalMatrix の位置が origin によってズレるバグを修正](https://github.com/phi-jp/tmlib.js/pull/143)
- [tm.util.GridSystem を実装](https://github.com/phi-jp/tmlib.js/commit/04f26429391834b948ecf1b55e8b2d95e3d2ed2a)
- [checkHierarchy のデフォルト値を true に変更](https://github.com/phi-jp/tmlib.js/commit/1ea9499b5ef037d5cec8ed2c8b7ccbc2ea61080c)
- [tm.display.Grid を実装](https://github.com/phi-jp/tmlib.js/commit/90c1b986941df3adfba0847184c841dc883dc134)
- [getChildIndex の機能が getChildAt になっていたのを修正](https://github.com/phi-jp/tmlib.js/commit/103ba47c7631d162f7a79b4c213d7830f00389f1)
- [tm.app.Element.prototype.getChildAt を実装](https://github.com/phi-jp/tmlib.js/commit/103ba47c7631d162f7a79b4c213d7830f00389f1)
- [tm.app.Object2D の left, right, top, bottom それぞれの setter を実装](https://github.com/phi-jp/tmlib.js/commit/a0ca57c3866663794a8aad451f94120dbaaef3a5)
- [tm.sound.SoundManager を実装](https://github.com/phi-jp/tmlib.js/pull/147)
- [tm.game.CountScene を作成](https://github.com/phi-jp/tmlib.js/pull/148)
- [JavaScript ファイルのAsset対応](https://github.com/phi-jp/tmlib.js/issues/146)
- [scene namespace を game namespace に変更](https://github.com/phi-jp/tmlib.js/pull/151)
- [tm.game.setup で Canvas ゲーム開発を簡略化](https://github.com/phi-jp/tmlib.js/pull/152)
- [tm.game.SplashScene を実装](https://github.com/phi-jp/tmlib.js/pull/153)


