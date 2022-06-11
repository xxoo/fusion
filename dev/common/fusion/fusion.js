// fusion
'use strict';
define(['common/slider/slider', 'common/svgicos/svgicos', 'site/pages/pages', 'site/popups/popups', 'site/panels/panels', './lang'], function (slider, svgicos, pages, popups, panels, lang) {
	let homePage,
		fusion = {
			__proto__: null,
			appendCss(url, forcecss) { //自动根据当前环境添加css或less
				const csslnk = document.createElement('link');
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
			removeCss(lnk) {
				lnk.remove();
				if (lnk.rel === 'stylesheet/less') {
					less.sheets.splice(less.sheets.indexOf(lnk), 1);
					less.refresh();
				}
			},
			// 创建 svg dom;
			makeSvg(name, type) {
				const svgns = 'http://www.w3.org/2000/svg',
					svg = document.createElementNS(svgns, 'svg');
				svg.appendChild(document.createElementNS(svgns, 'path'));
				if (name) {
					fusion.setSvgPath(svg, name, type);
				}
				return svg;
			},
			// 设置svg 内容
			setSvgPath(svg, name, type) {
				if (name in svgicos) {
					name = svgicos[name];
				}
				svg.firstChild.setAttribute('d', name);
				let box;
				if (type == 3) {
					box = {
						x: 0,
						y: 0,
						width: 24,
						height: 24
					};
				} else {
					const tmp = fusion.makeSvg();
					tmp.style.position = 'absolute';
					tmp.style.bottom = tmp.style.right = '100%';
					tmp.firstChild.setAttribute('d', name);
					document.body.appendChild(tmp);
					box = tmp.firstChild.getBBox();
					tmp.remove();
					if (type == 2) {
						box.width += box.x * 2;
						box.x = 0;
						box.height += box.y * 2;
						box.y = 0;
					} else if (type) {
						if (box.width > box.height) {
							box.y -= (box.width - box.height) / 2;
							box.height = box.width;
						} else {
							box.x -= (box.height - box.width) / 2;
							box.width = box.height;
						}
					}
				}
				svg.setAttribute('viewBox', box.x + ' ' + box.y + ' ' + box.width + ' ' + box.height);
			},
			encodeArg: (s, isName) => s.replace(isName ? /[^!$\x26-\x2e\x30-\x3b\x3f-\x5f\x61-\x7e]+/g : /[^!$=\x26-\x2e\x30-\x3b\x3f-\x5f\x61-\x7e]+/g, encodeURIComponent),
			buildHash(loc) {
				let hash = '#/' + fusion.encodeArg(loc.id, true);
				for (let n in loc.args) {
					hash += '/' + fusion.encodeArg(n, true);
					if (loc.args[n] !== undefined) {
						hash += '=' + fusion.encodeArg(loc.args[n]);
					}
				}
				return hash;
			},
			parseHash(hash) {
				const nl = {
					__proto__: null,
					id: homePage,
					args: { __proto__: null }
				};
				const s = hash.substring(1).match(/[^=/]+(=[^/]*)?/g);
				if (s) {
					let a = decodeURIComponent(s[0], true);
					if (a in pages) {
						nl.id = a;
					}
					for (let i = 1; i < s.length; i++) {
						a = s[i].match(/^([^=]+)(=)?(.+)?$/);
						if (a) {
							nl.args[decodeURIComponent(a[1], true)] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
						}
					}
				}
				return nl;
			},
			isSameLocation(loc1, loc2) {
				if (loc1.id === loc2.id && Object.keys(loc1.args).length === Object.keys(loc2.args).length) {
					for (const n in loc1.args) {
						if (n in loc2.args) {
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
			replaceLocation(loc) {
				if (fusion.location && fusion.isSameLocation(loc, fusion.location)) {
					fusion.reloadPage();
				} else {
					location.replace(fusion.buildHash(loc));
				}
			},
			getLang(langs) {
				if (navigator.languages) {
					for (let i = 0; i < navigator.languages.length; i++) {
						if (navigator.languages[i] in langs) {
							return langs[navigator.languages[i]];
						}
					}
				} else if (navigator.language in langs) {
					return langs[navigator.language];
				}
				return langs.en;
			}
		};
	lang = fusion.getLang(lang);
	//事件处理
	(() => {
		const key = typeof Symbol === 'function' ? Symbol('xEvents') : 'xEvents';
		fusion.listeners = {
			on(o, e, f) {
				let result = 0;
				if (typeof f === 'function') {
					if (!Object.hasOwn(o, key)) {
						o[key] = { __proto__: null };
					}
					if (!(e in o[key])) {
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
			once(o, e, f) {
				fusion.listeners.on(o, e, function ff(evt) {
					fusion.listeners.remove(o, e, ff);
					f.call(o, evt);
				});
			},
			list(o, e) {
				let result;
				if (e) {
					result = Object.hasOwn(o, key) && e in o[key] ? o[key][e].heap.slice(0) : [];
				} else {
					result = { __proto__: null };
					if (Object.hasOwn(o, key)) {
						for (let i in o[key]) {
							result[i] = o[key][i].heap.slice(0);
						}
					}
				}
				return result;
			},
			off(o, e, f) {
				let result = 0;
				if (Object.hasOwn(o, key)) {
					if (e) {
						if (e in o[key]) {
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
						for (const i in o[key]) {
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
			},
			trigger(o, e, d = { __proto__: null }) {
				const s = 'on' + e;
				if (typeof o[s] === 'function') {
					d.type = e;
					o[s](d);
				}
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
						const i = this[key][evt.type].heap.indexOf(this[key][evt.type].stack[0]);
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
	})();

	//panel
	(() => {
		let activePanel, ani, todo;
		const panelCtn = document.querySelector('#panel'),
			ctn = panelCtn.querySelector(':scope>.contents>div'),
			close = ctn.querySelector(':scope>a.close');
		fusion.openPanel = function (id, param) {
			if (id in panels) {
				initLoad('panel', panels[id], id, function () {
					if (typeof panels[id].open === 'function') {
						panels[id].open(param);
					} else {
						fusion.showPanel(id);
					}
				});
				return true;
			}
		};
		fusion.showPanel = function (id) {
			let result = 0;
			if (panels[id].status > 1) {
				if (ani) {
					todo = fusion.showPanel.bind(this, id);
					result = 2;
				} else if (!activePanel) {
					panels[id].status++;
					if (typeof panels[id].onload === 'function') {
						panels[id].onload();
					}
					panelCtn.className = activePanel = id;
					panelCtn.style.display = 'block';
					ctn.querySelector(':scope>div.' + id).style.display = '';
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
					todo = fusion.showPanel.bind(this, id);
					result = 1;
				}
			}
			return result;
		};
		fusion.closePanel = function (id) {
			let result = 0;
			if (ani) {
				todo = this.closePanel.bind(this, id);
				result = 2;
			} else if (activePanel && (!id || activePanel === id || (Array.isArray(id) && id.indexOf(activePanel) >= 0)) && hidePanel()) {
				result = 1;
			}
			return result;
		};
		// 获取当前显示的 panel id
		fusion.getCurrentPanel = function () {
			return activePanel;
		};
		fusion.destroyPanel = function (id) {
			if (panels[id].status === 2) {
				destroy(panels[id], 'panel', id);
				return true;
			}
		};
		close.appendChild(fusion.makeSvg('mdiWindowClose'), 1);
		close.onclick = panelCtn.querySelector(':scope>.mask').onclick = fusion.closePanel.bind(fusion, undefined);

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
					ctn.querySelector(':scope>div.' + activePanel).style.display = 'none';
					panelCtn.style.display = '';
					if (panels[activePanel].autoDestroy) {
						destroy(panels[activePanel], 'panel', activePanel);
					}
					activePanel = undefined;
				}, false);
				return true;
			}
		}
	})();

	//弹出窗口
	(() => {
		let activePopup;
		const popup = document.getElementById('popup'),
			ctn = popup.querySelector(':scope>div'),
			close = popup.querySelector(':scope>div>a.close');
		fusion.openPopup = function (id, param) {
			if (id in popups) {
				initLoad('popup', popups[id], id, function () {
					if (typeof popups[id].open === 'function') {
						popups[id].open(param);
					} else {
						fusion.showPopup(id);
					}
				});
				return true;
			}
		};
		fusion.showPopup = function (id) {
			let result;
			if (popups[id].status > 1) {
				if (!activePopup) {
					ctn.querySelector(':scope>div.' + id).style.display = '';
					popup.style.display = 'flex';
					popup.className = activePopup = id;
					fusion.listeners.trigger(fusion.popupEvents, 'show', { id: activePopup });
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
					ctn.querySelector(':scope>div.' + activePopup).style.display = 'none';
					if (popups[activePopup].autoDestroy) {
						destroy(popups[activePopup], 'popup', activePopup);
					}
					ctn.querySelector(':scope>div.' + id).style.display = '';
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
		fusion.closePopup = function (id) {
			let close;
			if (activePopup && (!id || activePopup === id || (Array.isArray(id) && id.indexOf(activePopup) >= 0)) && (typeof popups[activePopup].onunload !== 'function' || !popups[activePopup].onunload())) {
				popups[activePopup].status--;
				close = activePopup;
				ctn.querySelector(':scope>div.' + activePopup).style.display = 'none';
				popup.style.display = popup.className = '';
				if (popups[close].autoDestroy) {
					destroy(popups[close], 'popup', activePopup);
				}
				activePopup = '';
				fusion.listeners.trigger(fusion.popupEvents, 'hide', { id: close });
				return true;
			}
		};
		// 获取当前显示的 popup id
		fusion.getCurrentPopup = function () {
			return activePopup;
		};
		fusion.destroyPopup = function (id) {
			if (popups[id].status === 2) {
				destroy(popups[id], 'popup', id);
				return true;
			}
		};
		fusion.popupEvents = { __proto__: null };
		close.appendChild(fusion.makeSvg('mdiWindowClose', 3));
		close.onclick = fusion.closePopup.bind(fusion, undefined);
	})();
	//图片展示
	(() => {
		const ctn = document.querySelector('#photoview'),
			close = ctn.querySelector('a.close'),
			btns = ctn.querySelector('.btns'),
			btnCtn = btns.querySelector('div'),
			prev = btnCtn.querySelector('a.prev'),
			next = btnCtn.querySelector('a.next'),
			flip = btnCtn.querySelector('a.flip'),
			rotate = btnCtn.querySelector('a.rotate'),
			imgs = ctn.querySelector('.imgs'),
			sld = slider(imgs),
			siz = [],
			deg = [],
			scl = [];
		let w, h, tmo;
		fusion.showPhotoView = function (contents, idx, acts, cb) {
			if (Array.isArray(contents)) {
				for (let i = 0; i < contents.length; i++) {
					const img = new Image();
					img.src = contents[i];
					sld.add(img);
					getsz(i);
				}
				if (idx >= 0 && idx < sld.children.length) {
					sld.slideTo(idx, true);
				}
				prev.style.display = next.style.display = sld.children.length > 1 ? '' : 'none';
				if (Array.isArray(acts)) {
					for (let i = 0; i < acts.length; i++) {
						const a = document.createElement(a);
						if (typeof acts[i] === 'string') {
							a.innerHTML = acts[i];
						} else if (acts[i] instanceof Node) {
							a.replaceChildren(acts[i]);
						} else if (acts[i] && typeof acts[i][Symbol.iterator] === 'function') {
							a.replaceChildren(...acts[i]);
						}
						if (typeof cb === 'function') {
							a.onclick = () => cb(i, sld.current);
						}
						next.insertAdjacentElement('beforebegin', a);
					}
				}
			}
		};
		fusion.hidePhotoView = function () {
			siz.splice(0);
			scl.splice(0);
			while (sld.children.length) {
				sld.remove(0);
			}
		};
		imgs.onclick = function (evt) {
			if (evt.target.nodeName === 'IMG') {
				if (evt.target.style.cursor === 'zoom-in') {
					//let d = deg[sld.current] % 2;
					if (deg[sld.current] % 2) {
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
		};
		ctn.onmousemove = function (evt) {
			ctn.classList.add('act');
			if (tmo) {
				clearTimeout(tmo);
				tmo = undefined;
			}
			if (evt.target.nodeName !== 'A') {
				tmo = setTimeout(hideBtns, 2000);
			}
		};
		self.addEventListener('resize', rsz);
		prev.onclick = function () {
			sld.slideTo(sld.current - 1);
		};
		next.onclick = function () {
			sld.slideTo(sld.current + 1);
		};
		flip.onclick = function () {
			if (deg[sld.current] % 2) {
				scl[sld.current][1] *= -1;
			} else {
				scl[sld.current][0] *= -1;
			}
			chksz(sld.current);
		};
		rotate.onclick = function () {
			if (typeof deg[sld.current] === 'number') {
				deg[sld.current]++;
				chksz(sld.current);
			}
		};
		close.onclick = fusion.hidePhotoView;
		sld.onchange = function () {
			if (this.current === undefined) {
				ctn.style.display = '';
			} else {
				if (siz[this.current]) {
					chksz(this.current);
				}
				ctn.style.display = 'flex';
			}
		};
		prev.appendChild(fusion.makeSvg('mdiChevronLeft', 1));
		next.appendChild(fusion.makeSvg('mdiChevronRight', 1));
		flip.appendChild(fusion.makeSvg('mdiFlipHorizontal', 1));
		rotate.appendChild(fusion.makeSvg('mdiFileRotateRightOutline', 1));
		close.appendChild(fusion.makeSvg('mdiCloseThick', 1));
		rsz();
		function hideBtns() {
			tmo = undefined;
			ctn.classList.remove('act');
		}
		function rsz() {
			w = self.innerWidth;
			h = self.innerHeight;
			if (typeof sld.current === 'number' && siz[sld.current]) {
				chksz(sld.current);
			}
		}

		function getsz(i) {
			sld.children[i].onload = function () {
				this.onload = null;
				siz[i] = {
					w: this.width,
					h: this.height
				};
				deg[i] = 0;
				scl[i] = [1, 1];
				if (sld.current === i) {
					chksz(i);
				}
				this.style.visibility = 'visible';
			};
		}

		function chksz(i) {
			let r, cw, ch, dw, dh;
			const d = deg[i] % 2;
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
			sld.children[i].style.transform = 'rotate(' + 90 * deg[i] + 'deg) scale(' + scl[i][0] + ',' + scl[i][1] + ')';
		}
	})();
	//对话框及提示功能
	(() => {
		const hint = document.querySelector('#hint'),
			readable = document.querySelector('#readable'),
			dlgCtn = document.querySelector('#dialog'),
			loading = document.querySelector('#loading'),
			txt = dlgCtn.querySelector(':scope>div>.content'),
			yes = dlgCtn.querySelector(':scope>div>.btns>a.yes'),
			no = dlgCtn.querySelector(':scope>div>.btns>a.no'),
			dlgClose = dlgCtn.querySelector(':scope>div>.close'),
			dlgStack = [];
		let hintmo,
			dlgId = 0,
			loadingRT = 0,
			onClose, raCb; //callbacks
		fusion.showLoading = function (text) { //loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
			loading.querySelector(':scope>div').lastChild.data = text ? text : lang.loading;
			if (loadingRT === 0) {
				loading.style.display = 'flex';
			}
			loadingRT += 1;
		};
		fusion.hideLoading = function () { //不要使用hideDialog来关闭loading提示框
			if (loadingRT > 0) {
				loadingRT -= 1;
				if (loadingRT === 0) {
					loading.style.display = '';
					fusion.listeners.trigger(fusion.dialogEvents, 'loaded');
				}
			}
		};
		fusion.isLoading = () => loadingRT > 0;
		fusion.hint = function (text, className, t) {
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
		fusion.showReadable = function (html, width, height, callback, className) {
			let o = readable.querySelector(':scope>div');
			readable.className = className || '';
			readable.style.display = 'flex';
			o.style.width = width;
			o.style.height = height;
			o = o.querySelector(':scope>div');
			if (typeof html === 'string') {
				o.innerHTML = html;
			} else if (html instanceof Node) {
				o.replaceChildren(html);
			} else if (html && typeof html[Symbol.iterator] === 'function') {
				o.replaceChildren(...html);
			} else {
				o.innerHTML = '';
			}
			raCb = callback;
		};
		fusion.hideReadable = function () {
			if (typeof raCb === 'function') {
				raCb();
				raCb = undefined;
			}
			readable.style.display = '';
			readable.querySelector(':scope>div>div').innerHTML = '';
		};
		fusion.closeDialog = function (param, id) {
			const t = typeof id === 'number';
			if (!t || id === dlgId) {
				if (typeof onClose === 'function') {
					onClose(param, id);
					onClose = undefined;
				}
				dlgCtn.className = dlgCtn.style.display = '';
				let g;
				while (dlgStack.length && !g) {
					g = dlgStack.shift();
					if (g) {
						openDialog.apply(undefined, g);
					} else {
						++dlgId;
					}
				}
			} else if (t && t > dlgId && id <= dlgId + dlgStack.length) {
				dlgStack[id - dlgId - 1] = undefined;
			}
		};
		fusion.showForeign = (url, width, height, callback) => fusion.showReadable('<iframe frameborder="no" allowtransparency="yes" marginwidth="0" marginheight="0" src="' + url + '"></iframe>', width, height, callback, 'foreign');
		fusion.confirm = (text, onclose, onopen) => openDialog('confirm', text, onclose, onopen);
		fusion.alert = (text, onclose, onopen) => openDialog('alert', text, onclose, onopen);
		fusion.htmlDialog = (html, className, onclose, onopen) => openDialog(className || '', html, onclose, onopen);
		dlgClose.appendChild(fusion.makeSvg('mdiWindowClose', 2));
		readable.querySelector(':scope>div>a').onclick = fusion.hideReadable;
		yes.onclick = fusion.closeDialog.bind(fusion, true);
		no.onclick = dlgClose.onclick = fusion.closeDialog.bind(fusion, false);
		//目前只有loaded事件
		fusion.dialogEvents = { __proto__: null };

		function openDialog(type, content, onclose, onopen) {
			if (dlgCtn.className) {
				dlgStack.push([type, content, onclose, onopen]);
				return dlgId + dlgStack.length;
			} else {
				if (type === 'alert') {
					if (Array.isArray(content)) {
						txt.textContent = content[0];
						no.textContent = content[1];
					} else {
						txt.textContent = content;
						no.textContent = lang.close;
					}
				} else if (type === 'confirm') {
					if (Array.isArray(content)) {
						txt.textContent = content[0];
						yes.textContent = content[1];
						no.textContent = content[2];
					} else {
						txt.textContent = content;
						yes.textContent = lang.yes;
						no.textContent = lang.no;
					}
				} else if (typeof content === 'string') {
					txt.innerHTML = content;
				} else if (content instanceof Node) {
					txt.replaceChildren(content);
				} else if (content && typeof content[Symbol.iterator] === 'function') {
					txt.replaceChildren(...content);
				} else {
					txt.innerHTML = '';
				}
				dlgCtn.className = 'type';
				dlgCtn.style.display = 'flex';
				++dlgId;
				onClose = onclose;
				if (typeof onopen === 'function') {
					onopen(dlgId);
				}
				return dlgId;
			}
		}
	})();
	//页面加载相关功能
	(() => {
		let currentpage;
		//初始化并启动路由或者修改默认页
		//当调用此方法后引起路由变化则会返回true
		fusion.init = function (home) {
			let oldHome, tmp;
			if (home in pages) {
				if (homePage) {
					if (homePage !== home) {
						oldHome = homePage;
						homePage = home;
						if (fusion.location.id === oldHome) {
							hashchange();
							return true;
						}
					}
				} else {
					homePage = home;
					self.addEventListener('hashchange', hashchange);
					hashchange();
					if ('autoPopup' in fusion.location.args) {
						if ('autoPopupArg' in fusion.location.args) {
							tmp = fusion.location.args.autoPopupArg.parseJsex();
							if (tmp) {
								tmp = tmp.value;
							}
						}
						fusion.openPopup(fusion.location.args.autoPopup, tmp);
					}
				}
			}
		};
		fusion.reloadPage = function (id, silent) {
			let thislocation;
			// 是否有数据正在加载
			if (fusion.isLoading()) {
				thislocation = fusion.location;
				// 注册监听 ; loaded
				fusion.listeners.on(fusion.dialogEvents, 'loaded', listener);
			} else {
				reloadPage(id, silent);
			}

			function listener(evt) {
				fusion.listeners.off(this, evt.type, listener);
				// url 是否改变
				if (thislocation === fusion.location) {
					reloadPage(id, silent);
				}
			}
		};
		fusion.destroyPage = function (id) {
			if (pages[id].status === 2) {
				destroy(pages[id], 'page', id);
				return true;
			}
		};
		fusion.pageEvents = { __proto__: null };

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
			const historyNav = history.state,
				nl = fusion.parseHash(location.hash);
			history.replaceState && history.replaceState(true, null);
			if (!fusion.location || !fusion.isSameLocation(fusion.location, nl)) {
				fusion.lastLocation = fusion.location;
				fusion.location = nl;
				if (fusion.lastLocation) {
					clearWindow();
				}
				fusion.listeners.trigger(fusion.pageEvents, 'route', { history: historyNav });
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
							sel('page', currentpage).style.display = 'none';
							if (pages[currentpage].autoDestroy) {
								destroy(pages[currentpage], 'popup', activePopup);
							}
						}
						document.body.className = currentpage = nl.id;
						sel('page', nl.id).style.display = '';
						pages[nl.id].status++;
						if (typeof pages[nl.id].onload === 'function') {
							pages[nl.id].onload(force);
						}
					} else if (typeof pages[nl.id].onload === 'function') {
						//未发生页面跳转但url有变化时允许页面缓存
						pages[nl.id].onload();
					}
					fusion.listeners.trigger(fusion.pageEvents, 'routeend', {
						history: historyNav,
						force: force
					});
				});
			}
		}
	})();
	(() => {
		const tips = document.querySelector('#tips'),
			list = { __proto__: null };
		let id = 0;
		fusion.showTip = function (content, options = {}) {
			const tipId = id++,
				dom = document.createElement('div'),
				close = () => {
					tmo && clearTimeout(tmo);
					delete list[tipId];
					dom.style.transitionProperty = 'margin-left';
					dom.style.marginLeft = dom.offsetWidth + 20 + 'px';
					dom.ontransitionend = step2;
				};
			let tmo;
			list[tipId] = close;
			if (typeof options.className === 'string') {
				dom.className = options.className;
			}
			if (options.showClose) {
				dom.insertAdjacentHTML('beforeend', '<a class="close">✕</a>');
				dom.firstChild.onclick = close;
			}
			if (typeof content === 'string') {
				dom.insertAdjacentHTML('beforeend', content);
			} else {
				dom.appendChild(content);
			}
			if (typeof options.timeout === 'number') {
				dom.onmouseover = () => tmo = clearTimeout(tmo);
				dom.onmouseout = () => tmo = setTimeout(close, options.timeout);
				dom.onmouseout();
			}
			tips.appendChild(dom);
			dom.style.marginBottom = -dom.offsetHeight + 'px';
			dom.offsetHeight;
			dom.ontransitionend = cleanup;
			dom.style.transitionProperty = 'margin-bottom';
			dom.style.marginBottom = '10px';
			return close;
		};
		fusion.clearTips = function () {
			for (const n in list) {
				list[n]();
			}
		};
		function step2() {
			this.style.visibility = 'hidden';
			this.style.transitionProperty = 'margin-bottom';
			this.style.marginBottom = -this.offsetHeight + 'px';
			this.ontransitionend = () => this.remove();
		}
		function cleanup() {
			this.style.transitionProperty = this.style.marginBottom = '';
			this.ontransitionend = null;
		}
	})();
	return fusion;

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
			fusion.removeCss(cfg.css);
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
				oldcfg.css = fusion.appendCss(m + id);
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
				}, err => errorOccurs(url, err.message)).then(fusion.hideLoading);
				fusion.showLoading();
			} else {
				loadJs('');
			}
		}

		function loadJs(html) {
			let js;
			const ctn = sel(type);
			ctn.insertAdjacentHTML('afterBegin', '<div class="' + id + '" style="display:none">' + html + '</div>');
			if (oldcfg.js) {
				ctn.firstChild.style.visibility = 'hidden';
				fusion.showLoading();
				fusion.listeners.on(fusion.dialogEvents, 'loaded', loaded);
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
					fusion.hideLoading();
				}, BUILD && function (error) {
					destroy(oldcfg, type, id);
					if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
						errorOccurs(js, error.message);
					} else {
						updated();
					}
					fusion.hideLoading();
				});
			} else {
				oldcfg.status++;
				callback(true);
			}

			function loaded(evt) {
				fusion.listeners.off(this, evt.type, loaded);
				ctn.querySelector(':scope>div.' + id).style.visibility = '';
			}
		}

		function errorOccurs(res, msg) {
			fusion.alert(lang.error.replace('${res}', res) + msg, isPage ? function () {
				history.back();
			} : undefined);
		}

		function updated() {
			if (isPage) {
				location.reload();
			} else {
				fusion.confirm(lang.update, function (sure) {
					if (sure) {
						location.reload();
					}
				});
			}
		}
	}

	function clearWindow() {
		fusion.closePanel();
		fusion.closePopup();
		fusion.hideReadable();
	}
});