'use strict';define(['module','common/kernel/kernel'],function(module,kernel){function makeMenu(){var a,b,c,d='';for(a=0;a<tree.length;a++){if(d+='<a',a!==mod&&(d+=' href="#!doc&mod='+encodeURIComponent(tree[a].title)+'"'),d+='>'+tree[a].title+'</a>',a===mod&&tree[a].api)for(b=0;b<sections.length;b++)if(tree[a].api[sections[b]]){for(d+='<div>'+sectionNames[sections[b]],c=0;c<tree[a].api[sections[b]].length;c++)d+='<a',(c!==api||section!==sections[b])&&(d+=' href="#!doc&mod='+encodeURIComponent(tree[a].title)+'&api='+encodeURIComponent(getShotTitle(tree[a].api[sections[b]][c].title))+'"'),d+='>'+getShotTitle(tree[a].api[sections[b]][c].title)+'</a>';d+='</div>'}d+='</div>'}menu.html(d)}function showContent(){var a,b,c='<div class="title">'+tree[mod].title+'</div><div class="desc">'+tree[mod].desc+'</div>';if(tree[mod].construct&&(c+='<div class="subTitle">\u6784\u9020\u65B9\u6CD5</div>'+makeContent(tree[mod].construct)),tree[mod].api)for(a=0;a<sections.length;a++)if(tree[mod].api[sections[a]])for(c+='<div class="subTitle">'+sectionNames[sections[a]]+'</div>',b=0;b<tree[mod].api[sections[a]].length;b++)c+=makeContent(tree[mod].api[sections[a]][b],section===sections[a]&&api===b);content.html(c),'number'==typeof api&&(c=Math.min(content.find('>.field[data-name="'+getShotTitle(tree[mod].api[section][api].title)+'"]')[0].offsetTop,content[0].scrollHeight-content[0].clientHeight),c!==content[0].scrollTop&&content.animate({scrollTop:c}))}function makeContent(a){var b='<div class="field" data-name="'+getShotTitle(a.title)+'"><div class="name">'+a.title+'</div><div class="desc">'+a.desc+'</div>';return a.example&&(b+='<div class="code">'+a.example+'<a href="javascript:;">\u6267\u884C</a></div>'),b+='</div>',b}function getShotTitle(a){return a.replace(/[(:].+$/,'')}var mod,section,api,thisPage=module.id.replace(/^[^/]+\/|\/[^/]+/g,''),dom=$('#'+thisPage),menu=dom.find('.menu'),content=dom.find('.content'),tree=[{title:'common/kerenl',desc:'\u6838\u5FC3\u6A21\u5757\uFF0C\u5305\u542B\u6846\u67B6\u4E2D\u7684\u4E3B\u8981\u63A5\u53E3',api:{properties:[{title:'location:Object',desc:'\u7528\u4E8E\u5B58\u653E\u5F53\u524D\u8DEF\u7531\u4FE1\u606F, \u8BF7\u52FF\u76F4\u63A5\u4FEE\u6539',example:'console.log(kernel.location);'},{title:'lastLocation:Object',desc:'\u7528\u4E8E\u5B58\u653E\u6700\u8FD1\u53D1\u751F\u53D8\u5316\u7684\u8DEF\u7531\u4FE1\u606F, \u53EF\u80FD\u4E3Aundefined, \u8BF7\u52FF\u76F4\u63A5\u4FEE\u6539',example:'console.log(kernel.lastLocation);'}],methods:[{title:'appendCss(url:String):HTMLLinkElement',desc:'\u7528\u4E8E\u52A0\u8F7D\u6837\u5F0F\uFF0C\u4F1A\u81EA\u52A8\u6839\u636E\u5F53\u524D\u73AF\u5883\u6765\u9009\u62E9\u52A0\u8F7Dless\u6216\u8005\u7531less\u7F16\u8BD1\u6210\u7684css',example:'var a = kernel.appendCss(require.toUrl(\'common/kernel/kernel.less\'));\nconsole.log(a.href);\nsetTimeout(function(){\n\tconsole.log(kernel.removeCss(a));\n}, 1000);'},{title:'removeCss(lnk:HTMLLinkElement):String',desc:'\u79FB\u9664\u5DF2\u52A0\u8F7D\u7684less\u6216\u8005css',example:'var a = kernel.appendCss(require.toUrl(\'common/kernel/kernel.less\'));\nconsole.log(a.href);\nsetTimeout(function(){\n\tconsole.log(kernel.removeCss(a));\n}, 1000);'},{title:'buildHash(loc:Object):String',desc:'\u5C06loc\u5BF9\u8C61\u8F6C\u6362\u4E3A\u951A\u70B9\u94FE\u63A5\u5B57\u7B26\u4E32',example:'console.log(kernel.buildHash(kernel.location));'},{title:'parseHash(hash:String):Object',desc:'\u5C06\u951A\u70B9\u94FE\u63A5\u5B57\u7B26\u4E32\u8F6C\u6362\u4E3Aloc\u5BF9\u8C61',example:'console.log(kernel.parseHash(location.hash));'},{title:'isSameLocation(loc1:Object, loc2:Object):Bollean',desc:'\u5224\u65ADloc1\u548Cloc2\u662F\u5426\u5BF9\u5E94\u540C\u4E00\u4E2A\u5730\u5740',example:'console.log(kernel.isSameLocation(kernel.location, {\n\tid: \'doc\',\n\targs: {\n\t\tmod: \'common/kernel\',\n\t\tapi: \'isSameLocation\'\n\t}\n}));'},{title:'replaceLocation(loc:Object):void',desc:'\u6539\u53D8\u5F53\u524D\u5730\u5740\uFF0C\u82E5loc\u548C\u5F53\u524D\u5730\u5740\u76F8\u540C\uFF0C\u5219\u8C03\u7528reloadPage',example:'kernel.replaceLocation({\n\tid: \'doc\', args: {\n\t\tapi: \'replaceLocation\'\n\t}\n});'},{title:'listeners.add(o:Object, e:String, f:Function):void',desc:'\u6CE8\u518C\u76D1\u542C\u4E8B\u4EF6',example:'kernel.listeners.add(kernel.popupEvents, \'show\', func);\nkernel.listeners.add(kernel.popupEvents, \'hide\', func);\nkernel.openPopup(\'samplePopup\', \'doc\');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}'},{title:'listeners.list(o:Object, e:String):Array|Object',desc:'\u5217\u51FA\u5DF2\u6CE8\u518C\u7684\u76D1\u542C\u4E8B\u4EF6',example:'kernel.listeners.add(kernel.popupEvents, \'show\', func);\nkernel.listeners.add(kernel.popupEvents, \'hide\', func);\nkernel.openPopup(\'samplePopup\', \'doc\');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}'},{title:'listeners.remove(o:Object, e?:String, f?:Function):void',desc:'\u89E3\u9664\u5DF2\u6CE8\u518C\u7684\u76D1\u542C',example:'kernel.listeners.add(kernel.popupEvents, \'show\', func);\nkernel.listeners.add(kernel.popupEvents, \'hide\', func);\nkernel.openPopup(\'samplePopup\', \'doc\');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}'},{title:'openPanel(id:String, param:any):void',desc:'\u6253\u5F00\u4FA7\u8FB9\u680F',example:'kernel.openPanel(\'samplePanel\');'},{title:'showPanel(id:String):void',desc:'\u663E\u793A\u4FA7\u8FB9\u680F\uFF0C\u53EA\u6709\u5728\u6307\u5B9A\u4FA7\u8FB9\u680F\u5DF2\u7ECF\u52A0\u8F7D\u540E\u624D\u53EF\u4F7F\u7528',example:'kernel.showPanel(\'samplePanel\');'},{title:'closePanel(id?:String|Array):void',desc:'\u5173\u95ED\u4FA7\u8FB9\u680F',example:''},{title:'destoryPanel(id:String):void',desc:'\u9500\u6BC1\u5DF2\u52A0\u8F7D\u7684\u6307\u5B9A\u4FA7\u8FB9\u680F, \u4E0D\u53EF\u9500\u6BC1\u5F53\u524D\u4FA7\u8FB9\u680F',example:'kernel.destoryPanel(\'samplePanel\');'},{title:'openPopup(id:String, param:any):void',desc:'\u6253\u5F00\u5F39\u7A97',example:'kernel.listeners.add(kernel.popupEvents, \'show\', func);\nkernel.listeners.add(kernel.popupEvents, \'hide\', func);\nkernel.openPopup(\'samplePopup\', \'doc\');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}'},{title:'showPopup(id:String):void',desc:'\u663E\u793A\u5F39\u7A97\uFF0C\u53EA\u6709\u5728\u6307\u5B9A\u5F39\u7A97\u5DF2\u7ECF\u52A0\u8F7D\u540E\u624D\u53EF\u4F7F\u7528',example:'kernel.showPopup(\'samplePopup\');'},{title:'closePopup(id:String|Array):void',desc:'\u5173\u95ED\u5F39\u7A97',example:'kernel.listeners.add(kernel.popupEvents, \'show\', func);\nkernel.listeners.add(kernel.popupEvents, \'hide\', func);\nkernel.openPopup(\'samplePopup\', \'doc\');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}'},{title:'getCurrentPopup():String',desc:'\u83B7\u53D6\u5F53\u524D\u6B63\u5728\u663E\u793A\u7684\u5F39\u7A97id',example:'console.log(kernel.getCurrentPopup());'},{title:'destoryPopup(id:String):void',desc:'\u9500\u6BC1\u5DF2\u52A0\u8F7D\u7684\u6307\u5B9A\u5F39\u7A97, \u4E0D\u53EF\u9500\u6BC1\u5F53\u524D\u5F39\u7A97',example:'kernel.destoryPopup(\'samplePopup\');'},{title:'showPhotoView(contents:Array, idx?:Number):void',desc:'\u663E\u793A\u56FE\u7247\u67E5\u770B\u5668',example:'kernel.showPhotoView([\'http://cn.bing.com/az/hprichbg/rb/SnailsKissing_ZH-CN7861942488_1920x1080.jpg\',\'http://cn.bing.com/az/hprichbg/rb/RestArea_ZH-CN13518721881_1920x1080.jpg\']);'},{title:'hidePhotoView():void',desc:'\u5173\u95ED\u56FE\u7247\u67E5\u770B\u5668, \u4E00\u822C\u4E0D\u9700\u8981\u624B\u52A8\u8C03\u7528',example:''},{title:'showLoading(text?:String):void',desc:'\u663E\u793A\u52A0\u8F7D\u4E2D\u754C\u9762, \u8FD9\u4E2A\u65B9\u6CD5\u5305\u542B\u4E00\u4E2A\u5F15\u7528\u8BA1\u6570, \u6BCF\u6B21\u8C03\u7528\u4F1A+1\uFF0C\u6240\u4EE5\u6B64\u65B9\u6CD5\u5FC5\u987B\u548ChideLoading\u6210\u5BF9\u4F7F\u7528',example:'kernel.showLoading();\nconsole.log(kernel.isLoading());\nsetTimeout(kernel.hideLoading, 1000);\nkernel.listeners.add(kernel.dialogEvents, \'loaded\', loaded);\nfunction loaded(evt){\n\tkernel.listeners.remove(this, evt.type, loaded);\n\tconsole.log(kernel.isLoading());\n}'},{title:'hideLoading():void',desc:'\u4F7FshowLoading\u7684\u5F15\u7528\u8BA1\u6570-1, \u5F53\u5230\u8FBE0\u65F6\u624D\u4F1A\u5173\u95ED\u52A0\u8F7D\u4E2D\u754C\u9762, \u5E76\u89E6\u53D1dialogEvents.onloaded\u4E8B\u4EF6',example:'kernel.showLoading();\nconsole.log(kernel.isLoading());\nsetTimeout(kernel.hideLoading, 1000);\nkernel.listeners.add(kernel.dialogEvents, \'loaded\', loaded);\nfunction loaded(evt){\n\tkernel.listeners.remove(this, evt.type, loaded);\n\tconsole.log(kernel.isLoading());\n}'},{title:'isLoading():Boolean',desc:'\u5224\u65AD\u52A0\u8F7D\u4E2D\u754C\u9762\u662F\u5426\u5728\u663E\u793A',example:'kernel.showLoading();\nconsole.log(kernel.isLoading());\nsetTimeout(kernel.hideLoading, 1000);\nkernel.listeners.add(kernel.dialogEvents, \'loaded\', loaded);\nfunction loaded(evt){\n\tkernel.listeners.remove(this, evt.type, loaded);\n\tconsole.log(kernel.isLoading());\n}'},{title:'hint(text:String, className?:String, t?:Number)',desc:'\u663E\u793A\u63D0\u793A\u6587\u672C',example:'kernel.hint(\'\u63D0\u793A\u6587\u672C\', \'success\');'},{title:'showReadable(html:String|HTMLElement|JQueryDOM, width:String, height:String, callback?:Function, className?:String):void',desc:'\u663E\u793A\u5185\u5BB9\u5C55\u793A\u7A97',example:'kernel.showReadable(\'&lt;h1>title&lt;/h1>&lt;p>content&lt;/p>\', \'800px\', \'600px\', function(){\n\tconsole.log(\'readable window closed\');\n});'},{title:'showForeign(url:String, width:String, height:String, callback?:Function):void',desc:'\u5C06\u5916\u90E8\u94FE\u63A5\u4F5C\u4E3Aiframe\u663E\u793A\u5728\u5185\u5BB9\u5C55\u793A\u7A97\u5185',example:'kernel.showForeign(\'https://xxoo.github.io/fusion-mobile/\', \'360px\', \'600px\', function(){\n\tconsole.log(\'foreign window closed\');\n});'},{title:'hideReadable():void',desc:'\u9690\u85CF\u5F53\u524D\u5185\u5BB9\u5C55\u793A\u7A97\u6216\u5916\u90E8\u94FE\u63A5\u7A97, \u4E00\u822C\u4E0D\u9700\u8981\u624B\u52A8\u8C03\u7528',example:''},{title:'alert(text:String, callback?:Function, width?:String, height?:String):void',desc:'\u663E\u793A\u63D0\u793A\u6846',example:'kernel.alert(\'this is an alert box.\');'},{title:'confirm(text:String, callback:Function, width?:String, height?:String):void',desc:'\u663E\u793A\u9700\u786E\u8BA4\u7684\u63D0\u793A\u6846',example:'kernel.confirm(\'is this a confirm box?\', function(sure){\n\tconsole.log(sure);\n});'},{title:'hideDialog():void',desc:'\u5173\u95ED\u5F53\u524D\u63D0\u793A\u6846, \u4E00\u822C\u4E0D\u9700\u8981\u624B\u52A8\u8C03\u7528',example:''},{title:'init(home:String):void',desc:'\u542F\u52A8\u8DEF\u7531\u6216\u8005\u4FEE\u6539\u9ED8\u8BA4\u9875, \u9700\u8981\u793A\u4F8B\u8BF7\u67E5\u770Bsite/index/index\u4E2D\u7684\u4EE3\u7801'},{title:'reloadPage(id?:String, silent?:Boolean):void',desc:'\u91CD\u65B0\u52A0\u8F7D\u5F53\u524D\u9875, \u5982\u679Csilent\u4E3Atrue\u5219\u4E0D\u5173\u95ED\u5F39\u7A97',example:'kernel.reloadPage();'},{title:'destoryPage(id:String):void',desc:'\u9500\u6BC1\u5DF2\u52A0\u8F7D\u7684\u6307\u5B9A\u9875\u9762, \u4E0D\u53EF\u9500\u6BC1\u5F53\u524D\u9875',example:'kernel.destoryPage(\'samplePage\');'}],events:[{title:'pageEvents.onroute',desc:'\u8DEF\u7531\u53D8\u5316\u65F6\u89E6\u53D1, \u8BF7\u5728site/index/index\u4E2D\u67E5\u770B\u793A\u4F8B'},{title:'pageEvents.onroutend',desc:'\u8DEF\u7531\u5904\u7406\u5B8C\u6210\u65F6\u89E6\u53D1, \u8BF7\u5728site/index/index\u4E2D\u67E5\u770B\u793A\u4F8B'},{title:'popupEvents.onshow',desc:'\u5F39\u7A97\u663E\u793A\u65F6\u89E6\u53D1',example:'kernel.listeners.add(kernel.popupEvents, \'show\', func);\nkernel.listeners.add(kernel.popupEvents, \'hide\', func);\nkernel.openPopup(\'samplePopup\', \'doc\');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}'},{title:'popupEvents.onhide',desc:'\u5F39\u7A97\u9690\u85CF\u65F6\u89E6\u53D1',example:'kernel.listeners.add(kernel.popupEvents, \'show\', func);\nkernel.listeners.add(kernel.popupEvents, \'hide\', func);\nkernel.openPopup(\'samplePopup\', \'doc\');\nfunction func(evt){\n\tconsole.log(kernel.listeners.list(this));\n\tkernel.listeners.remove(this, evt.type, func);\n\tconsole.log(evt);\n}'},{title:'dialogEvents.onloaded',desc:'\u52A0\u8F7D\u52A8\u753B\u7ED3\u675F\u540E\u89E6\u53D1',example:'kernel.showLoading();\nconsole.log(kernel.isLoading());\nsetTimeout(kernel.hideLoading, 1000);\nkernel.listeners.add(kernel.dialogEvents, \'loaded\', loaded);\nfunction loaded(evt){\n\tkernel.listeners.remove(this, evt.type, loaded);\n\tconsole.log(kernel.isLoading());\n}'}]}},{title:'site/pages',desc:'\u9875\u9762\u914D\u7F6E'},{title:'site/popups',desc:'\u5F39\u7A97\u914D\u7F6E'},{title:'site/panels',desc:'\u4FA7\u8FB9\u680F\u914D\u7F6E'},{title:'site/index',desc:'\u6846\u67B6\u5165\u53E3'},{title:'common/slider',desc:'\u5185\u5BB9\u5FAA\u73AF\u5C55\u793A\u6A21\u5757, \u5728kernel.showPhotoView\u4E2D\u4F7F\u7528\u5230',construct:{title:'new? slider(container:JQueryDOM, contents?:Array, idx?:Number, nav?:JQueryDOM):slider',desc:'container: \u5BB9\u5668\u8282\u70B9\ncontents: \u521D\u59CB\u5185\u5BB9\nidx: \u9ED8\u8BA4\u5C55\u793A\u7684\u5185\u5BB9\u7D22\u5F15\nnav: \u5BFC\u822A\u8282\u70B9',example:'var ctn = $(\'&lt;div>&lt;/div>\');\nvar contents = [$(\'&lt;div style="background-color:yellow;color:blue;font-size: 100px;">content1&lt;/div>\'), $(\'&lt;div style="background-color:green;color:red;font-size: 100px;">content2&lt;/div>\')];\nvar slider = require(\'common/slider/slider\');\nvar s = slider(ctn, contents);\nkernel.showReadable(ctn, \'800px\', \'400px\', function(){\n\ts.stopPlay();\n});\ns.startPlay(1000);'},api:{properties:[{title:'children:Array',desc:'\u5305\u542B\u6240\u6709\u5B50\u5143\u7D20'},{title:'current:Number',desc:'\u5F53\u524D\u663E\u793A\u7684\u5143\u7D20\u7D22\u5F15'}],methods:[{title:'add(o:JQueryDOM):number',desc:'\u6DFB\u52A0\u5185\u5BB9'},{title:'remove(i:JQueryDOM|Number):JQueryDOM',desc:'\u79FB\u9664\u6307\u5B9A\u5185\u5BB9\u8282\u70B9'},{title:'slideTo(i:Number, silent?:Boolean):Boolean',desc:'\u5C06\u5F53\u524D\u663E\u793A\u7684\u5185\u5BB9\u5207\u6362\u81F3\u7B2Ci\u9879'},{title:'startPlay(delay:Number):void',desc:'\u5F00\u59CB\u81EA\u52A8\u64AD\u653E, \u5E76\u5C06\u5207\u6362\u5EF6\u65F6\u8BBE\u7F6E\u4E3Adelay\u6BEB\u79D2'},{title:'stopPlay():Boolean',desc:'\u505C\u6B62\u81EA\u52A8\u64AD\u653E'}],events:[{title:'onchange',desc:'\u5F53\u524D\u663E\u793A\u7684\u5185\u5BB9\u7D22\u5F15\u53D1\u751F\u53D8\u5316\u65F6\u89E6\u53D1'}]}},{title:'common/text',desc:'requirejs\u7684text\u63D2\u4EF6, \u7528\u4E8E\u52A0\u8F7D\u6587\u672C\u4F9D\u8D56'}],sections=['properties','methods','events'],sectionNames={properties:'\u5C5E\u6027',methods:'\u65B9\u6CD5',events:'\u4E8B\u4EF6'};return content.on('click','.code>a',function(){eval('var kernel = require("common/kernel/kernel");'+this.parentNode.firstChild.data)}),{onload:function c(){var a,b;for(mod=0,a=0;a<tree.length;a++)if(kernel.location.args.mod===tree[a].title){mod=a;break}if(section=api=void 0,tree[mod].api)for(b=0;b<sections.length;b++)if(tree[mod].api[sections[b]])for(a=0;a<tree[mod].api[sections[b]].length;a++)if(getShotTitle(tree[mod].api[sections[b]][a].title)===kernel.location.args.api){section=sections[b],api=a;break}makeMenu(),showContent()}}});