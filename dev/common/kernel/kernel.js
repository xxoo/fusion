// kernel
'use strict';
define(['common/slider/slider', 'site/pages/pages', 'site/popups/popups', 'site/panels/panels', './lang'], function (slider, pages, popups, panels, lang) {
	let homePage,
		kernel = {
			appendCss: function (url, forcecss) { //自动根据当前环境添加css或less
				let csslnk = document.createElement('link');
				if (self.less && !forcecss) {
					csslnk.rel = 'stylesheet/less';
					csslnk.href = url + '.less';
					less.sheets.push(csslnk);
					less.refresh();
				} else {
					csslnk.rel = 'stylesheet';
					csslnk.href = url + '.css';
				}
				return document.head.appendChild(csslnk);
			},
			removeCss: function (lnk) {
				lnk.remove();
				if (lnk.rel === 'stylesheet/less') {
					less.sheets.splice(less.sheets.indexOf(lnk), 1);
					less.refresh();
				}
			},
			buildHash: function (loc) {
				let hash = '#!' + encodeURIComponent(loc.id);
				for (let n in loc.args) {
					hash += loc.args[n] === undefined ? '&' + encodeURIComponent(n) : '&' + encodeURIComponent(n) + '=' + encodeURIComponent(loc.args[n]);
				}
				return hash;
			},
			parseHash: function (hash) {
				let nl = {
					id: homePage,
					args: {}
				};
				hash = hash.substr(1).replace(/[#?].*$/, '');
				let s = hash.match(/[^=&]+(=[^&]*)?/g);
				if (s && s[0].charAt(0) === '!') {
					let a = decodeURIComponent(s[0].substr(1));
					if (pages.hasOwnProperty(a)) {
						nl.id = a;
					}
					for (let i = 1; i < s.length; i++) {
						a = s[i].match(/^([^=]+)(=)?(.+)?$/);
						if (a) {
							nl.args[decodeURIComponent(a[1])] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
						}
					}
				}
				return nl;
			},
			isSameLocation: function (loc1, loc2) {
				if (loc1.id === loc2.id && Object.keys(loc1.args).length === Object.keys(loc2.args).length) {
					for (let n in loc1.args) {
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
				if (navigator.languages) {
					for (let i = 0; i < navigator.languages.length; i++) {
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
		let key = typeof Symbol === 'function' ? Symbol('xEvents') : 'xEvents';
		kernel.listeners = {
			add: function (o, e, f) {
				let result = 0;
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
				let result;
				if (e) {
					result = o.hasOwnProperty(key) && o[key].hasOwnProperty(e) ? o[key][e].heap.slice(0) : [];
				} else {
					result = {};
					if (o.hasOwnProperty(key)) {
						for (let i in o[key]) {
							result[i] = o[key][i].heap.slice(0);
						}
					}
				}
				return result;
			},
			remove: function (o, e, f) {
				let result = 0;
				if (o.hasOwnProperty(key)) {
					if (e) {
						if (o[key].hasOwnProperty(e)) {
							if (o[key][e].locked) {
								o[key][e].stack.push(f);
								result = 2;
							} else if (typeof f === 'function') {
								let i = o[key][e].heap.indexOf(f);
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
						for (let i in o[key]) {
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
			this[key][evt.type].locked = true;
			for (let i = 0; i < this[key][evt.type].heap.length; i++) {
				this[key][evt.type].heap[i].call(this, evt);
			}
			this[key][evt.type].locked = false;
			while (this[key][evt.type].stack.length) {
				if (this[key][evt.type].stack[0]) {
					if (typeof this[key][evt.type].stack[0] === 'function') {
						let i = this[key][evt.type].heap.indexOf(this[key][evt.type].stack[0]);
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
		let activePanel, ani, todo,
			panelCtn = document.querySelector('#panel'),
			ctn = panelCtn.querySelector(':scope>.contents>div');
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
			let result = 0;
			if (panels[id].status > 1) {
				if (ani) {
					todo = kernel.showPanel.bind(this, id);
					result = 2;
				} else if (!activePanel) {
					panels[id].status++;
					if (typeof panels[id].onload === 'function') {
						panels[id].onload();
					}
					panelCtn.className = activePanel = id;
					panelCtn.style.display = ctn.querySelector(':scope>div.' + id).style.display = 'block';
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
			let result = 0;
			if (ani) {
				todo = kernel.closePanel.bind(this, id);
				result = 2;
			} else if (activePanel && (!id || activePanel === id || (Array.isArray(id) && id.indexOf(activePanel) >= 0)) && hidePanel()) {
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
		ctn.querySelector(':scope>a.close').addEventListener('click', todo);
		panelCtn.querySelector(':scope>.mask').addEventListener('click', todo);
		todo = undefined;

		function startAni(cb, show) {
			let a, b;
			ani = true;
			if (show) {
				a = 0;
				b = '-100%';
				ctn.style.marginLeft = b;
			} else {
				a = '-100%';
				b = 0;
				ctn.style.marginLeft = '';
			}
			ctn.animate([{
				marginLeft: a
			}, {
				marginLeft: b
			}], {
				duration: 200,
				easing: 'ease-in-out'
			}).onfinish = function () {
				this.onfinish = null;
				ani = false;
				cb();
				if (typeof todo === 'function') {
					let tmp = todo;
					todo = undefined;
					tmp();
				}
			};
		}

		function hidePanel() {
			if (typeof panels[activePanel].onunload !== 'function' || !panels[activePanel].onunload()) {
				panels[activePanel].status--;
				startAni(function () {
					if (typeof panels[activePanel].onunloadend === 'function') {
						panels[activePanel].onunloadend();
					}
					panels[activePanel].status--;
					ctn.querySelector(':scope>div.' + activePanel).style.display = panelCtn.style.display = '';
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
		let activePopup,
			popup = document.getElementById('popup'),
			ctn = popup.querySelector(':scope>div');
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
			let result;
			if (popups[id].status > 1) {
				if (!activePopup) {
					ctn.querySelector(':scope>div.' + id).style.display = popup.style.display = 'block';
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
					ctn.querySelector(':scope>div.' + activePopup).style.display = '';
					if (popups[activePopup].autoDestroy) {
						destroy(popups[activePopup], 'popup', activePopup);
					}
					ctn.querySelector(':scope>div.' + id).style.display = 'block';
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
			let close;
			if (activePopup && (!id || activePopup === id || (Array.isArray(id) && id.indexOf(activePopup) >= 0)) && (typeof popups[activePopup].onunload !== 'function' || !popups[activePopup].onunload())) {
				popups[activePopup].status--;
				close = activePopup;
				ctn.querySelector(':scope>div.' + activePopup).style.display = popup.style.display = popup.className = activePopup = '';
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
		popup.querySelector(':scope>div>a').addEventListener('click', kernel.closePopup.bind(kernel, undefined));
	}();
	//图片展示
	! function () {
		let ctn = document.querySelector('#photoview'),
			close = ctn.querySelector('a.close'),
			prev = ctn.querySelector('a.prev'),
			next = ctn.querySelector('a.next'),
			rp = ctn.querySelector('a.rotate.p'),
			rn = ctn.querySelector('a.rotate.n'),
			sld = slider(ctn.querySelector(':scope>div')),
			siz = [],
			deg = [],
			w, h;
		kernel.showPhotoView = function (contents, idx) {
			if (Array.isArray(contents)) {
				for (let i = 0; i < contents.length; i++) {
					let img = document.createElement('img');
					img.src = contents[i];
					sld.add(img);
					getsz(i);
				}
				if (idx >= 0 && idx < sld.children.length) {
					sld.slideTo(idx, true);
				}
				if (sld.children.length > 1) {
					prev.style.display = next.style.display = 'block';
				} else {
					prev.style.display = next.style.display = '';
				}
			}
		};
		kernel.hidePhotoView = function () {
			siz = [];
			while (sld.children.length) {
				sld.remove(0);
			}
		};
		ctn.addEventListener('click', function (evt) {
			if (evt.target.nodeName === 'IMG') {
				if (evt.target.style.cursor === 'zoom-in') {
					let d = deg[sld.current] % 2;
					if (d) {
						evt.target.style.top = siz[sld.current].w > h ? (siz[sld.current].w - siz[sld.current].h) / 2 + 'px' : (h - siz[sld.current].h) / 2 + 'px';
						evt.target.style.left = siz[sld.current].h > w ? (siz[sld.current].h - siz[sld.current].w) / 2 + 'px' : (w - siz[sld.current].w) / 2 + 'px';
					} else {
						evt.target.style.top = siz[sld.current].h > h ? 0 : (h - siz[sld.current].h) / 2 + 'px';
						evt.target.style.left = siz[sld.current].w > w ? 0 : (w - siz[sld.current].w) / 2 + 'px';
					}
					evt.target.style.width = siz[sld.current].w + 'px';
					evt.target.style.height = siz[sld.current].h + 'px';
					evt.target.style.cursor = 'zoom-out';
				} else if (evt.target.style.cursor === 'zoom-out') {
					chksz(sld.current);
				}
			}
		});
		self.addEventListener('resize', rsz);
		prev.addEventListener('click', function () {
			sld.slideTo(sld.current - 1);
		});
		next.addEventListener('click', function () {
			sld.slideTo(sld.current + 1);
		});
		rp.addEventListener('click', function () {
			if (typeof deg[sld.current] === 'number') {
				deg[sld.current]++;
				chksz(sld.current);
			}
		});
		rn.addEventListener('click', function () {
			if (typeof deg[sld.current] === 'number') {
				deg[sld.current]--;
				chksz(sld.current);
			}
		});
		close.addEventListener('click', kernel.hidePhotoView);
		sld.onchange = function () {
			if (this.current === undefined) {
				ctn.style.display = '';
			} else {
				if (siz[this.current]) {
					chksz(this.current);
				}
				ctn.style.display = 'block';
			}
		};
		if ('transform' in document.documentElement.style) {
			rp.style.display = 'block';
			rn.style.display = 'block';
		}
		rsz();

		function rsz() {
			w = self.innerWidth;
			h = self.innerHeight;
			if (typeof sld.current === 'number' && siz[sld.current]) {
				chksz(sld.current);
			}
		}

		function getsz(i) {
			sld.children[i].addEventListener('load', load);

			function load() {
				this.removeEventListener('load', load);
				siz[i] = {
					w: this.width,
					h: this.height
				};
				deg[i] = 0;
				if (sld.current === i) {
					chksz(i);
				}
				this.style.visibility = 'visible';
			}
		}

		function chksz(i) {
			let r, cw, ch, dw, dh,
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
				sld.children[i].style.cursor = 'zoom-in';
			} else {
				dw = siz[i].w;
				dh = siz[i].h;
				sld.children[i].style.cursor = '';
			}
			sld.children[i].style.top = (h - dh) / 2 + 'px';
			sld.children[i].style.left = (w - dw) / 2 + 'px';
			sld.children[i].style.width = dw + 'px';
			sld.children[i].style.height = dh + 'px';
			sld.children[i].style.transform = 'rotate(' + 90 * deg[i] + 'deg)';
		}
	}();
	//对话框及提示功能
	! function () {
		let hintmo,
			loadingRT = 0,
			hint = document.querySelector('#hint'),
			readable = document.querySelector('#readable'),
			dlgCtn = document.querySelector('#dialog'),
			loading = document.querySelector('#loading'),
			dlgStack = [],
			dlgCb, raCb; //callbacks
		kernel.showLoading = function (text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
			loading.querySelector(':scope>div>div').textContent = text ? text : lang.loading;
			if (loadingRT === 0) {
				loading.style.display = 'block';
			}
			loadingRT += 1;
		};
		kernel.hideLoading = function () { //不要使用hideDialog来关闭loading提示框
			if (loadingRT > 0) {
				loadingRT -= 1;
				if (loadingRT === 0) {
					loading.style.display = '';
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
			hint.className = className || '';
			hint.querySelector('span').textContent = text;
			if (hintmo) {
				clearTimeout(hintmo);
			} else {
				hint.style.opacity = 1;
				hint.animate([{
					opacity: 0
				}, {
					opacity: 1
				}], {
					duration: 400,
					easing: 'ease-in-out'
				});
			}
			if (!t) {
				t = className === 'error' ? 4000 : className === 'warning' ? 3000 : 2000;
			}
			hintmo = setTimeout(function () {
				hintmo = 0;
				hint.style.opacity = '';
				hint.animate([{
					opacity: 1
				}, {
					opacity: 0
				}], {
					duration: 400,
					easing: 'ease-in-out'
				});
			}, t);
		};
		kernel.showReadable = function (html, width, height, callback, className) {
			let o = readable.querySelector(':scope>div');
			readable.className = className || '';
			readable.style.display = 'block';
			o.style.width = width;
			o.style.height = height;
			o = o.querySelector(':scope>div');
			if (typeof html === 'string') {
				o.innerHTML = html;
			} else {
				o.appendChild(html);
			}
			raCb = callback;
		};
		kernel.hideReadable = function () {
			if (typeof raCb === 'function') {
				raCb();
				raCb = undefined;
			}
			readable.style.display = '';
			readable.querySelector(':scope>div>div').innerHTML = '';
		};
		kernel.hideDialog = function (param) {
			let f;
			if (typeof dlgCb === 'function') {
				f = dlgCb;
				dlgCb = undefined;
				f(dlgCtn.className === 'isConfirm' ? param : undefined);
			}
			dlgCtn.className = '';
			if (dlgStack.length) {
				f = dlgStack.shift();
				kernel[f.shift()].apply(kernel, f);
			}
		};
		kernel.showForeign = function (url, width, height, callback) {
			kernel.showReadable('<iframe frameborder="no" allowtransparency="yes" marginwidth="0" marginheight="0" src="' + url + '"></iframe>', width, height, callback, 'foreign');
		};
		kernel.confirm = function (text, callback, width) {
			let ctn, txt, yes, no;
			if (dlgCtn.className) {
				dlgStack.push(['confirm', text, callback, width]);
			} else {
				ctn = dlgCtn.querySelector(':scope>div');
				txt = ctn.querySelector(':scope>div>div');
				yes = ctn.querySelector(':scope>a.yes');
				no = ctn.querySelector(':scope>a.no');
				dlgCb = callback;
				ctn.style.width = width || '400px';
				if (Array.isArray(text)) {
					txt.textContent = text[0];
					yes.textContent = text[1];
					no.textContent = text[2];
				} else {
					txt.textContent = text;
					yes.textContent = lang.yes;
					no.textContent = lang.no;
				}
				dlgCtn.className = 'isConfirm';
				ctn.style.height = txt.offsetHeight + Math.max(yes.offsetHeight, no.offsetHeight) + 76 + 'px';
			}
		};
		kernel.alert = function (text, callback, width) {
			let ctn, txt;
			if (dlgCtn.className) {
				dlgStack.push(['alert', text, callback, width]);
			} else {
				ctn = dlgCtn.querySelector(':scope>div');
				txt = ctn.querySelector(':scope>div>div');
				dlgCb = callback;
				ctn.style.width = width || '400px';
				txt.textContent = text;
				dlgCtn.className = 'isAlert';
				ctn.style.height = txt.offsetHeight + 46 + 'px';
			}
		};
		readable.querySelector(':scope>div>a').addEventListener('click', kernel.hideReadable);
		dlgCtn.querySelector(':scope>div>a.close').addEventListener('click', kernel.hideDialog);
		dlgCtn.querySelector(':scope>div>a.yes').addEventListener('click', kernel.hideDialog.bind(kernel, true));
		dlgCtn.querySelector(':scope>div>a.no').addEventListener('click', kernel.hideDialog.bind(kernel, false));
		//目前只有loaded事件
		kernel.dialogEvents = {};
	}();
	//页面加载相关功能
	! function () {
		let currentpage;
		//初始化并启动路由或者修改默认页
		//当调用此方法后引起路由变化则会返回true
		kernel.init = function (home) {
			let oldHash, oldHome, tmp;
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
						self.addEventListener('hashchange', hashchange);
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
								tmp = tmp.value;
							}
						}
						kernel.openPopup(kernel.location.args.autopopup, tmp);
					}
				}
			}
		};
		kernel.reloadPage = function (id, silent) {
			let thislocation;
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
			if (!id || id === currentpage || (Array.isArray(id) && id.indexOf(currentpage) >= 0)) {
				if (!silent) {
					clearWindow();
				}
				if (typeof pages[currentpage].onload === 'function') {
					pages[currentpage].onload(true);
				}
			}
		}

		function hashchange() {
			let historyNav = history.state,
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
					let force;
					//发生页面跳转或首次加载
					if (nl.id !== currentpage) {
						force = firstLoad || !historyNav;
						if (currentpage) {
							if (typeof pages[currentpage].onunload === 'function') {
								pages[currentpage].onunload();
							}
							pages[currentpage].status--;
							sel('page', currentpage).style.display = '';
							if (pages[currentpage].autoDestroy) {
								destroy(pages[currentpage], 'popup', activePopup);
							}
						}
						document.body.className = currentpage = nl.id;
						sel('page', nl.id).style.display = 'block';
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
		let n, o = sel(type, id);
		if (o) {
			if (typeof cfg.ondestroy === 'function') {
				cfg.ondestroy();
			}
			o.remove();
			if (cfg.js) {
				n = type + '/' + id + '/' + id;
				if (require.defined(n)) {
					o = require(n);
					require.undef(n);
					if (o) {
						if (self.Reflect) {
							Reflect.setPrototypeOf(cfg, Object.prototype);
						} else {
							cfg.__proto__ = Object.prototype;
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
		let result = '#' + type;
		if (type === 'popup') {
			result += '>div';
		} else if (type === 'panel') {
			result += '>.contents>div';
		}
		if (id) {
			result += '>div.' + id;
		}
		return document.querySelector(result);
	}

	function initLoad(type, oldcfg, id, callback) {
		let n, isPage;
		if (oldcfg.status > 1) {
			callback();
		} else if (!oldcfg.status) {
			oldcfg.status = 1;
			isPage = type === 'page';
			n = type + '/' + id + '/';
			let m = require.toUrl(n);
			if (oldcfg.css) {
				oldcfg.css = kernel.appendCss(m + id);
			}
			if (oldcfg.html) {
				let url = m + id + '.html';
				fetch(url).then(res => {
					if (res.ok) {
						return res.text().then(loadJs);
					} else {
						destroy(oldcfg, type, id);
						if (BUILD && res.status === 404) {
							updated();
						} else {
							errorOccurs(url, res.status);
						}
					}
				}, err => errorOccurs(url, err.message)).then(kernel.hideLoading);
				kernel.showLoading();
			} else {
				loadJs('');
			}
		}

		function loadJs(html) {
			let js,
				ctn = sel(type);
			ctn.insertAdjacentHTML('afterBegin', '<div class="' + id + '">' + html + '</div>');
			if (oldcfg.js) {
				ctn.firstChild.style.visibility = 'hidden';
				kernel.showLoading();
				kernel.listeners.add(kernel.dialogEvents, 'loaded', loaded);
				js = n + id;
				require([js], function (cfg) {
					if (cfg) {
						if (self.Reflect) {
							Reflect.setPrototypeOf(oldcfg, cfg);
						} else {
							oldcfg.__proto__ = cfg;
						}
					}
					oldcfg.status++;
					callback(true);
					kernel.hideLoading();
				}, BUILD && function (error) {
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

			function loaded(evt) {
				kernel.listeners.remove(this, evt.type, loaded);
				ctn.querySelector(':scope>div.' + id).style.visibility = '';
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