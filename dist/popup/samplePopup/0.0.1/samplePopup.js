"use strict";define("popup/samplePopup/samplePopup",["site/kernel/kernel"],function(e){var n="samplePopup",t=$("#"+n+">.content>span");return{onload:function(e){t.text(e)},onunload:function(){console.log("closing "+n)}}});