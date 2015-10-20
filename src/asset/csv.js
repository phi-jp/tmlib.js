tm.asset = tm.asset || {};

(function() {
    /*
     * csv loader
     */
    tm.define('tm.asset.CSV', {
        superClass: 'tm.event.EventDispatcher',

        init: function (src) {
            var self = this;
            self.superInit();
            tm.util.Ajax.load({
                type: 'GET',
                url: src,
                success: function (d) {
                    self.loaded = true;
                    self.data = self.parse(d);
                    self.flare('load');
                },
            });
        },
        parse: function (data) {
            // 1行目(key name list)
            var rowData = data.split('\n');
            var keyList = rowData.shift().split(',');
            // 2行目以降をデータ化(forループのほうがいいかな？)
            var resultData = rowData.map(function (l) {
                var result = {};
                l.split(',').each(function (m, j) {
                    result[keyList[j]] = m;
                });
                return result;
            });
            return resultData;
        },
    });

    tm.asset.Loader.register('csv', function(path, key) {
        return tm.asset.CSV(path, key);
    });
})();
