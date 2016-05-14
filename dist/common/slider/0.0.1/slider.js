"use strict";define("common/slider/slider",function(t){function i(t,i){var n=t%i;return 0>n&&(n+=i),n}function n(t,i){var n="on"+i;"function"==typeof t[n]&&t[n]({type:i})}function e(t){t.delay&&(t.timer=setTimeout(function(){delete t.timer,t.slideTo(t.current+1)},t.delay))}var s=function(t,i,n,e){var r,h,a,c;if(!(this instanceof s))return new s(t,i,n,e);if(a=this,this.pushStack=[],this.removeStack=[],this.container=t,this.nav=e,t.on("mouseover",function(t){c=a.delay,a.stopPlay()}),t.on("mouseout",function(t){a.startPlay(c),c=void 0}),e&&(e.css("display","none"),e.on("click",">a",function(){var t,i;if(!$(this).hasClass("current"))for(i=e.find(">a"),t=0;t<i.length;t++)if(i[t]===this){a.slideTo(t);break}})),i instanceof Array&&i.length>0){for(this.children=i,"number"==typeof n&&n>=0&&n<i.length?this.current=n:this.current=0,r=0;r<i.length;r++)t.append(i[r]),e&&(h=$('<a href="javascript:;"></a>'),e.append(h)),r!==this.current?i[r].css("display","none"):h&&h.addClass("current");e&&i.length>1&&e.css("display","")}else this.current=void 0,this.children=[]};return s.prototype.add=function(t){var i,e;return this.sliding?this.pushStack.push(t):(i=this.children.length,this.container.append(t),this.children.push(t),this.nav&&(e=$('<a href="javascript:;"></a>'),this.nav.append(e)),0===i?(this.current=0,this.nav&&e.addClass("current"),n(this,"change")):(t.css("display","none"),this.nav&&this.nav.css("display",""))),i},s.prototype.remove=function(t){var e,s;return this.sliding?this.removeStack.push("number"==typeof t?this.children[t]:t):this.children.length>0&&("number"!=typeof t&&(t=this.children.indexOf(t)),t=i(t,this.children.length),e=this.children.splice(t,1)[0],e.remove(),this.nav&&(s=this.nav.find(">a").eq(t).remove()),this.current!==t&&this.current!==this.children.length||(this.children.length>0?(this.current=i(t,this.children.length),this.children[this.current].css("display",""),this.nav&&this.nav.find(">a").eq(this.current).addClass("current")):this.current=void 0,n(this,"change")),1===this.children.length&&this.nav&&this.nav.css("display","none")),e},s.prototype.slideTo=function(t,s){var r,h,a=this;return!this.sliding&&this.children.length>1?(t=i(t,this.children.length),t!==this.current?(this.timer&&(clearTimeout(this.timer),this.timer=void 0),s?(this.children[this.current].css("display","none"),this.children[t].css("display",""),e(this)):(this.sliding=!0,this.children[this.current].fadeOut(function(){a.children[a.current].fadeIn(function(){a.sliding=!1,e(a)})})),this.nav&&(h=this.nav.find(">a"),$(h[this.current]).removeClass("current"),$(h[t]).addClass("current")),this.current=t,n(this,"change"),r=!0):r=!1):r=!1,r},s.prototype.startPlay=function(t){this.stopPlay(),this.delay=t,e(this)},s.prototype.stopPlay=function(){var t;return this.delay?(delete this.delay,this.timer&&(clearTimeout(this.timer),delete this.timer),t=!0):t=!1,t},s});