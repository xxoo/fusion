"use strict";define(["common/kernel/kernel","./lang"],function(t,e){let s=document.createElement("div");s.innerHTML='<a class="reload" href="javascript:;">'+e.reload+'</a><a class="closeOther" href="javascript:;">'+e.closeOther+'</a><a class="closeLeft" href="javascript:;">'+e.closeLeft+'</a><a class="closeRight" href="javascript:;">'+e.closeRight+"</a>";let i={open:function(e){let s,i,a;if(e.id in this.cfg){if(e.args){for(o(e.args,this.cfg[e.id].args),s=0;s<this.list.length;s++)if(t.isSameLocation(e,this.list[s])){i=!0;break}}else for(s=0;s<this.list.length;s++)if(this.list[s].id===e.id){i=!0;break}i?this.tabs[s].loaded&&(a=!0):s=this.add(e),this.show(s),a&&this.reload()}return s},add:function(e){let s,i,a,h="tab-"+this.name+"/"+e.id+"/",d=this;if(e.id in this.cfg)return e.args||(e.args={}),o(e.args,this.cfg[e.id].args),(i={head:document.createElement("span"),body:document.createElement("div"),args:e.args,parent:this,setTitle:n}).head.innerHTML='<span title="'+this.cfg[e.id].title+'">'+this.cfg[e.id].title+'</span><a href="javascript:;"></a>',i.body.className=i.head.className=e.id,this.inv&&this.tabs.length?this.tabCtn.insertBefore(i.head,this.tabs[this.tabs.length-1].head):this.tabCtn.appendChild(i.head),this.tabContent.appendChild(i.body),s=this.list.length,this.list.push(e),this.tabs.push(i),"string"==typeof this.cfg[e.id].css&&(this.cfg[e.id].css=t.appendCss(require.toUrl(h+this.cfg[e.id].css))),2===this.cfg[e.id].status?f():(t.listeners.add(this.cfg[e.id],"complete",function a(n){t.listeners.remove(d.cfg[e.id],"complete",a);s=d.tabs.indexOf(i);2===d.cfg[e.id].status?(f(),s>=0&&(void 0===d.active||d.active===s)&&d.show(s)):s>=0&&d.close(s)}),1!==this.cfg[e.id].status&&(this.cfg[e.id].status=1,"html"in this.cfg[e.id]?(a=require.toUrl(h+this.cfg[e.id].html),fetch(a).then(t=>{if(t.ok)return t.text(t=>{delete d.cfg[e.id].html,d.cfg[e.id].htmlContent=t,r()});d.cfg[e.id].status=0,d.cfg[e.id].oncomplete({type:"complete"}),BUILD&&404===t.status?l():c(a,t.status)}).then(t.hideLoading),t.showLoading()):r())),this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"}),s;function r(){let s;"js"in d.cfg[e.id]?(t.showLoading(),s=h+d.cfg[e.id].js,require([s],function(s){delete d.cfg[e.id].js,d.cfg[e.id].proto=s,d.cfg[e.id].status=2,d.cfg[e.id].oncomplete({type:"complete"}),t.hideLoading()},BUILD&&function(i){require.undef(s),d.cfg[e.id].status=0,d.cfg[e.id].oncomplete({type:"complete"}),i.requireType&&"scripterror"!==i.requireType&&"nodefine"!==i.requireType||i.xhr&&404!==i.xhr.status?c(s,i.message):l(),t.hideLoading()})):(d.cfg.status=2,d.cfg[e.id].oncomplete({type:"complete"}))}function f(){d.cfg[e.id].htmlContent&&(i.body.innerHTML=d.cfg[e.id].htmlContent),Object.assign(i,d.cfg[e.id].proto)}},show:function(t){let e;t>=0&&t<this.list.length&&("number"==typeof this.active&&this.active!==t&&("function"==typeof this.tabs[this.active].onhide&&this.tabs[this.active].onhide(),this.tabCtn.querySelector(":scope>span.active").classList.remve("active"),this.tabContent.querySelector(":scope>div.active").classList.remove("active")),this.tabs[t].body.classList.add("active"),this.tabs[t].head.classList.add("active"),2===this.cfg[this.list[t].id].status&&(this.tabs[t].loaded||(e=!0,"function"==typeof this.tabs[t].onload&&this.tabs[t].onload(),this.tabs[t].loaded=!0),this.active===t&&!e||"function"!=typeof this.tabs[t].onshow||this.tabs[t].onshow()),this.active=t,this.save())},close:function(t){t>=0&&t<this.tabs.length&&(this.active===t&&(this.list.length>t+1?this.show(t+1):this.list.length>1?this.show(t-1):("function"==typeof this.tabs[t].onhide&&this.tabs[t].onhide(),this.active=void 0)),this.tabs[t].loaded&&"function"==typeof this.tabs[t].onunload&&this.tabs[t].onunload(),this.tabs[t].head.remove(),this.tabs[t].body.remove(),this.tabs.splice(t,1),this.list.splice(t,1),this.active>t&&this.active--,this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"}))},clear:function(){if(this.tabs.length){for(let t=0;t<this.list.length;t++)t===this.active&&"function"==typeof this.tabs[t].onhide&&this.tabs[t].onhide(),this.tabs[t].loaded&&"function"==typeof this.tabs[t].onunload&&this.tabs[t].onunload(),this.tabs[t].head.remove(),this.tabs[t].body.remove();this.list=[],this.tabs=[],this.active=void 0,this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeOther:function(t){if(t>0&&t<this.tabs.length-1){for(let e=0;e<this.list.length;e++)e!==t&&(e===this.active&&"function"==typeof this.tabs[e].onhide&&this.tabs[e].onhide(),this.tabs[e].loaded&&"function"==typeof this.tabs[e].onunload&&this.tabs[e].onunload(),this.tabs[e].head.remove(),this.tabs[e].body.remove());this.list=[this.list[t]],this.tabs=[this.tabs[t]],this.active===t?(this.active=0,this.save()):(this.active=void 0,this.show(0)),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeLeft:function(t){if(t>0&&t<this.tabs.length){let e=0;for(;e<t;)e===this.active&&"function"==typeof this.tabs[e].onhide&&this.tabs[e].onhide(),this.tabs[e].loaded&&"function"==typeof this.tabs[e].onunload&&this.tabs[e].onunload(),this.tabs[e].head.remove(),this.tabs[e].body.remove(),e++;this.list.splice(0,t),this.tabs.splice(0,t),this.active<t?(this.active=void 0,this.show(0)):(this.active-=t,this.save()),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeRight:function(t){if(t>=0&&t<this.tabs.length-1){let e=t+1,s=e;for(;e<this.tabs.length;)e===this.active&&"function"==typeof this.tabs[e].onhide&&this.tabs[e].onhide(),this.tabs[e].loaded&&"function"==typeof this.tabs[e].onunload&&this.tabs[e].onunload(),this.tabs[e].head.remove(),this.tabs[e].body.remove(),e++;e=this.tabs.length-s,this.list.splice(s,e),this.tabs.splice(s,e),this.active>t?(this.active=void 0,this.show(t)):this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"})}},reload:function(){"number"==typeof this.active&&"function"==typeof this.tabs[this.active].onload&&this.tabs[this.active].onload()},save:function(){localStorage.setItem("tab-"+this.name,JSON.stringify({active:this.active,list:this.list}))}};return t.appendCss(require.toUrl("common/tab/tab.less")),function(t,e,n,o,c){let l=Object.create(i);l.list=[],l.tabs=[],l.name=t,l.cfg=e,l.tabCtn=n,l.tabContent=o,l.inv=c,c&&n.addClass("inv"),n.addEventListener("click",function(t){let e;if(e=d(this.querySelector(":scope>span>span"),t.target)){let t=a(l,e.parentNode);l.active!==t&&l.show(t)}else(e=d(this.querySelector(":scope>span>a"),t.target))?l.close(a(l,e.parentNode)):(e=d(this.querySelector(":scope>span>div>a"),t.target))&&l[this.className](a(l,e.parentNode.parentNode))}),n.addEventListener("contextmenu",function(t){let e;t.preventDefault(),(e=d(this.querySelectorAll(":scope>span"),t.target))&&s.parentNode!==e&&(e.appendChild(s),document.addEventListener("click",h))}),o.addEventListener("click",function(t){let e;(e=d(this.querySelectorAll(".closepage"),t.target))&&l.close(a(l,n.querySelector("span.active")))});let r=localStorage.getItem("tab-"+t);if("string"==typeof r&&(r=r.parseJsex())&&"Object"===dataType(r.value)&&"number"==typeof r.value.active&&Array.isArray(r.value.list)){for(let t=0;t<r.value.list.length;t++)l.add(r.value.list[t]);l.show(r.value.active)}return l};function a(t,e){for(let s=0;s<t.tabs.length;s++)if(e===t.tabs[s].head[0])return s}function n(t){let e=this.head.querySelector(":scope>span");e.title=e.textContent=t}function h(){document.removeEventListener("click",h),s.remove()}function o(t,e){if(e)for(let s in e)s in t||(t[s]=e[s])}function c(s,i){t.alert(e.error.replace("${res}",s)+i)}function l(){t.confirm(e.update,function(t){t&&location.reload()})}function d(t,e){for(let s=0;s<t.length;s++)if(t[s].contains(e))return t[s]}});