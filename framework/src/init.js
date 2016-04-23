'use strict';
var _hmt;
! function() {
	var head = document.head || document.getElementsByTagName('head')[0];
	if ($.browser.msie && parseInt($.browser.version) < 7) {
		window.onload = function() {
			document.getElementById('loading').firstChild.firstChild.firstChild.data = '请使用IE7+、Chrome、Firefox访问';
		};
	} else {
		require(['/fusion/framework/require-config.js?' + new Date().valueOf()], function() {
			var l = document.createElement('link');
			var m = document.createElement('link');
			if (require.data.debug) {
				l.rel = m.rel = 'stylesheet/less';
				l.href = require.toUrl('site/index/index.less');
				m.href = require.toUrl('site/kernel/kernel.less');
				require(['/fusion/framework/less.js'], function() {
					require(['site/index/index']);
				});
			} else {
				l.rel = m.rel = 'stylesheet';
				l.href = require.toUrl('site/index/index.css');
				m.href = require.toUrl('site/kernel/kernel.css');
				require(['site/index/index']);
			}
			head.appendChild(l);
			head.appendChild(m);
		});
		//百度统计代码
		if (location.host === 'your_production_host') {
			_hmt = [
				['_setAutoPageview', false]
			];
			require(['//hm.baidu.com/hm.js?[your_hmid]'], function(){
				//由于百度统计在head中插入的input标签在ie7中会导致jquery选择器遍历时出错，这里尝试将其移除
				if ($.browser.msie && parseInt($.browser.version) === 7) {
					var ipt = head.getElementsByTagName('input')[0];
					if (ipt) {
						head.removeChild(ipt);
					}
				}
			});
		}
	}
}();