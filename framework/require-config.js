'use strict';
define(['module'], function(module) {
	//请确保modules第一个被赋值
	var modules = {"common/kernel":"0.0.28","common/slider":"0.0.4","common/text":"0.0.3","page/doc":3,"panel/samplePanel":"0.0.5","popup/samplePopup":"0.0.6","site/index":"0.0.10","site/pages":"0.0.4","site/panels":"0.0.3","site/popups":"0.0.4"},
		//请确保srcRoot第二个被赋值
		srcRoot = 'dev/',
		//请确保productRoot第三个被赋值
		productRoot = 'dist/',
		//请确保siteVersion第四个被赋值
		siteVersion = "1.0.41",
		//请确保debug第五个被赋值
		debug = false,
		prefix = module.id.replace(/framework\/[^\/]+$/, ''),
		cfg = {
			waitSeconds: 0,
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
});