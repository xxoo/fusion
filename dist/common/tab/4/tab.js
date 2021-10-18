"use strict";define(["common/kernel/kernel","./lang"],function(t,e){let i=document.createElement("div");i.innerHTML='<a class="reload" href="javascript:;">'+e.reload+'</a><a class="closeOther" href="javascript:;">'+e.closeOther+'</a><a class="closeLeft" href="javascript:;">'+e.closeLeft+'</a><a class="closeRight" href="javascript:;">'+e.closeRight+"</a>";let s={open:function(e){let i,s,a;if(e.id in this.cfg){if(e.args){for(o(e.args,this.cfg[e.id].args),i=0;i<this.list.length;i++)if(t.isSameLocation(e,this.list[i])){s=!0;break}}else for(i=0;i<this.list.length;i++)if(this.list[i].id===e.id){s=!0;break}s?this.tabs[i].loaded&&(a=!0):i=this.add(e),this.show(i),a&&this.reload()}return i},add:function(e){let i,s,a="tab-"+this.name+"/"+e.id+"/",h=this;if(e.id in this.cfg){if(e.args||(e.args={}),o(e.args,this.cfg[e.id].args),(s={head:document.createElement("span"),body:document.createElement("div"),args:e.args,parent:this,setTitle:n}).head.innerHTML='<span title="'+this.cfg[e.id].title+'">'+this.cfg[e.id].title+'</span><a href="javascript:;"></a>',s.body.className=s.head.className=e.id,this.inv&&this.tabs.length?this.tabCtn.insertBefore(s.head,this.tabs[this.tabs.length-1].head):this.tabCtn.appendChild(s.head),this.tabContent.appendChild(s.body),i=this.list.length,this.list.push(e),this.tabs.push(s),"string"==typeof this.cfg[e.id].css&&(this.cfg[e.id].css=t.appendCss(require.toUrl(a+this.cfg[e.id].css))),2===this.cfg[e.id].status)f();else if(t.listeners.add(this.cfg[e.id],"complete",function a(n){t.listeners.remove(h.cfg[e.id],"complete",a);i=h.tabs.indexOf(s);2===h.cfg[e.id].status?(f(),i>=0&&(void 0===h.active||h.active===i)&&h.show(i)):i>=0&&h.close(i)}),1!==this.cfg[e.id].status)if(this.cfg[e.id].status=1,"html"in this.cfg[e.id]){let i=require.toUrl(a+this.cfg[e.id].html);fetch(i).then(t=>{if(t.ok)return t.text().then(t=>{delete h.cfg[e.id].html,h.cfg[e.id].htmlContent=t,d()});h.cfg[e.id].status=0,h.cfg[e.id].oncomplete({type:"complete"}),BUILD&&404===t.status?l():c(i,t.status)},t=>c(i,t.message)).then(t.hideLoading),t.showLoading()}else d();return this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"}),i}function d(){let i;"js"in h.cfg[e.id]?(t.showLoading(),i=a+h.cfg[e.id].js,require([i],function(i){delete h.cfg[e.id].js,h.cfg[e.id].proto=i,h.cfg[e.id].status=2,h.cfg[e.id].oncomplete({type:"complete"}),t.hideLoading()},BUILD&&function(s){require.undef(i),h.cfg[e.id].status=0,h.cfg[e.id].oncomplete({type:"complete"}),s.requireType&&"scripterror"!==s.requireType&&"nodefine"!==s.requireType||s.xhr&&404!==s.xhr.status?c(i,s.message):l(),t.hideLoading()})):(h.cfg.status=2,h.cfg[e.id].oncomplete({type:"complete"}))}function f(){h.cfg[e.id].htmlContent&&(s.body.innerHTML=h.cfg[e.id].htmlContent),Object.assign(s,h.cfg[e.id].proto)}},show:function(t){let e;t>=0&&t<this.list.length&&("number"==typeof this.active&&this.active!==t&&("function"==typeof this.tabs[this.active].onhide&&this.tabs[this.active].onhide(),this.tabCtn.querySelector(":scope>span.active").classList.remve("active"),this.tabContent.querySelector(":scope>div.active").classList.remove("active")),this.tabs[t].body.classList.add("active"),this.tabs[t].head.classList.add("active"),2===this.cfg[this.list[t].id].status&&(this.tabs[t].loaded||(e=!0,"function"==typeof this.tabs[t].onload&&this.tabs[t].onload(),this.tabs[t].loaded=!0),this.active===t&&!e||"function"!=typeof this.tabs[t].onshow||this.tabs[t].onshow()),this.active=t,this.save())},close:function(t){t>=0&&t<this.tabs.length&&(this.active===t&&(this.list.length>t+1?this.show(t+1):this.list.length>1?this.show(t-1):("function"==typeof this.tabs[t].onhide&&this.tabs[t].onhide(),this.active=void 0)),this.tabs[t].loaded&&"function"==typeof this.tabs[t].onunload&&this.tabs[t].onunload(),this.tabs[t].head.remove(),this.tabs[t].body.remove(),this.tabs.splice(t,1),this.list.splice(t,1),this.active>t&&this.active--,this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"}))},clear:function(){if(this.tabs.length){for(let t=0;t<this.list.length;t++)t===this.active&&"function"==typeof this.tabs[t].onhide&&this.tabs[t].onhide(),this.tabs[t].loaded&&"function"==typeof this.tabs[t].onunload&&this.tabs[t].onunload(),this.tabs[t].head.remove(),this.tabs[t].body.remove();this.list=[],this.tabs=[],this.active=void 0,this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeOther:function(t){if(t>0&&t<this.tabs.length-1){for(let e=0;e<this.list.length;e++)e!==t&&(e===this.active&&"function"==typeof this.tabs[e].onhide&&this.tabs[e].onhide(),this.tabs[e].loaded&&"function"==typeof this.tabs[e].onunload&&this.tabs[e].onunload(),this.tabs[e].head.remove(),this.tabs[e].body.remove());this.list=[this.list[t]],this.tabs=[this.tabs[t]],this.active===t?(this.active=0,this.save()):(this.active=void 0,this.show(0)),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeLeft:function(t){if(t>0&&t<this.tabs.length){let e=0;for(;e<t;)e===this.active&&"function"==typeof this.tabs[e].onhide&&this.tabs[e].onhide(),this.tabs[e].loaded&&"function"==typeof this.tabs[e].onunload&&this.tabs[e].onunload(),this.tabs[e].head.remove(),this.tabs[e].body.remove(),e++;this.list.splice(0,t),this.tabs.splice(0,t),this.active<t?(this.active=void 0,this.show(0)):(this.active-=t,this.save()),"function"==typeof this.onchange&&this.onchange({type:"change"})}},closeRight:function(t){if(t>=0&&t<this.tabs.length-1){let e=t+1,i=e;for(;e<this.tabs.length;)e===this.active&&"function"==typeof this.tabs[e].onhide&&this.tabs[e].onhide(),this.tabs[e].loaded&&"function"==typeof this.tabs[e].onunload&&this.tabs[e].onunload(),this.tabs[e].head.remove(),this.tabs[e].body.remove(),e++;e=this.tabs.length-i,this.list.splice(i,e),this.tabs.splice(i,e),this.active>t?(this.active=void 0,this.show(t)):this.save(),"function"==typeof this.onchange&&this.onchange({type:"change"})}},reload:function(){"number"==typeof this.active&&"function"==typeof this.tabs[this.active].onload&&this.tabs[this.active].onload()},save:function(){localStorage.setItem("tab-"+this.name,JSON.stringify({active:this.active,list:this.list}))}};return t.appendCss(require.toUrl("common/tab/tab.less")),function(t,e,n,o,c){let l=Object.create(s);l.list=[],l.tabs=[],l.name=t,l.cfg=e,l.tabCtn=n,l.tabContent=o,l.inv=c,c&&n.addClass("inv"),n.addEventListener("click",function(t){let e;if(e=d(this.querySelector(":scope>span>span"),t.target)){let t=a(l,e.parentNode);l.active!==t&&l.show(t)}else(e=d(this.querySelector(":scope>span>a"),t.target))?l.close(a(l,e.parentNode)):(e=d(this.querySelector(":scope>span>div>a"),t.target))&&l[this.className](a(l,e.parentNode.parentNode))}),n.addEventListener("contextmenu",function(t){let e;t.preventDefault(),(e=d(this.querySelectorAll(":scope>span"),t.target))&&i.parentNode!==e&&(e.appendChild(i),document.addEventListener("click",h))}),o.addEventListener("click",function(t){let e;(e=d(this.querySelectorAll(".closepage"),t.target))&&l.close(a(l,n.querySelector("span.active")))});let f=localStorage.getItem("tab-"+t);if("string"==typeof f&&(f=f.parseJsex())&&"Object"===dataType(f.value)&&"number"==typeof f.value.active&&Array.isArray(f.value.list)){for(let t=0;t<f.value.list.length;t++)l.add(f.value.list[t]);l.show(f.value.active)}return l};function a(t,e){for(let i=0;i<t.tabs.length;i++)if(e===t.tabs[i].head[0])return i}function n(t){let e=this.head.querySelector(":scope>span");e.title=e.textContent=t}function h(){document.removeEventListener("click",h),i.remove()}function o(t,e){if(e)for(let i in e)i in t||(t[i]=e[i])}function c(i,s){t.alert(e.error.replace("${res}",i)+s)}function l(){t.confirm(e.update,function(t){t&&location.reload()})}function d(t,e){for(let i=0;i<t.length;i++)if(t[i].contains(e))return t[i]}});