"use strict";define("page/home/home",["module","common/kernel/kernel"],function(e,n){var t=e.id.replace(/^[^\/]+\/|\/[^\/]+/g,""),i=$("#"+t),o=0;return i.find(">a").on("click",function(){o++,n.openPanel("samplePanel",o)}),{onload:function(e){e&&n.alert("loading "+t)},onunload:function(){console.log("leaving "+t)}}});