'use strict';
define(['module', 'site/kernel/kernel'], function(module, kernel) {
	var thisPage = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = $('#' + thisPage);
	var i = 0;
	dom.find('>a').on('click', function(){
		i++;
		kernel.openPopup('samplePopup', i);
	});
	return {
		onload:function(force){
			if (force) {
				kernel.alert('loading ' + thisPage);
			}
		},
		onunload: function(){
			console.log('leaving ' + thisPage);
		}
	};
});