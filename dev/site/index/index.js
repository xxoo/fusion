'use strict';
define(['common/kernel/kernel'], function(kernel) {
	//百度统计代码
	if (location.host === 'your_production_host') {
		window._hmt = [
			['_setAutoPageview', false]
		];
		require(['//hm.baidu.com/hm.js?[your_hmid]'], function() {
			//由于百度统计在head中插入的input标签在ie7中会导致jquery选择器遍历时出错，这里尝试将其移除
			var ipt = head.getElementsByTagName('input')[0];
			if (ipt) {
				head.removeChild(ipt);
			}
		});
	}
	kernel.init('doc', undefined, function() {
		//百度统计接口
		if (window._hmt && _hmt.push) {
			_hmt.push(['_trackPageview', '/' + kernel.buildHash(kernel.location)]);
		}
	});
});