"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}define(["common/slider/slider","site/pages/pages","site/popups/popups","site/panels/panels","./lang"],function(e,n,t,o,i){var s,a,r,c,u,d,l,p,f,h,y={appendCss:function(e){var n=document.createElement("link");return/\.less$/.test(e)?"object"===("undefined"==typeof less?"undefined":_typeof(less))?(n.rel="stylesheet/less",n.href=e,less.sheets.push(n),less.refresh()):(n.rel="stylesheet",n.href=e.replace(/less$/,"css")):(n.rel="stylesheet",n.href=e),(document.head||document.getElementsByTagName("head")[0]).appendChild(n)},removeCss:function(e){return $(e).remove(),"stylesheet/less"===e.rel&&(less.sheets.splice(less.sheets.indexOf(e),1),less.refresh()),e.getAttribute("href")},buildHash:function(e){var n,t="#!"+encodeURIComponent(e.id);for(n in e.args)t+=e.args[n]===undefined?"&"+encodeURIComponent(n):"&"+encodeURIComponent(n)+"="+encodeURIComponent(e.args[n]);return t},parseHash:function(e){var t,o,i,a={id:s,args:{}};if((i=(e=e.substr(1).replace(/[#?].*$/,"")).match(/[^=&]+(=[^&]*)?/g))&&"!"===i[0].charAt(0))for(o=decodeURIComponent(i[0].substr(1)),n.hasOwnProperty(o)&&(a.id=o),t=1;t<i.length;t++)(o=i[t].match(/^([^=]+)(=)?(.+)?$/))&&(a.args[decodeURIComponent(o[1])]=o[2]?decodeURIComponent(o[3]||""):undefined);return a},isSameLocation:function(e,n){var t;if(e.id===n.id&&Object.keys(e.args).length===Object.keys(n.args).length){for(t in e.args){if(!n.args.hasOwnProperty(t))return!1;if(e.args[t]===undefined){if(e.args[t]!==n.args[t])return!1}else if(""+e.args[t]!=""+n.args[t])return!1}return!0}return!1},replaceLocation:function(e){y.location&&y.isSameLocation(e,y.location)?y.reloadPage():location.replace(y.buildHash(e))},getLang:function(e){var n;if(navigator.languages){for(n=0;n<navigator.languages.length;n++)if(e.hasOwnProperty(navigator.languages[n]))return e[navigator.languages[n]]}else if(e.hasOwnProperty(navigator.language))return e[navigator.language];return e.en}};return i=y.getLang(i),function(){var e="function"==typeof Symbol?Symbol("xEvents"):"xEvents";function n(n){var o;for(this[e][n.type].locked=!0,o=0;o<this[e][n.type].heap.length;o++)this[e][n.type].heap[o].call(this,n);for(this[e][n.type].locked=!1;this[e][n.type].stack.length;)this[e][n.type].stack[0]?"function"==typeof this[e][n.type].stack[0]?(o=this[e][n.type].heap.indexOf(this[e][n.type].stack[0]))>=0&&this[e][n.type].heap.splice(o,1):this[e][n.type].heap.indexOf(this[e][n.type].stack[0][0])<0&&this[e][n.type].heap.push(this[e][n.type].stack[0][0]):this[e][n.type].heap.splice(0),this[e][n.type].stack.shift();t(this,n.type)}function t(n,t,o){!o&&n[e][t].heap.length||(delete n[e][t],n["on"+t]=null)}y.listeners={add:function(t,o,i){var s=0;return"function"==typeof i&&(t.hasOwnProperty(e)||(t[e]={}),t[e].hasOwnProperty(o)||(t[e][o]={stack:[],heap:[],locked:!1},t["on"+o]=n),t[e][o].locked?(t[e][o].stack.push([i]),s=2):t[e][o].heap.indexOf(i)<0&&(t[e][o].heap.push(i),s=1)),s},list:function(n,t){var o,i;if(t)i=n.hasOwnProperty(e)&&n[e].hasOwnProperty(t)?n[e][t].heap.slice(0):[];else if(i={},n.hasOwnProperty(e))for(o in n[e])i[o]=n[e][o].heap.slice(0);return i},remove:function(n,o,i){var s,a=0;if(n.hasOwnProperty(e))if(o)n[e].hasOwnProperty(o)&&(n[e][o].locked?(n[e][o].stack.push(i),a=2):"function"==typeof i?(s=n[e][o].heap.indexOf(i))>=0&&(n[e][o].heap.splice(s,1),t(n,o),a=1):(t(n,o,!0),a=1));else{for(s in n[e])n[e][s].locked?(n[e][s].stack.push(undefined),a=2):t(n,s,!0);a||(a=1)}return a}}}(),function(){var e,n,t,i=$("#panel"),s=i.find(">.contents>div");function a(e,o){n=!0,s.animate({"margin-left":o?"-100%":"0%"},{duration:200,complete:function(){var o;n=!1,e(),"function"==typeof t&&(o=t,t=undefined,o())}})}function r(){if("function"!=typeof o[e].onunload||!o[e].onunload())return o[e].status--,a(function(){"function"==typeof o[e].onunloadend&&o[e].onunloadend(),o[e].status--,s.find(">."+e)[0].style.display=i[0].style.display="",o[e].autoDestroy&&g(o[e],"panel",e),e=undefined},!1),!0}y.openPanel=function(e,n){if(o.hasOwnProperty(e))return m("panel",o[e],e,function(){"function"==typeof o[e].open?o[e].open(n):y.showPanel(e)}),!0},y.showPanel=function(c){var u=0;return o[c].status>1&&(n?(t=y.showPanel.bind(this,c),u=2):e?e===c?("function"==typeof o[c].onload&&o[c].onload(),"function"==typeof o[c].onloadend&&o[c].onloadend(),u=1):r()&&(t=y.showPanel.bind(this,c),u=1):(o[c].status++,"function"==typeof o[c].onload&&o[c].onload(),i[0].className=e=c,i[0].style.display=s.find(">."+c)[0].style.display="block",a(function(){"function"==typeof o[c].onloadend&&o[c].onloadend(),o[c].status++},!0),u=1)),u},y.closePanel=function(o){var i=0;return n?(t=y.closePanel.bind(this,o),i=2):e&&(!o||e===o||"Array"===dataType(o)&&o.indexOf(e)>=0)&&r()&&(i=1),i},y.getCurrentPanel=function(){return e},y.destroyPanel=function(e){if(2===o[e].status)return g(o[e],"panel",e),!0},t=y.closePanel.bind(y,undefined),s.find(">.close").on("click",t),i.find(">.mask").on("click",t),t=undefined}(),function(){var e,n=document.getElementById("popup"),o=$(n).find(">div>div");y.openPopup=function(e,n){if(t.hasOwnProperty(e))return m("popup",t[e],e,function(){"function"==typeof t[e].open?t[e].open(n):y.showPopup(e)}),!0},y.showPopup=function(i){var s;return t[i].status>1&&(e?e===i?("function"==typeof t[i].onload&&t[i].onload(),s=!0):"function"==typeof t[e].onunload&&t[e].onunload()||(t[e].status--,o.find(">."+e).css("display",""),t[e].autoDestroy&&g(t[e],"popup",e),o.find(">."+i).css("display","block"),n.className=e=i,t[i].status++,"function"==typeof t[i].onload&&t[i].onload(),s=!0):(o.find(">."+i)[0].style.display=n.style.display="block",n.className=e=i,"function"==typeof y.popupEvents.onshow&&y.popupEvents.onshow({type:"show",id:e}),t[i].status++,"function"==typeof t[i].onload&&t[i].onload(),s=!0)),s},y.closePopup=function(i){var s;if(e&&(!i||e===i||"Array"===dataType(i)&&i.indexOf(e)>=0)&&("function"!=typeof t[e].onunload||!t[e].onunload()))return t[e].status--,s=e,o.find(">."+e)[0].style.display=n.style.display=n.className=e="",t[s].autoDestroy&&g(t[s],"popup",e),"function"==typeof y.popupEvents.onhide&&y.popupEvents.onhide({type:"hide",id:s}),!0},y.getCurrentPopup=function(){return e},y.destroyPopup=function(e){if(2===t[e].status)return g(t[e],"popup",e),!0},y.popupEvents={},$(n).find(">div>a").on("click",y.closePopup.bind(y,undefined))}(),function(){var n,t,o=$("#photoview"),i=o.find(".close"),s=o.find(".prev"),a=o.find(".next"),r=o.find(".rotate.p"),c=o.find(".rotate.n"),u=e(o.find(">div")),d=[],l=[];function p(){var e=$(self);n=e.innerWidth(),t=e.innerHeight(),"number"==typeof u.current&&d[u.current]&&h(u.current)}function f(e){u.children[e].one("load",function(){d[e]={w:this.width,h:this.height},l[e]=0,u.current===e&&h(e),this.style.visibility="visible"})}function h(e){var o,i,s,a,r,c=l[e]%2;c?(a=d[e].h,r=d[e].w):(a=d[e].w,r=d[e].h),a>n||r>t?(n/t>(o=a/r)?i=(s=t)*o:s=(i=n)/o,c?(a=s,r=i):(a=i,r=s),u.children[e].css("cursor","zoom-in")):(a=d[e].w,r=d[e].h,u.children[e].css("cursor","")),u.children[e].css({top:(t-r)/2+"px",left:(n-a)/2+"px",width:a+"px",height:r+"px",transform:"rotate("+90*l[e]+"deg)"})}y.showPhotoView=function(e,n){var t;if("Array"===dataType(e)){for(t=0;t<e.length;t++)u.add($('<img src="'+e[t]+'"/>')),f(t);n>=0&&n<u.children.length&&u.slideTo(n,!0),u.children.length>1?(s.css("display","block"),a.css("display","block")):(s.css("display",""),a.css("display",""))}},y.hidePhotoView=function(){for(d=[];u.children.length;)u.remove(0)},o.on("click",">div>img",function(){"zoom-in"===this.style.cursor?(l[u.current]%2?(this.style.top=d[u.current].w>t?(d[u.current].w-d[u.current].h)/2+"px":(t-d[u.current].h)/2+"px",this.style.left=d[u.current].h>n?(d[u.current].h-d[u.current].w)/2+"px":(n-d[u.current].w)/2+"px"):(this.style.top=d[u.current].h>t?0:(t-d[u.current].h)/2+"px",this.style.left=d[u.current].w>n?0:(n-d[u.current].w)/2+"px"),this.style.width=d[u.current].w+"px",this.style.height=d[u.current].h+"px",this.style.cursor="zoom-out"):"zoom-out"===this.style.cursor&&h(u.current)}),$(self).on("resize",p),s.on("click",function(){u.slideTo(u.current-1)}),a.on("click",function(){u.slideTo(u.current+1)}),r.on("click",function(){"number"==typeof l[u.current]&&(l[u.current]++,h(u.current))}),c.on("click",function(){"number"==typeof l[u.current]&&(l[u.current]--,h(u.current))}),i.on("click",y.hidePhotoView),u.onchange=function(){this.current===undefined?o.css("display",""):(d[this.current]&&h(this.current),o.css("display","block"))},"transform"in document.documentElement.style&&(r.css("display","block"),c.css("display","block")),p()}(),u=0,d=$("#hint"),l=$("#readable"),p=$("#dialog"),f=$("#loading"),h=[],y.showLoading=function(e){f.find(">div>div").text(e||i.loading),0===u&&f.css("display","block"),u+=1},y.hideLoading=function(){u>0&&0==(u-=1)&&(f.css("display",""),"function"==typeof y.dialogEvents.onloaded&&y.dialogEvents.onloaded({type:"loaded"}))},y.isLoading=function(){return u>0},y.hint=function(e,n,t){d[0].className=n||"",d.find("span").text(e),a?clearTimeout(a):(d.css("display","block"),d[0].offsetWidth,d.fadeIn()),t||(t="error"===n?4e3:"warning"===n?3e3:2e3),a=setTimeout(function(){a=0,d.fadeOut(function(){d.css("display","")})},t)},y.showReadable=function(e,n,t,o,i){l.prop("className",i||"").css("display","block").find(">div").css({width:n,height:t}).find(">div").append(e),c=o},y.hideReadable=function(){"function"==typeof c&&(c(),c=undefined),l.css("display","").find(">div>div>*").remove()},y.hideDialog=function(e){var n;"function"==typeof r&&("isConfirm"===p[0].className?r(e):"isAlert"===p[0].className&&r(),r=undefined),p[0].className="",h.length>0&&(n=h[0][0],h[0].shift(),y[n].apply(this,h[0]),h.shift())},y.showForeign=function(e,n,t,o){y.showReadable('<iframe frameborder="no" allowtransparency="yes" marginwidth="0" marginheight="0" src="'+e+'"></iframe>',n,t,o,"foreign")},y.confirm=function(e,n,t){var o,s,a,c;""===p[0].className?(s=(o=p.find(">div")).find(">div>div"),a=o.find(">a.yes"),c=o.find(">a.no"),r=n,o.css("width",t||"400px"),"Array"===dataType(e)?(s.text(e[0]),a.text(e[1]),c.text(e[2])):(s.text(e),a.text(i.yes),c.text(i.no)),p[0].className="isConfirm",o.css("height",s.outerHeight()+Math.max(a.outerHeight(),c.outerHeight())+76+"px")):h.push(["confirm",e,n,t])},y.alert=function(e,n,t){var o,i;""===p[0].className?(i=(o=p.find(">div")).find(">div>div"),r=n,o.css("width",t||"400px"),i.text(e),p[0].className="isAlert",o.css("height",i.outerHeight()+46+"px")):h.push(["alert",e,n,t])},l.find(">div>a").on("click",y.hideReadable),p.find(">div>a.close").on("click",y.hideDialog),p.find(">div>a.yes").on("click",function(){y.hideDialog(!0)}),p.find(">div>a.no").on("click",function(){y.hideDialog(!1)}),y.dialogEvents={},function(){var e;function t(t,o){(!t||t===e||"Array"===dataType(t)&&t.indexOf(e)>=0)&&(o||w(),"function"==typeof n[e].onload&&n[e].onload(!0))}function o(){var t=history.state,o=y.parseHash(location.hash);history.replaceState&&history.replaceState(!0,null),y.location&&y.isSameLocation(y.location,o)||(y.lastLocation=y.location,y.location=o,y.lastLocation&&w(),"function"==typeof y.pageEvents.onroute&&y.pageEvents.onroute({type:"route",history:t}),m("page",n[o.id],o.id,function(i){var s;o.id!==e?(s=i||!t,e&&("function"==typeof n[e].onunload&&n[e].onunload(),n[e].status--,v("page",e).css("display",""),n[e].autoDestroy&&g(n[e],"popup",activePopup)),document.body.className=e=o.id,v("page",o.id).css("display","block"),n[o.id].status++,"function"==typeof n[o.id].onload&&n[o.id].onload(s)):"function"==typeof n[o.id].onload&&n[o.id].onload(),"function"==typeof y.pageEvents.onrouteend&&y.pageEvents.onrouteend({type:"routeend",history:t,force:s})}))}y.init=function(e){var t,i,a;if(n.hasOwnProperty(e))if(s){if(s!==e&&(i=s,s=e,y.location.id===i))return o(),!0}else s=e,"onhashchange"in self?$(self).on("hashchange",o):(setInterval(function(){t!==location.hash&&(t=location.hash,o())},10),t=location.hash),o(),y.location.args.hasOwnProperty("autopopup")&&(y.location.args.hasOwnProperty("autopopuparg")&&(a=y.location.args.autopopuparg.parseJsex())&&(a=a.value),y.openPopup(y.location.args.autopopup,a))},y.reloadPage=function(e,n){var o;y.isLoading()?(o=y.location,y.listeners.add(y.dialogEvents,"loaded",function i(s){y.listeners.remove(this,s.type,i);o===y.location&&t(e,n)})):t(e,n)},y.destroyPage=function(e){if(2===n[e].status)return g(n[e],"page",e),!0},y.pageEvents={}}(),y;function g(e,n,t){var o,i=n+"/"+t+"/";if("function"==typeof e.ondestroy&&e.ondestroy(),v(n,t).remove(),e.css&&"string"!=typeof e.css&&(e.css=y.removeCss(e.css).substr(require.toUrl(i).length)),e.js&&(i+=e.js,require.defined(i)&&(o=require(i),require.undef(i),o)))for(i in o)delete e[i];delete e.status}function v(e,n){var t="#"+e;return"popup"===e?t+=">div>div":"panel"===e&&(t+=">.contents>div"),n&&(t+=">."+n),$(t)}function m(e,n,t,o){var s,a,r,c,u;function d(){var i;"js"in n?(y.showLoading(),i=r+n.js,require([i],function(e){e&&Object.assign(n,e),n.status++,o(!0),y.hideLoading()},"dev"===VERSION?undefined:function(o){g(n,e,t),o.requireType&&"scripterror"!==o.requireType&&"nodefine"!==o.requireType||o.xhr&&404!==o.xhr.status?l(i,o.message):p(),y.hideLoading()})):(n.status++,o(!0))}function l(e,n){y.alert(i.error.replace("${res}",e)+n,u?function(){history.back()}:undefined)}function p(){u?location.reload():y.confirm(i.update,function(e){e&&location.reload()})}n.status>1?o():n.status||(n.status=1,a=v(e)[0],r=e+"/"+t+"/",c=require.toUrl(r),u="page"===e,"string"==typeof n.css&&(n.css=y.appendCss(c+n.css)),"html"in n?(s=c+n.html,$.ajax({url:s,type:"get",dataType:"text",success:function(e){a.insertAdjacentHTML("afterBegin",'<div class="'+t+'">'+e+"</div>"),d()},error:function(o){g(n,e,t),"dev"===VERSION||404!==o.status?l(s,o.status):p()},complete:y.hideLoading}),y.showLoading()):(a.insertAdjacentHTML("afterBegin",'<div class="'+t+'"></div>'),d()))}function w(){y.closePanel(),y.closePopup(),y.hideReadable()}});