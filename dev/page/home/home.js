'use strict';
define(['site/kernel/kernel'], function(kernel) {
	var thisPage = 'home', i = 0;
	$('#'+thisPage+'>a').on('click', function(){
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