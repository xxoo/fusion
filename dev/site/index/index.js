'use strict';
define(['common/kernel/kernel'], function (kernel) {
	//百度统计代码
	if (location.host === 'your_production_host') {
		self._hmt = [
			['_setAutoPageview', false]
		];
		require(['//hm.baidu.com/hm.js?[your_hmid]'], function () {
			//由于百度统计在head中插入的input标签在ie7中会导致jquery选择器遍历时出错，这里尝试将其移除
			let head = document.head || document.getElementsByTagName('head'),
				ipt = head.getElementsByTagName('input')[0];
			if (ipt) {
				head.removeChild(ipt);
			}
		});
		kernel.listeners.add(kernel.pageEvents, 'route', function () {
			_hmt.push(['_trackPageview', location.pathname + kernel.buildHash(kernel.location)]);
		});
	}
	kernel.listeners.add(kernel.pageEvents, 'routeend', function (evt) {
		//如果上次访问的页面id和当前页id不同，并且不是在history中导航时，则滚动到页面顶部
		if (kernel.lastLocation && kernel.lastLocation.id !== kernel.location.id && !evt.history && Math.max(document.body.scrollTop, document.documentElement.scrollTop)) {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	});
	kernel.init('doc');
});