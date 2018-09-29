'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = $('#popup>div>div>.' + thisPopup);
	var o = dom.find('>.content>span');
	return {
		open: function(param) {
			o.text(param);
			kernel.showPopup(thisPopup);
		},
		onunload: function() {
			console.log('closing ' + thisPopup);
		}
	};
});