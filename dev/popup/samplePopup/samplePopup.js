'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	let thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#popup>div>.' + thisPopup),
		o = dom.querySelector(':scope>.content>span');
	return {
		open: function(param) {
			o.textContent = param;
			kernel.showPopup(thisPopup);
		},
		onunload: function() {
			console.log('closing ' + thisPopup);
		}
	};
});