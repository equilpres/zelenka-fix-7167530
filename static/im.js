'use strict';

(self.webpackChunklzt = self.webpackChunklzt || []).push([
	[789],
	{
		80042: function (e, t, n) {
			n.d(t, {
				Z: function () {
					return f;
				},
			});
			var s;
			var a;
			var i = n(40633);
			var r = n(88218);
			var o = n(27681);
			var c = n(38715);
			var l = n(34878);
			var u = n(12271);
			var d = (function () {
				function e() {
					var t = this;
					(0, o._)(this, e);
					(0, l._)(this, 'worker', undefined);
					(0, l._)(this, 'clientId', 0);
					(0, l._)(this, 'initPromise', undefined);
					(0, l._)(this, 'initCallback', undefined);
					(0, l._)(this, 'handlers', Object.create(null));
					(0, l._)(this, 'channels', Object.create(null));
					(0, l._)(this, 'workerUpdateChannel', undefined);
					this.worker = new SharedWorker(`/js/lolzteam/ng/notify/worker.js?_v=${XenForo._jsVersion}&u=${u.NE.userId}`);
					this.workerUpdateChannel = new BroadcastChannel('update:' + XenForo._jsVersion);
					this.workerUpdateChannel.onmessage = this.updateWorker.bind(this);
					this.worker.onerror = function (e) {
						return console.warn('notify worker error', e);
					};
					this.worker.port.onmessage = this.onWorkerMessage.bind(this);
					this.worker.port.postMessage({
						method: 'init',
						data: [XenForo._jsVersion],
					});
					this.worker.port.start();
					this.initPromise = new Promise(function (e) {
						return (t.initCallback = e);
					});
				}
				(0, c._)(e, [
					{
						key: 'onWorkerMessage',
						value: function (t) {
							if (
								(t == null ? undefined : t.data?.method) &&
								Object.prototype.hasOwnProperty.call(e.prototype, t.data.method) &&
								typeof this[t.data.method] == 'function'
							) {
								this[t.data.method].apply(this, t.data.data);
							}
						},
					},
					{
						key: 'call',
						value: function (e) {
							for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), s = 1; s < t; s++) {
								n[s - 1] = arguments[s];
							}
							this.worker.port.postMessage({
								method: e,
								data: n,
							});
						},
					},
					{
						key: 'updateWorker',
						value: function (e) {
							if (e.data !== XenForo._jsVersion) {
								this.worker = new SharedWorker(
									`/js/lolzteam/ng/notify/worker.js?_v=${e.data}&u=${u.NE.userId}`,
								);
								this.worker.onerror = function (e) {
									return console.warn('notify worker error', e);
								};
								this.worker.port.onmessage = this.onWorkerMessage.bind(this);
								this.worker.port.postMessage({
									method: 'init',
									data: [],
								});
								this.worker.port.start();
								var t = true;
								var n = false;
								var s = undefined;
								try {
									for (
										var a, i = Object.keys(this.handlers)[Symbol.iterator]();
										!(t = (a = i.next()).done);
										t = true
									) {
										var r = a.value;
										this.call('subscribe', this.clientId, r);
									}
								} catch (e) {
									n = true;
									s = e;
								} finally {
									try {
										if (!t && i.return != null) {
											i.return();
										}
									} finally {
										if (n) {
											throw s;
										}
									}
								}
							}
						},
					},
					{
						key: 'emit',
						value: function (e, t) {
							if (this.handlers[e.channel]) {
								var n = true;
								var s = false;
								var a = undefined;
								try {
									for (
										var i, r = this.handlers[e.channel][Symbol.iterator]();
										!(n = (i = r.next()).done);
										n = true
									) {
										var o = i.value;
										try {
											o(e);
										} catch (t) {
											console.error('error while emitting event:', t, o, e);
										}
									}
								} catch (e) {
									s = true;
									a = e;
								} finally {
									try {
										if (!n && r.return != null) {
											r.return();
										}
									} finally {
										if (s) {
											throw a;
										}
									}
								}
							}
						},
					},
					{
						key: 'init',
						value: function (e) {
							this.clientId = e;
							this.initCallback();
						},
					},
					{
						key: 'subscribe',
						value: function (e, t) {
							var n = this;
							if (!this.handlers[e]) {
								this.handlers[e] = new Set();
								this.call('subscribe', this.clientId, e);
							}
							if (!this.channels[e]) {
								this.channels[e] = new BroadcastChannel(e);
								this.channels[e].onmessage = function (e) {
									return n.onWorkerMessage(e);
								};
							}
							this.handlers[e].add(t);
						},
					},
					{
						key: 'unsubscribe',
						value: function (e, t) {
							if (this.handlers[e]) {
								this.handlers[e].delete(t);
								if (!this.handlers[e].size) {
									delete this.handlers[e];
									this.channels[e].close();
								}
							}
						},
					},
					{
						key: 'publish',
						value: function (e, t) {
							this.call('publish', e, t);
						},
					},
				]);
				return e;
			})();
			var h = n(51655);
			var m = (function () {
				function e() {
					var t;
					var n = this;
					(0, o._)(this, e);
					(0, l._)(this, 'handlers', new Map());
					(0, l._)(this, 'socket', null);
					(0, l._)(this, 'state', 0);
					(0, l._)(this, 'queue', []);
					(0, l._)(this, 'channelMessages', {});
					(0, l._)(this, 'reconnectAttempts', 0);
					(0, l._)(this, 'lastPingTime', 0);
					(0, l._)(this, 'onConnectReply', function () {});
					(0, l._)(this, 'idCounter', 0);
					if ((t = navigator.connection) !== null && t !== undefined) {
						t.addEventListener('change', function () {
							if (n.state == 2) {
								var e;
								if ((e = n.socket) !== null && e !== undefined) {
									e.close();
								}
							}
						});
					}
					setInterval(function () {
						if (n.lastPingTime && n.state === 2 && Date.now() - n.lastPingTime > 120000) {
							var e;
							if ((e = n.socket) !== null && e !== undefined) {
								e.close();
							}
						}
					}, 1000);
					if (!u.tZ.isOpen) {
						u.tZ.openDB('socket', function () {
							console.debug('IndexedDB opened');
						});
					}
				}
				(0, c._)(e, [
					{
						key: 'connect',
						value: function () {
							this.idCounter = 0;
							this.socket = new WebSocket(`wss://${self.location.host}/socket/`);
							this.socket.onopen = this.onOpen.bind(this);
							this.socket.onmessage = this.onMessage.bind(this);
							this.socket.onclose = this.onClose.bind(this);
							this.socket.onerror = function (e) {
								return console.warn('notify socket error', e);
							};
							this.lastPingTime = Date.now();
							this.state = 1;
						},
					},
					{
						key: 'send',
						value: function (e, t) {
							var n;
							e.id = ++this.idCounter;
							if (t) {
								this.channelMessages[e.id] = t;
							}
							if ((n = this.socket) !== null && n !== undefined) {
								n.send(JSON.stringify(e));
							}
						},
					},
					{
						key: 'onOpen',
						value: function () {
							var e = this;
							return (0, i._)(function () {
								var t;
								var n;
								var s;
								var a;
								var i;
								var o;
								return (0, r.Jh)(this, function (r) {
									switch (r.label) {
										case 0:
											e.reconnectAttempts = 0;
											e.send({
												connect: {
													name: 'js',
												},
											});
											return [
												4,
												new Promise(function (t) {
													return (e.onConnectReply = t);
												}),
											];
										case 1:
											r.sent();
											t = true;
											n = false;
											s = undefined;
											try {
												for (
													a = e.handlers[Symbol.iterator]();
													!(t = (i = a.next()).done);
													t = true
												) {
													o = (0, h._)(i.value, 1)[0];
													e.send(
														{
															subscribe: {
																channel: o,
															},
														},
														o,
													);
												}
											} catch (e) {
												n = true;
												s = e;
											} finally {
												try {
													if (!t && a.return != null) {
														a.return();
													}
												} finally {
													if (n) {
														throw s;
													}
												}
											}
											e.state = 2;
											e.flushQueue();
											return [2];
									}
								});
							})();
						},
					},
					{
						key: 'flushQueue',
						value: function () {
							if (this.state === 2) {
								var e = true;
								var t = false;
								var n = undefined;
								try {
									for (var s, a = this.queue[Symbol.iterator](); !(e = (s = a.next()).done); e = true) {
										var i = (0, h._)(s.value, 2);
										var r = i[0];
										var o = i[1];
										this.send({
											publish: {
												channel: r,
												data: {
													input: JSON.stringify(o),
												},
											},
										});
									}
								} catch (e) {
									t = true;
									n = e;
								} finally {
									try {
										if (!e && a.return != null) {
											a.return();
										}
									} finally {
										if (t) {
											throw n;
										}
									}
								}
								this.queue = [];
							}
						},
					},
					{
						key: 'emit',
						value: function (e) {
							var t = this.handlers.get(e.channel);
							if (t) {
								var n = true;
								var s = false;
								var a = undefined;
								try {
									for (var i, r = t[Symbol.iterator](); !(n = (i = r.next()).done); n = true) {
										var o = i.value;
										try {
											o(e);
										} catch (t) {
											console.error('error while emitting event:', t, o, e);
										}
									}
								} catch (e) {
									s = true;
									a = e;
								} finally {
									try {
										if (!n && r.return != null) {
											r.return();
										}
									} finally {
										if (s) {
											throw a;
										}
									}
								}
							}
						},
					},
					{
						key: 'onMessage',
						value: function (e) {
							var t = this;
							if (this.state === 2 || this.state === 1) {
								if (e.data === '{}') {
									this.lastPingTime = Date.now();
									if ((r = this.socket) !== null && r !== undefined) {
										r.send('{}');
									}
									return;
								}
								var n = e.data.split(/\n/).map(function (e) {
									return JSON.parse(e);
								});
								var s = true;
								var a = false;
								var i = undefined;
								try {
									var r;
									for (var o, c = this, l = n[Symbol.iterator](); !(s = (o = l.next()).done); s = true) {
										(function () {
											var e = o.value;
											var n = c.channelMessages[e.id];
											if (e.connect) {
												c.onConnectReply();
											} else if (e.push) {
												if (e.push.unsubscribe) {
													if (e.push.unsubscribe.code === 2500) {
														return c.send({
															subscribe: {
																channel: e.push.unsubscribe
																	.channel,
															},
														});
													} else {
														return console.error(
															'Unknown unsubscribe code',
															e.push,
														);
													}
												}
												if (!e.push.pub) {
													return console.log(
														'No pub key in message.push. Response: ',
														e.push,
													);
												}
												u.tZ.set(
													e.push.channel,
													{
														offset: e.push.pub.offset,
													},
													function () {},
												);
												c.handlePublication(e.push.pub, e.push.channel, false);
											} else if (e.subscribe && e.subscribe.recoverable && n) {
												u.tZ.get(n, function (s) {
													var a = e.subscribe.offset || 0;
													if (s && s.offset < a) {
														var i = a - s.offset;
														t.send(
															{
																history: {
																	channel: n,
																	since: {
																		offset: s.offset,
																		epoch: e
																			.subscribe
																			.epoch,
																	},
																	limit: i,
																},
															},
															n,
														);
													}
												});
											} else if (e.history && e.history.publications && n) {
												u.tZ.set(
													n,
													{
														offset: e.history.offset,
													},
													function () {},
												);
												var s = true;
												var a = false;
												var i = undefined;
												try {
													for (
														var r,
															l =
																e.history.publications[
																	Symbol.iterator
																]();
														!(s = (r = l.next()).done);
														s = true
													) {
														var d = r.value;
														c.handlePublication(d, n, true);
													}
												} catch (e) {
													a = true;
													i = e;
												} finally {
													try {
														if (!s && l.return != null) {
															l.return();
														}
													} finally {
														if (a) {
															throw i;
														}
													}
												}
											}
										})();
									}
								} catch (e) {
									a = true;
									i = e;
								} finally {
									try {
										if (!s && l.return != null) {
											l.return();
										}
									} finally {
										if (a) {
											throw i;
										}
									}
								}
							}
						},
					},
					{
						key: 'handlePublication',
						value: function (e, t, n) {
							if (e.info) {
								var s;
								try {
									s = JSON.parse(e.data.input);
								} catch (t) {
									console.warn(`${e.info.conn_info.username} trying to send invalid json`, e);
									return;
								}
								this.emit({
									from: 'user',
									channel: t,
									data: s,
									userId: e.info.conn_info.user_id,
									username: e.info.conn_info.username,
									recovered: n,
								});
							} else {
								this.emit({
									from: 'system',
									channel: t,
									data: JSON.parse(e.data.input),
									recovered: n,
								});
							}
						},
					},
					{
						key: 'onClose',
						value: function () {
							var e = this;
							if (!this.handlers.size) {
								this.state = 0;
								return;
							}
							this.reconnectAttempts = Math.min(this.reconnectAttempts + 1, 15);
							this.state = 3;
							setTimeout(function () {
								return e.connect();
							}, this.reconnectAttempts * 1000);
						},
					},
					{
						key: 'subscribe',
						value: function (e, t) {
							var n;
							if (!this.handlers.has(e)) {
								this.handlers.set(e, new Set());
								if (this.state === 2) {
									this.send({
										subscribe: {
											channel: e,
										},
									});
								}
							}
							if ((n = this.handlers.get(e)) !== null && n !== undefined) {
								n.add(t);
							}
							if (this.state === 0) {
								this.connect();
							}
						},
					},
					{
						key: 'unsubscribe',
						value: function (e, t) {
							var n;
							var s = this.handlers.get(e);
							if (s) {
								s.delete(t);
								if (!s.size) {
									this.handlers.delete(e);
									if (this.state === 2 && this.handlers.size) {
										this.send({
											unsubscribe: {
												channel: e,
											},
										});
									}
								}
								if (this.state === 2 && !this.handlers.size) {
									if ((n = this.socket) !== null && n !== undefined) {
										n.close();
									}
									this.state = 0;
								}
							}
						},
					},
					{
						key: 'publish',
						value: function (e, t) {
							this.queue.push([e, t]);
							this.flushQueue();
						},
					},
				]);
				return e;
			})();
			function f() {
				return (s ||= (0, i._)(function () {
					var e;
					return (0, r.Jh)(this, function (t) {
						switch (t.label) {
							case 0:
								if (document.readyState === 'complete') {
									return [3, 2];
								}
								return [
									4,
									new Promise(function (e) {
										return window.addEventListener('load', e, {
											once: true,
										});
									}),
								];
							case 1:
								t.sent();
								t.label = 2;
							case 2:
								if (!('SharedWorker' in window) || !('BroadcastChannel' in window)) {
									return [3, 4];
								}
								if (a) {
									return [2, a];
								}
								return [4, (e = new d()).initPromise];
							case 3:
								t.sent();
								a = e;
								return [2, e];
							case 4:
								return [2, new m()];
							case 5:
								return [2];
						}
					});
				})());
			}
		},
		97293: function (e, t, n) {
			n.d(t, {
				u: function () {
					return h;
				},
				m: function () {
					return m;
				},
			});
			var s = n(43136);
			var a = n(27681);
			var i = n(38715);
			var r = n(34878);
			var o = n(83467);
			var c = n(62338);
			var l = n(10730);
			var u = n(93613);
			var d = n(12271);
			var h = (function (e) {
				(0, o._)(n, e);
				var t = (0, u._)(n);
				function n() {
					var e;
					var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
					(0, a._)(this, n);
					e = t.call(this);
					(0, r._)((0, s._)(e), 'options', undefined);
					(0, r._)((0, s._)(e), 'tippy', null);
					(0, r._)((0, s._)(e), 'triggerNode', null);
					(0, r._)((0, s._)(e), 'contentNode', null);
					e.trigger = e.trigger.bind((0, s._)(e));
					e.content = e.content.bind((0, s._)(e));
					e.options = i;
					return e;
				}
				(0, i._)(n, [
					{
						key: 'createTippy',
						value: function () {
							if (this.triggerNode && this.contentNode !== null && !this.tippy) {
								this.tippy = tippy(
									this.triggerNode,
									(0, c._)(
										{
											content: this.contentNode,
										},
										this.getTippyOptions(),
									),
								);
							}
						},
					},
					{
						key: 'destroy',
						value: function () {
							var e;
							if ((e = this.tippy) !== null && e !== undefined) {
								e.destroy();
							}
							this.tippy = null;
						},
					},
					{
						key: 'trigger',
						value: function (e) {
							this.triggerNode = e;
							this.createTippy();
							return {
								destroy: this.destroy.bind(this),
							};
						},
					},
					{
						key: 'content',
						value: function (e) {
							var t;
							if ((t = e.parentNode) !== null && t !== undefined) {
								t.removeChild(e);
							}
							this.contentNode = e;
							this.createTippy();
							return {
								destroy: this.destroy.bind(this),
							};
						},
					},
					{
						key: 'getTippyOptions',
						value: function () {
							var e;
							var a = this;
							var i = {
								popup: {
									arrow: true,
									animation: 'shift-toward',
									theme: 'popup',
									interactive: true,
									zIndex: (
										(e = this.triggerNode) === null || e === undefined
											? undefined
											: e.closest('.xenOverlay')
									)
										? 11111
										: 9000,
									hideOnClick: d.fq,
								},
								tooltip: {
									arrow: true,
									animation: 'shift-toward',
									distance: 5,
									zIndex: 11111,
								},
							};
							i['smilie-picker'] = (0, l._)((0, c._)({}, i.popup), {
								theme: 'popup lzt-fe-smilies',
								distance: 0,
							});
							return (0, c._)(
								{
									placement: this.options.placement ?? 'top',
									trigger: d.fq ? 'click' : 'mouseenter focus',
									maxWidth: this.options.maxWidth ?? 250,
									popperOptions: {
										positionFixed: this.options.placementStrategy === 'fixed',
									},
									onShown: function () {
										if (document.body.classList.contains('iOS')) {
											var e;
											if ((e = a.triggerNode) !== null && e !== undefined) {
												e.click();
											}
										}
										a.emit('shown', null);
									},
									onShow: function () {
										a.emit('show', null);
									},
									onHide: function () {
										a.emit('hide', null);
									},
									onHidden: function () {
										a.emit('hidden', null);
									},
								},
								i[this.options.style ?? 'tooltip'],
							);
						},
					},
					{
						key: 'update',
						value: function () {
							var e;
							var t;
							var n;
							if (
								(e = this.triggerNode) !== null &&
								e !== undefined &&
								(t = e.tippy) !== null &&
								t !== undefined &&
								(n = t.popperInstance) !== null &&
								n !== undefined
							) {
								n.update();
							}
						},
					},
				]);
				return n;
			})(
				(function () {
					function e() {
						(0, a._)(this, e);
						(0, r._)(this, 'handlers', Object.create(null));
					}
					(0, i._)(e, [
						{
							key: 'on',
							value: function (e, t) {
								this.handlers[e] ||= [];
								this.handlers[e].push(t);
								return this;
							},
						},
						{
							key: 'off',
							value: function (e, t) {
								this.handlers[e] &&= this.handlers[e].filter(function (e) {
									return e !== t;
								});
							},
						},
						{
							key: 'emit',
							value: function (e, t) {
								if (this.handlers[e]) {
									var n = true;
									var s = false;
									var a = undefined;
									try {
										for (
											var i, r = this.handlers[e][Symbol.iterator]();
											!(n = (i = r.next()).done);
											n = true
										) {
											i.value.call(this, t);
										}
									} catch (e) {
										s = true;
										a = e;
									} finally {
										try {
											if (!n && r.return != null) {
												r.return();
											}
										} finally {
											if (s) {
												throw a;
											}
										}
									}
								}
							},
						},
					]);
					return e;
				})(),
			);
			function m(e, t) {
				function n(e) {
					var t = document.createElement('div');
					if (e.html) {
						t.innerHTML = e.content;
					} else {
						t.innerText = e.content;
					}
					return t;
				}
				var s = new h(t);
				s.trigger(e);
				s.content(n(t));
				return {
					destroy: s.destroy.bind(s),
					update: function (e) {
						var t;
						if ((t = s.tippy) !== null && t !== undefined) {
							t.set({
								content: n(e),
							});
						}
					},
				};
			}
		},
		74580: function (e, t, n) {
			var i = n(43617);
			var r = n(80042);
			var o = n(43136);
			var c = n(27681);
			var l = n(83467);
			var u = n(51655);
			var d = n(93613);
			var h = n(38574);
			var m = n(36969);
			var f = n(12271);
			var v = n(97293);
			function p(e) {
				var t;
				var n;
				var s;
				var a;
				var i;
				var r;
				var o;
				var c;
				var l;
				var u;
				var d;
				var v;
				var p;
				var g;
				var y;
				var b;
				var k;
				var L;
				var I;
				var w;
				var j;
				var C;
				var T;
				var R;
				var M;
				var x;
				var S = (0, f.mr)(e[0].helper.timestamp * 1000) + '';
				var $ = e[0].html + '';
				v = new m.Z({
					props: {
						id: e[0].helper.userId,
						$$slots: {
							default: [_],
						},
						$$scope: {
							ctx: e,
						},
					},
				});
				return {
					c: function () {
						t = (0, h.bGB)('li');
						n = (0, h.bGB)('span');
						s = (0, h.DhX)();
						a = (0, h.bGB)('div');
						i = (0, h.bGB)('div');
						r = (0, h.bGB)('a');
						o = (0, h.bGB)('img');
						u = (0, h.DhX)();
						d = (0, h.bGB)('div');
						(0, h.YCL)(v.$$.fragment);
						p = (0, h.DhX)();
						g = (0, h.bGB)('span');
						y = (0, h.DhX)();
						b = (0, h.bGB)('span');
						k = (0, h.fLW)(S);
						w = (0, h.DhX)();
						j = (0, h.bGB)('div');
						C = (0, h.bGB)('blockquote');
						(0, h.Ljt)(n, 'class', 'selectedIcon fas fa-check-circle');
						(0, h.Ljt)(o, 'class', 'user_avatar');
						if (!(0, h.Jn4)(o.src, (c = e[0].helper.avatar))) {
							(0, h.Ljt)(o, 'src', c);
						}
						(0, h.Ljt)(o, 'alt', (l = e[0].helper.username));
						(0, h.czc)(o, 'left', '0px');
						(0, h.czc)(o, 'top', '0px');
						(0, h.Ljt)(o, 'itemprop', 'photo');
						(0, h.Ljt)(r, 'class', 'avatar');
						(0, h.Ljt)(i, 'class', 'user_avatar_block avatar');
						(0, h.Ljt)(g, 'class', 'slowInsertReplyRequestIcon fas fa-clock');
						(0, h.Ljt)(b, 'class', 'messageDate muted');
						(0, h.Ljt)(b, 'data-absolutetime', (L = e[0].helper.timestamp));
						(0, h.Ljt)(b, 'data-shorttime', (I = (0, f.mr)(e[0].helper.timestamp * 1000)));
						(0, h.Ljt)(C, 'class', 'messageText messageContent SelectQuoteContainer');
						(0, h.Ljt)(j, 'class', 'messageContent');
						(0, h.Ljt)(d, 'class', 'messageInfo');
						(0, h.Ljt)(a, 'class', 'messageWrapper');
						(0, h.Ljt)(t, 'id', (T = 'messageHelper--' + e[0].helper.timestamp));
						(0, h.Ljt)(t, 'data-message-id', '');
						(0, h.Ljt)(t, 'data-author', (R = e[0].helper.username));
						(0, h.Ljt)(t, 'data-user-id', (M = e[0].helper.userId));
						(0, h.Ljt)(t, 'class', 'message MessageHelper message-block unread');
					},
					m: function (e, c) {
						(0, h.$Tr)(e, t, c);
						(0, h.R3I)(t, n);
						(0, h.R3I)(t, s);
						(0, h.R3I)(t, a);
						(0, h.R3I)(a, i);
						(0, h.R3I)(i, r);
						(0, h.R3I)(r, o);
						(0, h.R3I)(a, u);
						(0, h.R3I)(a, d);
						(0, h.yef)(v, d, null);
						(0, h.R3I)(d, p);
						(0, h.R3I)(d, g);
						(0, h.R3I)(d, y);
						(0, h.R3I)(d, b);
						(0, h.R3I)(b, k);
						(0, h.R3I)(d, w);
						(0, h.R3I)(d, j);
						(0, h.R3I)(j, C);
						C.innerHTML = $;
						x = true;
					},
					p: function (e, n) {
						if (!x || (!!(n & 1) && !(0, h.Jn4)(o.src, (c = e[0].helper.avatar)))) {
							(0, h.Ljt)(o, 'src', c);
						}
						if (!x || (n & 1 && l !== (l = e[0].helper.username))) {
							(0, h.Ljt)(o, 'alt', l);
						}
						var s = {};
						if (n & 1) {
							s.id = e[0].helper.userId;
						}
						if (n & 5) {
							s.$$scope = {
								dirty: n,
								ctx: e,
							};
						}
						v.$set(s);
						if ((!x || n & 1) && S !== (S = (0, f.mr)(e[0].helper.timestamp * 1000) + '')) {
							(0, h.rTO)(k, S);
						}
						if (!x || (n & 1 && L !== (L = e[0].helper.timestamp))) {
							(0, h.Ljt)(b, 'data-absolutetime', L);
						}
						if (!x || (n & 1 && I !== (I = (0, f.mr)(e[0].helper.timestamp * 1000)))) {
							(0, h.Ljt)(b, 'data-shorttime', I);
						}
						if ((!x || n & 1) && $ !== ($ = e[0].html + '')) {
							C.innerHTML = $;
						}
						if (!x || (n & 1 && T !== (T = 'messageHelper--' + e[0].helper.timestamp))) {
							(0, h.Ljt)(t, 'id', T);
						}
						if (!x || (n & 1 && R !== (R = e[0].helper.username))) {
							(0, h.Ljt)(t, 'data-author', R);
						}
						if (!x || (n & 1 && M !== (M = e[0].helper.userId))) {
							(0, h.Ljt)(t, 'data-user-id', M);
						}
					},
					i: function (e) {
						if (!x) {
							(0, h.Ui)(v.$$.fragment, e);
							x = true;
						}
					},
					o: function (e) {
						(0, h.etI)(v.$$.fragment, e);
						x = false;
					},
					d: function (e) {
						if (e) {
							(0, h.ogt)(t);
						}
						(0, h.vpE)(v);
					},
				};
			}
			function g(e) {
				var t;
				var n;
				var s;
				var a;
				var i;
				var r;
				var o;
				var c;
				var l;
				var u;
				var d;
				var p;
				var g;
				var _;
				var w;
				var j;
				var C;
				var T;
				var R;
				var M;
				var x;
				var S;
				var $;
				var B;
				var H;
				var G;
				var N;
				var D;
				var O;
				var W;
				var E;
				var X;
				var Z;
				var F;
				var P;
				var z = (0, f.mr)(e[0].message.message_date * 1000) + '';
				var U = e[0].html + '';
				var V = e[0].user.user_id === f.NE.userId && y(e);
				C = new m.Z({
					props: {
						id: e[0].user.user_id,
						$$slots: {
							default: [b],
						},
						$$scope: {
							ctx: e,
						},
					},
				});
				var A = e[0].title === 'owner' && k(e);
				var J = e[0].user.user_id === 7180734 && L(e);
				var q = e[0].message.message_edited && I(e);
				return {
					c: function () {
						t = (0, h.bGB)('li');
						n = (0, h.bGB)('span');
						s = (0, h.DhX)();
						a = (0, h.bGB)('div');
						i = (0, h.bGB)('div');
						if (V) {
							V.c();
						}
						r = (0, h.DhX)();
						o = (0, h.bGB)('a');
						c = (0, h.bGB)('i');
						u = (0, h.DhX)();
						d = (0, h.bGB)('div');
						p = (0, h.bGB)('a');
						g = (0, h.bGB)('img');
						w = (0, h.DhX)();
						j = (0, h.bGB)('div');
						(0, h.YCL)(C.$$.fragment);
						T = (0, h.DhX)();
						if (A) {
							A.c();
						}
						R = (0, h.DhX)();
						if (J) {
							J.c();
						}
						M = (0, h.DhX)();
						x = (0, h.bGB)('span');
						S = (0, h.fLW)(z);
						H = (0, h.DhX)();
						if (q) {
							q.c();
						}
						G = (0, h.DhX)();
						N = (0, h.bGB)('div');
						(0, h.Ljt)(n, 'class', 'selectedIcon fas fa-check-circle');
						(0, h.Ljt)(c, 'class', 'far fa-star');
						(0, h.Ljt)(o, 'class', 'action StarContent');
						(0, h.Ljt)(o, 'href', (l = e[0].links.star));
						(0, h.VHj)(o, 'mainc', e[0].isStarred);
						(0, h.Ljt)(i, 'class', 'actionButtons');
						(0, h.Ljt)(g, 'class', 'user_avatar');
						if (!(0, h.Jn4)(g.src, (_ = e[0].user.avatar))) {
							(0, h.Ljt)(g, 'src', _);
						}
						(0, h.Ljt)(p, 'class', 'avatar');
						(0, h.Ljt)(d, 'class', 'user_avatar_block avatar');
						(0, h.Ljt)(x, 'class', 'messageDate muted');
						(0, h.Ljt)(x, 'data-absolutetime', ($ = e[0].message.message_date));
						(0, h.Ljt)(x, 'data-shorttime', (B = (0, f.mr)(e[0].message.message_date * 1000)));
						(0, h.Ljt)(N, 'class', 'messageText messageContent');
						(0, h.Ljt)(j, 'class', 'messageInfo');
						(0, h.Ljt)(a, 'class', 'messageWrapper');
						(0, h.Ljt)(a, 'data-id', (D = e[0].message.message_id));
						(0, h.Ljt)(t, 'id', (O = 'message-' + e[0].message.message_id));
						(0, h.Ljt)(t, 'class', 'message message-block');
						(0, h.Ljt)(t, 'data-message-id', (W = e[0].message.message_id));
						(0, h.Ljt)(t, 'data-author', (E = e[0].message.username));
						(0, h.Ljt)(t, 'data-user-id', (X = e[0].message.user_id));
						(0, h.VHj)(t, 'unread', e[0].message.global_unread);
					},
					m: function (e, l) {
						(0, h.$Tr)(e, t, l);
						(0, h.R3I)(t, n);
						(0, h.R3I)(t, s);
						(0, h.R3I)(t, a);
						(0, h.R3I)(a, i);
						if (V) {
							V.m(i, null);
						}
						(0, h.R3I)(i, r);
						(0, h.R3I)(i, o);
						(0, h.R3I)(o, c);
						(0, h.R3I)(a, u);
						(0, h.R3I)(a, d);
						(0, h.R3I)(d, p);
						(0, h.R3I)(p, g);
						(0, h.R3I)(a, w);
						(0, h.R3I)(a, j);
						(0, h.yef)(C, j, null);
						(0, h.R3I)(j, T);
						if (A) {
							A.m(j, null);
						}
						(0, h.R3I)(j, R);
						if (J) {
							J.m(j, null);
						}
						(0, h.R3I)(j, M);
						(0, h.R3I)(j, x);
						(0, h.R3I)(x, S);
						(0, h.R3I)(j, H);
						if (q) {
							q.m(j, null);
						}
						(0, h.R3I)(j, G);
						(0, h.R3I)(j, N);
						N.innerHTML = U;
						Z = true;
						if (!F) {
							P = [
								(0, h.TVh)(f.yR.call(null, o)),
								(0, h.TVh)(
									v.m.call(null, o, {
										content: (0, f.cI)('star_message'),
										placementStrategy: 'fixed',
									}),
								),
								(0, h.TVh)(f.yR.call(null, t)),
							];
							F = true;
						}
					},
					p: function (e, n) {
						if (e[0].user.user_id === f.NE.userId) {
							if (V) {
								V.p(e, n);
							} else {
								(V = y(e)).c();
								V.m(i, r);
							}
						} else if (V) {
							V.d(1);
							V = null;
						}
						if (!Z || (n & 1 && l !== (l = e[0].links.star))) {
							(0, h.Ljt)(o, 'href', l);
						}
						if (!Z || n & 1) {
							(0, h.VHj)(o, 'mainc', e[0].isStarred);
						}
						if (!Z || (!!(n & 1) && !(0, h.Jn4)(g.src, (_ = e[0].user.avatar)))) {
							(0, h.Ljt)(g, 'src', _);
						}
						var s = {};
						if (n & 1) {
							s.id = e[0].user.user_id;
						}
						if (n & 5) {
							s.$$scope = {
								dirty: n,
								ctx: e,
							};
						}
						C.$set(s);
						if (e[0].title === 'owner') {
							if (A) {
								A.p(e, n);
							} else {
								(A = k(e)).c();
								A.m(j, R);
							}
						} else if (A) {
							A.d(1);
							A = null;
						}
						if (e[0].user.user_id === 7180734) {
							if (J) {
								J.p(e, n);
							} else {
								(J = L(e)).c();
								J.m(j, M);
							}
						} else if (J) {
							J.d(1);
							J = null;
						}
						if ((!Z || n & 1) && z !== (z = (0, f.mr)(e[0].message.message_date * 1000) + '')) {
							(0, h.rTO)(S, z);
						}
						if (!Z || (n & 1 && $ !== ($ = e[0].message.message_date))) {
							(0, h.Ljt)(x, 'data-absolutetime', $);
						}
						if (!Z || (n & 1 && B !== (B = (0, f.mr)(e[0].message.message_date * 1000)))) {
							(0, h.Ljt)(x, 'data-shorttime', B);
						}
						if (e[0].message.message_edited) {
							if (q) {
								q.p(e, n);
							} else {
								(q = I(e)).c();
								q.m(j, G);
							}
						} else if (q) {
							q.d(1);
							q = null;
						}
						if ((!Z || n & 1) && U !== (U = e[0].html + '')) {
							N.innerHTML = U;
						}
						if (!Z || (n & 1 && D !== (D = e[0].message.message_id))) {
							(0, h.Ljt)(a, 'data-id', D);
						}
						if (!Z || (n & 1 && O !== (O = 'message-' + e[0].message.message_id))) {
							(0, h.Ljt)(t, 'id', O);
						}
						if (!Z || (n & 1 && W !== (W = e[0].message.message_id))) {
							(0, h.Ljt)(t, 'data-message-id', W);
						}
						if (!Z || (n & 1 && E !== (E = e[0].message.username))) {
							(0, h.Ljt)(t, 'data-author', E);
						}
						if (!Z || (n & 1 && X !== (X = e[0].message.user_id))) {
							(0, h.Ljt)(t, 'data-user-id', X);
						}
						if (!Z || n & 1) {
							(0, h.VHj)(t, 'unread', e[0].message.global_unread);
						}
					},
					i: function (e) {
						if (!Z) {
							(0, h.Ui)(C.$$.fragment, e);
							Z = true;
						}
					},
					o: function (e) {
						(0, h.etI)(C.$$.fragment, e);
						Z = false;
					},
					d: function (e) {
						if (e) {
							(0, h.ogt)(t);
						}
						if (V) {
							V.d();
						}
						(0, h.vpE)(C);
						if (A) {
							A.d();
						}
						if (J) {
							J.d();
						}
						if (q) {
							q.d();
						}
						F = false;
						(0, h.j7q)(P);
					},
				};
			}
			function _(e) {
				var t;
				var n;
				var s = e[0].helper.usernameHtml + '';
				return {
					c: function () {
						t = new h.FWw(false);
						n = (0, h.cSb)();
						t.a = n;
					},
					m: function (e, a) {
						t.m(s, e, a);
						(0, h.$Tr)(e, n, a);
					},
					p: function (e, n) {
						if (n & 1 && s !== (s = e[0].helper.usernameHtml + '')) {
							t.p(s);
						}
					},
					d: function (e) {
						if (e) {
							(0, h.ogt)(n);
						}
						if (e) {
							t.d();
						}
					},
				};
			}
			function y(e) {
				var t;
				var n;
				var s;
				var a;
				var i;
				return {
					c: function () {
						t = (0, h.bGB)('span');
						n = (0, h.bGB)('i');
						(0, h.Ljt)(n, 'class', 'fas fa-pencil-alt');
						(0, h.Ljt)(t, 'class', 'action EditMessage');
						(0, h.Ljt)(t, 'data-jsonurl', (s = e[0].links.edit));
					},
					m: function (e, s) {
						(0, h.$Tr)(e, t, s);
						(0, h.R3I)(t, n);
						if (!a) {
							i = (0, h.TVh)(f.yR.call(null, t));
							a = true;
						}
					},
					p: function (e, n) {
						if (n & 1 && s !== (s = e[0].links.edit)) {
							(0, h.Ljt)(t, 'data-jsonurl', s);
						}
					},
					d: function (e) {
						if (e) {
							(0, h.ogt)(t);
						}
						a = false;
						i();
					},
				};
			}
			function b(e) {
				var t;
				var n;
				var s = e[0].user.usernameHtml + '';
				return {
					c: function () {
						t = new h.FWw(false);
						n = (0, h.cSb)();
						t.a = n;
					},
					m: function (e, a) {
						t.m(s, e, a);
						(0, h.$Tr)(e, n, a);
					},
					p: function (e, n) {
						if (n & 1 && s !== (s = e[0].user.usernameHtml + '')) {
							t.p(s);
						}
					},
					d: function (e) {
						if (e) {
							(0, h.ogt)(n);
						}
						if (e) {
							t.d();
						}
					},
				};
			}
			function k(e) {
				var t;
				return {
					c: function () {
						(t = (0, h.bGB)('span')).textContent = `${(0, f.cI)('owner')}`;
						(0, h.Ljt)(t, 'class', 'owner_conservation_ls');
					},
					m: function (e, n) {
						(0, h.$Tr)(e, t, n);
					},
					p: h.ZTd,
					d: function (e) {
						if (e) {
							(0, h.ogt)(t);
						}
					},
				};
			}
			function L(e) {
				var t;
				return {
					c: function () {
						(t = (0, h.bGB)('span')).textContent = `${(0, f.cI)('bot')}`;
						(0, h.Ljt)(t, 'class', 'owner_conservation_ls');
					},
					m: function (e, n) {
						(0, h.$Tr)(e, t, n);
					},
					p: h.ZTd,
					d: function (e) {
						if (e) {
							(0, h.ogt)(t);
						}
					},
				};
			}
			function I(e) {
				var t;
				var n;
				var s;
				var a;
				return {
					c: function () {
						(t = (0, h.bGB)('span')).textContent = `${(0, f.cI)('edited')}`;
						(0, h.Ljt)(t, 'class', 'MessageEdited muted');
					},
					m: function (i, r) {
						(0, h.$Tr)(i, t, r);
						if (!s) {
							a = (0, h.TVh)(
								(n = v.m.call(null, t, {
									content: (0, f.mr)(e[0].message.message_edit_date * 1000),
									placementStrategy: 'fixed',
								})),
							);
							s = true;
						}
					},
					p: function (e, t) {
						if (n && (0, h.sBU)(n.update) && t & 1) {
							n.update.call(null, {
								content: (0, f.mr)(e[0].message.message_edit_date * 1000),
								placementStrategy: 'fixed',
							});
						}
					},
					d: function (e) {
						if (e) {
							(0, h.ogt)(t);
						}
						s = false;
						a();
					},
				};
			}
			function w(e) {
				var t;
				var n;
				var s;
				var a;
				function i(e, t) {
					if (e[1]) {
						return 1;
					} else {
						return 0;
					}
				}
				var r = [g, p];
				var o = [];
				n = o[(t = i(e, -1))] = r[t](e);
				return {
					c: function () {
						n.c();
						s = (0, h.cSb)();
					},
					m: function (e, n) {
						o[t].m(e, n);
						(0, h.$Tr)(e, s, n);
						a = true;
					},
					p: function (e, a) {
						var c = (0, u._)(a, 1)[0];
						var l = t;
						if ((t = i(e, c)) === l) {
							o[t].p(e, c);
						} else {
							(0, h.dvw)();
							(0, h.etI)(o[l], 1, 1, function () {
								o[l] = null;
							});
							(0, h.gbL)();
							if ((n = o[t])) {
								n.p(e, c);
							} else {
								(n = o[t] = r[t](e)).c();
							}
							(0, h.Ui)(n, 1);
							n.m(s.parentNode, s);
						}
					},
					i: function (e) {
						if (!a) {
							(0, h.Ui)(n);
							a = true;
						}
					},
					o: function (e) {
						(0, h.etI)(n);
						a = false;
					},
					d: function (e) {
						o[t].d(e);
						if (e) {
							(0, h.ogt)(s);
						}
					},
				};
			}
			function j(e, t, n) {
				var s = t.data;
				var a = t.helper;
				var i = a !== undefined && a;
				e.$$set = function (e) {
					if ('data' in e) {
						n(0, (s = e.data));
					}
					if ('helper' in e) {
						n(1, (i = e.helper));
					}
				};
				return [s, i];
			}
			var C = (function (e) {
				(0, l._)(n, e);
				var t = (0, d._)(n);
				function n(e) {
					var s;
					(0, c._)(this, n);
					s = t.call(this);
					(0, h.S1n)((0, o._)(s), e, j, w, h.N8, {
						data: 0,
						helper: 1,
					});
					return s;
				}
				return n;
			})(h.f_C);
			function T(e) {
				var t;
				var n;
				return {
					c: function () {
						t = (0, h.bGB)('div');
						n = (0, h.bGB)('span');
						(0, h.Ljt)(n, 'class', 'systemMessage');
						(0, h.Ljt)(t, 'class', 'systemMessageWrapper');
					},
					m: function (s, a) {
						(0, h.$Tr)(s, t, a);
						(0, h.R3I)(t, n);
						n.innerHTML = e[0];
					},
					p: function (e, t) {
						if ((0, u._)(t, 1)[0] & 1) {
							n.innerHTML = e[0];
						}
					},
					i: h.ZTd,
					o: h.ZTd,
					d: function (e) {
						if (e) {
							(0, h.ogt)(t);
						}
					},
				};
			}
			function R(e, t, n) {
				var s = t.messageHtml;
				var a = s === undefined ? undefined : s;
				e.$$set = function (e) {
					if ('messageHtml' in e) {
						n(0, (a = e.messageHtml));
					}
				};
				return [a];
			}
			var M = (function (e) {
				(0, l._)(n, e);
				var t = (0, d._)(n);
				function n(e) {
					var s;
					(0, c._)(this, n);
					s = t.call(this);
					(0, h.S1n)((0, o._)(s), e, R, T, h.N8, {
						messageHtml: 0,
					});
					return s;
				}
				return n;
			})(h.f_C);
			var x = window.$;
			var S = (window.XenForo ||= {});
			var $ = (window.Im ||= {});
			var B = new Set();
			var H = {};
			$.Socket = function (e) {
				this.__construct($.conversationId);
			};
			$.Socket.prototype = {
				__construct: function () {
					var e = this;
					this.im = x('#Conversations').data('Im.Start');
					this.id = $.conversationId;
					var t = this;
					this.socket = (0, r.Z)().then(function (n) {
						n.subscribe(`user:${S.visitor.user_id}`, e.handleUserEvent.bind(e));
						t.setupConversation(n, e.id);
						return n;
					});
					var n = x('.conversationList');
					var s = this.im.$container;
					s.on('insertMessageFromEditor', function (t, n) {
						return e.handleInsert(n);
					});
					s.on('insertMessageError', function () {
						return x('#ConversationMessageList').find('.MessageHelper').remove();
					});
					s.on('LoadConversation', function (t, n) {
						return e.socket.then(function (t) {
							return e.setupConversation(t, n);
						});
					});
					s.on('typingIm', function () {
						return e.socket.then(function (t) {
							return e.typingMessage(t);
						});
					});
					n.on('click', function (e) {
						var n = x(e.target).closest('._loadConversation');
						if (n.length) {
							var s = n.data('cid');
							t.id = s;
							t.socket.then(function (e) {
								return t.setupConversation(e, s);
							});
						}
					});
				},
				handleInsert: function (e) {
					var t = e.content;
					var n = e.messageTime;
					new C({
						target: x('#ConversationMessageList').find('ol')[0],
						props: {
							data: {
								html: t,
								helper: {
									avatar: x('#NavigationAccountUsername').parent().find('img').attr('src'),
									userId: S.visitor.user_id,
									timestamp: n,
									usernameHtml: x('#NavigationAccountUsername').html(),
									username: x('#NavigationAccountUsername').find('span').html(),
								},
							},
							helper: true,
						},
					});
					x('#ConversationMessageList li.message:last').xfFadeIn(100);
				},
				setupConversation: function (e, t) {
					if (t) {
						if (e.handlers instanceof Map) {
							e.handlers.delete(`conversation:${t}`);
						} else {
							e.handlers[`conversation:${t}`] = null;
						}
						e.subscribe(`conversation:${t}`, this.handleExtLoader.bind(this));
						x('#ConversationListItems').find('li.active').removeClass('active');
						var n = x('#ConversationListItems').find(`li[data-cid="${t}"]`);
						var s = n.find('.tc-lucmc-unreadCounter');
						n.addClass('active');
						if (n.length) {
							if (!s.hasClass('Zero')) {
								s.addClass('Zero').text(0);
							}
						}
					}
				},
				handleExtLoader: function (e) {
					var t = this;
					if (!e.data.extLoader) {
						return this.handleConversationsEvent(e);
					}
					new window.XenForo.ExtLoader(e.data.extLoader, function () {
						return t.handleConversationsEvent(e);
					});
				},
				handleUserEvent: function (e) {
					if (e.data.type == 'newMessage') {
						var t = x(`#conversation-${e.data.conversation_id}`).find('.tc-lucmc-unreadCounter').text();
						var n = e.data.conversation_list_item_for_receiver;
						if (e.data.user_id === S.visitor.user_id) {
							n = e.data.conversation_list_item_for_visitor;
							this.im.insertItemToConversationList(n, e.data.conversation_id);
						} else {
							this.im.insertItemToConversationList(n, e.data.conversation_id);
							var s = x(`#conversation-${e.data.conversation_id}`).find('.tc-lucmc-unreadCounter');
							var a = (parseInt(t, 10) || 0) + 1;
							s.removeClass('Zero');
							s.text(a);
						}
					}
					if (e.data.action == 'read') {
						var i = x(`#conversation-${e.data.conversation_id}`).find('.tc-lucmc-unreadCounter');
						i.addClass('Zero');
						i.text(' ');
					}
				},
				handleConversationsEvent: function (e) {
					var t = this;
					function n() {
						if (!Object.keys(H).length) {
							s.css('opacity', 0);
							return;
						}
						var e = (0, i._)(
							new Set(
								Object.keys(H)
									.sort()
									.map(
										function (e) {
											return H[e].username;
										}.bind(this),
									),
							),
						).slice(0, 3);
						var t = e.length;
						if (!t) {
							return s.css('opacity', 0);
						}
						s.find('.Content').html(
							t === 1
								? S.phrases.user_is_typing.replace(/\{\{user}}/, e[0])
								: S.phrases.users_are_typing.replace(/{\{user([12])}}/g, function (t, n) {
										if (e.length <= 2 || n === '1') {
											return e[n - 1];
										} else if (n === '2' && e.length > 2) {
											return S.phrases.count_more.replace('{{count}}', e.length - 1);
										} else {
											return undefined;
										}
									}),
						);
						s.css('opacity', 1);
					}
					var s = x('.TypingNotice');
					if (e.channel.split(':').slice(-1) == $.conversationId) {
						var a = x('#ConversationListItems').find(`#conversation-${$.conversationId}`);
						switch (e.data.action) {
							case 'new':
								if (e.data.message.systemMessage) {
									new M({
										target: x('#ConversationMessageList').find('ol')[0],
										props: {
											messageHtml: e.data.message_html,
										},
									});
								} else {
									var r = false;
									if (
										B.has(e.data.message.message_id) ||
										x(`#message-${e.data.message.message_id}`).length
									) {
										return;
									}
									B.add(e.data.message.message_id);
									var o = x('#ConversationMessageList')[0];
									if (!x(o).find('ol').length) {
										return;
									}
									var c = x('#ConversationMessageList').find('ol')[0];
									var l = document.createDocumentFragment();
									if (e.data.user.user_id === S.visitor.user_id) {
										c = l;
										r = true;
									}
									new C({
										target: c,
										props: {
											data: {
												message: e.data.message,
												html: e.data.message_html,
												user: e.data.user,
												conversationId: $.conversationId,
												links: e.data.links,
												title: e.data.message_user_title,
											},
										},
									});
									if (r) {
										x(l).xfActivate();
										x('#ConversationMessageList').find('.MessageHelper').replaceWith(l);
									}
									var u = x(
										'#ConversationMessageList li.message, #ConversationMessageList .messagesGroupDate, #ConversationMessageList .systemMessageWrapper',
									);
									var d = x('#ConversationMessageList li.message:last');
									var h = d.outerHeight(true);
									d.hide();
									if (
										(o.scrollHeight - o.scrollTop === o.clientHeight ||
											e.data.user.user_id === S.visitor.user_id) &&
										o.classList.contains('scroll-scrolly_visible') &&
										!r
									) {
										u.stop(true, true).animate(
											{
												translateY: '-=' + h,
											},
											{
												duration: 200,
												step: function (e) {
													this.style.transform = `translateY(${e}px)`;
												},
												complete: function () {
													this.translateY = 0;
													if (this === d[0]) {
														d.xfFadeIn(100, function () {
															u.css('transform', '');
															x(o).scrollTop(o.scrollHeight);
														});
													}
												},
											},
										);
									} else {
										d.show();
										u.css('transform', '');
										x(o).scrollTop(o.scrollHeight);
									}
								}
								if (e.data.user.user_id !== S.visitor.user_id && document.hasFocus()) {
									setTimeout(function () {
										t.im.markConversationAsRead();
									}, 1500);
								}
								break;
							case 'edit':
								var m = x(`#message-${e.data.message.message_id}`);
								var f = m.find('.StarContent').hasClass('mainc');
								var v = document.createDocumentFragment();
								new C({
									target: v,
									props: {
										data: {
											message: e.data.message,
											html: e.data.message_html,
											user: e.data.user,
											conversationId: $.conversationId,
											isStarredBefore: f,
											links: e.data.links,
											title: e.data.message_user_title,
										},
									},
								});
								m.replaceWith(v);
								x(`#message-${e.data.message.message_id}`).parent().xfActivate();
								if (!a.length) {
									return;
								}
								a.find('conversationItem--messageDate')
									.data('absolutetime', e.data.message.message_date)
									.text(formatTime(e.data.message.message_date * 1000));
								a.find('.Content').html(e.data.message_list_html);
								this.im.insertItemToConversationList(a.prop('outerHTML'), $.conversationId);
								break;
							case 'read':
								x('.messageDate')
									.filter(function () {
										return (
											x(this).data('absolutetime') <= e.data.user_read_date &&
											x(this).closest('li.message').data('user-id') !== e.data.user_id
										);
									})
									.each(function () {
										x(this).closest('li.message').removeClass('unread');
									});
								if (e.data.user_id !== S.visitor.user_id) {
									a.find('.messageStateIcon').removeClass('unread');
								}
								break;
							case 'typing':
								if (e.recovered || !s.length || e.userId === S.visitor.user_id) {
									return;
								}
								if (H[e.userId]) {
									clearTimeout(H[e.userId].timeout);
								}
								H[e.userId] = {
									username: e.username,
									timeout: setTimeout(
										function () {
											delete H[e.userId];
											n();
										}.bind(this),
										3000,
									),
								};
								n();
						}
					}
				},
				typingMessage: function (e) {
					e.publish(`conversation:${$.conversationId}`, {
						action: 'typing',
					});
				},
			};
			S.register('#Conversations', 'Im.Socket');
		},
	},
	function (e) {
		e.O(0, [321], function () {
			return e((e.s = 74580));
		});
		e.O();
	},
]);
