'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	var thisPanel = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = $('#' + thisPanel);
	//var o = dom.find('>.content>span');
	return {
		onload: function(param) {
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
		ondestory: function() {
			console.log('do clean up stuff here');
		}
	};
});