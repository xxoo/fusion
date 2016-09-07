'use strict';
! function() {
    //请确保modules第一个被赋值
    var modules = {"common/kernel":"0.0.8","common/slider":"0.0.2","common/text":"0.0.2","page/home":"0.0.4","panel/samplePanel":"0.0.1","popup/samplePopup":"0.0.3","site/index":"0.0.7","site/pages":"0.0.2","site/panels":"0.0.1","site/popups":"0.0.2"},
        //请确保srcRoot第二个被赋值
        srcRoot = 'dev/',
        //请确保productRoot第三个被赋值
        productRoot = 'dist/',
        //请确保siteVersion第四个被赋值
        siteVersion = "1.0.20",
        //请确保debug第五个被赋值
        debug = false,
        prefix = '/fusion/',
        cfg = {
            baseUrl: prefix + srcRoot
        };

    if (!debug) {
        for (var n in modules) {
            modules[n] = prefix + productRoot + n + '/' + modules[n];
        }
        cfg.paths = modules;
    }
    require.config(cfg);
    //用于外部访问的基本信息
    require.data = {
        siteVersion: siteVersion,
        debug: debug
    };
    //若需要从外部获得模块路径请使用require.toUrl('family/name')
}();