// kernel
'use strict';
define(['common/slider/slider', 'site/pages/pages', 'site/popups/popups', 'site/panels/panels', './lang'], function (slider, pages, popups, panels, lang) {
	var homePage,
		kernel = {
			appendCss: function (url) { //自动根据当前环境添加css或less
				var csslnk = document.createElement('link');
				if (typeof less === 'object') {
					csslnk.rel = 'stylesheet/less';
					csslnk.href = url + '.less';
					less.sheets.push(csslnk);
					less.refresh();
				} else {
					csslnk.rel = 'stylesheet';
					csslnk.href = url + '.css';
				}
				return (document.head || document.getElementsByTagName('head')[0]).appendChild(csslnk);
			},
			removeCss: function (lnk) {
				$(lnk).remove();
				if (lnk.rel === 'stylesheet/less') {
					less.sheets.splice(less.sheets.indexOf(lnk), 1);
					less.refresh();
				}
				return lnk.getAttribute('href').replace(/\.(le|c)ss$/, '');
			},
			buildHash: function (loc) {
				var n, hash = '#!' + encodeURIComponent(loc.id);
				for (n in loc.args) {
					hash += loc.args[n] === undefined ? '&' + encodeURIComponent(n) : '&' + encodeURIComponent(n) + '=' + encodeURIComponent(loc.args[n]);
				}
				return hash;
			},
			parseHash: function (hash) {
				var i, a, s, nl = {
					id: homePage,
					args: {}
				};
				hash = hash.substr(1).replace(/[#?].*$/, '');
				s = hash.match(/[^=&]+(=[^&]*)?/g);
				if (s && s[0].charAt(0) === '!') {
					a = decodeURIComponent(s[0].substr(1));
					if (pages.hasOwnProperty(a)) {
						nl.id = a;
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
			isSameLocation: function (loc1, loc2) {
				var n;
				if (loc1.id === loc2.id && Object.keys(loc1.args).length === Object.keys(loc2.args).length) {
					for (n in loc1.args) {
						if (loc2.args.hasOwnProperty(n)) {
							if (loc1.args[n] === undefined) {
								if (loc1.args[n] !== loc2.args[n]) {
									return false;
								}
							} else {
								if ('' + loc1.args[n] !== '' + loc2.args[n]) {
									return false;
								}
							}
						} else {
							return false;
						}
					}
					return true;
				} else {
					return false;
				}
			},
			replaceLocation: function (loc) {
				if (kernel.location && kernel.isSameLocation(loc, kernel.location)) {
					kernel.reloadPage();
				} else {
					location.replace(kernel.buildHash(loc));
				}
			},
			getLang: function (langs) {
				var i;
				if (navigator.languages) {
					for (i = 0; i < navigator.languages.length; i++) {
						if (langs.hasOwnProperty(navigator.languages[i])) {
							return langs[navigator.languages[i]];
						}
					}
				} else {
					if (langs.hasOwnProperty(navigator.language)) {
						return langs[navigator.language];
					}
				}
				return langs.en;
			}
		};
	lang = kernel.getLang(lang);
	//事件处理
	! function () {
		var key = typeof Symbol === 'function' ? Symbol('xEvents') : 'xEvents';
		kernel.listeners = {
			add: function (o, e, f) {
				var result = 0;
				if (typeof f === 'function') {
					if (!o.hasOwnProperty(key)) {
						o[key] = {};
					}
					if (!o[key].hasOwnProperty(e)) {
						o[key][e] = {
							stack: [],
							heap: [],
							locked: false
						};
						o['on' + e] = xEventProcessor;
					}
					if (o[key][e].locked) {
						o[key][e].stack.push([f]);
						result = 2;
					} else if (o[key][e].heap.indexOf(f) < 0) {
						o[key][e].heap.push(f);
						result = 1;
					}
				}
				return result;
			},
			list: function (o, e) {
				var i, result;
				if (e) {
					result = o.hasOwnProperty(key) && o[key].hasOwnProperty(e) ? o[key][e].heap.slice(0) : [];
				} else {
					result = {};
					if (o.hasOwnProperty(key)) {
						for (i in o[key]) {
							result[i] = o[key][i].heap.slice(0);
						}
					}
				}
				return result;
			},
			remove: function (o, e, f) {
				var i, result = 0;
				if (o.hasOwnProperty(key)) {
					if (e) {
						if (o[key].hasOwnProperty(e)) {
							if (o[key][e].locked) {
								o[key][e].stack.push(f);
								result = 2;
							} else if (typeof f === 'function') {
								i = o[key][e].heap.indexOf(f);
								if (i >= 0) {
									o[key][e].heap.splice(i, 1);
									cleanup(o, e);
									result = 1;
								}
							} else {
								cleanup(o, e, true);
								result = 1;
							}
						}
					} else {
						for (i in o[key]) {
							if (o[key][i].locked) {
								o[key][i].stack.push(undefined);
								result = 2;
							} else {
								cleanup(o, i, true);
							}
						}
						if (!result) {
							result = 1;
						}
					}
				}
				return result;
			}
		};

		function xEventProcessor(evt) {
			var i;
			this[key][evt.type].locked = true;
			for (i = 0; i < this[key][evt.type].heap.length; i++) {
				this[key][evt.type].heap[i].call(this, evt);
			}
			this[key][evt.type].locked = false;
			while (this[key][evt.type].stack.length) {
				if (this[key][evt.type].stack[0]) {
					if (typeof this[key][evt.type].stack[0] === 'function') {
						i = this[key][evt.type].heap.indexOf(this[key][evt.type].stack[0]);
						if (i >= 0) {
							this[key][evt.type].heap.splice(i, 1);
						}
					} else if (this[key][evt.type].heap.indexOf(this[key][evt.type].stack[0][0]) < 0) {
						this[key][evt.type].heap.push(this[key][evt.type].stack[0][0]);
					}
				} else {
					this[key][evt.type].heap.splice(0);
				}
				this[key][evt.type].stack.shift();
			}
			cleanup(this, evt.type);
		}

		function cleanup(o, e, force) {
			if (force || !o[key][e].heap.length) {
				delete o[key][e];
				o['on' + e] = null;
			}
		}
	}();

	//panel
	! function () {
		var activePanel, ani, todo,
			panelCtn = $('#panel'),
			ctn = panelCtn.find('>.contents>div');
		kernel.openPanel = function (id, param) {
			if (panels.hasOwnProperty(id)) {
				initLoad('panel', panels[id], id, function () {
					if (typeof panels[id].open === 'function') {
						panels[id].open(param);
					} else {
						kernel.showPanel(id);
					}
				});
				return true;
			}
		};
		kernel.showPanel = function (id) {
			var result = 0;
			if (panels[id].status > 1) {
				if (ani) {
					todo = kernel.showPanel.bind(this, id);
					result = 2;
				} else if (!activePanel) {
					panels[id].status++;
					if (typeof panels[id].onload === 'function') {
						panels[id].onload();
					}
					panelCtn[0].className = activePanel = id;
					panelCtn[0].style.display = ctn.find('>.' + id)[0].style.display = 'block';
					startAni(function () {
						if (typeof panels[id].onloadend === 'function') {
							panels[id].onloadend();
						}
						panels[id].status++;
					}, true);
					result = 1;
				} else if (activePanel === id) {
					if (typeof panels[id].onload === 'function') {
						panels[id].onload();
					}
					if (typeof panels[id].onloadend === 'function') {
						panels[id].onloadend();
					}
					result = 1;
				} else if (hidePanel()) {
					todo = kernel.showPanel.bind(this, id);
					result = 1;
				}
			}
			return result;
		};
		kernel.closePanel = function (id) {
			var result = 0;
			if (ani) {
				todo = kernel.closePanel.bind(this, id);
				result = 2;
			} else if (activePanel && (!id || activePanel === id || (dataType(id) === 'Array' && id.indexOf(activePanel) >= 0)) && hidePanel()) {
				result = 1;
			}
			return result;
		};
		// 获取当前显示的 panel id
		kernel.getCurrentPanel = function () {
			return activePanel;
		};
		kernel.destroyPanel = function (id) {
			if (panels[id].status === 2) {
				destroy(panels[id], 'panel', id);
				return true;
			}
		};
		todo = kernel.closePanel.bind(kernel, undefined);
		ctn.find('>.close').on('click', todo);
		panelCtn.find('>.mask').on('click', todo);
		todo = undefined;

		function startAni(cb, show) {
			ani = true;
			ctn.animate({
				'margin-left': show ? '-100%' : '0%'
			}, {
				duration: 200,
				complete: function () {
					var tmp;
					ani = false;
					cb();
					if (typeof todo === 'function') {
						tmp = todo;
						todo = undefined;
						tmp();
					}
				}
			});
		}

		function hidePanel() {
			if (typeof panels[activePanel].onunload !== 'function' || !panels[activePanel].onunload()) {
				panels[activePanel].status--;
				startAni(function () {
					if (typeof panels[activePanel].onunloadend === 'function') {
						panels[activePanel].onunloadend();
					}
					panels[activePanel].status--;
					ctn.find('>.' + activePanel)[0].style.display = panelCtn[0].style.display = '';
					if (panels[activePanel].autoDestroy) {
						destroy(panels[activePanel], 'panel', activePanel);
					}
					activePanel = undefined;
				}, false);
				return true;
			}
		}
	}();

	//弹出窗口
	! function () {
		var activePopup,
			popup = document.getElementById('popup'),
			ctn = $(popup).find('>div>div');
		kernel.openPopup = function (id, param) {
			if (popups.hasOwnProperty(id)) {
				initLoad('popup', popups[id], id, function () {
					if (typeof popups[id].open === 'function') {
						popups[id].open(param);
					} else {
						kernel.showPopup(id);
					}
				});
				return true;
			}
		};
		kernel.showPopup = function (id) {
			var result;
			if (popups[id].status > 1) {
				if (!activePopup) {
					ctn.find('>.' + id)[0].style.display = popup.style.display = 'block';
					popup.className = activePopup = id;
					if (typeof kernel.popupEvents.onshow === 'function') {
						kernel.popupEvents.onshow({
							type: 'show',
							id: activePopup
						});
					}
					popups[id].status++;
					if (typeof popups[id].onload === 'function') {
						popups[id].onload();
					}
					result = true;
				} else if (activePopup === id) {
					if (typeof popups[id].onload === 'function') {
						popups[id].onload();
					}
					result = true;
				} else if (typeof popups[activePopup].onunload !== 'function' || !popups[activePopup].onunload()) {
					popups[activePopup].status--;
					ctn.find('>.' + activePopup).css('display', '');
					if (popups[activePopup].autoDestroy) {
						destroy(popups[activePopup], 'popup', activePopup);
					}
					ctn.find('>.' + id).css('display', 'block');
					popup.className = activePopup = id;
					popups[id].status++;
					if (typeof popups[id].onload === 'function') {
						popups[id].onload();
					}
					result = true;
				}
			}
			return result;
		};
		kernel.closePopup = function (id) {
			var close;
			if (activePopup && (!id || activePopup === id || (dataType(id) === 'Array' && id.indexOf(activePopup) >= 0)) && (typeof popups[activePopup].onunload !== 'function' || !popups[activePopup].onunload())) {
				popups[activePopup].status--;
				close = activePopup;
				ctn.find('>.' + activePopup)[0].style.display = popup.style.display = popup.className = activePopup = '';
				if (popups[close].autoDestroy) {
					destroy(popups[close], 'popup', activePopup);
				}
				if (typeof kernel.popupEvents.onhide === 'function') {
					kernel.popupEvents.onhide({
						type: 'hide',
						id: close
					});
				}
				return true;
			}
		};
		// 获取当前显示的 popup id
		kernel.getCurrentPopup = function () {
			return activePopup;
		};
		kernel.destroyPopup = function (id) {
			if (popups[id].status === 2) {
				destroy(popups[id], 'popup', id);
				return true;
			}
		};
		kernel.popupEvents = {};
		$(popup).find('>div>a').on('click', kernel.closePopup.bind(kernel, undefined));
	}();
	//图片展示
	! function () {
		var ctn = $('#photoview'),
			close = ctn.find('.close'),
			prev = ctn.find('.prev'),
			next = ctn.find('.next'),
			rp = ctn.find('.rotate.p'),
			rn = ctn.find('.rotate.n'),
			sld = slider(ctn.find('>div')),
			siz = [],
			deg = [],
			w, h;
		kernel.showPhotoView = function (contents, idx) {
			var i;
			if (dataType(contents) === 'Array') {
				for (i = 0; i < contents.length; i++) {
					sld.add($('<img src="' + contents[i] + '"/>'));
					getsz(i);
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
		kernel.hidePhotoView = function () {
			siz = [];
			while (sld.children.length) {
				sld.remove(0);
			}
		};
		ctn.on('click', '>div>img', function () {
			var d;
			if (this.style.cursor === 'zoom-in') {
				d = deg[sld.current] % 2;
				if (d) {
					this.style.top = siz[sld.current].w > h ? (siz[sld.current].w - siz[sld.current].h) / 2 + 'px' : (h - siz[sld.current].h) / 2 + 'px';
					this.style.left = siz[sld.current].h > w ? (siz[sld.current].h - siz[sld.current].w) / 2 + 'px' : (w - siz[sld.current].w) / 2 + 'px';
				} else {
					this.style.top = siz[sld.current].h > h ? 0 : (h - siz[sld.current].h) / 2 + 'px';
					this.style.left = siz[sld.current].w > w ? 0 : (w - siz[sld.current].w) / 2 + 'px';
				}
				this.style.width = siz[sld.current].w + 'px';
				this.style.height = siz[sld.current].h + 'px';
				this.style.cursor = 'zoom-out';
			} else if (this.style.cursor === 'zoom-out') {
				chksz(sld.current);
			}
		});
		$(self).on('resize', rsz);
		prev.on('click', function () {
			sld.slideTo(sld.current - 1);
		});
		next.on('click', function () {
			sld.slideTo(sld.current + 1);
		});
		rp.on('click', function () {
			if (typeof deg[sld.current] === 'number') {
				deg[sld.current]++;
				chksz(sld.current);
			}
		});
		rn.on('click', function () {
			if (typeof deg[sld.current] === 'number') {
				deg[sld.current]--;
				chksz(sld.current);
			}
		});
		close.on('click', kernel.hidePhotoView);
		sld.onchange = function () {
			if (this.current === undefined) {
				ctn.css('display', '');
			} else {
				if (siz[this.current]) {
					chksz(this.current);
				}
				ctn.css('display', 'block');
			}
		};
		if ('transform' in document.documentElement.style) {
			rp.css('display', 'block');
			rn.css('display', 'block');
		}
		rsz();

		function rsz() {
			var win = $(self);
			w = win.innerWidth();
			h = win.innerHeight();
			if (typeof sld.current === 'number' && siz[sld.current]) {
				chksz(sld.current);
			}
		}

		function getsz(i) {
			sld.children[i].one('load', function () {
				siz[i] = {
					w: this.width,
					h: this.height
				};
				deg[i] = 0;
				if (sld.current === i) {
					chksz(i);
				}
				this.style.visibility = 'visible';
			});
		}

		function chksz(i) {
			var r, cw, ch, dw, dh,
				d = deg[i] % 2;
			if (d) {
				dw = siz[i].h;
				dh = siz[i].w;
			} else {
				dw = siz[i].w;
				dh = siz[i].h;
			}
			if (dw > w || dh > h) {
				r = dw / dh;
				if (w / h > r) {
					ch = h;
					cw = ch * r;
				} else {
					cw = w;
					ch = cw / r;
				}
				if (d) {
					dw = ch;
					dh = cw;
				} else {
					dw = cw;
					dh = ch;
				}
				sld.children[i].css('cursor', 'zoom-in');
			} else {
				dw = siz[i].w;
				dh = siz[i].h;
				sld.children[i].css('cursor', '');
			}
			sld.children[i].css({
				top: (h - dh) / 2 + 'px',
				left: (w - dw) / 2 + 'px',
				width: dw + 'px',
				height: dh + 'px',
				transform: 'rotate(' + 90 * deg[i] + 'deg)'
			});
		}
	}();
	//对话框及提示功能
	! function () {
		var hintmo,
			loadingRT = 0,
			hint = $('#hint'),
			readable = $('#readable'),
			dlgCtn = $('#dialog'),
			loading = $('#loading'),
			dlgStack = [],
			dlgCb, raCb; //callbacks
		kernel.showLoading = function (text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
			loading.find('>div>div').text(text ? text : lang.loading);
			if (loadingRT === 0) {
				loading.css('display', 'block');
			}
			loadingRT += 1;
		};
		kernel.hideLoading = function () { //不要使用hideDialog来关闭loading提示框
			if (loadingRT > 0) {
				loadingRT -= 1;
				if (loadingRT === 0) {
					loading.css('display', '');
					if (typeof kernel.dialogEvents.onloaded === 'function') {
						kernel.dialogEvents.onloaded({
							type: 'loaded'
						});
					}
				}
			}
		};
		kernel.isLoading = function () {
			return loadingRT > 0;
		};
		kernel.hint = function (text, className, t) {
			hint[0].className = className || '';
			hint.find('span').text(text);
			if (hintmo) {
				clearTimeout(hintmo);
			} else {
				hint.css('display', 'block');
				hint[0].offsetWidth;
				hint.fadeIn();
			}
			if (!t) {
				t = className === 'error' ? 4000 : className === 'warning' ? 3000 : 2000;
			}
			hintmo = setTimeout(function () {
				hintmo = 0;
				hint.fadeOut(function () {
					hint.css('display', '');
				});
			}, t);
		};
		kernel.showReadable = function (html, width, height, callback, className) {
			readable.prop('className', className || '').css('display', 'block').find('>div').css({
				width: width,
				height: height
			}).find('>div').append(html);
			raCb = callback;
		};
		kernel.hideReadable = function () {
			if (typeof raCb === 'function') {
				raCb();
				raCb = undefined;
			}
			readable.css('display', '').find('>div>div>*').remove();
		};
		kernel.hideDialog = function (param) {
			var f;
			if (typeof dlgCb === 'function') {
				f = dlgCb;
				dlgCb = undefined;
				f(dlgCtn[0].className === 'isConfirm' ? param : undefined);
			}
			dlgCtn[0].className = '';
			if (dlgStack.length) {
				f = dlgStack.shift();
				kernel[f.shift()].apply(kernel, f);
			}
		};
		kernel.showForeign = function (url, width, height, callback) {
			kernel.showReadable('<iframe frameborder="no" allowtransparency="yes" marginwidth="0" marginheight="0" src="' + url + '"></iframe>', width, height, callback, 'foreign');
		};
		kernel.confirm = function (text, callback, width) {
			var ctn, txt, yes, no;
			if (dlgCtn[0].className) {
				dlgStack.push(['confirm', text, callback, width]);
			} else {
				ctn = dlgCtn.find('>div');
				txt = ctn.find('>div>div');
				yes = ctn.find('>a.yes');
				no = ctn.find('>a.no');
				dlgCb = callback;
				ctn.css('width', width || '400px');
				if (dataType(text) === 'Array') {
					txt.text(text[0]);
					yes.text(text[1]);
					no.text(text[2]);
				} else {
					txt.text(text);
					yes.text(lang.yes);
					no.text(lang.no);
				}
				dlgCtn[0].className = 'isConfirm';
				ctn.css('height', txt.outerHeight() + Math.max(yes.outerHeight(), no.outerHeight()) + 76 + 'px');
			}
		};
		kernel.alert = function (text, callback, width) {
			var ctn, txt;
			if (dlgCtn[0].className) {
				dlgStack.push(['alert', text, callback, width]);
			} else {
				ctn = dlgCtn.find('>div');
				txt = ctn.find('>div>div');
				dlgCb = callback;
				ctn.css('width', width || '400px');
				txt.text(text);
				dlgCtn[0].className = 'isAlert';
				ctn.css('height', txt.outerHeight() + 46 + 'px');
			}
		};
		readable.find('>div>a').on('click', kernel.hideReadable);
		dlgCtn.find('>div>a.close').on('click', kernel.hideDialog);
		dlgCtn.find('>div>a.yes').on('click', function () {
			kernel.hideDialog(true);
		});
		dlgCtn.find('>div>a.no').on('click', function () {
			kernel.hideDialog(false);
		});
		//目前只有loaded事件
		kernel.dialogEvents = {};
	}();
	//页面加载相关功能
	! function () {
		var currentpage;
		//初始化并启动路由或者修改默认页
		//当调用此方法后引起路由变化则会返回true
		kernel.init = function (home) {
			var oldHash, oldHome, tmp;
			if (pages.hasOwnProperty(home)) {
				if (homePage) {
					if (homePage !== home) {
						oldHome = homePage;
						homePage = home;
						if (kernel.location.id === oldHome) {
							hashchange();
							return true;
						}
					}
				} else {
					homePage = home;
					if ('onhashchange' in self) {
						$(self).on('hashchange', hashchange);
					} else {
						setInterval(function () {
							if (oldHash !== location.hash) {
								oldHash = location.hash;
								hashchange();
							}
						}, 10);
						oldHash = location.hash;
					}
					hashchange();
					if (kernel.location.args.hasOwnProperty('autopopup')) {
						if (kernel.location.args.hasOwnProperty('autopopuparg')) {
							tmp = kernel.location.args.autopopuparg.parseJsex();
							if (tmp) {
								tmp = tmp.value
							}
						}
						kernel.openPopup(kernel.location.args.autopopup, tmp);
					}
				}
			}
		};
		kernel.reloadPage = function (id, silent) {
			var thislocation;
			// 是否有数据正在加载
			if (kernel.isLoading()) {
				thislocation = kernel.location;
				// 注册监听 ; loaded
				kernel.listeners.add(kernel.dialogEvents, 'loaded', listener);
			} else {
				reloadPage(id, silent);
			}

			function listener(evt) {
				kernel.listeners.remove(this, evt.type, listener);
				// url 是否改变
				if (thislocation === kernel.location) {
					reloadPage(id, silent);
				}
			}
		};
		kernel.destroyPage = function (id) {
			if (pages[id].status === 2) {
				destroy(pages[id], 'page', id);
				return true;
			}
		};
		kernel.pageEvents = {};

		function reloadPage(id, silent) {
			if (!id || id === currentpage || (dataType(id) === 'Array' && id.indexOf(currentpage) >= 0)) {
				if (!silent) {
					clearWindow();
				}
				if (typeof pages[currentpage].onload === 'function') {
					pages[currentpage].onload(true);
				}
			}
		}

		function hashchange() {
			var historyNav = history.state,
				nl = kernel.parseHash(location.hash);
			history.replaceState && history.replaceState(true, null);
			if (!kernel.location || !kernel.isSameLocation(kernel.location, nl)) {
				kernel.lastLocation = kernel.location;
				kernel.location = nl;
				if (kernel.lastLocation) {
					clearWindow();
				}
				if (typeof kernel.pageEvents.onroute === 'function') {
					kernel.pageEvents.onroute({
						type: 'route',
						history: historyNav
					});
				}
				initLoad('page', pages[nl.id], nl.id, function (firstLoad) {
					var force, tmp;
					//发生页面跳转或首次加载
					if (nl.id !== currentpage) {
						force = firstLoad || !historyNav;
						if (currentpage) {
							if (typeof pages[currentpage].onunload === 'function') {
								pages[currentpage].onunload();
							}
							pages[currentpage].status--;
							sel('page', currentpage).css('display', '');
							if (pages[currentpage].autoDestroy) {
								destroy(pages[currentpage], 'popup', activePopup);
							}
						}
						document.body.className = currentpage = nl.id;
						sel('page', nl.id).css('display', 'block');
						pages[nl.id].status++;
						if (typeof pages[nl.id].onload === 'function') {
							pages[nl.id].onload(force);
						}
					} else {
						if (typeof pages[nl.id].onload === 'function') {
							//未发生页面跳转但url有变化时允许页面缓存
							pages[nl.id].onload();
						}
					}
					if (typeof kernel.pageEvents.onrouteend === 'function') {
						kernel.pageEvents.onrouteend({
							type: 'routeend',
							history: historyNav,
							force: force
						});
					}
				});
			}
		}
	}();
	return kernel;

	function destroy(cfg, type, id) {
		var o = sel(type, id),
			n = type + '/' + id + '/';
		if (o.length) {
			if (typeof cfg.ondestroy === 'function') {
				cfg.ondestroy();
			}
			o.remove();
			if (cfg.js) {
				n += cfg.js;
				if (require.defined(n)) {
					o = require(n);
					require.undef(n);
					if (o) {
						for (n in o) {
							delete cfg[n];
						}
					}
				}
			}
		}
		if (cfg.css && cfg.css.href) {
			kernel.removeCss(cfg.css);
			cfg.css = true;
		}
		delete cfg.status;
	}

	function sel(type, id) {
		var result = '#' + type;
		if (type === 'popup') {
			result += '>div>div';
		} else if (type === 'panel') {
			result += '>.contents>div';
		}
		if (id) {
			result += '>.' + id;
		}
		return $(result);
	}

	function initLoad(type, oldcfg, id, callback) {
		var url, ctn, n, m, isPage;
		if (oldcfg.status > 1) {
			callback();
		} else if (!oldcfg.status) {
			oldcfg.status = 1;
			ctn = sel(type)[0];
			n = type + '/' + id + '/';
			m = require.toUrl(n);
			isPage = type === 'page';
			if (oldcfg.css) {
				oldcfg.css = kernel.appendCss(m + id);
			}
			if (oldcfg.html) {
				url = m + id + '.html';
				$.ajax({
					url: url,
					type: 'get',
					dataType: 'text',
					success: function (text) {
						ctn.insertAdjacentHTML('afterBegin', '<div class="' + id + '">' + text + '</div>');
						loadJs();
					},
					error: function (xhr) {
						destroy(oldcfg, type, id);
						if (VERSION === 'dev' || xhr.status !== 404) {
							errorOccurs(url, xhr.status);
						} else {
							updated();
						}
					},
					complete: kernel.hideLoading
				});
				kernel.showLoading();
			} else {
				ctn.insertAdjacentHTML('afterBegin', '<div class="' + id + '"></div>');
				loadJs();
			}
		}

		function loadJs() {
			var js;
			if (oldcfg.js) {
				kernel.showLoading();
				js = n + id;
				require([js], function (cfg) {
					if (cfg) {
						Object.assign(oldcfg, cfg);
					}
					oldcfg.status++;
					callback(true);
					kernel.hideLoading();
				}, VERSION === 'dev' ? undefined : function (error) {
					destroy(oldcfg, type, id);
					if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
						errorOccurs(js, error.message);
					} else {
						updated();
					}
					kernel.hideLoading();
				});
			} else {
				oldcfg.status++;
				callback(true);
			}
		}

		function errorOccurs(res, msg) {
			kernel.alert(lang.error.replace('${res}', res) + msg, isPage ? function () {
				history.back();
			} : undefined);
		}

		function updated() {
			if (isPage) {
				location.reload();
			} else {
				kernel.confirm(lang.update, function (sure) {
					if (sure) {
						location.reload();
					}
				});
			}
		}
	}

	function clearWindow() {
		kernel.closePanel();
		kernel.closePopup();
		kernel.hideReadable();
	}
});