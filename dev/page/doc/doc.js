'use strict';
define(['module', 'common/kernel/kernel'], function (module, kernel) {
	var thisPage = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
		dom = $('#' + thisPage),
		menu = dom.find('.menu'),
		content = dom.find('.content'),
		tree = [{
			title: 'common/kerenl',
			desc: '核心模块，包含框架中的主要接口',
			api: {
				properties: [{
					title: 'location:Object',
					desc: '用语存放当前路由信息'
				}],
				methods: [{
					title: 'appendCss(url:String):HTMLLinkElement',
					desc: '用于加载样式，会自动根据当前环境来选择加载less或者由less编译成的css',
					example: ``
				}, {
					title: 'removeCss(lnk:HTMLLinkElement):String',
					desc: '移除已加载的less或者css',
					example: ``
				}, {
					title: 'buildHash(loc:Object):String',
					desc: '将loc对象转换为锚点链接字符串',
					example: ``
				}, {
					title: 'parseHash(hash:String):Object',
					desc: '将锚点链接字符串转换为loc对象',
					example: ``
				}, {
					title: 'isSameLocation(loc1:Object, loc2:Object):Bollean',
					desc: '判断loc1和loc2是否对应同一个地址',
					example: ``
				}, {
					title: 'replaceLocation(loc:Object):void',
					desc: '改变当前地址，若loc和当前地址相同，则调用reloadPage',
					example: ``
				}, {
					title: 'listeners.add(o:Object, e:String, f:Function):void',
					desc: '注册监听事件',
					example: ``
				}, {
					title: 'listeners.list(o:Object, e:String):Array|Object',
					desc: '列出已注册的监听事件',
					example: ``
				}, {
					title: 'listeners.remove(o:Object, e?:String, f?:Function):void',
					desc: '解除已注册的监听',
					example: ``
				}, {
					title: 'openPanel(id:String, param:any):void',
					desc: '打开侧边栏',
					example: ``
				}, {
					title: 'showPanel(id:String, param:any):void',
					desc: '显示侧边栏，一般不需要手动调用',
					example: ``
				}, {
					title: 'closePanel(id?:String):void',
					desc: '关闭侧边栏',
					example: ``
				}, {
					title: 'destoryPanel(id:String):void',
					desc: '销毁已加载的指定侧边栏, 不可销毁当前侧边栏',
					example: ``
				}, {
					title: 'openPopup(id:String, param:any):void',
					desc: '打开弹窗',
					example: ``
				}, {
					title: 'showPopup(id:String, param:any):void',
					desc: '显示弹窗，一般不需要手动调用',
					example: ``
				}, {
					title: 'closePopup(id:String):void',
					desc: '关闭弹窗',
					example: ``
				}, {
					title: 'getCurrentPopup():String',
					desc: '获取当前正在显示的弹窗id',
					example: ``
				}, {
					title: 'destoryPopup(id:String):void',
					desc: '销毁已加载的指定弹窗, 不可销毁当前弹窗',
					example: ``
				}, {
					title: 'showPhotoView(contents:Array, idx?:Number):void',
					desc: '显示图片查看器',
					example: ``
				}, {
					title: 'hidePhotoView():void',
					desc: '关闭图片查看器',
					example: ``
				}, {
					title: 'showLoading(text?:String):void',
					desc: '显示加载中界面, 这个方法包含一个引用计数, 每次调用会+1，所以此方法必须和hideLoading成对使用',
					example: ``
				}, {
					title: 'hideLoading():void',
					desc: '使showLoading的引用计数-1, 当到达0时才会关闭加载中界面, 并触发dialogEvents.onloaded事件',
					example: ``
				}, {
					title: 'isLoading():Boolean',
					desc: '判断加载中界面是否在显示',
					example: ``
				}, {
					title: 'hint(text:String, className?:String, t?:Number)',
					desc: '显示提示文本',
					example: ``
				}, {
					title: 'showReadable(html:String, width:String, height:String, callback?:Function):void',
					desc: '显示内容展示窗',
					example: ``
				}, {
					title: 'showForeign(url:String, width:String, height:String, callback?:Function):void',
					desc: '显示外部链接',
					example: ``
				}, {
					title: 'hideReadable():void',
					desc: '隐藏当前内容展示或外部链接',
					example: ``
				}, {
					title: 'alert(text:String, callback?:Function, width?:String, height?:String):void',
					desc: '显示提示框',
					example: ``
				}, {
					title: 'confirm(text:String, callback:Function, width?:String, height?:String):void',
					desc: '显示需确认的提示框',
					example: ``
				}, {
					title: 'hideDialog():void',
					desc: '关闭当前提示框',
					example: ``
				}, {
					title: 'init(home:String, ps?:HTMLElement, func?:Function):void',
					desc: '初始化路由',
					example: ``
				}, {
					title: 'setHome(home:String):Boolean',
					desc: '改变默认页',
					example: ``
				}, {
					title: 'reloadPage(id?:String):void',
					desc: '重新加载当前页',
					example: ``
				}, {
					title: 'destoryPage(id:String):void',
					desc: '销毁已加载的指定页面, 不可销毁当前页',
					example: ``
				}],
				events: [{
					title: 'popupEvents.onshow',
					desc: '弹窗显示时触发'
				}, {
					title: 'popupEvents.onhide',
					desc: '弹窗隐藏时触发'
				}, {
					title: 'dialogEvents.onloaded',
					desc: '加载动画结束后触发'
				}]
			}
		}, {
			title: 'site/pages',
			desc: '页面配置'
		}, {
			title: 'site/popups',
			desc: '弹窗配置'
		}, {
			title: 'site/panels',
			desc: '侧边栏配置'
		}, {
			title: 'site/index',
			desc: '框架入口'
		}, {
			title: 'common/slider',
			desc: '内容循环展示模块, 在kernel.showPhotoView中使用到',
			construct: {
				title: 'new? slider(container:JQueryDOM, contents?:Array, idx?:Number, nav?:JQueryDOM):slider',
				desc: 'container: 容器节点\ncontents: 初始内容\nidx: 默认展示的内容索引\nnav: 导航节点',
				example: ``
			},
			api: {
				properties: [{
					title: 'children:Array',
					desc: '包含所有子元素'
				}, {
					title: 'current:Number',
					desc: '当前显示的元素索引'
				}],
				methods: [{
					title: 'add(o:JQueryDOM):number',
					desc: '添加内容'
				}, {
					title: 'remove(i:JQueryDOM|Number):JQueryDOM',
					desc: '移除指定内容节点'
				}, {
					title: 'slideTo(i:Number, silent?:Boolean):Boolean',
					desc: '将当前显示的内容切换至第i项'
				}, {
					title: 'startPlay(delay:Number):void',
					desc: '开始自动播放, 并将切换延时设置为delay毫秒'
				}, {
					title: 'stopPlay():Boolean',
					desc: '停止自动播放'
				}],
				events: [{
					title: 'onchange',
					desc: '当前显示的内容索引发生变化时触发'
				}]
			}
		}, {
			title: 'common/text',
			desc: 'requirejs的text插件, 用于加载文本依赖'
		}],
		sections = ['properties', 'methods', 'events'],
		sectionNames = {
			properties: '属性',
			methods: '方法',
			events: '事件'
		},
		mod, section, api;
	return {
		onload: function (force) {
			var i, j;
			mod = 0;
			for (i = 0; i < tree.length; i++) {
				if (kernel.location.args.mod === tree[i].title) {
					mod = i;
					break;
				}
			}
			section = api = undefined;
			if (tree[mod].api) {
				for (j = 0; j < sections.length; j++) {
					if (tree[mod].api[sections[j]]) {
						for (i = 0; i < tree[mod].api[sections[j]].length; i++) {
							if (getShotTitle(tree[mod].api[sections[j]][i].title) === kernel.location.args.api) {
								section = sections[j];
								api = i;
								break;
							}
						}
					}
				}
			}
			makeMenu();
			showContent();
		}
	};

	function makeMenu() {
		var i, j, k, s = '';
		for (i = 0; i < tree.length; i++) {
			s += '<a';
			if (i !== mod) {
				s += ' href="#!doc&mod=' + encodeURIComponent(tree[i].title) + '"';
			}
			s += '>' + tree[i].title + '</a>';
			if (i === mod && tree[i].api) {
				for (j = 0; j < sections.length; j++) {
					if (tree[i].api[sections[j]]) {
						s += '<div>' + sectionNames[sections[j]];
						for (k = 0; k < tree[i].api[sections[j]].length; k++) {
							s += '<a';
							if (k !== api || section !== sections[j]) {
								s += ' href="#!doc&mod=' + encodeURIComponent(tree[i].title) + '&api=' + encodeURIComponent(getShotTitle(tree[i].api[sections[j]][k].title)) + '"';
							}
							s += '>' + getShotTitle(tree[i].api[sections[j]][k].title) + '</a>';
						}
						s += '</div>';
					}
				}
			}
			s += '</div>';
		}
		menu.html(s);
	}

	function showContent() {
		var i, j, s = '<div class="title">' + tree[mod].title + '</div><div class="desc">' + tree[mod].desc + '</div>';
		if (tree[mod].construct) {
			s += '<div class="subTitle">构造方法</div>' + makeContent(tree[mod].construct);
		}
		if (tree[mod].api) {
			for (i = 0; i < sections.length; i++) {
				if (tree[mod].api[sections[i]]) {
					s += '<div class="subTitle">' + sectionNames[sections[i]] + '</div>';
					for (j = 0; j < tree[mod].api[sections[i]].length; j++) {
						s += makeContent(tree[mod].api[sections[i]][j], section === sections[i] && api === j);
					}
				}
			}
		}
		content.html(s);
		s = content.find('.active')[0];
		if (s) {
			content.animate({
				scrollTop: s.offsetTop
			});
		}
	}

	function makeContent(o, active) {
		var s = '<div class="field';
		if (active) {
			s += ' active';
		}
		s += '"><div class="name">' + o.title + '</div><div class="desc">' + o.desc + '</div>';
		if (o.example) {
			s += '<div class="code">' + o.example + '</div>';
		}
		s += '</div>';
		return s;
	}

	function getShotTitle(title) {
		return title.replace(/[(:].+$/, '');
	}
});