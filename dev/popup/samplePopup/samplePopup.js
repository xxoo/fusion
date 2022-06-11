'use strict';
define(['module', 'common/fusion/fusion'], function (module, fusion) {
	let thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#popup>div>.' + thisPopup),
		o = dom.querySelector(':scope>.content>span');
	return {
		open: function (param) {
			o.textContent = param;
			fusion.showPopup(thisPopup);
		},
		onunload: function () {
			console.log('closing ' + thisPopup);
		}
	};
});