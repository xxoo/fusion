'use strict';define(['module','common/kernel/kernel'],function(a,b){var c=a.id.replace(/^[^/]+\/|\/[^/]+/g,''),d=$('#'+c),e=d.find('>.content>span');return{open:function d(a){e.text(a),b.showPopup(c)},onunload:function a(){console.log('closing '+c)}}});