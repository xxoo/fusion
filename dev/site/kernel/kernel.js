// kernel
'use strict';
define(['site/pages/pages', 'site/popups/popups'], function(pages, popups) {
	var kernel = {
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
				id: 'home',
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
					a = s[i].match(/^([^=]+)(?:=(.+))?$/);
					if (a) {
						nl.args[decodeURIComponent(a[1])] = a.length > 1 ? decodeURIComponent(a[2]) : undefined;
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

	//弹出窗口
	! function() {
		var activePopup, popup = document.getElementById('popup');
		kernel.openPopup = function(id, param) {
			var popupcfg = popups[id];
			if (popupcfg) {
				initLoad(popupcfg, id, false, function() {
					if (typeof popupcfg.open === 'function') {
						popupcfg.open(param);
					} else {
						kernel.showPopup(id, param);
					}
				});
			} else {
				kernel.hint('popup config not found: ' + id);
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
					popup.className = popup.style.display = activePopup = '';
					if (typeof kernel.popupEvents.onhide === 'function') {
						kernel.popupEvents.onhide({
							type: 'hide'
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
		$('#popup > div > a').on('click', function() {
			kernel.closePopup();
		});
	}();
	//对话框及提示功能
	! function() {
		var hintmo,
			hintCtn = document.getElementById('hintCtn'),
			loadingRT = 0,
			dlgCtn = document.getElementById('dialog'),
			dlgStack = [],
			dlgCb, raCb; //callbacks
		kernel.showLoading = function(text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
			$('#loading > div > div').text(text ? text : '正在为您努力加载中...');
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
		kernel.hint = function(text, t) {
			var o = $('#hint');
			o.find('span').text(text);
			if (hintmo) {
				clearTimeout(hintmo);
			} else {
				o.css('display', 'block');
				o[0].offsetWidth;
				o.fadeIn();
			}
			hintmo = setTimeout(function() {
				hintmo = 0;
				o.fadeOut(function() {
					o.css('display', '');
				});
			}, t ? t : 4000);
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
				if (dlgCtn.className === 'confirm') {
					dlgCb(param);
				} else if (dlgCtn.className === 'alert') {
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
				dlgCtn.className = 'confirm';
				ctn.css('height', txt.outerHeight() + 108 + 'px');
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
				dlgCtn.className = 'alert';
				ctn.css('height', txt.outerHeight() + 46 + 'px');
			} else {
				dlgStack.push(['alert', text, callback, width]);
			}
		};
		$('#readable > div > a').on('click', kernel.hideReadable);
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
		var currentpage;
		//启动路由处理，只需要调用一次
		//func为每次路由发生改变时需要执行的回调, 此回调会在页面加载前执行
		kernel.init = function (func) {
			var lastHash;
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
		kernel.reloadPage = function() {
			kernel.closePopup();
			kernel.hideReadable();
			if (typeof pages[currentpage].onunload === 'function') {
				pages[currentpage].onunload();
			}
			if (typeof pages[currentpage].onload === 'function') {
				pages[currentpage].onload(true);
			}
		};

		function hashchange() {
			var nl = kernel.parseHash(location.hash),
				historyNav = history.state;
			history.replaceState && history.replaceState(true, null);
			if (!kernel.location || !kernel.isSameLocation(kernel.location, nl)) {
				//百度统计接口
				if (typeof _hmt !== 'undefined' && _hmt.push) {
					_hmt.push(['_trackPageview', '/' + kernel.buildHash(nl)]);
				}
				kernel.location = nl;
				kernel.closePopup();
				kernel.hideReadable();
				if (typeof func === 'function') {
					func();
				}
				initLoad(pages[kernel.location.id], kernel.location.id, true, function() {
					var scroll, h;
					//发生页面跳转或首次加载
					if (kernel.location.id !== currentpage) {
						if (currentpage) {
							if (typeof pages[currentpage].onunload === 'function') {
								pages[currentpage].onunload();
							}
							document.getElementById(currentpage).style.display = '';
							scroll = !historyNav;
						} else {
							if ('autopopup' in kernel.location.args) {
								kernel.openPopup(kernel.location.args.autopopup, kernel.location.args.autopopuparg);
								delete kernel.location.args.autopopup;
								delete kernel.location.args.autopopuparg;
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
									'scrollTop': 0
								}, h);
							}
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

	function initLoad(oldcfg, id, isPage, callback) {
		if (oldcfg.loaded === 2) {
			callback();
		} else if (oldcfg.loaded !== 1) {
			oldcfg.loaded = 1;
			var ctnSel, family, exts;
			if (isPage) {
				ctnSel = '#page';
				family = 'page';
				exts = ['onload', 'onunload'];
			} else {
				ctnSel = '#popup > div > div';
				family = 'popup';
				exts = ['onload', 'onunload', 'open'];
			}
			var n = family + '/' + id + '/',
				m = require.toUrl(n);
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
						$(ctnSel).append('<div id="' + id + '">' + text + '</div>');
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
				$(ctnSel).append('<div id="' + id + '"></div>');
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
				}, function(error) {
					oldcfg.loaded = 0;
					if (require.data.debug || (error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
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