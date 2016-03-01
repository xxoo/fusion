'use strict';
define(['site/kernel/kernel'], function(kernel) {
    var thisPopup = 'samplePopup';
    var o = $('#'+thisPopup+'>.content>span');
    return {
        onload: function(param){
            o.text(param);
        },
        onunload: function(){
            console.log('closing ' + thisPopup);
        }
    };
});