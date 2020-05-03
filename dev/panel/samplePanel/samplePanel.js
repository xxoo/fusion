'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	let thisPanel = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = document.querySelector('#panel>.contents>div>.' + thisPanel);
	return {
		onload: function() {
			console.log('opening ' + thisPanel);
		},
		onunload: function() {
			console.log('closing ' + thisPanel);
		},
		onloadend: function() {
			console.log(thisPanel + ' is open');
		},
		onunloadend: function() {
			console.log(thisPanel + ' is closed');
		},
		ondestroy: function() {
			console.log('do clean up stuff here');
		}
	};
});