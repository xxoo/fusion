! function() {
	'use strict';
	var prefix = (document.currentScript || (function() {
			var scripts = document.getElementsByTagName('script');
			return scripts[scripts.length - 1];
		})()).src.replace(/^http(s)?:\/\/[^\/]+|[^\/]+$/g, ''),
		head = document.head || document.getElementsByTagName('head')[0];
	if (!window.XMLHttpRequest) {
		window.onload = function() {
			document.getElementById('loading').firstChild.firstChild.firstChild.data = '请使用IE7+、Chrome、Firefox访问';
		};
	} else {
		require([prefix + 'require-config.js?' + new Date().valueOf()], function() {
			var l = document.createElement('link');
			var m = document.createElement('link');
			if (require.data.debug) {
				l.rel = m.rel = 'stylesheet/less';
				l.href = require.toUrl('site/index/index.less');
				m.href = require.toUrl('common/kernel/kernel.less');
				require([prefix + 'less.js'], function() {
					less.pageLoadFinished.then(function() {
						require(['site/index/index']);
					});
				});
			} else {
				l.rel = m.rel = 'stylesheet';
				l.href = require.toUrl('site/index/index.css');
				m.href = require.toUrl('common/kernel/kernel.css');
				require(['site/index/index']);
			}
			head.appendChild(m);
			head.appendChild(l);
		});
	}
}();