Ext.data.JsonP.tm_util_Flow({"tagname":"class","name":"tm.util.Flow","extends":"tm.event.EventDispatcher","mixins":[],"alternateClassNames":[],"aliases":{},"singleton":false,"requires":[],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{},"private":null,"id":"class-tm.util.Flow","members":{"cfg":[],"property":[{"name":"_listeners","tagname":"property","owner":"tm.event.EventDispatcher","meta":{"private":true},"id":"property-_listeners"},{"name":"args","tagname":"property","owner":"tm.util.Flow","meta":{},"id":"property-args"},{"name":"counter","tagname":"property","owner":"tm.util.Flow","meta":{},"id":"property-counter"},{"name":"waits","tagname":"property","owner":"tm.util.Flow","meta":{},"id":"property-waits"}],"method":[{"name":"constructor","tagname":"method","owner":"tm.util.Flow","meta":{},"id":"method-constructor"},{"name":"addEventListener","tagname":"method","owner":"tm.event.EventDispatcher","meta":{},"id":"method-addEventListener"},{"name":"clearEventListener","tagname":"method","owner":"tm.event.EventDispatcher","meta":{"chainable":true},"id":"method-clearEventListener"},{"name":"dispatchEvent","tagname":"method","owner":"tm.event.EventDispatcher","meta":{},"id":"method-dispatchEvent"},{"name":"fire","tagname":"method","owner":"tm.event.EventDispatcher","meta":{"chainable":true},"id":"method-fire"},{"name":"hasEventListener","tagname":"method","owner":"tm.event.EventDispatcher","meta":{},"id":"method-hasEventListener"},{"name":"isFinish","tagname":"method","owner":"tm.util.Flow","meta":{},"id":"method-isFinish"},{"name":"off","tagname":"method","owner":"tm.event.EventDispatcher","meta":{"chainable":true},"id":"method-off"},{"name":"on","tagname":"method","owner":"tm.event.EventDispatcher","meta":{"chainable":true},"id":"method-on"},{"name":"pass","tagname":"method","owner":"tm.util.Flow","meta":{},"id":"method-pass"},{"name":"removeEventListener","tagname":"method","owner":"tm.event.EventDispatcher","meta":{},"id":"method-removeEventListener"},{"name":"setup","tagname":"method","owner":"tm.util.Flow","meta":{"chainable":true},"id":"method-setup"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":6,"files":[{"filename":"flow.js","href":"flow.html#tm-util-Flow"}],"html_meta":{},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":["tm.event.EventDispatcher"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='docClass'>tm.event.EventDispatcher</a><div class='subclass '><strong>tm.util.Flow</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/flow.html#tm-util-Flow' target='_blank'>flow.js</a></div></pre><div class='doc-contents'><p>it is inspire in made flow.js of <code>@uupaa</code></p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-_listeners' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-property-_listeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-property-_listeners' class='name not-expandable'>_listeners</a><span> : Object</span><strong class='private signature' >private</strong></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-args' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tm.util.Flow'>tm.util.Flow</span><br/><a href='source/flow.html#tm-util-Flow-property-args' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.util.Flow-property-args' class='name not-expandable'>args</a><span> : Object</span></div><div class='description'><div class='short'><p>args</p>\n</div><div class='long'><p>args</p>\n</div></div></div><div id='property-counter' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tm.util.Flow'>tm.util.Flow</span><br/><a href='source/flow.html#tm-util-Flow-property-counter' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.util.Flow-property-counter' class='name expandable'>counter</a><span> : Number</span></div><div class='description'><div class='short'>counter ...</div><div class='long'><p>counter</p>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='property-waits' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tm.util.Flow'>tm.util.Flow</span><br/><a href='source/flow.html#tm-util-Flow-property-waits' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.util.Flow-property-waits' class='name expandable'>waits</a><span> : Number</span></div><div class='description'><div class='short'>waits ...</div><div class='long'><p>waits</p>\n<p>Defaults to: <code>0</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tm.util.Flow'>tm.util.Flow</span><br/><a href='source/flow.html#tm-util-Flow-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/tm.util.Flow-method-constructor' class='name expandable'>tm.util.Flow</a>( <span class='pre'></span> ) : <a href=\"#!/api/tm.util.Flow\" rel=\"tm.util.Flow\" class=\"docClass\">tm.util.Flow</a></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/tm.util.Flow\" rel=\"tm.util.Flow\" class=\"docClass\">tm.util.Flow</a></span><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href='#!/api/tm.event.EventDispatcher-method-constructor' rel='tm.event.EventDispatcher-method-constructor' class='docClass'>tm.event.EventDispatcher.constructor</a></p></div></div></div><div id='method-addEventListener' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-method-addEventListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-method-addEventListener' class='name expandable'>addEventListener</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>on と同じ ...</div><div class='long'><p>on と同じ</p>\n</div></div></div><div id='method-clearEventListener' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-method-clearEventListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-method-clearEventListener' class='name expandable'>clearEventListener</a>( <span class='pre'>type</span> ) : <a href=\"#!/api/tm.event.EventDispatcher\" rel=\"tm.event.EventDispatcher\" class=\"docClass\">tm.event.EventDispatcher</a><strong class='chainable signature' >chainable</strong></div><div class='description'><div class='short'>type に登録されているリスナーを全てクリア ...</div><div class='long'><p>type に登録されているリスナーを全てクリア</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/tm.event.EventDispatcher\" rel=\"tm.event.EventDispatcher\" class=\"docClass\">tm.event.EventDispatcher</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-dispatchEvent' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-method-dispatchEvent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-method-dispatchEvent' class='name expandable'>dispatchEvent</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>fire と同じ ...</div><div class='long'><p>fire と同じ</p>\n</div></div></div><div id='method-fire' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-method-fire' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-method-fire' class='name expandable'>fire</a>( <span class='pre'>e</span> ) : <a href=\"#!/api/tm.event.EventDispatcher\" rel=\"tm.event.EventDispatcher\" class=\"docClass\">tm.event.EventDispatcher</a><strong class='chainable signature' >chainable</strong></div><div class='description'><div class='short'>イベント発火 ...</div><div class='long'><p>イベント発火</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>e</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/tm.event.EventDispatcher\" rel=\"tm.event.EventDispatcher\" class=\"docClass\">tm.event.EventDispatcher</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-hasEventListener' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-method-hasEventListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-method-hasEventListener' class='name expandable'>hasEventListener</a>( <span class='pre'>type</span> )</div><div class='description'><div class='short'>type に登録されたイベントがあるかをチェック ...</div><div class='long'><p>type に登録されたイベントがあるかをチェック</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isFinish' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tm.util.Flow'>tm.util.Flow</span><br/><a href='source/flow.html#tm-util-Flow-method-isFinish' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.util.Flow-method-isFinish' class='name expandable'>isFinish</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>終了チェック ...</div><div class='long'><p>終了チェック</p>\n</div></div></div><div id='method-off' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-method-off' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-method-off' class='name expandable'>off</a>( <span class='pre'>type, listener</span> ) : <a href=\"#!/api/tm.event.EventDispatcher\" rel=\"tm.event.EventDispatcher\" class=\"docClass\">tm.event.EventDispatcher</a><strong class='chainable signature' >chainable</strong></div><div class='description'><div class='short'>リスナーを削除 ...</div><div class='long'><p>リスナーを削除</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>listener</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/tm.event.EventDispatcher\" rel=\"tm.event.EventDispatcher\" class=\"docClass\">tm.event.EventDispatcher</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-on' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-method-on' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-method-on' class='name expandable'>on</a>( <span class='pre'>type, listener</span> ) : <a href=\"#!/api/tm.event.EventDispatcher\" rel=\"tm.event.EventDispatcher\" class=\"docClass\">tm.event.EventDispatcher</a><strong class='chainable signature' >chainable</strong></div><div class='description'><div class='short'>イベントリスナー追加 ...</div><div class='long'><p>イベントリスナー追加</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>type</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>listener</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/tm.event.EventDispatcher\" rel=\"tm.event.EventDispatcher\" class=\"docClass\">tm.event.EventDispatcher</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-pass' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tm.util.Flow'>tm.util.Flow</span><br/><a href='source/flow.html#tm-util-Flow-method-pass' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.util.Flow-method-pass' class='name expandable'>pass</a>( <span class='pre'>key, value</span> )</div><div class='description'><div class='short'>パス ...</div><div class='long'><p>パス</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>key</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>value</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-removeEventListener' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/tm.event.EventDispatcher' rel='tm.event.EventDispatcher' class='defined-in docClass'>tm.event.EventDispatcher</a><br/><a href='source/eventdispatcher.html#tm-event-EventDispatcher-method-removeEventListener' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.event.EventDispatcher-method-removeEventListener' class='name expandable'>removeEventListener</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>off と同じ ...</div><div class='long'><p>off と同じ</p>\n</div></div></div><div id='method-setup' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='tm.util.Flow'>tm.util.Flow</span><br/><a href='source/flow.html#tm-util-Flow-method-setup' target='_blank' class='view-source'>view source</a></div><a href='#!/api/tm.util.Flow-method-setup' class='name expandable'>setup</a>( <span class='pre'>waits, callback</span> ) : <a href=\"#!/api/tm.util.Flow\" rel=\"tm.util.Flow\" class=\"docClass\">tm.util.Flow</a><strong class='chainable signature' >chainable</strong></div><div class='description'><div class='short'>セットアップ ...</div><div class='long'><p>セットアップ</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>waits</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>callback</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/tm.util.Flow\" rel=\"tm.util.Flow\" class=\"docClass\">tm.util.Flow</a></span><div class='sub-desc'><p>this</p>\n</div></li></ul></div></div></div></div></div></div></div>"});