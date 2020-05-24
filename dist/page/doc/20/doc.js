"use strict";define(["module","common/kernel/kernel"],function(module,kernel){let thisPage=module.id.replace(/^[^/]+\/|\/[^/]+/g,""),dom=document.querySelector("#page>."+thisPage),menu=dom.querySelector(".menu"),content=dom.querySelector(".content"),tree=[{title:"common/kernel",desc:"核心模块，包含框架中的主要接口",api:{properties:[{title:"location:Object",desc:"用于存放当前路由信息, 请勿直接修改",example:"console.log(kernel.location);"},{title:"lastLocation:Object",desc:"用于存放最近发生变化的路由信息, 可能为undefined, 请勿直接修改",example:"console.log(kernel.lastLocation);"}],methods:[{title:"appendCss(url:string, forcecss:bool):HTMLLinkElement",desc:"用于加载样式，会自动根据当前环境来选择加载less或者由less编译成的css",example:"let a = kernel.appendCss(require.toUrl('common/kernel/kernel'));\nconsole.log(a.href);\nsetTimeout(function(){\n\tkernel.removeCss(a);\n}, 1000);"},{title:"removeCss(lnk:HTMLLinkElement):undefined",desc:"移除已加载的less或者css",example:"let a = kernel.appendCss(require.toUrl('common/kernel/kernel'));\nconsole.log(a.href);\nsetTimeout(function(){\n\tkernel.removeCss(a);\n}, 1000);"},{title:"buildHash(loc:Object):string",desc:"将loc对象转换为锚点链接字符串",example:"console.log(kernel.buildHash(kernel.location));"},{title:"parseHash(hash:string):Object",desc:"将锚点链接字符串转换为loc对象",example:"console.log(kernel.parseHash(location.hash));"},{title:"isSameLocation(loc1:Object, loc2:Object):boolean",desc:"判断loc1和loc2是否对应同一个地址",example:"console.log(kernel.isSameLocation(kernel.location, {\n\tid: 'doc',\n\targs: {\n\t\tmod: 'common/kernel',\n\t\tapi: 'isSameLocation'\n\t}\n}));"},{title:"replaceLocation(loc:Object):undefined",desc:"改变当前地址，若loc和当前地址相同，则调用reloadPage",example:"kernel.replaceLocation({\n\tid: 'doc', args: {\n\t\tmod: 'common/kernel',\n\t\tapi: 'replaceLocation'\n\t}\n});"},{title:"listeners.add(o:Object, e:string, f:Function):undefined",desc:"注册监听事件",example:"kernel.listeners.add(kernel.popupEvents, 'show', func);\nkernel.listeners.add(kernel.popupEvents, 'hide', func);\nkernel.openPopup('samplePopup', 'doc');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}"},{title:"listeners.list(o:Object, e?:string):Array|Object",desc:"列出已注册的监听事件",example:"kernel.listeners.add(kernel.popupEvents, 'show', func);\nkernel.listeners.add(kernel.popupEvents, 'hide', func);\nkernel.openPopup('samplePopup', 'doc');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}"},{title:"listeners.remove(o:Object, e?:string, f?:Function):undefined",desc:"解除已注册的监听",example:"kernel.listeners.add(kernel.popupEvents, 'show', func);\nkernel.listeners.add(kernel.popupEvents, 'hide', func);\nkernel.openPopup('samplePopup', 'doc');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}"},{title:"openPanel(id:string, param:any):undefined",desc:"打开侧边栏",example:"kernel.openPanel('samplePanel');"},{title:"showPanel(id:string):0|1|2",desc:"显示侧边栏, 只有在指定侧边栏已经加载后才可使用. 返回0表示操作失败, 返回1表示操作成功, 返回2表示操作已队列. 若失败, 原因可能是当前侧边栏的onunload方法返回true",example:"kernel.showPanel('samplePanel');"},{title:"closePanel(id?:string|Array):0|1|2",desc:"关闭侧边栏. 返回0表示操作失败, 返回1表示操作成功, 返回2表示操作已队列. 若失败, 原因可能是当前侧边栏的onunload方法返回true",example:""},{title:"getCurrentPanel():string",desc:"获取当前正在显示的侧边栏id",example:"console.log(kernel.getCurrentPanel());"},{title:"destroyPanel(id:string):boolean",desc:"销毁已加载的指定侧边栏, 不可销毁当前侧边栏. 返回true表示销毁成功.",example:"kernel.destroyPanel('samplePanel');"},{title:"openPopup(id:string, param:any):undefined",desc:"打开弹窗",example:"kernel.listeners.add(kernel.popupEvents, 'show', func);\nkernel.listeners.add(kernel.popupEvents, 'hide', func);\nkernel.openPopup('samplePopup', 'doc');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}"},{title:"showPopup(id:string):boolean",desc:"显示弹窗, 只有在指定弹窗已经加载后才可使用. 返回true表示打开成功. 若失败, 原因可能是当前弹窗的onunload方法返回true",example:"kernel.showPopup('samplePopup');"},{title:"closePopup(id:string|Array):boolean",desc:"关闭弹窗, 返回true表示关闭成. 若失败, 原因可能是当前弹窗的onunload方法返回true",example:"kernel.listeners.add(kernel.popupEvents, 'show', func);\nkernel.listeners.add(kernel.popupEvents, 'hide', func);\nkernel.openPopup('samplePopup', 'doc');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}"},{title:"getCurrentPopup():string",desc:"获取当前正在显示的弹窗id",example:"console.log(kernel.getCurrentPopup());"},{title:"destroyPopup(id:string):boolean",desc:"销毁已加载的指定弹窗, 不可销毁当前弹窗. 返回true表示销毁成功.",example:"kernel.destroyPopup('samplePopup');"},{title:"showPhotoView(contents:Array, idx?:number):undefined",desc:"显示图片查看器",example:"kernel.showPhotoView(['https://cn.bing.com/az/hprichbg/rb/SnailsKissing_ZH-CN7861942488_1920x1080.jpg','https://cn.bing.com/az/hprichbg/rb/RestArea_ZH-CN13518721881_1920x1080.jpg']);"},{title:"hidePhotoView():undefined",desc:"关闭图片查看器, 一般不需要手动调用",example:""},{title:"showLoading(text?:string):undefined",desc:"显示加载中界面, 这个方法包含一个引用计数, 每次调用会+1，所以此方法必须和hideLoading成对使用",example:"kernel.showLoading();\nconsole.log(kernel.isLoading());\nsetTimeout(kernel.hideLoading, 1000);\nkernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);\nfunction loaded(evt){\n\tkernel.listeners.remove(this, evt.type, loaded);\n\tconsole.log(kernel.isLoading());\n}"},{title:"hideLoading():undefined",desc:"使showLoading的引用计数-1, 当到达0时才会关闭加载中界面, 并触发dialogEvents.onloaded事件",example:"kernel.showLoading();\nconsole.log(kernel.isLoading());\nsetTimeout(kernel.hideLoading, 1000);\nkernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);\nfunction loaded(evt){\n\tkernel.listeners.remove(this, evt.type, loaded);\n\tconsole.log(kernel.isLoading());\n}"},{title:"isLoading():boolean",desc:"判断加载中界面是否在显示",example:"kernel.showLoading();\nconsole.log(kernel.isLoading());\nsetTimeout(kernel.hideLoading, 1000);\nkernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);\nfunction loaded(evt){\n\tkernel.listeners.remove(this, evt.type, loaded);\n\tconsole.log(kernel.isLoading());\n}"},{title:"hint(text:string, className?:string, t?:number)",desc:"显示提示文本",example:"kernel.hint('提示文本', 'success');"},{title:"showReadable(html:string|HTMLElement, width:string, height:string, callback?:Function, className?:string):undefined",desc:"显示内容展示窗",example:"kernel.showReadable('&lt;h1>title&lt;/h1>&lt;p>content&lt;/p>', '800px', '600px', function(){\n\tconsole.log('readable window closed');\n});"},{title:"showForeign(url:string, width:string, height:string, callback?:Function):undefined",desc:"将外部链接作为iframe显示在内容展示窗内",example:"kernel.showForeign('https://xxoo.github.io/fusion-mobile/', '360px', '600px', function(){\n\tconsole.log('foreign window closed');\n});"},{title:"hideReadable():undefined",desc:"隐藏当前内容展示窗或外部链接窗, 一般不需要手动调用",example:""},{title:"alert(text:string, callback?:Function, width?:string, height?:string):undefined",desc:"显示提示框",example:"kernel.alert('this is an alert box.');"},{title:"confirm(text:string, callback:Function, width?:string, height?:string):undefined",desc:"显示需确认的提示框",example:"kernel.confirm('is this a confirm box?', function(sure){\n\tconsole.log(sure);\n});"},{title:"hideDialog():undefined",desc:"关闭当前提示框, 一般不需要手动调用",example:""},{title:"init(home:string):undefined",desc:"启动路由或者修改默认页, 需要示例请查看site/index/index中的代码"},{title:"reloadPage(id?:string, silent?:boolean):undefined",desc:"重新加载当前页, 如果silent为true则不关闭弹窗",example:"kernel.reloadPage();"},{title:"destroyPage(id:string):undefined",desc:"销毁已加载的指定页面, 不可销毁当前页",example:"kernel.destroyPage('samplePage');"}],events:[{title:"pageEvents.onroute",desc:"路由变化时触发, 请在site/index/index中查看示例"},{title:"pageEvents.onrouteend",desc:"路由处理完成时触发, 请在site/index/index中查看示例"},{title:"popupEvents.onshow",desc:"弹窗显示时触发",example:"kernel.listeners.add(kernel.popupEvents, 'show', func);\nkernel.listeners.add(kernel.popupEvents, 'hide', func);\nkernel.openPopup('samplePopup', 'doc');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}"},{title:"popupEvents.onhide",desc:"弹窗隐藏时触发",example:"kernel.listeners.add(kernel.popupEvents, 'show', func);\nkernel.listeners.add(kernel.popupEvents, 'hide', func);\nkernel.openPopup('samplePopup', 'doc');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}"},{title:"dialogEvents.onloaded",desc:"加载动画结束后触发",example:"kernel.showLoading();\nconsole.log(kernel.isLoading());\nsetTimeout(kernel.hideLoading, 1000);\nkernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);\nfunction loaded(evt){\n\tkernel.listeners.remove(this, evt.type, loaded);\n\tconsole.log(kernel.isLoading());\n}"}]}},{title:"site/pages",desc:"页面配置"},{title:"site/popups",desc:"弹窗配置"},{title:"site/panels",desc:"侧边栏配置"},{title:"site/index",desc:"框架入口"},{title:"common/slider",desc:"内容循环展示模块, 在kernel.showPhotoView中使用到",construct:{title:"new? slider(container:HTMLElement, contents?:Array, idx?:number, nav?:HTMLElement):slider",desc:"container: 容器节点\ncontents: 初始内容\nidx: 默认展示的内容索引\nnav: 导航节点",example:"let ctn = $('&lt;div>&lt;/div>');\nlet contents = [$('&lt;div style=\"background-color:yellow;color:blue;font-size: 100px;\">content1&lt;/div>'), $('&lt;div style=\"background-color:green;color:red;font-size: 100px;\">content2&lt;/div>')];\nlet slider = require('common/slider/slider');\nlet s = slider(ctn, contents);\nkernel.showReadable(ctn, '800px', '400px', function(){\n\ts.stopPlay();\n});\ns.startPlay(1000);"},api:{properties:[{title:"children:Array",desc:"包含所有子元素"},{title:"current:number",desc:"当前显示的元素索引"}],methods:[{title:"add(o:HTMLElement):number",desc:"添加内容"},{title:"remove(i:HTMLElement|number):HTMLElement",desc:"移除指定内容节点"},{title:"slideTo(i:number, silent?:boolean):boolean",desc:"将当前显示的内容切换至第i项"},{title:"startPlay(delay:number):undefined",desc:"开始自动轮播, 并将切换延时设置为delay毫秒"},{title:"stopPlay():boolean",desc:"停止自动轮播"}],events:[{title:"onchange",desc:"当前显示的内容索引发生变化时触发"}]}},{title:"common/text",desc:"requirejs的text插件, 用于加载文本依赖"}],sections=["properties","methods","events"],sectionNames={properties:"属性",methods:"方法",events:"事件"},mod,section,api;return content.addEventListener("click",function(evt){"A"===evt.target.nodeName&&"code"===evt.target.parentNode.className&&eval('let kernel = require("common/kernel/kernel");'+evt.target.parentNode.firstChild.data)}),{onload:function(e){let n,t;for(mod=0,n=0;n<tree.length;n++)if(kernel.location.args.mod===tree[n].title){mod=n;break}if(section=api=void 0,tree[mod].api)for(t=0;t<sections.length;t++)if(tree[mod].api[sections[t]])for(n=0;n<tree[mod].api[sections[t]].length;n++)if(getShotTitle(tree[mod].api[sections[t]][n].title)===kernel.location.args.api){section=sections[t],api=n;break}makeMenu(),showContent()}};function makeMenu(){let e,n,t,o="";for(e=0;e<tree.length;e++){if(o+="<a",e!==mod&&(o+=' href="#!doc&mod='+encodeURIComponent(tree[e].title)+'"'),o+=">"+tree[e].title+"</a>",e===mod&&tree[e].api)for(n=0;n<sections.length;n++)if(tree[e].api[sections[n]]){for(o+="<div>"+sectionNames[sections[n]],t=0;t<tree[e].api[sections[n]].length;t++)o+="<a",t===api&&section===sections[n]||(o+=' href="#!doc&mod='+encodeURIComponent(tree[e].title)+"&api="+encodeURIComponent(getShotTitle(tree[e].api[sections[n]][t].title))+'"'),o+=">"+getShotTitle(tree[e].api[sections[n]][t].title)+"</a>";o+="</div>"}o+="</div>"}menu.innerHTML=o}function showContent(){let e,n,t='<div class="title">'+tree[mod].title+'</div><div class="desc">'+tree[mod].desc+"</div>";if(tree[mod].construct&&(t+='<div class="subTitle">构造方法</div>'+makeContent(tree[mod].construct)),tree[mod].api)for(e=0;e<sections.length;e++)if(tree[mod].api[sections[e]])for(t+='<div class="subTitle">'+sectionNames[sections[e]]+"</div>",n=0;n<tree[mod].api[sections[e]].length;n++)t+=makeContent(tree[mod].api[sections[e]][n],section===sections[e]&&api===n);content.innerHTML=t,"number"==typeof api&&content.querySelector(':scope>.field[data-name="'+getShotTitle(tree[mod].api[section][api].title)+'"]').scrollIntoView({block:"start",behavior:"smooth"})}function makeContent(e,n){let t='<div class="field" data-name="'+getShotTitle(e.title)+'"><div class="name">'+e.title+'</div><div class="desc">'+e.desc+"</div>";return e.example&&(t+='<div class="code">'+e.example+'<a href="javascript:;">执行</a></div>'),t+="</div>"}function getShotTitle(e){return e.replace(/[(:].+$/,"")}});