'use strict';
define(['common/kernel/kernel', './lang'], function (kernel, lang) {
	let tabMenu = document.createElement('div');
	tabMenu.innerHTML = '<a class="reload" href="javascript:;">' + lang.reload + '</a><a class="closeOther" href="javascript:;">' + lang.closeOther + '</a><a class="closeLeft" href="javascript:;">' + lang.closeLeft + '</a><a class="closeRight" href="javascript:;">' + lang.closeRight + '</a>';
	let tabProto = {
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
						if (kernel.isSameLocation(o, this.list[i])) {
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
			let i, tab,
				m = 'tab-' + this.name + '/' + o.id + '/',
				self = this;
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
					this.cfg[o.id].css = kernel.appendCss(require.toUrl(m + this.cfg[o.id].css));
				}
				if (this.cfg[o.id].status === 2) {
					initTab();
				} else {
					kernel.listeners.add(this.cfg[o.id], 'complete', oncomplete);
					if (this.cfg[o.id].status !== 1) {
						this.cfg[o.id].status = 1;
						if ('html' in this.cfg[o.id]) {
							let url = require.toUrl(m + this.cfg[o.id].html);
							fetch(url).then(res => {
								if (res.ok) {
									return res.text().then(html => {
										delete self.cfg[o.id].html;
										self.cfg[o.id].htmlContent = html;
										loadJs();
									});
								} else {
									self.cfg[o.id].status = 0;
									self.cfg[o.id].oncomplete({
										type: 'complete'
									});
									if (BUILD && res.status === 404) {
										updated();
									} else {
										errorOccurs(url, res.status);
									}
								}
							}, err => errorOccurs(url, err.message)).then(kernel.hideLoading);
							kernel.showLoading();
						} else {
							loadJs();
						}
					}
				}
				this.save();
				if (typeof this.onchange === 'function') {
					this.onchange({
						type: 'change'
					});
				}
				return i;
			}

			function oncomplete(evt) {
				kernel.listeners.remove(self.cfg[o.id], 'complete', oncomplete);
				i = self.tabs.indexOf(tab);
				if (self.cfg[o.id].status === 2) {
					initTab();
					if (i >= 0 && (self.active === undefined || self.active === i)) {
						self.show(i);
					}
				} else {
					if (i >= 0) {
						self.close(i);
					}
				}
			}

			function loadJs() {
				let js;
				if ('js' in self.cfg[o.id]) {
					kernel.showLoading();
					js = m + self.cfg[o.id].js;
					require([js], function (proto) {
						delete self.cfg[o.id].js;
						self.cfg[o.id].proto = proto;
						self.cfg[o.id].status = 2;
						self.cfg[o.id].oncomplete({
							type: 'complete'
						});
						kernel.hideLoading();
					}, BUILD && function (error) {
						require.undef(js);
						self.cfg[o.id].status = 0;
						self.cfg[o.id].oncomplete({
							type: 'complete'
						});
						if ((error.requireType && error.requireType !== 'scripterror' && error.requireType !== 'nodefine') || (error.xhr && error.xhr.status !== 404)) {
							errorOccurs(js, error.message);
						} else {
							updated();
						}
						kernel.hideLoading();
					});
				} else {
					self.cfg.status = 2;
					self.cfg[o.id].oncomplete({
						type: 'complete'
					});
				}
			}

			function initTab() {
				if (self.cfg[o.id].htmlContent) {
					tab.body.innerHTML = self.cfg[o.id].htmlContent;
				}
				Object.assign(tab, self.cfg[o.id].proto);
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
				if (typeof this.onchange === 'function') {
					this.onchange({
						type: 'change'
					});
				}
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
				if (typeof this.onchange === 'function') {
					this.onchange({
						type: 'change'
					});
				}
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
				if (typeof this.onchange === 'function') {
					this.onchange({
						type: 'change'
					});
				}
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
				if (typeof this.onchange === 'function') {
					this.onchange({
						type: 'change'
					});
				}
			}
		},
		closeRight(j) {
			if (j >= 0 && j < this.tabs.length - 1) {
				let i = j + 1,
					k = i;
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
				if (typeof this.onchange === 'function') {
					this.onchange({
						type: 'change'
					});
				}
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
	kernel.appendCss(require.toUrl('common/tab/tab.less'));

	return function (name, cfg, tabCtn, tabContent, inv) {
		let r = Object.create(tabProto);
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
				let i = getIdx(r, o.parentNode);
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
		let o = this.head.querySelector(':scope>span');
		o.title = o.textContent = title;
	}

	function removeMenu() {
		document.removeEventListener('click', removeMenu);
		tabMenu.remove();
	}

	function setDefault(a, b) {
		if (b) {
			for (let n in b) {
				if (!(n in a)) {
					a[n] = b[n];
				}
			}
		}
	}

	function errorOccurs(res, msg) {
		kernel.alert(lang.error.replace('${res}', res) + msg);
	}

	function updated() {
		kernel.confirm(lang.update, function (sure) {
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