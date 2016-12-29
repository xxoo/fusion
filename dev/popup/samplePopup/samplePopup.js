'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = $('#' + thisPopup);
	var o = dom.find('>.content>span');
	return {
		onload: function(param) {
			o.text(param);
		},
		onunload: function() {
			console.log('closing ' + thisPopup);
		}
	};
});