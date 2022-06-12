'use strict';
define(['common/fusion/fusion', './lang'], function (fusion, lang) {
	const tabMenu = document.createElement('div'),
		tabProto = {
			open(o) {
				let i, found, reload;
				if (o.id in this.cfg) {
					if (!o.args) {
						for (i = 0; i < this.list.length; i++) {
							if (this.list[i].id === o.id) {
								found = true;
								break;
							}
						}
					} else {
						setDefault(o.args, this.cfg[o.id].args);
						for (i = 0; i < this.list.length; i++) {
							if (fusion.isSameLocation(o, this.list[i])) {
								found = true;
								break;
							}
						}
					}
					if (!found) {
						i = this.add(o);
					} else if (this.tabs[i].loaded) {
						reload = true;
					}
					this.show(i);
					if (reload) {
						this.reload();
					}
				}
				return i;
			},
			add(o) {
				let i, tab;
				const m = 'tab-' + this.name + '/' + o.id + '/',
					oncomplete = () => {
						fusion.listeners.off(this.cfg[o.id], 'complete', oncomplete);
						i = this.tabs.indexOf(tab);
						if (this.cfg[o.id].status === 2) {
							initTab();
							if (i >= 0 && (this.active === undefined || this.active === i)) {
								this.show(i);
							}
						} else {
							if (i >= 0) {
								this.close(i);
							}
						}
					},
					loadJs = () => {
						let js;
						if ('js' in this.cfg[o.id]) {
							fusion.showLoading();
							js = m + this.cfg[o.id].js;
							require([js], proto => {
								delete this.cfg[o.id].js;
								this.cfg[o.id].proto = proto;
								this.cfg[o.id].status = 2;
								fusion.listeners.trigger(this.cfg[o.id], 'complete');
								fusion.hideLoading();
							}, BUILD ? error => {
								require.undef(js);
								this.cfg[o.id].status = 0;
								this.cfg[o.id].oncomplete({
									type: 'complete'
								});
								if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
									errorOccurs(js, error.message);
								} else {
									updated();
								}
								fusion.hideLoading();
							} : undefined);
						} else {
							this.cfg.status = 2;
							fusion.listeners.trigger(this.cfg[o.id], 'complete');
						}
					},
					initTab = () => {
						if (this.cfg[o.id].htmlContent) {
							tab.body.innerHTML = this.cfg[o.id].htmlContent;
						}
						Object.assign(tab, this.cfg[o.id].proto);
					};
				if (o.id in this.cfg) {
					if (!o.args) {
						o.args = {};
					}
					setDefault(o.args, this.cfg[o.id].args);
					tab = {
						head: document.createElement('span'),
						body: document.createElement('div'),
						args: o.args,
						parent: this,
						setTitle: setTitle
					};
					tab.head.innerHTML = '<span title="' + this.cfg[o.id].title + '">' + this.cfg[o.id].title + '</span><a href="javascript:;"></a>';
					tab.body.className = tab.head.className = o.id;
					this.inv && this.tabs.length ? this.tabCtn.insertBefore(tab.head, this.tabs[this.tabs.length - 1].head) : this.tabCtn.appendChild(tab.head);
					this.tabContent.appendChild(tab.body);
					i = this.list.length;
					this.list.push(o);
					this.tabs.push(tab);
					if (typeof this.cfg[o.id].css === 'string') {
						this.cfg[o.id].css = fusion.appendCss(require.toUrl(m + this.cfg[o.id].css));
					}
					if (this.cfg[o.id].status === 2) {
						initTab();
					} else {
						fusion.listeners.on(this.cfg[o.id], 'complete', oncomplete);
						if (this.cfg[o.id].status !== 1) {
							this.cfg[o.id].status = 1;
							if ('html' in this.cfg[o.id]) {
								const url = require.toUrl(m + this.cfg[o.id].html);
								fetch(url).then(res => {
									if (res.ok) {
										return res.text().then(html => {
											delete this.cfg[o.id].html;
											this.cfg[o.id].htmlContent = html;
											loadJs();
										});
									} else {
										this.cfg[o.id].status = 0;
										this.cfg[o.id].oncomplete({
											type: 'complete'
										});
										if (BUILD && res.status === 404) {
											updated();
										} else {
											errorOccurs(url, res.status);
										}
									}
								}, err => errorOccurs(url, err.message)).then(fusion.hideLoading);
								fusion.showLoading();
							} else {
								loadJs();
							}
						}
					}
					this.save();
					fusion.listeners.trigger(this, 'change');
					return i;
				}
			},
			show(i) {
				let firstload;
				if (i >= 0 && i < this.list.length) {
					if (typeof this.active === 'number' && this.active !== i) {
						if (typeof this.tabs[this.active].onhide === 'function') {
							this.tabs[this.active].onhide();
						}
						this.tabCtn.querySelector(':scope>span.active').classList.remve('active');
						this.tabContent.querySelector(':scope>div.active').classList.remove('active');
					}
					this.tabs[i].body.classList.add('active');
					this.tabs[i].head.classList.add('active');
					if (this.cfg[this.list[i].id].status === 2) {
						if (!this.tabs[i].loaded) {
							firstload = true;
							if (typeof this.tabs[i].onload === 'function') {
								this.tabs[i].onload();
							}
							this.tabs[i].loaded = true;
						}
						if ((this.active !== i || firstload) && typeof this.tabs[i].onshow === 'function') {
							this.tabs[i].onshow();
						}
					}
					this.active = i;
					this.save();
				}
			},
			close(i) {
				if (i >= 0 && i < this.tabs.length) {
					if (this.active === i) {
						if (this.list.length > i + 1) {
							this.show(i + 1);
						} else if (this.list.length > 1) {
							this.show(i - 1);
						} else {
							if (typeof this.tabs[i].onhide === 'function') {
								this.tabs[i].onhide();
							}
							this.active = undefined;
						}
					}
					if (this.tabs[i].loaded && typeof this.tabs[i].onunload === 'function') {
						this.tabs[i].onunload();
					}
					this.tabs[i].head.remove();
					this.tabs[i].body.remove();
					this.tabs.splice(i, 1);
					this.list.splice(i, 1);
					if (this.active > i) {
						this.active--;
					}
					this.save();
					fusion.listeners.trigger(this, 'change');
				}
			},
			clear() {
				if (this.tabs.length) {
					for (let i = 0; i < this.list.length; i++) {
						if (i === this.active && typeof this.tabs[i].onhide === 'function') {
							this.tabs[i].onhide();
						}
						if (this.tabs[i].loaded && typeof this.tabs[i].onunload === 'function') {
							this.tabs[i].onunload();
						}
						this.tabs[i].head.remove();
						this.tabs[i].body.remove();
					}
					this.list = [];
					this.tabs = [];
					this.active = undefined;
					this.save();
					fusion.listeners.trigger(this, 'change');
				}
			},
			closeOther(j) {
				if (j > 0 && j < this.tabs.length - 1) {
					for (let i = 0; i < this.list.length; i++) {
						if (i !== j) {
							if (i === this.active && typeof this.tabs[i].onhide === 'function') {
								this.tabs[i].onhide();
							}
							if (this.tabs[i].loaded && typeof this.tabs[i].onunload === 'function') {
								this.tabs[i].onunload();
							}
							this.tabs[i].head.remove();
							this.tabs[i].body.remove();
						}
					}
					this.list = [this.list[j]];
					this.tabs = [this.tabs[j]];
					if (this.active === j) {
						this.active = 0;
						this.save();
					} else {
						this.active = undefined;
						this.show(0);
					}
					fusion.listeners.trigger(this, 'change');
				}
			},
			closeLeft(j) {
				if (j > 0 && j < this.tabs.length) {
					let i = 0;
					while (i < j) {
						if (i === this.active && typeof this.tabs[i].onhide === 'function') {
							this.tabs[i].onhide();
						}
						if (this.tabs[i].loaded && typeof this.tabs[i].onunload === 'function') {
							this.tabs[i].onunload();
						}
						this.tabs[i].head.remove();
						this.tabs[i].body.remove();
						i++;
					}
					this.list.splice(0, j);
					this.tabs.splice(0, j);
					if (this.active < j) {
						this.active = undefined;
						this.show(0);
					} else {
						this.active -= j;
						this.save();
					}
					fusion.listeners.trigger(this, 'change');
				}
			},
			closeRight(j) {
				if (j >= 0 && j < this.tabs.length - 1) {
					let i = j + 1;
					const k = i;
					while (i < this.tabs.length) {
						if (i === this.active && typeof this.tabs[i].onhide === 'function') {
							this.tabs[i].onhide();
						}
						if (this.tabs[i].loaded && typeof this.tabs[i].onunload === 'function') {
							this.tabs[i].onunload();
						}
						this.tabs[i].head.remove();
						this.tabs[i].body.remove();
						i++;
					}
					i = this.tabs.length - k;
					this.list.splice(k, i);
					this.tabs.splice(k, i);
					if (this.active > j) {
						this.active = undefined;
						this.show(j);
					} else {
						this.save();
					}
					fusion.listeners.trigger(this, 'change');
				}
			},
			reload() {
				if (typeof this.active === 'number' && typeof this.tabs[this.active].onload === 'function') {
					this.tabs[this.active].onload();
				}
			},
			save() {
				localStorage.setItem('tab-' + this.name, JSON.stringify({
					active: this.active,
					list: this.list
				}));
			}
		};
	tabMenu.innerHTML = '<a class="reload" href="javascript:;">' + lang.reload + '</a><a class="closeOther" href="javascript:;">' + lang.closeOther + '</a><a class="closeLeft" href="javascript:;">' + lang.closeLeft + '</a><a class="closeRight" href="javascript:;">' + lang.closeRight + '</a>';
	fusion.appendCss(require.toUrl('common/tab/tab.less'));

	return function (name, cfg, tabCtn, tabContent, inv) {
		const r = { __proto__: tabProto };
		r.list = [];
		r.tabs = [];
		r.name = name;
		r.cfg = cfg;
		r.tabCtn = tabCtn;
		r.tabContent = tabContent;
		r.inv = inv;
		if (inv) {
			tabCtn.addClass('inv');
		}
		tabCtn.addEventListener('click', function (evt) {
			let o;
			if (o = inpath(this.querySelector(':scope>span>span'), evt.target)) {
				const i = getIdx(r, o.parentNode);
				if (r.active !== i) {
					r.show(i);
				}
			} else if (o = inpath(this.querySelector(':scope>span>a'), evt.target)) {
				r.close(getIdx(r, o.parentNode));
			} else if (o = inpath(this.querySelector(':scope>span>div>a'), evt.target)) {
				r[this.className](getIdx(r, o.parentNode.parentNode));
			}
		});
		tabCtn.addEventListener('contextmenu', function (evt) {
			let o;
			evt.preventDefault();
			if (o = inpath(this.querySelectorAll(':scope>span'), evt.target)) {
				if (tabMenu.parentNode !== o) {
					o.appendChild(tabMenu);
					document.addEventListener('click', removeMenu);
				}
			}
		});
		tabContent.addEventListener('click', function (evt) {
			let o;
			if (o = inpath(this.querySelectorAll('.closepage'), evt.target)) {
				r.close(getIdx(r, tabCtn.querySelector('span.active')));
			}
		});
		let tmp = localStorage.getItem('tab-' + name);
		if (typeof tmp === 'string') {
			tmp = tmp.parseJsex();
			if (tmp && tmp.value && typeof tmp.value.active === 'number' && Array.isArray(tmp.value.list)) {
				for (let i = 0; i < tmp.value.list.length; i++) {
					r.add(tmp.value.list[i]);
				}
				r.show(tmp.value.active);
			}
		}
		return r;
	};

	function getIdx(r, o) {
		for (let i = 0; i < r.tabs.length; i++) {
			if (o === r.tabs[i].head[0]) {
				return i;
			}
		}
	}

	function setTitle(title) {
		const o = this.head.querySelector(':scope>span');
		o.title = o.textContent = title;
	}

	function removeMenu() {
		document.removeEventListener('click', removeMenu);
		tabMenu.remove();
	}

	function setDefault(a, b) {
		if (b) {
			for (const n in b) {
				if (!(n in a)) {
					a[n] = b[n];
				}
			}
		}
	}

	function errorOccurs(res, msg) {
		fusion.alert(lang.error.replace('${res}', res) + msg);
	}

	function updated() {
		fusion.confirm(lang.update, function (sure) {
			if (sure) {
				location.reload();
			}
		});
	}

	function inpath(a, b) {
		for (let i = 0; i < a.length; i++) {
			if (a[i].contains(b)) {
				return a[i];
			}
		}
	}
});