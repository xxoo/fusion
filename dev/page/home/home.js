'use strict';
define(['module', 'common/kernel/kernel'], function(module, kernel) {
	var thisPage = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = $('#' + thisPage);
	var i = 0;
	dom.find('>a').on('click', function(){
		i++;
		kernel.openPanel('samplePanel', i);
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