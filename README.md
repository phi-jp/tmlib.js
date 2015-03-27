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
<script src="http://cdn.rawgit.com/phi-jp/tmlib.js/0.4.4/build/tmlib.js"></script>
```


[runstant](http://qiita.com/phi/items/e7fe30156c43a7690c1a) で実際に体験できます.

[[runstant]](http://goo.gl/B2JcWF)


## Documentation
ドキュメントは[こちら](http://phi-jp.github.io/tmlib.js/docs/index.html)


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

[tmlife](http://tmlife.io)

## Feature

### 0.5

- getFinalMatrix の位置が origin によってズレるバグを修正 ... done
- checkHierarchy のデフォルト値を true に変更 ... done
- tm.display.Grid を実装 ... done
- getChildIndex の機能が getChildAt になっていたのを修正 ... done
- tm.app.Element.prototype.getChildAt を実装 ... done
- tm.app.Object2D の left, right, top, bottom それぞれの setter を実装 ... done
- scene namespace を game namespace に変更
- tm.game.CountScene を作成
- tm.game.ResultScene のデザインを変更
- pointing の機能を強化( startPosition 保持したり, 数フレーム分の移動値をキャッシュしたり )
- CircleShape がサイズによって切れる問題を修正
- テスト改修
- リファクタリング



