// kernel
'use strict';
define(['common/slider/slider', 'site/pages/pages', 'site/popups/popups', 'site/panels/panels'], function(slider, pages, popups, panels) {
	var homePage, kernel = {
		appendCss: function(url) { //自动根据当前环境添加css或less
			var csslnk = document.createElement('link');
			csslnk.type = 'text/css';
			if (/\.less$/.test(url)) {
				if (typeof less === 'object') {
					csslnk.rel = 'stylesheet/less';
					csslnk.href = url;
					less.sheets.push(csslnk);
					less.refresh();
				} else {
					csslnk.rel = 'stylesheet';
					csslnk.href = url.replace(/less$/, 'css');
				}
			} else {
				csslnk.rel = 'stylesheet';
				csslnk.href = url;
			}
			(document.head || document.getElementsByTagName('head')[0]).appendChild(csslnk);
		},
		extendIn: function(o, e, p) {
			for (var i = 0; i < p.length; i++) {
				if (p[i] in e) {
					o[p[i]] = e[p[i]];
				}
			}
		},
		buildHash: function(loc) {
			var n, hash = '#!' + encodeURIComponent(loc.id);
			for (n in loc.args) {
				hash += loc.args[n] === undefined ? '&' + encodeURIComponent(n) : '&' + encodeURIComponent(n) + '=' + encodeURIComponent(loc.args[n]);
			}
			return hash;
		},
		parseHash: function(hash) {
			var i, a, s, nl = {
				id: homePage,
				args: {}
			};
			hash = hash.substr(1).replace(/[#\?].*$/, '');
			s = hash.match(/[^=&]+(=[^&]*)?/g);
			if (s) {
				if (s[0].charAt(0) === '!') {
					a = s[0].substr(1);
					if (a in pages) {
						nl.id = decodeURIComponent(a);
					}
				}
				for (i = 1; i < s.length; i++) {
					a = s[i].match(/^([^=]+)(=)?(.+)?$/);
					if (a) {
						nl.args[decodeURIComponent(a[1])] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
					}
				}
			}
			return nl;
		},
		isSameLocation: function(loc1, loc2) {
			var n;
			if (loc1.id === loc2.id && Object.keys(loc1.args).length === Object.keys(loc2.args).length) {
				for (n in loc1.args) {
					if (!(n in loc2.args) || loc1.args[n] !== loc2.args[n]) {
						return false;
					}
				}
				return true;
			} else {
				return false;
			}
		}
	};

	! function() {
		kernel.listeners = {
			add: function(o, e, f) {
				if (!o.xEvents) {
					o.xEvents = function(evt) { //override internal event manager
						xEventProcessor(o, evt);
					};
				}
				if (!o.xEvents[e]) {
					o.xEvents[e] = [];
					o.xEvents[e].stack = [];
					o.xEvents[e].locked = false;
					if (o.addEventListener) {
						o.addEventListener(e, o.xEvents, false);
					} else if (o.attachEvent) {
						o.attachEvent('on' + e, o.xEvents);
					} else {
						o['on' + e] = o.xEvents;
					}
				}
				if (o.xEvents[e].locked) {
					o.xEvents[e].stack.push([false, f]);
				} else {
					if (o.xEvents[e].indexOf(f) < 0) {
						o.xEvents[e].push(f);
					}
				}
			},
			list: function(o, e) {
				var r, n;
				if (e) {
					if (o.xEvents && o.xEvents[e]) {
						r = o.xEvents[e].slice(0);
					} else {
						r = [];
					}
				} else {
					r = {};
					if (o.xEvents) {
						for (n in o.xEvents) {
							if (o.xEvents[n] instanceof Array && o.xEvents[n].length > 0) {
								r[n] = o.xEvents[n].slice(0);
							}
						}
					}
				}
				return r;
			},
			remove: function(o, e, f) {
				var n, addRemoveMark;
				if (o.xEvents) {
					if (e) {
						if (o.xEvents[e]) {
							if (o.xEvents[e].locked) {
								if (f) {
									o.xEvents[e].stack.push([true, f]);
								} else {
									o.xEvents[e].stack.push(null);
								}
							} else {
								if (f) {
									var tmp = o.xEvents[e].indexOf(f);
									if (tmp !== -1) {
										o.xEvents[e].splice(tmp, 1);
									}
								} else {
									o.xEvents[e].splice(0, o.xEvents[e].length);
								}
							}
							if (o.xEvents[e].length === 0) {
								delete o.xEvents[e];
								if (o.removeEventListener) {
									o.removeEventListener(e, o.xEvents, false);
								} else if (o.detachEvent) {
									o.detachEvent('on' + e, o.xEvents);
								} else {
									o['on' + e] = null;
								}
							}
						}
					} else {
						if (!o.xEvents.removeMark) {
							for (n in o.xEvents) {
								if (!o.xEvents[n].locked) {
									delete o.xEvents[n];
									if (o.removeEventListener) {
										o.removeEventListener(n, o.xEvents, false);
									} else if (o.detachEvent) {
										o.detachEvent('on' + n, o.xEvents);
									} else {
										o['on' + n] = null;
									}
								} else {
									addRemoveMark = true;
								}
							}
							if (addRemoveMark) {
								o.xEvents.removeMark = true;
							} else {
								o.xEvents = null;
							}
						}
					}
				}
			}
		};

		function xEventProcessor(o, evt) {
			o.xEvents[evt.type].locked = true;
			for (var i = 0; i < o.xEvents[evt.type].length; i++) {
				o.xEvents[evt.type][i].call(o, evt);
			}
			o.xEvents[evt.type].locked = false;
			while (o.xEvents[evt.type].stack.length > 0) {
				if (o.xEvents[evt.type].stack[0]) {
					var tmp = o.xEvents[evt.type].indexOf(o.xEvents[evt.type].stack[0][1]);
					if (o.xEvents[evt.type].stack[0][0]) {
						if (tmp !== -1) {
							o.xEvents[evt.type].splice(tmp, 1);
						}
					} else {
						if (tmp === -1) {
							o.xEvents[evt.type].push(o.xEvents[evt.type].stack[0][1]);
						}
					}
				} else {
					o.xEvents[evt.type].splice(0, o.xEvents[evt.type].length);
				}
				o.xEvents[evt.type].stack.shift();
			}
			if (o.xEvents[evt.type].length === 0) {
				delete o.xEvents[evt.type];
				if (o.removeEventListener) {
					o.removeEventListener(evt.type, o.xEvents, false);
				} else if (o.detachEvent) {
					o.detachEvent('on' + evt.type, o.xEvents);
				} else {
					o['on' + evt.type] = null;
				}
			}
			if (o.xEvents.removeMark) {
				delete o.xEvents.removeMark;
				for (var n in o.xEvents) {
					delete o.xEvents[n];
					if (o.removeEventListener) {
						o.removeEventListener(n, o.xEvents, false);
					} else if (o.detachEvent) {
						o.detachEvent('on' + n, o.xEvents);
					} else {
						o['on' + n] = null;
					}
				}
				o.xEvents = null;
			}
		}
	}();

	//panel
	! function() {
		var activePanel, ani, todo,
			panelCtn = document.getElementById('panels'),
			ctn = panelCtn.lastChild.firstChild;
		kernel.openPanel = function(id, param) {
			var panelcfg = panels[id];
			if (panelcfg) {
				initLoad('panel', panelcfg, id, function() {
					if (typeof panelcfg.open === 'function') {
						panelcfg.open(param);
					} else {
						kernel.showPanel(id, param);
					}
				});
			} else {
				kernel.hint('panel config not found: ' + id, 'error');
			}
		}
		kernel.showPanel = function(id, param) {
			if (ani) {
				setTodo();
			} else {
				if (activePanel) {
					hidePanel();
					setTodo();
				} else {
					if (typeof panels[id].onload === 'function') {
						panels[id].onload(param);
					}
					panelCtn.className = activePanel = id;
					panelCtn.style.display = document.getElementById(id).style.display = 'block';
					startAni(function() {
						if (typeof panels[id].onloadend === 'function') {
							panels[id].onloadend();
						}
					}, true);
				}
			}
			function setTodo(){
				setTimeout(function() {
					todo = function(){
						kernel.showPanel(id, param);
					}
				}, 0);
			}
		};
		kernel.closePanel = function(id){
			var close;
			if (ani) {
				setTimeout(function(){
					todo = function(){
						kernel.closePanel(id);
					};
				}, 0);
			} else {
				if (activePanel) {
					if (typeof id === 'string') {
						close = id === activePanel;
					} else if (id instanceof Array) {
						close = id.indexOf(activePanel) >= 0;
					} else {
						close = true;
					}
					if (close) {
						hidePanel();
					} else if (todo) {
						todo = undefined;
					}
				}
			}
		}

		function startAni(cb, show){
			ani = true;
			$(ctn).animate({
				'margin-left': show ? '-100%' : '0%'
			}, {
				duration: 200,
				complete: function(){
					ani = false;
					cb();
					if (typeof todo === 'function') {
						todo();
						todo = undefined;
					}
				}
			});
		}
		$(panelCtn.firstChild).on('click', function(){
			kernel.closePanel();
		});
		$(ctn.firstChild).on('click', function(){
			kernel.closePanel();
		});

		function hidePanel(){
			if (typeof panels[activePanel].onunload === 'function') {
				panels[activePanel].onunload();
			}
			startAni(function(){
				if (typeof panels[activePanel].onunloadend === 'function') {
					panels[activePanel].onunloadend();
				}
				activePanel = undefined;
				panelCtn.style.display = '';
			}, false);
		}
	}();

	//弹出窗口
	! function() {
		var activePopup, popup = document.getElementById('popups');
		kernel.openPopup = function(id, param) {
			var popupcfg = popups[id];
			if (popupcfg) {
				initLoad('popup', popupcfg, id, function() {
					if (typeof popupcfg.open === 'function') {
						popupcfg.open(param);
					} else {
						kernel.showPopup(id, param);
					}
				});
			} else {
				kernel.hint('popup config not found: ' + id, 'error');
			}
		};
		kernel.showPopup = function(id, param) {
			var fire, popupcfg = popups[id];
			if (activePopup) {
				if (typeof popups[activePopup].onunload === 'function') {
					popups[activePopup].onunload();
				}
				document.getElementById(activePopup).style.display = '';
			} else {
				popup.style.display = 'block';
				fire = true;
			}
			activePopup = id;
			popup.className = id;
			document.getElementById(id).style.display = 'block';
			if (fire && typeof kernel.popupEvents.onshow === 'function') {
				kernel.popupEvents.onshow({
					type: 'show'
				});
			}
			if (typeof popupcfg.onload === 'function') {
				popupcfg.onload(param);
			}
		};
		kernel.closePopup = function(id) {
			var close;
			if (activePopup) {
				if (typeof id === 'string') {
					close = id === activePopup;
				} else if (id instanceof Array) {
					close = id.indexOf(activePopup) >= 0;
				} else {
					close = true;
				}
				if (close) {
					if (typeof popups[activePopup].onunload === 'function') {
						popups[activePopup].onunload();
					}
					document.getElementById(activePopup).style.display = '';
					close = activePopup;
					popup.className = popup.style.display = activePopup = '';
					if (typeof kernel.popupEvents.onhide === 'function') {
						kernel.popupEvents.onhide({
							type: 'hide',
							id: close
						});
					}
					return true;
				}
			}
		};

		// 获取当前显示的 popup id
		kernel.getCurrentPopup = function() {
			return activePopup;
		};
		kernel.popupEvents = {};
		$('#popups > div > a').on('click', function() {
			kernel.closePopup();
		});
	}();
	//图片展示
	! function() {
		var ctn = $('#photoview'),
			close = ctn.find('.close'),
			prev = ctn.find('.prev'),
			next = ctn.find('.next'),
			sld = slider(ctn.find('>div')),
			siz = [],
			w, h;
		kernel.showPhotoView = function(contents, idx) {
			var i;
			if ($.type(contents) === 'array') {
				for (i = 0; i < contents.length; i++) {
					sld.add($('<div style="background-image:url(' + contents[i] + ')"></div>'));
					getsz(i, contents[i]);
				}
				if (idx >= 0 && idx < sld.children.length) {
					sld.slideTo(idx, true);
				}
				if (sld.children.length > 1) {
					prev.css('display', 'block');
					next.css('display', 'block');
				} else {
					prev.css('display', '');
					next.css('display', '');
				}
			}
		};
		kernel.hidePhotoView = function() {
			while (sld.children.length) {
				if (!$.isPlainObject(siz[0])) {
					siz[0].onload = null;
					document.body.removeChild(siz[0]);
				}
				siz.shift();
				sld.remove(0);
			}
		};
		$(window).on('resize', rsz);
		prev.on('click', function() {
			sld.slideTo(sld.current - 1);
		});
		next.on('click', function() {
			sld.slideTo(sld.current + 1);
		});
		close.on('click', kernel.hidePhotoView);
		sld.onchange = function() {
			if (this.current === undefined) {
				ctn.css('display', '');
			} else {
				if ($.isPlainObject(siz[this.current])) {
					chksz(this.current);
				}
				ctn.css('display', 'block');
			}
		};
		rsz();
		function rsz() {
			w = $(window).innerWidth();
			h = $(window).innerHeight();
			if (typeof sld.current === 'number' && $.isPlainObject(siz[sld.current])) {
				chksz(sld.current);
			}
		}
		function getsz(i, url) {
			siz[i] = new Image();
			siz[i].style.position = 'absolute';
			siz[i].style.bottom = siz[i].style.right = '100%';
			siz[i].onload = function (){
				var r = {
					w: this.width,
					h: this.height
				};
				document.body.removeChild(siz[i]);
				siz[i] = r;
				if (sld.current === i) {
					chksz(i);
				}
			};
			siz[i].src = url;
			document.body.appendChild(siz[i]);
		}
		function chksz(i) {
			sld.children[i].css('background-size', siz[i].w > w || siz[i].h > h ? 'contain' : '');
		}
	}();
	//对话框及提示功能
	! function() {
		var hintmo,
			hintCtn = document.getElementById('hintCtn'),
			loadingRT = 0,
			dlgCtn = document.getElementById('dialogs'),
			dlgStack = [],
			dlgCb, raCb; //callbacks
		kernel.showLoading = function(text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
			$('#loading > div > div').text(text ? text : '加载中...');
			if (loadingRT === 0) {
				document.getElementById('loading').style.display = 'block';
			}
			loadingRT += 1;
		};
		kernel.hideLoading = function() { //不要使用hideDialog来关闭loading提示框
			if (loadingRT > 0) {
				loadingRT -= 1;
				if (loadingRT === 0) {
					document.getElementById('loading').style.display = '';
					if (typeof kernel.dialogEvents.onloaded === 'function') {
						kernel.dialogEvents.onloaded({
							type: 'loaded'
						});
					}
				}
			}
		};
		kernel.isLoading = function() {
			return loadingRT > 0;
		};
		kernel.hint = function(text, className, t) {
			var o = $('#hint');
			o.prop('className', className ? className : '');
			o.find('span').text(text);
			if (hintmo) {
				clearTimeout(hintmo);
			} else {
				o.css('display', 'block');
				o[0].offsetWidth;
				o.fadeIn();
			}
			if (!t) {
				t = className === 'error' ? 4000 : className === 'warning' ? 3000 : 2000;
			}
			hintmo = setTimeout(function() {
				hintmo = 0;
				o.fadeOut(function() {
					o.css('display', '');
				});
			}, t);
		};
		kernel.showReadable = function(html, width, height, callback) {
			var readable = $('#readable');
			if (typeof html === 'string') {
				readable.find('>div').css('width', width).css('height', height).find('>div').html(html);
			} else {
				readable.find('>div').css('width', width).css('height', height).find('>div').append(html);
			}
			readable.css('display', 'block');
			raCb = callback;
		};
		kernel.hideReadable = function() {
			if (typeof raCb === 'function') {
				raCb();
				raCb = undefined;
			}
			$('#readable').css('display', '').find('>div>div>*').remove();
		};
		kernel.hideDialog = function(param) {
			var f;
			if (typeof dlgCb === 'function') {
				if (dlgCtn.className === 'isConfirm') {
					dlgCb(param);
				} else if (dlgCtn.className === 'isAlert') {
					dlgCb();
				}
				dlgCb = undefined;
			}
			dlgCtn.className = '';
			if (dlgStack.length > 0) {
				f = dlgStack[0][0];
				dlgStack[0].shift();
				kernel[f].apply(this, dlgStack[0]);
				dlgStack.shift();
			}
		};
		kernel.showForeign = function(url, width, height, callback) {
			kernel.showReadable('<iframe frameborder="no" allowtransparency="yes" marginwidth="0" marginheight="0" style="width:100%;height:100%;" src="' + url + '"></iframe>', width, height, callback);
		};
		kernel.confirm = function(text, callback, width, height) {
			var ctn, txt;
			if (dlgCtn.className === '') {
				ctn = $(dlgCtn).find('>div');
				txt = ctn.find('>div>div')
				dlgCb = callback;
				ctn.css('width', width || '400px');
				txt.text(text);
				dlgCtn.className = 'isConfirm';
				ctn.css('height', txt.outerHeight() + Math.max($(dlgCtn).find('>div>a.yes').outerHeight(), $(dlgCtn).find('>div>a.no').outerHeight()) + 76 + 'px');
			} else {
				dlgStack.push(['confirm', text, callback, width, height]);
			}
		};
		kernel.alert = function(text, callback, width, height) {
			var ctn, txt;
			if (dlgCtn.className === '') {
				ctn = $(dlgCtn).find('>div');
				txt = ctn.find('>div>div');
				dlgCb = callback;
				ctn.css('width', width || '400px');
				txt.text(text);
				dlgCtn.className = 'isAlert';
				ctn.css('height', txt.outerHeight() + 46 + 'px');
			} else {
				dlgStack.push(['alert', text, callback, width]);
			}
		};
		$('#readable>div>a').on('click', kernel.hideReadable);
		$(window).on('keydown', function(evt) {
			if (evt.keyCode === 27 && $('#readable').css('display') === 'block') {
				kernel.hideReadable();
			}
		});
		$(dlgCtn).find('>div>a.close').on('click', kernel.hideDialog);
		$(dlgCtn).find('>div>a.yes').on('click', function() {
			kernel.hideDialog(true);
		});
		$(dlgCtn).find('>div>a.no').on('click', function() {
			kernel.hideDialog(false);
		});
		//目前只有loaded事件
		kernel.dialogEvents = {};
	}();

	//页面加载相关功能
	! function() {
		var currentpage, routingCb, pageScroller;
		//启动路由处理，只需要调用一次
		//func为每次路由发生改变时需要执行的回调, 此回调会在页面加载前执行
		//当指定ps时则表示使用局部滚动
		kernel.init = function(home, ps, func) {
			var lastHash;
			homePage = home;
			pageScroller = ps;
			routingCb = func;
			if ('onhashchange' in window) {
				$(window).on('hashchange', hashchange);
			} else {
				setInterval(function() {
					if (lastHash !== location.hash) {
						lastHash = location.hash;
						hashchange();
					}
				}, 10);
			}
			hashchange();
		};
		kernel.setHome = function(home) {
			var tmp;
			if (home in pages) {
				tmp = homePage;
				homePage = home;
				if (kernel.location && kernel.location.id === tmp) {
					if (!kernel.isSameLocation(kernel.location, kernel.parseHash(location.hash))){
						hashchange();
						return true;
					}
				}
			}
		};
		kernel.reloadPage = function(id) {
			if (!id || (typeof id === 'string' && id === kernel.location.id) || id.infexOf(kernel.location.id) >= 0) {
				kernel.closePopup();
				kernel.hideReadable();
				if (typeof pages[currentpage].onunload === 'function') {
					pages[currentpage].onunload();
				}
				if (typeof pages[currentpage].onload === 'function') {
					pages[currentpage].onload(true);
				}
			}
		};

		function hashchange() {
			var nl = kernel.parseHash(location.hash),
				historyNav = history.state;
			history.replaceState && history.replaceState(true, null);
			if (!kernel.location || !kernel.isSameLocation(kernel.location, nl)) {
				kernel.location = nl;
				kernel.closePanel();
				kernel.closePopup();
				kernel.hideReadable();
				if (typeof routingCb === 'function') {
					routingCb();
				}
				initLoad('page', pages[kernel.location.id], kernel.location.id, function() {
					var scroll, h;
					//发生页面跳转或首次加载
					if (kernel.location.id !== currentpage) {
						if (currentpage) {
							if (typeof pages[currentpage].onunload === 'function') {
								pages[currentpage].onunload();
							}
							document.getElementById(currentpage).style.display = '';
							scroll = !pageScroller && !historyNav;
						} else {
							if ('autopopup' in kernel.location.args) {
								kernel.openPopup(kernel.location.args.autopopup, kernel.location.args.autopopuparg ? JSON.parse(kernel.location.args.autopopuparg) : undefined);
							}
						}
						document.body.className = currentpage = kernel.location.id;
						document.getElementById(kernel.location.id).style.display = 'block';
						if (typeof pages[kernel.location.id].onload === 'function') {
							pages[kernel.location.id].onload(true);
						}
						if (scroll) {
							h = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
							if (h > 0) {
								$('html,body').animate({
									scrollTop: 0
								}, h);
							}
						} else if (pageScroller) {
							pageScroller.scrollTop = 0;
						}
					} else {
						if (typeof pages[kernel.location.id].onload === 'function') {
							//未发生页面跳转但url有变化时允许页面缓存
							pages[kernel.location.id].onload();
						}
					}
				});
			}
		}
	}();
	return kernel;

	function initLoad(type, oldcfg, id, callback) {
		if (oldcfg.loaded === 2) {
			callback();
		} else if (oldcfg.loaded !== 1) {
			oldcfg.loaded = 1;
			var ctn = '#' + type + 's',
				exts = ['onload', 'onunload'],
				n = type + '/' + id + '/',
				m = require.toUrl(n),
				isPage = type === 'page';
			if (!isPage) {
				exts.push('open');
				if (type === 'popup') {
					ctn += '>div>div';
				} else if (type === 'panel'){
					exts.push('onloadend');
					exts.push('onunloadend');
					ctn += '>.contents>div';
				}
			}
			ctn = $(ctn)[0];
			if ('css' in oldcfg) {
				kernel.appendCss(m + oldcfg.css);
				delete oldcfg.css;
			}
			if ('html' in oldcfg) {
				var url = m + oldcfg.html
				$.ajax({
					url: url,
					type: 'get',
					dataType: 'text',
					success: function(text) {
						delete oldcfg.html;
						ctn.insertAdjacentHTML('afterBegin', '<div id="' + id + '">' + text + '</div>');
						loadJs();
					},
					error: function(xhr, msg) {
						oldcfg.loaded = 0;
						if (require.data.debug || xhr.status !== 404) {
							errorOccurs(url, xhr.status, isPage);
						} else {
							updated(isPage);
						}
					},
					complete: kernel.hideLoading
				});
				kernel.showLoading();
			} else {
				ctn.insertAdjacentHTML('afterBegin', '<div id="' + id + '"></div>');
				loadJs();
			}
		}

		function loadJs() {
			var js;
			if ('js' in oldcfg) {
				kernel.showLoading();
				js = n + oldcfg.js;
				require([js], function(cfg) {
					delete oldcfg.js;
					if (cfg) {
						kernel.extendIn(oldcfg, cfg, exts);
					}
					oldcfg.loaded = 2;
					callback();
					kernel.hideLoading();
				}, require.data.debug ? undefined : function(error) {
					oldcfg.loaded = 0;
					if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
						require.undef(js);
						errorOccurs(js, error.message, isPage);
					} else {
						updated(isPage);
					}
					kernel.hideLoading();
				});
			} else {
				oldcfg.loaded = 2;
				callback();
			}
		}
	}

	function errorOccurs(res, msg, isPage) {
		kernel.alert('加载' + res + '时发生了一个错误: ' + msg, isPage ? function() {
			history.back();
		} : undefined);
	}

	function updated(isPage) {
		if (isPage) {
			location.reload();
		} else {
			kernel.confirm('网站已经更新, 使用该功能需要先重新加载. 是否立即刷新本页?', function(sure) {
				if (sure) {
					location.reload();
				}
			});
		}
	}
});