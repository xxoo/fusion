/* slider 0.1
 * requires jquery
 * usage:
 * var slider = require('path/to/slider');
 * var slider = [new] silder($container, contents, idx, $nav);
 * slider.add($content);
 * slider.onchange = function(){
 *   var current = slider.current;
 *   ...
 * };
 */

'use strict';
define(function(pointerevents) {
	var slider = function(container, contents, idx, nav) {
		var i, navItem, self, delay;
		if (this instanceof slider) {
			self = this;
			this.pushStack = []; //for adding elements while sliding
			this.removeStack = []; //for removing elements while sliding
			this.container = container;
			this.nav = nav;
			container.on('mouseover', function(evt) {
				delay = self.delay;
				self.stopPlay();
			});
			container.on('mouseout', function(evt) {
				self.startPlay(delay);
				delay = undefined;
			});
			if (nav) {
				nav.css('display', 'none');
				nav.on('click', '>a', function() {
					var i, a;
					if (!$(this).hasClass('current')) {
						a = nav.find('>a');
						for (i = 0; i < a.length; i++) {
							if (a[i] === this) {
								self.slideTo(i);
								break;
							}
						}
					}
				});
			}
			if (contents instanceof Array && contents.length > 0) {
				this.children = contents;
				if (typeof idx === 'number' && idx >= 0 && idx < contents.length) {
					this.current = idx;
				} else {
					this.current = 0;
				}
				for (i = 0; i < contents.length; i++) {
					container.append(contents[i]);
					if (nav) {
						navItem = $('<a href="javascript:;"></a>');
						nav.append(navItem);
					}
					if (i !== this.current) {
						contents[i].css('display', 'none');
					} else {
						if (navItem) {
							navItem.addClass('current');
						}
					}
				}
				if (nav && contents.length > 1) {
					nav.css('display', '');
				}
			} else {
				this.current = undefined;
				this.children = [];
			}
		} else {
			return new slider(container, contents, idx, nav);
		}
	};
	slider.prototype.add = function(o) {
		var result, navItem;
		if (this.sliding) { //will push to children when sliding ends
			this.pushStack.push(o);
		} else {
			result = this.children.length;
			this.container.append(o);
			this.children.push(o);
			if (this.nav) {
				navItem = $('<a href="javascript:;"></a>');
				this.nav.append(navItem);
			}
			if (result === 0) {
				this.current = 0;
				this.nav && navItem.addClass('current');
				fireEvent(this, 'change');
			} else {
				o.css('display', 'none');
				this.nav && this.nav.css('display', '');
			}
		}
		return result;
	};
	slider.prototype.remove = function(i) {
		var result, a;
		if (this.sliding) {
			this.removeStack.push(typeof i === 'number' ? this.children[i] : i);
		} else if (this.children.length > 0) {
			if (typeof i !== 'number') {
				i = this.children.indexOf(i);
			}
			i = getPos(i, this.children.length);
			result = this.children.splice(i, 1)[0];
			result.remove();
			if (this.nav) {
				a = this.nav.find('>a').eq(i).remove();
			}
			if (this.current === i || this.current === this.children.length) {
				if (this.children.length > 0) {
					this.current = getPos(i, this.children.length);
					this.children[this.current].css('display', '');
					this.nav && this.nav.find('>a').eq(this.current).addClass('current');
				} else {
					this.current = undefined;
				}
				fireEvent(this, 'change');
			}
			if (this.children.length === 1) {
				this.nav && this.nav.css('display', 'none');
			}
		}
		return result;
	};
	slider.prototype.slideTo = function(i, silent) {
		var result, a, self = this;
		if (!this.sliding && this.children.length > 1) {
			i = getPos(i, this.children.length);
			if (i !== this.current) {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = undefined;
				}
				if (silent) {
					this.children[this.current].css('display', 'none');
					this.children[i].css('display', '');
					restartTimer(this);
				} else {
					this.sliding = true;
					this.children[this.current].fadeOut(function() {
						self.children[self.current].fadeIn(function() {
							self.sliding = false;
							restartTimer(self);
						});
					});
				}
				if (this.nav) {
					a = this.nav.find('>a');
					$(a[this.current]).removeClass('current');
					$(a[i]).addClass('current');
				}
				this.current = i;
				fireEvent(this, 'change');
				result = true;
			} else {
				result = false;
			}
		} else {
			result = false;
		}
		return result;
	};
	slider.prototype.startPlay = function(delay) {
		this.stopPlay();
		this.delay = delay;
		restartTimer(this);
	};
	slider.prototype.stopPlay = function() {
		var result;
		if (this.delay) {
			delete this.delay;
			if (this.timer) {
				clearTimeout(this.timer);
				delete this.timer;
			}
			result = true;
		} else {
			result = false;
		}
		return result;
	};
	return slider;

	function getPos(c, t) {
		var s = c % t;
		if (s < 0) {
			s += t;
		}
		return s;
	}

	function fireEvent(obj, name) {
		var funcName = 'on' + name;
		if (typeof obj[funcName] === 'function') {
			obj[funcName]({
				type: name
			});
		}
	}

	function restartTimer(obj) {
		if (obj.delay) {
			obj.timer = setTimeout(function() {
				delete obj.timer;
				obj.slideTo(obj.current + 1);
			}, obj.delay);
		}
	}
});