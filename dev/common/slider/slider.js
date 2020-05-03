/* slider 0.1
 * requires jquery
 * usage:
 * let Slider = require('path/to/slider');
 * let slider = [new] Silder(container, contents, idx, nav);
 * slider.add(content);
 * slider.onchange = function(){
 *   let current = this.current;
 *   ...
 * };
 */

'use strict';
define(function () {
	let Slider = function (container, contents, idx, nav) {
		let i, navItem, that, delay;
		if (this instanceof Slider) {
			that = this;
			this.pushStack = []; //for adding elements while sliding
			this.removeStack = []; //for removing elements while sliding
			this.container = container;
			this.nav = nav;
			container.addEventListener('mouseover', function () {
				delay = that.delay;
				that.stopPlay();
			});
			container.addEventListener('mouseout', function () {
				that.startPlay(delay);
				delay = undefined;
			});
			if (nav) {
				nav.style.display = 'none';
				nav.addEventListener('click', function (evt) {
					if (evt.target.nodeName === 'A') {
						if (!evt.target.classList.contains('current')) {
							let a = this.querySelectorAll(':scope>a');
							for (let i = 0; i < a.length; i++) {
								if (a[i] === evt.target) {
									that.slideTo(i);
									break;
								}
							}
						}
					}
				});
			}
			if (Array.isArray(contents) && contents.length > 0) {
				this.children = contents;
				if (typeof idx === 'number' && idx >= 0 && idx < contents.length) {
					this.current = idx;
				} else {
					this.current = 0;
				}
				for (i = 0; i < contents.length; i++) {
					container.appendChild(contents[i]);
					if (nav) {
						nav.insertAdjacentHTML('<a href="javascript:;"></a>');
						navItem = nav.lastChild;
					}
					if (i !== this.current) {
						contents[i].style.display = 'none';
					} else {
						if (navItem) {
							navItem.classList.add('current');
						}
					}
				}
				if (nav && contents.length > 1) {
					nav.style.display = '';
				}
			} else {
				this.current = undefined;
				this.children = [];
			}
		} else {
			return new Slider(container, contents, idx, nav);
		}
	};
	Slider.prototype.add = function (o) {
		let result, navItem;
		if (this.sliding) { //will push to children when sliding ends
			this.pushStack.push(o);
		} else {
			result = this.children.length;
			this.container.appendChild(o);
			this.children.push(o);
			if (this.nav) {
				this.nav.insertAdjacentHTML('<a href="javascript:;"></a>');
				navItem = this.nav.lastChild;
			}
			if (result === 0) {
				this.current = 0;
				this.nav && navItem.classList.add('current');
				fireEvent(this, 'change');
			} else {
				o.style.display = 'none';
				if (this.nav) {
					this.nav.style.display = '';
				}
			}
		}
		return result;
	};
	Slider.prototype.remove = function (i) {
		let result;
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
				this.nav.querySelectorAll(':scope>a')[i].remove();
			}
			if (this.current === i || this.current === this.children.length) {
				if (this.children.length > 0) {
					this.current = getPos(i, this.children.length);
					this.children[this.current].style.display = '';
					this.nav && this.nav.querySelectorAll(':scope>a')[this.current].classList.add('current');
				} else {
					this.current = undefined;
				}
				fireEvent(this, 'change');
			}
			if (this.children.length === 1 && this.nav) {
				this.nav.style.display = 'none';
			}
		}
		return result;
	};
	Slider.prototype.slideTo = function (i, silent) {
		let result, that = this;
		if (!this.sliding && this.children.length > 1) {
			i = getPos(i, this.children.length);
			if (i !== this.current) {
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = undefined;
				}
				if (silent) {
					this.children[i].style.display = '';
					this.children[this.current].style.display = 'none';
					restartTimer(this);
				} else {
					this.sliding = true;
					this.children[this.current].animate([{
						opacity: 1
					}, {
						opacity: 0
					}], {
						duration: 400,
						easing: 'ease-in-out'
					}).onfinish = function () {
						this.onfinish = null;
						this.effect.target.style.display = 'none';
						that.children[that.current].style.display = '';
						that.children[that.current].animate([{
							opacity: 0
						}, {
							opacity: 1
						}], {
							duration: 400,
							easing: 'ease-in-out'
						}).onfinish = function () {
							this.onfinish = null;
							that.sliding = false;
							restartTimer(that);
						};
					};
				}
				if (this.nav) {
					let a = this.nav.querySelectorAll(':scope>a');
					a[this.current].classList.remove('current');
					a[i].classList.add('current');
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
	Slider.prototype.startPlay = function (delay) {
		this.stopPlay();
		this.delay = delay;
		restartTimer(this);
	};
	Slider.prototype.stopPlay = function () {
		let result;
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
	return Slider;

	function getPos(c, t) {
		let s = c % t;
		if (s < 0) {
			s += t;
		}
		return s;
	}

	function fireEvent(obj, name) {
		let funcName = 'on' + name;
		if (typeof obj[funcName] === 'function') {
			obj[funcName]({
				type: name
			});
		}
	}

	function restartTimer(obj) {
		if (obj.delay) {
			obj.timer = setTimeout(function () {
				delete obj.timer;
				obj.slideTo(obj.current + 1);
			}, obj.delay);
		}
	}
});