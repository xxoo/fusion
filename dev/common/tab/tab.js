'use strict';
define(['common/kernel/kernel', './lang'], function (kernel, lang) {
	var tabMenu = $('<div><a class="reload" href="javascript:;">' + lang.reload + '</a><a class="closeOther" href="javascript:;">' + lang.closeOther + '</a><a class="closeLeft" href="javascript:;">' + lang.closeLeft + '</a><a class="closeRight" href="javascript:;">' + lang.closeRight + '</a></div>'),
		tabProto = {
			open: function (o) {
				var i, found, reload;
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
			add: function (o) {
				var i, tab, url,
					m = 'tab-' + this.name + '/' + o.id + '/',
					self = this;
				if (o.id in this.cfg) {
					if (!o.args) {
						o.args = {};
					}
					setDefault(o.args, this.cfg[o.id].args);
					tab = {
						head: $('<span class="' + o.id + '"><span title="' + this.cfg[o.id].title + '">' + this.cfg[o.id].title + '</span><a href="javascript:;"></a></span>'),
						body: $('<div class="' + o.id + '"></div>'),
						args: o.args,
						parent: this,
						setTitle: setTitle
					};
					this.inv && this.tabs.length ? this.tabs[this.tabs.length - 1].head.before(tab.head) : this.tabCtn.append(tab.head);
					this.tabContent.append(tab.body);
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
								url = require.toUrl(m + this.cfg[o.id].html);
								$.ajax({
									url: url,
									type: 'get',
									dataType: 'text',
									success: function (text) {
										delete self.cfg[o.id].html;
										self.cfg[o.id].htmlContent = text;
										loadJs();
									},
									error: function (xhr, msg) {
										self.cfg[o.id].status = 0;
										self.cfg[o.id].oncomplete({
											type: 'complete'
										});
										if (VERSION == 'dev' || xhr.status !== 404) {
											errorOccurs(url, xhr.status);
										} else {
											updated();
										}
									},
									complete: kernel.hideLoading
								});
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
					var js;
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
						}, VERSION == 'dev' ? undefined : function (error) {
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
						tab.body.html(self.cfg[o.id].htmlContent);
					}
					Object.assign(tab, self.cfg[o.id].proto);
				}
			},
			show: function (i) {
				var firstload;
				if (i >= 0 && i < this.list.length) {
					if (typeof this.active === 'number' && this.active !== i) {
						if (typeof this.tabs[this.active].onhide === 'function') {
							this.tabs[this.active].onhide();
						}
						this.tabCtn.find('>span.active').removeClass('active');
						this.tabContent.find('>div.active').removeClass('active');
					}
					this.tabs[i].body.addClass('active');
					this.tabs[i].head.addClass('active');
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
			close: function (i) {
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
			clear: function () {
				var i;
				if (this.tabs.length) {
					for (i = 0; i < this.list.length; i++) {
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
			closeOther: function (j) {
				var i;
				if (j > 0 && j < this.tabs.length - 1) {
					for (i = 0; i < this.list.length; i++) {
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
			closeLeft: function (j) {
				var i = 0;
				if (j > 0 && j < this.tabs.length) {
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
			closeRight: function (j) {
				var i = j + 1,
					k = i;
				if (j >= 0 && j < this.tabs.length - 1) {
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
			reload: function () {
				if (typeof this.active === 'number' && typeof this.tabs[this.active].onload === 'function') {
					this.tabs[this.active].onload();
				}
			},
			save: function () {
				localStorage.setItem('tab-' + this.name, JSON.stringify({
					active: this.active,
					list: this.list
				}));
			}
		};
	kernel.appendCss(require.toUrl('common/tab/tab.less'));

	return function (name, cfg, tabCtn, tabContent, inv) {
		var i, tmp, r = Object.create(tabProto);
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
		tabCtn.on('click', '>span>span', function () {
			var i = getIdx(r, this.parentNode);
			if (r.active !== i) {
				r.show(i);
			}
		}).on('click', '>span>a', function () {
			r.close(getIdx(r, this.parentNode));
		}).on('contextmenu', '>span', function () {
			if (tabMenu.parent()[0] !== this) {
				$(this).append(tabMenu);
				$(document).one('click', removeMenu);
			}
			return false;
		}).on('click', '>span>div>a', function () {
			r[this.className](getIdx(r, this.parentNode.parentNode));
		});
		tabContent.on('click', '.closepage', function () {
			r.close(getIdx(r, tabCtn.find('span.active')[0]));
		});
		try {
			tmp = JSON.parse(localStorage.getItem('tab-' + name));
		} catch (e) {}
		if ($.type(tmp) === 'object' && typeof tmp.active === 'number' && $.type(tmp.list) === 'array') {
			for (i = 0; i < tmp.list.length; i++) {
				r.add(tmp.list[i]);
			}
			r.show(tmp.active);
		}
		return r;
	};

	function getIdx(r, o) {
		var i;
		for (i = 0; i < r.tabs.length; i++) {
			if (o === r.tabs[i].head[0]) {
				return i;
			}
		}
	}

	function setTitle(title) {
		this.head.find('>span').prop('title', title).text(title);
	}

	function removeMenu() {
		tabMenu.remove();
	}

	function setDefault(a, b) {
		var n;
		if (b) {
			for (n in b) {
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
});