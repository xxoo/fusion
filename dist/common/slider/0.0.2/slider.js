"use strict";define("common/slider/slider",function(e){function n(e,n){var t=e%n;return 0>t&&(t+=n),t}function t(e,n){var t="on"+n;"function"==typeof e[t]&&e[t]({type:n})}function i(e){e.delay&&(e.timer=setTimeout(function(){delete e.timer,e.slideTo(e.current+1)},e.delay))}var o=function(e,n,t,i){var s,a,d,r;if(!(this instanceof o))return new o(e,n,t,i);if(d=this,this.pushStack=[],this.removeStack=[],this.container=e,this.nav=i,e.on("mouseover",function(e){r=d.delay,d.stopPlay()}),e.on("mouseout",function(e){d.startPlay(r),r=void 0}),i&&(i.css("display","none"),i.on("click",">a",function(){var e,n;if(!$(this).hasClass("current"))for(n=i.find(">a"),e=0;e<n.length;e++)if(n[e]===this){d.slideTo(e);break}})),n instanceof Array&&n.length>0){for(this.children=n,"number"==typeof t&&t>=0&&t<n.length?this.current=t:this.current=0,s=0;s<n.length;s++)e.append(n[s]),i&&(a=$('<a href="javascript:;"></a>'),i.append(a)),s!==this.current?n[s].css("display","none"):a&&a.addClass("current");i&&n.length>1&&i.css("display","")}else this.current=void 0,this.children=[]};return o.prototype.add=function(e){var n,i;return this.sliding?this.pushStack.push(e):(n=this.children.length,this.container.append(e),this.children.push(e),this.nav&&(i=$('<a href="javascript:;"></a>'),this.nav.append(i)),0===n?(this.current=0,this.nav&&i.addClass("current"),t(this,"change")):(e.css("display","none"),this.nav&&this.nav.css("display",""))),n},o.prototype.remove=function(e){var i,o;return this.sliding?this.removeStack.push("number"==typeof e?this.children[e]:e):this.children.length>0&&("number"!=typeof e&&(e=this.children.indexOf(e)),e=n(e,this.children.length),i=this.children.splice(e,1)[0],i.remove(),this.nav&&(o=this.nav.find(">a").eq(e).remove()),this.current!==e&&this.current!==this.children.length||(this.children.length>0?(this.current=n(e,this.children.length),this.children[this.current].css("display",""),this.nav&&this.nav.find(">a").eq(this.current).addClass("current")):this.current=void 0,t(this,"change")),1===this.children.length&&this.nav&&this.nav.css("display","none")),i},o.prototype.slideTo=function(e,o){var s,a,d=this;return!this.sliding&&this.children.length>1?(e=n(e,this.children.length),e!==this.current?(this.timer&&(clearTimeout(this.timer),this.timer=void 0),o?(this.children[this.current].css("display","none"),this.children[e].css("display",""),i(this)):(this.sliding=!0,this.children[this.current].fadeOut(function(){d.children[d.current].fadeIn(function(){d.sliding=!1,i(d)})})),this.nav&&(a=this.nav.find(">a"),$(a[this.current]).removeClass("current"),$(a[e]).addClass("current")),this.current=e,t(this,"change"),s=!0):s=!1):s=!1,s},o.prototype.startPlay=function(e){this.stopPlay(),this.delay=e,i(this)},o.prototype.stopPlay=function(){var e;return this.delay?(delete this.delay,this.timer&&(clearTimeout(this.timer),delete this.timer),e=!0):e=!1,e},o});