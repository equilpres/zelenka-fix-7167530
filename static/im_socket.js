var __webpack_exports__ = {};
function _define_property(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value: value,
			enumerable: true,
			configurable: true,
			writable: true,
		});
	} else {
		obj[key] = value;
	}
	return obj;
}
var Im = Im || {};
Im.navigationCache = Im.navigationCache || {};
Im.dialogChannelId = Im.dialogChannelId || undefined;
Im.ssl = Im.ssl || undefined;
Im.visitorChannelId = Im.visitorChannelId || undefined;
Im.conversationId = Im.conversationId || undefined;
XenForo.phrases.messageDodPhrases = XenForo.phrases.messageDodPhrases || [];
XenForo.phrases.forwardingMessageDodPhrases = XenForo.phrases.forwardingMessageDodPhrases || [];
Im.selectedMessages = [];
Im.$selectedMessage = undefined;
Im.forwardingMessageFlag = false;
function deleteStartSlash(str) {
	return str[0] === '/' ? str.substr(1) : str;
}
function declOfNum(number, titles, showNumber) {
	var cases = [2, 0, 1, 1, 1, 2];
	var result = titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
	if (showNumber) {
		result = number.toString() + ' ' + result;
	}
	return result;
}
function addToNavigationCache(url) {
	var $copy = $('.ImViewContent').clone();
	$copy.find('.redactor_box').find(':not(textarea)').remove();
	$copy.find('textarea').parent().parent().prepend($copy.find('textarea'));
	$copy.find('.redactor_box').remove();
	Im.navigationCache[url] = $copy.html();
}
function createNavigationCache() {
	var currentPage = location.href;
	//if (currentPage in Im.navigationCache) return;
	addToNavigationCache(currentPage);
}
function isScrolledIntoView(elem) {
	var docViewTop = $(window).scrollTop() + $('#header').height();
	var docViewBottom = docViewTop + $(window).height();
	var elemTop = $(elem).offset().top;
	var elemBottom = elemTop + $(elem).height();
	return elemBottom <= docViewBottom && elemTop >= docViewTop;
}
function isScrolledToBottom(e) {
	var _e_target = e.target,
		scrollHeight = _e_target.scrollHeight,
		clientHeight = _e_target.clientHeight,
		scrollTop = _e_target.scrollTop;
	return Math.round(scrollHeight - clientHeight - scrollTop) === 0;
}
function listenCall(method, callback, obj) {
	if (typeof method !== 'string' || typeof callback !== 'function') return;
	obj = obj || window;
	(function (objMethod) {
		obj[method] = function () {
			try {
				callback.apply(obj, arguments);
			} catch (e) {}
			return objMethod.apply(obj, arguments);
		};
	})(obj[method]);
}
function formatTime(time) {
	var date = new Date(time);
	return date.toLocaleTimeString('ru-RU', {
		timeZone: Im.timezone,
		timeStyle: 'short',
	});
}
!(function ($1, window1, document1, _undefined) {
	var SoundNotification = {
		audio: undefined,
		play: function play() {
			if (Im.soundNotificationsEnabled) {
				if (!self.audio) {
					self.audio = new Audio(Im.soundNotificationFile);
				}
				self.audio.play();
			}
		},
		stop: function stop() {
			if (self.audio) self.audio.pause();
		},
	};
	var TabControl = {
		tabVisibilityChanged: function tabVisibilityChanged(tabIsHiddenCallback) {
			if (this.tabIsHidden()) {
				// tab is hidden
			} else {
			}
		},
		getHiddenProp: function getHiddenProp() {
			var prefixes = ['webkit', 'moz', 'ms', 'o'];
			if ('hidden' in document1) return 'hidden';
			for (var i = 0; i < prefixes.length; i++) {
				if (prefixes[i] + 'Hidden' in document1) return prefixes[i] + 'Hidden';
			}
			return null;
		},
		monitorTabVisibility: function monitorTabVisibility() {
			var visProp = this.getHiddenProp(),
				self1 = this;
			if (visProp) {
				var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
				document1.addEventListener(evtname, function () {
					self1.tabVisibilityChanged();
				});
			}
		},
		tabIsHidden: function tabIsHidden() {
			var prop = this.getHiddenProp();
			if (!prop) return false;
			return document1[prop];
		},
	};
	Im.Start = function ($container) {
		this.__construct($container);
	};
	var _obj;
	Im.Start.prototype =
		((_obj = {
			__construct: function __construct($container) {
				this.spinnerHTML =
					'<div class="spinner">				<div class="bounce1"></div>				<div class="bounce2"></div>				<div class="bounce3"></div>			</div>';
				var CapImage = new Image();
				CapImage.src = '//lztcdn.com/files/c4f7a51e-28d6-4b89-ba9c-00424d5e0202.webp';
				this.conversationCapHTML =
					'<div class="conversationCap">                <img class="conversationCapImage" src="' +
					CapImage.src +
					'" alt="' +
					XenForo.phrases.conversationCap +
					'">                <div class="conversationCapText">' +
					XenForo.phrases.conversationCap +
					'</div>            </div>';
				this.$container = $container;
				this.$conversationList = $container.find('#ConversationListItems');
				createNavigationCache();
				$1(this.spinnerHTML).attr('id', 'conversationsLoadSpinner').appendTo(this.$conversationList);
				this.$conversationsLoadSpinner = this.$conversationList.find('#conversationsLoadSpinner').hide();
				this.$conversationListScrollbar = $1('#ConversationListScrollbar');
				this.href = undefined;
				this.refreshDocHeightInterval = undefined;
				this._fullModeEnabled = this.fullModeEnabled();
				this.setContainerHeight();
				var disableScrolling = false;
				if (window1.location.hash.substring(1).indexOf('message-') >= 0) {
					var $el = $1(window1.location.hash);
					if ($el.length) {
						$el[0].scrollIntoView(false);
						disableScrolling = true;
						this.animateBackgroundColor($el);
					}
				}
				this.autoScrollEnabled = true;
				this.isSmoothScrolling = false;
				this.middleMouseButtonDown = false;
				this.requestAnimationFrameId = 0;
				this.updateSelectors(disableScrolling);
				this.loadPreviousMessagesInProgress = false;
				this.loadNextMessagesInProgress = false;
				this.initConversationSearch($1('#ConversationListSearch'));
				this.initModChanger();
				this.$conversationList.find('._loadConversation').on('click', $1.context(this, 'conversationListItemClickHandler'));
				this.setMessageListScrollHandler();
				this.setConversationMessagesScrollHandler();
				this.loadConversationListIfNeeded();
				this.initPopupLink();
				TabControl.monitorTabVisibility();
				var self1 = this;
				listenCall(
					'tabVisibilityChanged',
					function () {
						if (!this.tabIsHidden()) {
							self1.markConversationAsRead();
						}
					},
					TabControl,
				);
				this.messageListHeight = 0;
				this.initConversationJumpUp();
				$1(window1).on('resize', this.resize.bind(this));
				$1(window1).on('scroll', function () {
					if ($1('#headerMover').get(0).getBoundingClientRect().top < 59) {
						$1('#content').css('margin-top', '30px');
					}
				});
				$1(window1).on(
					'popstate',
					function (e) {
						if (XenForo.preservePopstate) return;
						if (!this.fullModeEnabled()) {
							$1('#toConversationList').trigger('click');
							return;
						}
						this.$conversationList.find('.active').removeClass('active');
						$1('.SearchResults').find('.active').removeClass('active');
						this.href = e.target.location.href;
						if (this.href in Im.navigationCache) {
							$1('.ImViewContent')
								.html(Im.navigationCache[this.href])
								.find('.LolzteamEditorSimple')
								.detach()
								.appendTo('.defEditor');
							$1('.ImViewContent').xfActivate();
							this.updateSelectors();
						} else {
							this.loadConversationClick();
						}
						$1('li[data-href="'.concat(this.href, '"]')).addClass('active');
						//$(".scroll-content #messageDateContainer").remove();
					}.bind(this),
				);
				if (this.$messageList) this.$messageList.find('ol > li').each(this.setMessageTime);
				this.setConversationListTime();
				$1(document1).keydown(this.editKeydownHandler.bind(this));
				// if (this.$ed) this.$ed.$textarea.on('lzt-editor:initDone', this.resize.bind(this));
				$1(document1).on('lzt-editor:toolbar-toggle', this.resize.bind(this));
				$container.find('ul.autoCompleteList').scrollbar();
				$1('.conversationMessages img, .conversationMessages video').on('load loadeddata', this.scrollDialogToBottom.bind(this));
			},
			setConversationListTime: function setConversationListTime() {
				$1('.conversationItem--messageDate').each(function () {
					var $messageDate = $1(this);
					if (/^\d{2}:\d{2}$/.test($messageDate.text().trim())) {
						var absoluteTime = $messageDate.data('absolutetime');
						if (!absoluteTime) return;
						$messageDate.text(formatTime(absoluteTime * 1000));
					}
				});
			},
			initConversationJumpUp: function initConversationJumpUp() {
				this.$conversationJumpUp = $1('<div id="conversationJumpUp"></div>')
					.hide()
					.css('bottom', '-60px')
					.appendTo('.conversationList');
				this.conversationJumpUpHidden = true;
				this.conversationJumpUpHidden = false;
				this.$conversationJumpUp.on(
					'click',
					function () {
						this.$conversationListScrollbar.scrollTop(0);
					}.bind(this),
				);
			},
			hideConversationJumpUp: function hideConversationJumpUp() {
				if (this.conversationJumpUpHidden || this.conversationJumpUpInProgress) return;
				this.conversationJumpUpHidden = true;
				this.conversationJumpUpInProgress = true;
				this.$conversationJumpUp.animate(
					{
						bottom: '-60px',
					},
					250,
					function () {
						this.conversationJumpUpInProgress = false;
						this.$conversationJumpUp.hide();
						this.updateConversationJumpUp();
					}.bind(this),
				);
			},
			showConversationJumpUp: function showConversationJumpUp() {
				if (!this.conversationJumpUpHidden || this.conversationJumpUpInProgress) return;
				this.conversationJumpUpHidden = false;
				this.conversationJumpUpInProgress = true;
				this.$conversationJumpUp.show();
				this.$conversationJumpUp.animate(
					{
						bottom: '0px',
					},
					250,
					function () {
						this.conversationJumpUpInProgress = false;
						this.updateConversationJumpUp();
					}.bind(this),
				);
			},
			updateConversationJumpUp: function updateConversationJumpUp() {
				if (!this.$conversationJumpUp) return;
				var $searchResults = this.$conversationListScrollbar.find('.SearchResults');
				var $conversationList;
				if (this.$conversationList.is(':visible')) {
					$conversationList = this.$conversationList;
				} else if ($searchResults.is(':visible')) {
					$conversationList = $searchResults;
				} else {
					this.hideConversationJumpUp();
					return;
				}
				var $firstConversation = $conversationList.find('li:first');
				if (!$firstConversation.length) {
					this.hideConversationJumpUp();
					return;
				}
				if ($conversationList.parent().offset().top > $firstConversation.offset().top + $firstConversation.outerHeight()) {
					this.showConversationJumpUp();
				} else {
					this.hideConversationJumpUp();
				}
			},
			setMessageTime: function setMessageTime() {
				var $message = $1(this);
				var $messageDate = $message.find('.messageDate');
				var dateString = formatTime($messageDate.data('absolutetime') * 1000);
				$messageDate.html(dateString);
			},
			setMessageTimeNow: function setMessageTimeNow() {
				var $message = $1(this);
				var $messageDate = $message.find('.messageDate');
				var dateString = formatTime(Date.now());
				$messageDate.html(dateString);
			},
			initPopupLink: function initPopupLink() {
				var $link = $1('.ConversationsPopupLink');
				$link.parent().removeClass('Popup PopupControl PopupContainerControl');
				$link.on('click', function (e) {
					e.preventDefault(e);
					$1('.conversationList').show();
				});
			},
			setContainerHeight: function setContainerHeight() {
				var topBottomOffset = 15 * 2;
				if (!this._fullModeEnabled) {
					topBottomOffset = 15;
				}
				this.$container.height($1(window1).height() - $1('#header').height() - topBottomOffset);
			},
			loadConversationListIfNeeded: function loadConversationListIfNeeded() {
				this.$conversationListScrollHelper = $1('.ConversationListInsertHelper');
				var self1 = this;
				var prepareItems = function prepareItems() {
					self1.$conversationList
						.find('._loadConversation')
						.on('click', function (e) {
							self1.conversationListItemClickHandler(e);
						})
						.each(function () {
							if ($1(this).attr('id').indexOf(Im.conversationId) >= 0) {
								self1.markCurrent($1(this));
							}
						});
				};
				var callback = function callback(ajaxData) {
					if (!XenForo.hasResponseError(ajaxData)) {
						$1(ajaxData.templateHtml).each(function (i) {
							var element = $1('#' + $1(this).attr('id'));
							if (!element.length) {
								$1(this).xfInsert('insertBefore', self1.$conversationListScrollHelper, 'show', 0);
							}
						});
						self1.setConversationListTime();
						self1.$conversationsLoadSpinner.hide();
						setTimeout(
							function () {
								return prepareItems();
							},
							self1.setConversationListScrollHandler(),
							500,
						);
					}
				};
				if ($1('.LoadConversationsHelper').length) {
					this.$conversationsLoadSpinner.show();
					XenForo.ajax(this.$conversationList.data('link'), {}, callback, {
						global: false,
					});
				} else {
					this.setConversationListScrollHandler();
				}
			},
			initModChanger: function initModChanger() {
				var callback = function callback(ajaxData) {
					if (!XenForo.hasResponseError(ajaxData)) {
						self1.$searchLoader.hide();
						if (!ajaxData.templateHtml.trim().length) {
							$noUnreadConversations.show();
						}
						$unreadConversations.html(ajaxData.templateHtml).xfActivate().show();
						self1.setConversationListTime();
						$unreadConversations.find('._loadConversation').on('click', function (e) {
							var $conversation = $1('#ConversationListItems #conversation-' + $1(this).data('cid'));
							if ($conversation.length) {
								e.currentTarget = $conversation[0];
							}
							self1.conversationListItemClickHandler(e);
							$1(this).remove();
							if (!$unreadConversations.find('._loadConversation').length) {
								$unreadConversations.hide();
								self1.$conversationList.show();
								$showUnread.addClass('visible');
								$showAll.removeClass('visible');
							}
						});
						self1.$conversationList.hide();
					}
				};
				var $button = this.$container.find('.ModChanger');
				var $showAll = $button.filter('.ShowAll');
				var $showUnread = $button.filter('.ShowUnread');
				var $noUnreadConversations = this.$container.find('.NoUnreadConversations');
				var $unreadConversations = this.$container.find('.UnreadConversationList');
				var self1 = this;
				$button.on('click', function () {
					$1(this).removeClass('visible');
					if ($1(this).hasClass('ShowUnread')) {
						self1.$conversationList.hide();
						self1.$searchLoader.show();
						XenForo.ajax($1(this).data('url'), {}, callback);
						$showAll.addClass('visible');
					} else {
						$noUnreadConversations.hide();
						$unreadConversations.hide();
						self1.$conversationList.show();
						$showUnread.addClass('visible');
					}
				});
			},
			initConversationSearch: function initConversationSearch($form) {
				var checkInput = function checkInput(el) {
					if ($1(el).val().trim().length > 2) {
						searchInMessages = false;
						self1.$conversationList.hide();
						self1.$searchLoader.show();
						$searchCup.hide();
						$searchResults.hide();
						XenForo.ajax($form.attr('action'), $form.serializeArray(), searchCallback);
					} else if ($1(el).val().length === 0) {
						// Hide search results and show latest conversations
						$searchCup.hide();
						self1.$searchLoader.hide();
						$searchResults.hide();
						$unreadConversations.hide();
						self1.$conversationList.show();
					}
				};
				var $parent = this.$conversationListScrollbar;
				var $searchResults = $parent.find('.SearchResults');
				var $unreadConversations = $parent.find('.UnreadConversationList');
				var self1 = this;
				var searchInMessages = false;
				var $searchCup = $parent.find('.searchCup');
				$1(this.spinnerHTML).attr('id', 'searchLoader').appendTo($parent);
				this.$searchLoader = $parent.find('#searchLoader');
				this.$searchLoader.hide();
				function searchCallback(ajaxData) {
					self1.$searchLoader.hide();
					if (!XenForo.hasResponseError(ajaxData)) {
						$unreadConversations.hide();
						self1.$conversationList.hide();
						if (!ajaxData.templateHtml.length) {
							$searchCup.show();
						} else {
							$searchCup.hide();
							$searchResults.html($1(ajaxData.templateHtml)).xfActivate().show();
							$searchResults.find('._loadConversation').on('click', function (e) {
								self1.conversationListItemClickHandler(e);
								if (!searchInMessages) {
									$searchResults.hide();
									console.log($input);
									$input.val('');
									$unreadConversations.hide();
									self1.$conversationList.show();
								}
							});
						}
						self1.setConversationListTime();
						var $messageSearchForm = $searchResults.find('form.ConversationListMessageSearch');
						if ($messageSearchForm.length) {
							$messageSearchForm.on('submit', function (e) {
								e.preventDefault();
								searchInMessages = true;
								console.log($input);
								$input.val('');
								$searchResults.hide();
								self1.$searchLoader.show();
								XenForo.ajax(
									$messageSearchForm.attr('action'),
									$messageSearchForm.serializeArray(),
									searchCallback,
								);
							});
						}
					}
				}
				var timer,
					$input = $form.find('input.universalSearchInput');
				$input.on('input', function () {
					if (timer) clearTimeout(timer);
					timer = setTimeout(
						function () {
							checkInput(this);
						}.bind(this),
						400,
					);
				});
				$form.on('submit', function (e) {
					e.preventDefault();
					checkInput($input);
				});
			},
			conversationListItemClickHandler: function conversationListItemClickHandler(e) {
				this.saveMessageDraft();
				this.$conversationList.find('.active').removeClass('active');
				$1('.SearchResults').find('.active').removeClass('active');
				var $element = $1(e.currentTarget);
				this.href = $element.data('href');
				this.markCurrent($element);
				this.loadConversationClick();
			},
			setConversationListScrollHandler: function setConversationListScrollHandler() {
				this.$conversationListScrollbar.scrollbar();
				this.currentListPage = 1;
				this.conversationListLoadInProgress = false;
				if (this.$conversationList.find('._loadConversation').length >= Im.conversationsPerPage) {
					this.$conversationListScrollbar.on('scroll', $1.context(this, 'conversationListScroll'));
				}
				this.updateConversationJumpUp();
			},
			conversationListScroll: function conversationListScroll() {
				if (isScrolledIntoView(this.$conversationListScrollHelper) && !this.conversationListLoadInProgress) {
					this.conversationListLoadInProgress = true;
					var data = {
						page: this.currentListPage + 1,
					};
					this.$conversationsLoadSpinner.show();
					XenForo.ajax(this.$conversationList.data('link'), data, $1.context(this, 'conversationListScrollCallback'), {
						global: false,
					});
				}
				this.updateConversationJumpUp();
			},
			conversationListScrollCallback: function conversationListScrollCallback(ajaxData) {
				if (!XenForo.hasResponseError(ajaxData)) {
					if (ajaxData.templateHtml.length) {
						var self1 = this;
						this.currentListPage++;
						this.conversationListLoadInProgress = false;
						$1(ajaxData.templateHtml).xfInsert(
							'insertBefore',
							this.$conversationListScrollHelper,
							'xfFadeIn',
							500,
							function (e) {
								$1(this).on('click', function (e) {
									self1.conversationListItemClickHandler(e);
								});
							},
						);
					}
					this.$conversationsLoadSpinner.hide();
				}
			},
			markConversationAsRead: function markConversationAsRead() {
				if (this.$messageList) {
					var unreadMessageIds = [];
					this.$messageList.find('li.unread').each(function () {
						if ($1(this).data('user-id') !== XenForo.visitor.user_id) {
							unreadMessageIds.push($1(this).data('message-id'));
							$1(this).removeClass('unread');
						}
					});
					if (unreadMessageIds.length) {
						var data = {
							do: 'message_read',
							conversation_id: Im.conversationId,
							message_ids: unreadMessageIds,
							user_id: XenForo.visitor.user_id,
						};
						XenForo.ajax(window1.location.href.replace(/\/$/, '') + '/mark-as-read', {}, function () {}, {
							global: false,
						});
					}
				}
			},
			insertItemToConversationList: function (item, conversationId) {
				var $item = $1(item);
				if (Im.conversationId === conversationId) {
					this.markCurrent($item);
				}
				var $existingConversation = this.$conversationList.find('#conversation-' + conversationId);
				var existing = $existingConversation.length;
				if (existing && $existingConversation.index() === 0) {
					$existingConversation.replaceWith($item);
				} else {
					// Mark as unread
					if (existing) $existingConversation.remove();
					if ($1('.starredConversationIcon').length) $item.insertAfter($1('.starredConversationIcon:last').closest('li'));
					else $item.prependTo(this.$conversationList);
				}
				$item.on('click', $1.context(this, 'conversationListItemClickHandler'));
				this.setMessageTime.bind(item)();
				this.setConversationListTime();
			},
			needToRenderBbCode: function needToRenderBbCode(content) {
				content = content.replace('<p>', '').replace('</p>', '').trim();
				var tags = ['[', '[', '<', '>'];
				var res = false;
				tags.some(function (item) {
					if (content.indexOf(item) > 0) {
						res = true;
						return true;
					}
				});
				return res;
			},
			deleteImageFromContent: function deleteImageFromContent(content) {
				return content
					.replace(/<img.+?alt="\[IMG\]".+?>/i, '<span class="tagTitle">' + XenForo.phrases.image + '</span>')
					.replace('  ', ' ');
			},
			getMessageSelector: function getMessageSelector(messageId) {
				return $1('#message-' + messageId);
			},
			hideMask: function hideMask() {
				this.$quickReply.data('processing', 0);
				this.$quickReply.find('.Mask').addClass('hidden');
			},
			showMask: function showMask() {
				this.$quickReply.data('processing', 1);
				this.$quickReply.find('.Mask').removeClass('hidden');
			},
			saveMessage: function saveMessage(content) {
				// Message save after edit
				var $message = this.getMessageSelector(this.$quickReply.data('MSG_ID'));
				$message.find('.messageText').html(content);
				if (this.$ed) {
					this.hideMask();
				}
				this.refreshMessageListHeight();
			},
			refreshMessageListHeight: function refreshMessageListHeight() {
				var diff;
				var $header = $1('.ImDialogHeader');
				var $bottom = $1('#QuickReply');
				var headerH = $header.outerHeight();
				var bottomH = $bottom.outerHeight();
				if ($bottom.data('height') && bottomH !== $bottom.data('height')) {
					diff = bottomH - $bottom.data('height');
				}
				$header.data('height', headerH);
				$bottom.data('height', bottomH);
				var height = $1('#Conversations').outerHeight() - headerH - bottomH;
				$1('.conversationMessages').css('max-height', height);
				if (diff) {
					this.$messageList.scrollTop(this.$messageList.scrollTop() + diff);
				}
			},
			prevent: function prevent(e) {
				e.preventDefault();
				return false;
			},
			setQuickReplyHandler: function setQuickReplyHandler() {
				var _this = this;
				this.$quickReply = this.$dialog.find('#QuickReply');
				var $textarea = this.$quickReply.find('textarea');
				this.$ed = $textarea.data('Lolzteam.EditorSimple');
				var isNeedToRenderBbCode;
				var onSubmit = function () {
					var _this = this;
					var content = this.prepareContent(this.$ed.ed.html.get());
					if (!content && !$1('#ctrl_reply_message_ids').val().length) {
						this.hideMask();
						_this.$ed.ed.events.focus();
						return;
					}
					isNeedToRenderBbCode = this.needToRenderBbCode(content);
					var data = this.$quickReply.serializeArray();
					data = data.filter(function (objectElement) {
						return objectElement.name !== 'message_html';
					});
					var messageTime = Date.now();
					data.push(
						{
							name: 'message_html',
							value: content,
						},
						{
							name: 'tab_id',
							value: this.getBrowserTabId(),
						},
						{
							name: 'messageTime',
							value: messageTime,
						},
					);
					$1('#ctrl_reply_message_ids').val('');
					this.insertMessageFromEditor(content, messageTime);
					var ajaxCallback = function (data) {
						if (XenForo.hasResponseError(data)) {
							_this.$ed.ed.html.set(content);
							_this.$container.trigger('insertMessageError');
						}
						_this.hideMask();
						_this.$ed.ed.events.focus();
					};
					XenForo.ajax(this.$quickReply.attr('action'), data, ajaxCallback.bind(this), {
						global: false,
					});
					$1('.MessageManagePanel').data('Im.MessageManagePanel').cancelMessageReply();
					if (this.$quickReply.data('MSG_ID')) this.hideEditingBox();
				}.bind(this);
				this.$quickReply.on(
					'submit',
					function (e) {
						e.preventDefault();
						setTimeout(
							function () {
								onSubmit();
								this.$ed.ed.html.set('');
								this.refreshMessageListHeight();
							}.bind(this),
							200,
						);
					}.bind(this),
				);
				var $quickReplyFrame = this.$quickReply.find('.redactor_MessageEditor');
				var onFrameLoad = function () {
					$quickReplyFrame.contents().keydown(this.editKeydownHandler.bind(this));
					$quickReplyFrame.contents().find('body').on('change', console.log);
				}.bind(this);
				var observer = new ResizeObserver(function (entries) {
					var _iteratorNormalCompletion = true,
						_didIteratorError = false,
						_iteratorError = undefined;
					try {
						for (
							var _iterator = entries[Symbol.iterator](), _step;
							!(_iteratorNormalCompletion = (_step = _iterator.next()).done);
							_iteratorNormalCompletion = true
						) {
							var entry = _step.value;
							_this.resize();
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return != null) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				});
				$quickReplyFrame.ready(
					function () {
						$quickReplyFrame.load(onFrameLoad);
						onFrameLoad();
						if (this.$quickReply.length) {
							observer.observe(this.$quickReply[0]);
						}
					}.bind(this),
				);
			},
			prepareContent: function prepareContent(content) {
				/*var tmp = content.replace('<p>', '').replace('</p>', '').trim();
            if (tmp.indexOf('<br>') === 0) return '';*/ if (!content) return '';
				return content === null || content === void 0 ? void 0 : content.trim();
			},
			callbackWithoutInsertMessage: function callbackWithoutInsertMessage(ajaxData, messageTime) {
				if (!XenForo.hasResponseError(ajaxData)) {
					this.$quickReply.trigger($1.Event('AutoValidationComplete'));
					var $activeConversation = this.$conversationList.find('.active.conversationItem');
					if (!this.$quickReply.data('MSG_ID')) {
						var $templateHtml = $1(ajaxData.templateHtml).each(this.setMessageTime);
						var $messageDate = $templateHtml.find('.messageDate').text().trim();
						if (ajaxData.messageTime) {
							$templateHtml.xfInsert(
								'replaceAll',
								'#messageHelper--' + ajaxData.messageTime,
								'show',
								0,
								this.$messageList.xfActivate.bind(this.$messageList),
							);
						} else {
							$templateHtml.xfInsert(
								'replaceAll',
								'#message-' + $templateHtml.data('message-id'),
								'show',
								0,
								this.$messageList.xfActivate.bind(this.$messageList),
							);
						}
						this.bindQuoteHandler($templateHtml);
						if ($activeConversation.length) {
							$activeConversation.find('.conversationItem--messageDate').text($messageDate);
						} else {
							this.insertItemToConversationList(ajaxData.conversation_list_item_for_visitor, Im.conversationId);
						}
					}
				} else {
					$1('#messageHelper--' + messageTime).remove();
				}
			},
			callbackWithInsertMessage: function callbackWithInsertMessage(ajaxData) {
				this.$quickReply.trigger($1.Event('AutoValidationComplete'));
				var $templateHtml = $1(ajaxData.templateHtml).each(this.setMessageTime);
				this.bindQuoteHandler($templateHtml);
				if (this.$quickReply.data('MSG_ID')) {
					$templateHtml.xfInsert(
						'replaceAll',
						this.$messageList.find('#message-' + this.$quickReply.data('MSG_ID')),
						'show',
						0,
						this.$messageList.xfActivate.bind(this.$messageList),
					);
					this.hideEditingBox();
				} else {
					$templateHtml.xfInsert('appendTo', this.$messageList.children('ol'), 'xfFadeIn', 500);
				}
				this.hideMask();
				this.scrollDialogToBottom();
				var $activeConversation = this.$conversationList.find('.active.conversationItem');
				// Delete current conversation and add new conversation item to conversation list
				this.insertItemToConversationList($activeConversation, Im.conversationId);
			},
			insertMessageFromEditor: function insertMessageFromEditor(content, messageTime) {
				if (!this.$quickReply.data('MSG_ID')) {
					this.$container.trigger('insertMessageFromEditor', {
						content: content,
						messageTime: messageTime,
					});
				}
				if (this.$ed) {
					this.$ed.ed.html.set('');
					this.hideMask();
				}
				this.setConversationListTime();
				this.scrollDialogToBottom();
			},
			getBrowserTabId: function getBrowserTabId() {
				var value = sessionStorage.tabID ? sessionStorage.tabID : (sessionStorage.tabID = Math.floor(Math.random() * Math.pow(10, 6)));
				return parseInt(value, 10);
			},
			getDialogElement: function getDialogElement(conversationId) {
				return this.$container.find('.ImDialog-' + conversationId);
			},
			refreshDocHeight: function refreshDocHeight() {
				var h = this.$messageList.children('ol').height();
				if (h !== this.messageListHeight) {
					this.messageListHeight = h;
				}
			},
			setRefreshDocHeightInterval: function setRefreshDocHeightInterval() {
				if (this.refreshDocHeightInterval) clearInterval(this.refreshDocHeightInterval);
				this.messageListHeight = this.$messageList.children('ol').height();
				this.refreshDocHeightInterval = window1.setInterval($1.context(this, 'refreshDocHeight'), 500);
			},
			animateBackgroundColor: function animateBackgroundColor($el) {
				if ($el.data('animated')) {
					return;
				}
				$el.attr('data-animated', 1);
				var defaultBackgroundColor = $el.css('background-color');
				$el.animate(
					{
						backgroundColor: 'rgb(45,45,45)',
					},
					500,
					function () {
						setTimeout(function () {
							$el.animate(
								{
									backgroundColor: defaultBackgroundColor,
								},
								500,
								function () {
									$el.attr('data-animated', 0);
									$el.css('backgroundColor', '');
								},
							);
						}, 2000);
					},
				);
			},
			setPageUrl: function setPageUrl(url) {
				history.pushState(
					{
						page: url,
						type: 'page',
						title: document1.title,
						description: $1('meta[name="description"]').text(),
					},
					document1.title,
					url,
				);
			},
			updateSelectors: function updateSelectors() {
				if (Im.conversationId) {
					this.$dialog = this.getDialogElement(Im.conversationId);
					this.$messageList = $1('#ConversationMessageList');
					this.$messageList.scrollbar();
					this.setRefreshDocHeightInterval();
					this.refreshMessageListHeight();
					this.scrollDialogToBottom(true);
					this.totalPages = this.$dialog.data('pages');
					this.currentPage = this.$dialog.data('page') || 1;
					this.currentDownPage = this.$dialog.data('page');
					this.autoScrollEnabled = this.currentDownPage === 1;
					this.$scrollHelper = $1('.MessageListInsertHelper');
					this.$typingNotice = this.$dialog.find('.TypingNotice');
					this.setQuickReplyHandler();
					this.setMessageListScrollHandler();
					this.setConversationMessagesScrollHandler();
					if (!$1('#messageDateContainer').length) {
						$1('.scroll-wrapper.conversationMessages').prepend(
							'<div id="messageDateContainer"><div id="messageDate"></div></div>',
						);
					}
					this.$messageDate = $1('#messageDate');
					this.updateMessageDate();
					this.initMessageJumpDown();
					$1(this.spinnerHTML).attr('id', 'messageLoadSpinner').prependTo(this.$messageList.children('ol'));
					this.$messageLoadSpinner = this.$messageList.find('#messageLoadSpinner').hide();
					$1('.ImDialogHeader').prepend('<a href="conversations/" class="fl_l OverlayTrigger" id="toConversationList"></a>');
					this.$toConversationList = $1('.ImDialogHeader > #toConversationList').on(
						'click',
						function (e) {
							e.preventDefault();
							$1('.conversationList').show();
							this.setPageUrl('/conversations/');
							this.updateToConversationList();
							this.$conversationList.find('.active.conversationItem').removeClass('active');
						}.bind(this),
					);
					this.updateToConversationList();
					this.bindQuoteHandler(this.$messageList);
				}
			},
			initMessageJumpDown: function initMessageJumpDown() {
				this.$messageJumpDown = $1('<div id="messageJumpDown"></div>')
					.hide()
					.css('bottom', '-60px')
					.appendTo('.scroll-wrapper.conversationMessages');
				this.messageJumpDownHidden = true;
				this.messageJumpDownInProgress = false;
				this.$messageJumpDown.on(
					'click',
					function () {
						if (this.currentDownPage === 1) {
							this.$messageList.scrollTop(
								this.$messageList.find('li:last').offset().top + this.$messageList.scrollTop(),
							);
						} else {
							this.href = '/conversations/'.concat(Im.conversationId, '/');
							this.setPageUrl(this.href);
							XenForo.ajax(
								this.href,
								{
									fromList: true,
								},
								$1.context(this, 'loadConversationCallback'),
								{
									global: false,
								},
							);
						}
					}.bind(this),
				);
				this.updateMessageJumpDown();
			},
			updateMessageJumpDown: function updateMessageJumpDown() {
				if (this.messageJumpDownInProgress) return;
				var $lastMessage = this.$messageList.find('li:last');
				if (!$lastMessage.length) return;
				var doShow = this.$messageList.height() + this.$messageList.offset().top < $lastMessage.offset().top;
				if (doShow !== this.messageJumpDownHidden) return;
				if (doShow && this.autoScrollEnabled) return;
				this.messageJumpDownHidden = !doShow;
				this.messageJumpDownInProgress = true;
				if (doShow) this.$messageJumpDown.show();
				this.$messageJumpDown.animate(
					{
						bottom: doShow ? '0px' : '-60px',
					},
					250,
					function () {
						this.messageJumpDownInProgress = false;
						if (!doShow) this.$messageJumpDown.hide();
						this.updateMessageJumpDown();
					}.bind(this),
				);
			},
			updateMessageDate: function updateMessageDate() {
				var _this_$messageDate_offset, _this_$messageDate;
				var dateElems = $1('.messagesGroupDate');
				if (!this.$messageDate.length) return;
				if (!dateElems.length) {
					this.messageDateHidden = true;
					this.$messageDate.css({
						opacity: '0%',
					});
					return;
				}
				var topOffset =
					(_this_$messageDate_offset =
						(_this_$messageDate = this.$messageDate) === null || _this_$messageDate === void 0
							? void 0
							: _this_$messageDate.offset()) === null || _this_$messageDate_offset === void 0
						? void 0
						: _this_$messageDate_offset.top;
				var isDateSet = false;
				for (var i = dateElems.length - 1; i >= 0; i--) {
					var $dateElem = $1(dateElems[i]);
					if (!isDateSet && $dateElem.offset().top <= topOffset) {
						this.messageDateHidden = false;
						this.$messageDate.css({
							opacity: '100%',
						});
						this.$messageDate.text($dateElem.text());
						isDateSet = true;
					}
					$dateElem.css('opacity', isDateSet ? '0%' : '100%');
				}
				if (isDateSet) return;
				this.messageDateHidden = true;
				this.$messageDate.css({
					opacity: '0%',
				});
			},
			updateToConversationList: function updateToConversationList() {
				var $conversationList = $1('.conversationList');
				if ($conversationList.css('display') === 'none') {
					this.$toConversationList.show();
				} else this.$toConversationList.hide();
			},
			setMessageListScrollHandler: function setMessageListScrollHandler() {
				if (!Im.conversationId) {
					return;
				}
				this.$messageList.on('scroll', $1.context(this, 'messageListScroll'));
				for (var _i = 0, _iter = ['wheel', 'touchmove']; _i < _iter.length; _i++) {
					var event = _iter[_i];
					this.$messageList.on(event, $1.context(this, 'disableAutoScroll'));
				}
			},
			setConversationMessagesScrollHandler: function setConversationMessagesScrollHandler() {
				if (!Im.conversationId) {
					return;
				}
				var conversationMessagesScrollElement = $1('.conversationMessages .scroll-element').last();
				for (var _i = 0, _iter = ['mousemove', 'touchmove', 'wheel']; _i < _iter.length; _i++) {
					var event = _iter[_i];
					conversationMessagesScrollElement.on(event, $1.context(this, 'disableAutoScroll'));
				}
				this.setConversationMessagesMiddleMouseHandler();
			},
			setConversationMessagesMiddleMouseHandler: function setConversationMessagesMiddleMouseHandler() {
				var _this = this,
					_loop = function (_i, _iter) {
						var event = _iter[_i];
						conversationMessages.on(
							event,
							function (e) {
								if (e.button === 1) {
									this.middleMouseButtonDown = e.type === 'mousedown';
								} else if (event === 'mousemove' && this.middleMouseButtonDown) {
									this.disableAutoScroll();
								}
							}.bind(_this),
						);
					};
				var conversationMessages = $1('.conversationMessages');
				for (var _i = 0, _iter = ['mousedown', 'mouseup', 'mousemove']; _i < _iter.length; _i++) _loop(_i, _iter);
			},
			disableAutoScroll: function disableAutoScroll(e) {
				if (this.requestAnimationFrameId) {
					cancelAnimationFrame(this.requestAnimationFrameId);
				}
				this.$messageList.stop();
				this.autoScrollEnabled = false;
				this.isSmoothScrolling = false;
			},
			messageListScroll: function messageListScroll(e) {
				if (this.autoScrollEnabled) {
					this.requestAnimationFrameId = requestAnimationFrame(this.scrollDialogToBottom.bind(this, true));
				} else if (isScrolledToBottom(e) && this.currentDownPage === 1) {
					this.autoScrollEnabled = true;
				}
				if (
					this.$dialog.data('pages') &&
					this.$dialog.data('pages') > 0 &&
					this.currentPage < this.totalPages &&
					isScrolledIntoView(this.$scrollHelper) &&
					!this.loadPreviousMessagesInProgress
				) {
					this.loadPreviousMessagesInProgress = true;
					this.loadPreviousMessages();
				}
				if (
					!this.loadNextMessagesInProgress &&
					this.currentDownPage > 1 &&
					this.$dialog.data('page') > 1 &&
					$1('.message-block:last').offset().top < this.$messageList.offset().top + this.$messageList.height()
				)
					this.loadNextMessages();
				this.updateMessageDate();
				if (!this.messageDateHidden) {
					$1('#messageDate').fadeIn(50);
					if (this.messageDateFadeOut) {
						clearTimeout(this.messageDateFadeOut);
					}
					this.messageDateFadeOut = setTimeout(function () {
						$1('#messageDate').fadeOut(250);
					}, 1500);
				}
				this.updateMessageJumpDown();
			},
			getOldestMessageId: function getOldestMessageId() {
				return this.$messageList.find('.message-block').first().data('message-id');
			},
			loadPreviousMessages: function loadPreviousMessages() {
				var msgId = this.getOldestMessageId();
				if (!msgId) {
					return console.error('No msgId specified', msgId);
				}
				XenForo.ajax(
					window1.location.href,
					{
						max_message_id: msgId,
					},
					$1.context(this, 'loadPreviousMessagesCallback'),
					{
						global: false,
					},
				);
				this.$messageLoadSpinner.show();
			},
			loadNextMessages: function loadNextMessages() {
				var msgId = this.$messageList.find('.message-block:not(.MessageHelper):last').data('message-id');
				if (!msgId) {
					return console.error('No msgId specified', msgId);
				}
				var $spinner = $1(this.spinnerHTML).attr('id', 'nextMessageLoadSpinner').appendTo(this.$messageList);
				this.loadNextMessagesInProgress = true;
				XenForo.ajax(
					'/conversations/' + Im.conversationId + '/page-' + --this.currentDownPage,
					{},
					function (ajaxData) {
						if (XenForo.hasResponseError(ajaxData)) return;
						//createNavigationCache();
						var scrollBeforeInsert = this.$messageList.scrollTop();
						$spinner.remove();
						if (ajaxData.templateHtml) {
							if (this.refreshDocHeightInterval) clearInterval(this.refreshDocHeightInterval);
							this.bindQuoteHandler(
								$1(ajaxData.templateHtml).xfInsert(
									'insertAfter',
									this.$messageList.find('.message-block:not(.MessageHelper):last'),
									'show',
									0,
								),
							);
							this.removeSameMessageGroup();
							this.$messageList.scrollTop(scrollBeforeInsert);
							this.$messageList.find('ol > li').each(this.setMessageTime);
							this.$messageList.xfActivate();
							this.loadNextMessagesInProgress = false;
							this.setRefreshDocHeightInterval();
						}
					}.bind(this),
					{
						global: false,
					},
				);
			},
			removeSameMessageGroup: function () {
				var groups = [];
				$1('.messagesGroupDate')
					.sort(function (a, b) {
						return $1(a).offset().top - $1(b).offset().top;
					})
					.each(function () {
						var $elem = $1(this);
						var text = $elem.text();
						if (groups.includes(text)) {
							$elem.remove();
						} else {
							groups.push(text);
						}
					});
			},
			loadPreviousMessagesCallback: function loadPreviousMessagesCallback(ajaxData) {
				if (!XenForo.hasResponseError(ajaxData)) {
					//createNavigationCache();
					var scrollBottom = this.$messageList.prop('scrollHeight') - this.$messageList.height() - this.$messageList.scrollTop();
					this.$messageLoadSpinner.hide();
					if (ajaxData.templateHtml) {
						if (this.refreshDocHeightInterval) clearInterval(this.refreshDocHeightInterval);
						$1(ajaxData.templateHtml)
							.find('img')
							.each(function () {
								new Image().src = this.src;
							});
						this.bindQuoteHandler($1(ajaxData.templateHtml).insertAfter(this.$scrollHelper));
						this.removeSameMessageGroup();
						this.$messageList.find('ol > li').each(this.setMessageTime);
						this.$messageList.xfActivate();
						this.$messageList.scrollTop(this.$messageList.prop('scrollHeight') - this.$messageList.height() - scrollBottom);
						this.currentPage++;
						this.loadPreviousMessagesInProgress = false;
						this.setRefreshDocHeightInterval();
					}
				}
			},
			hideEditingBox: function hideEditingBox() {
				$1('.MessageEditingBox').hide();
				this.$quickReply.attr('action', this.$quickReply.data('default-action')).data('MSG_ID', 0);
				$1('#ctrl_reply_message_ids').val('');
				this.$ed.ed.html.set(this.$quickReply.data('oldMessage'));
				setTimeout(
					function () {
						this.refreshMessageListHeight();
					}.bind(this),
					100,
				);
			},
			saveMessageDraft: function saveMessageDraft() {
				var _this_$ed;
				if (
					Im.conversationId &&
					((_this_$ed = this.$ed) === null || _this_$ed === void 0 ? void 0 : _this_$ed.ed.ready) &&
					$1('.MessageEditingBox').is(':hidden')
				) {
					var draft = this.$ed.ed.xfDraft;
					var message = this.$ed.ed.html.get();
					if (this.$ed.ed._original_html.trim() !== message) {
						if (message === '') {
							draft.delete();
						} else {
							draft.save();
						}
					}
				}
			},
			editKeydownHandler: function editKeydownHandler(e) {
				var value = $1('#ctrl_message_html').val();
				switch (e.which) {
					case 27:
						var _this_$ed;
						var btn = this.$quickReply && this.$quickReply.find('.aboveRedactorBox:visible .Cancel');
						if (btn && btn.length) {
							btn.click();
							break;
						}
						if ($1('.tippy-popper').length) {
							$1('.tippy-popper').remove();
							break;
						}
						if (Im.forwardingMessageFlag || $1('.MessageManagePanel').is(':visible')) {
							$1('.MessageManagePanel').data('Im.MessageManagePanel').cancelMessageReply();
							Im.forwardingMessageFlag = false;
							$1('.ForwardMessageCap').css('display', 'none');
							break;
						} else {
							Im.selectedMessages = [];
						}
						if ($1('.MenuOpened').length) {
							$1(document1).trigger('HideAllMenus');
							break;
						}
						if (
							!$1(e.target).closest('.modal.fade').length &&
							Im.conversationId &&
							!$1('.spinner.conversationCap').length &&
							((_this_$ed = this.$ed) === null || _this_$ed === void 0 ? void 0 : _this_$ed.ed.ready) &&
							!$1('.fancybox__container').length
						) {
							this.saveMessageDraft();
							this.href = '/conversations/';
							Im.conversationId = 0;
							$1('.conversationList').show();
							this.setPageUrl(this.href);
							this.updateToConversationList();
							$1(this.conversationCapHTML).appendTo($1('.ImViewContent').html(''));
							this.$conversationList.find('.active.conversationItem').removeClass('active');
						}
						break;
					case 38:
						if (!this.prepareContent(value)) {
							var my_messages = $1(
								'#ConversationMessageList .message-block[data-user-id="' + XenForo.visitor.user_id + '"]',
							);
							if (my_messages.length) {
								e.preventDefault();
								my_messages.last().find('.EditMessage').click();
							}
						}
				}
			},
			editMessage: function editMessage(e) {
				var messageId = $1(e.target).closest('li').data('message-id');
				var $editingBox = $1('.MessageEditingBox');
				var jsonurl = $1(e.target).closest('.EditMessage').data('jsonurl');
				this.$quickReply.attr('action', this.$quickReply.data('edit-action').replace('MSG_ID', messageId));
				this.$quickReply.data('oldMessage', this.$ed.ed.html.get()).data('MSG_ID', messageId);
				Im.selectedMessages = [];
				$editingBox.show();
				var message = $1(e.target).closest('li').find('.messageText').html();
				$1(e.target).closest('li').data('oldMessage', message);
				var $activeConversation = this.$conversationList.find('.active.conversationItem');
				if ($activeConversation.length && $activeConversation.data('message-id') === messageId) {
					$activeConversation.data('oldMessage', $activeConversation.find('.message').html());
				}
				var optimizeMessageCode = function optimizeMessageCode(message) {
					if (!message.includes('[/CODE]')) return message;
					return message
						.replace(/\t/g, '    ')
						.replace(/  /g, '&nbsp; ')
						.replace(/  /g, ' &nbsp;')
						.replace(/\r\n|\n|\r/g, '<br />');
				};
				var callback = function (message) {
					message = optimizeMessageCode(message);
					this.$ed.ed.html.set(message);
					this.$ed.ed.$el.find('.username').attr('spellcheck', 'false');
					this.$ed.ed.selection.setAtEnd(this.$ed.ed.selection.endElement());
					this.$ed.ed.selection.restore();
					this.hideMask();
					setTimeout(
						function () {
							this.refreshMessageListHeight();
						}.bind(this),
						100,
					);
				}.bind(this);
				this.showMask();
				XenForo.ajax(
					jsonurl,
					{
						m: messageId,
						conversation_id: Im.conversationId,
					},
					function (ajaxData) {
						if (!XenForo.hasResponseError(ajaxData)) {
							callback(
								ajaxData.html.replace(/(\[code=[^\]]+\])(.+)(?=\[\/code\])(\[\/code\])/gi, function (_) {
									for (
										var _len = arguments.length, m = new Array(_len > 1 ? _len - 1 : 0), _key = 1;
										_key < _len;
										_key++
									) {
										m[_key - 1] = arguments[_key];
									}
									// https://zelenka.guru/threads/5599353/
									// m[1] попадает к нам в уже экранированном виде.
									//return `${m[0]}${XenForo.htmlspecialchars(m[1])}${m[2]}`
									return ''.concat(m[0]).concat(m[1]).concat(m[2]);
								}),
							);
						} else {
							this.hideMask();
							this.hideEditingBox();
						}
					}.bind(this),
				);
				$editingBox.find('.Cancel').on(
					'click',
					function () {
						this.hideEditingBox();
					}.bind(this),
				);
			},
			markCurrent: function markCurrent($element) {
				Im.conversationId = $element.data('cid');
				$element.addClass('active').removeClass('unread');
			},
		}),
		_define_property(_obj, 'setPageUrl', function setPageUrl(url) {
			history.pushState(
				{
					page: url,
					type: 'page',
				},
				document1.title,
				url,
			);
		}),
		_define_property(_obj, 'deleteTooltips', function () {
			$1('.bbCodeImageTip').remove();
		}),
		_define_property(_obj, 'loadConversationClick', function loadConversationClick() {
			$1('.bbCodeImageFullSize').remove();
			$1(this.spinnerHTML).addClass('conversationCap').appendTo($1('.ImViewContent').html(''));
			XenForo.ajax(
				this.href,
				{
					fromList: true,
				},
				$1.context(this, 'loadConversationCallback'),
				{
					global: false,
				},
			);
		}),
		_define_property(_obj, 'scrollDialogToBottom', function scrollDialogToBottom(instant) {
			var disableScrolling = false;
			if (window1.location.href.indexOf('message_id=')) {
				var url = new URL(window1.location.href);
				var id = url.searchParams.get('message_id');
				var $el = $1('#message-' + id);
				if ($el.length) {
					$el[0].scrollIntoView(false);
					disableScrolling = true;
					this.animateBackgroundColor($el);
				}
			}
			if (!disableScrolling) {
				var $messageList = this.$dialog.find('#ConversationMessageList');
				if ($messageList.length) {
					if (instant) {
						if (!this.autoScrollEnabled || this.isSmoothScrolling) {
							return;
						}
						$messageList.scrollTop($messageList[0].scrollHeight);
					} else {
						this.$messageList.stop();
						this.isSmoothScrolling = true;
						setImmediate(
							function () {
								$messageList.animate(
									{
										scrollTop: $messageList[0].scrollHeight,
									},
									this.autoScrollEnabled ? 3000 : 'smooth',
									function () {
										this.isSmoothScrolling = false;
									}.bind(this),
								);
							}.bind(this),
						);
					}
				}
			}
		}),
		_define_property(_obj, 'fullModeEnabled', function fullModeEnabled() {
			return $1(document1).width() >= 800;
		}),
		_define_property(_obj, 'resize', function resize() {
			var currentState = this.fullModeEnabled();
			var changed = currentState !== this._fullModeEnabled;
			this._fullModeEnabled = currentState;
			var $conversationList = $1('.conversationList');
			if (changed) {
				this.setContainerHeight();
				if (currentState) {
					$conversationList.show();
				} else {
					if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;
					$conversationList.hide();
				}
			}
			this.setContainerHeight();
			this.refreshMessageListHeight();
		}),
		_define_property(_obj, 'loadConversationCallback', function loadConversationCallback(ajaxData) {
			if (!XenForo.hasResponseError(ajaxData)) {
				if (Im.forwardingMessageFlag) {
					$1('.ForwardMessageCap').css('display', 'none');
				}
				if (ajaxData.isConversationList) {
					$1(this.conversationCapHTML).appendTo($1('.ImViewContent').html(''));
					return;
				}
				new XenForo.ExtLoader(
					ajaxData,
					function () {
						this.autoScrollEnabled = true;
						this.deleteTooltips();
						$1('.ImViewContent').html(ajaxData.templateHtml).xfActivate();
						$1('.conversationMessages img, .conversationMessages video').on(
							'load loadeddata',
							this.scrollDialogToBottom.bind(this),
						);
						if (!this._fullModeEnabled) {
							$1('.conversationList').hide();
						}
						if (!(location.href == this.href)) {
							this.setPageUrl(this.href);
						}
						this.updateSelectors();
						setTimeout(
							function () {
								this.markConversationAsRead();
							}.bind(this),
							3000,
						);
						if (Im.forwardingMessageFlag) {
							$1('.MessageManagePanel').data('Im.MessageManagePanel').replyButtonClick();
							Im.forwardingMessageFlag = false;
						} else {
							Im.selectedMessages = [];
						}
						this.$messageList.find('ol > li').each(this.setMessageTime);
						this.$container.trigger('LoadConversation', [Im.conversationId]);
						createNavigationCache();
					}.bind(this),
				);
			}
		}),
		_define_property(_obj, 'bindQuoteHandler', function bindQuoteHandler($messages) {
			$messages.on(
				'click',
				function (e) {
					if (!$1(e.target).closest('.quoteAuthor').length) {
						return;
					}
					var target = $1(e.target).closest('.quoteAuthor');
					e.preventDefault();
					var messageId = target.data('content-id');
					var loadedMessage = $1('#message-' + messageId);
					if (loadedMessage.length) {
						XenForo.preservePopstate = true;
						window1.location.hash = '#message-' + messageId;
						XenForo.preservePopstate = false;
						this.animateBackgroundColor(loadedMessage);
						return;
					}
					this.href = '/conversations/message?message_id=' + messageId;
					this.loadConversationClick();
				}.bind(this),
			);
		}),
		_obj);
	Im.Editor = function ($form) {
		this.__construct($form.closest('form'));
	};
	Im.Editor.prototype = {
		__construct: function __construct($form) {
			var refreshTypingStatus = function refreshTypingStatus() {
				if (self1.ed.$editor) {
					if (redactorBox.hasClass('focused') && self1.ed.$editor.text() !== '') {
						if (Date.now() - lastSentTime > sendingDelayMillis) {
							lastSentTime = Date.now();
							obj.sendUserIsTypingMessage();
						}
					}
				}
			};
			var updateLastTypedTime = function updateLastTypedTime() {
				lastTypedTime = Date.now();
			};
			this.ed = XenForo.getEditorInForm($form);
			var lastTypedTime = 0;
			var lastSentTime = 0;
			var sendingDelayMillis = 3000; // send message every 3 seconds
			//var typingDelayMillis = 5000;
			//var isTyping = 0;
			var self1 = this;
			var redactorBox = $form.find('.redactor_box');
			var obj = XenForo.create('Im.Start', '#Conversations');
			setInterval(refreshTypingStatus, 300);
			this.ed.opts.keyupCallback = function () {
				updateLastTypedTime();
			};
		},
	};
	Im.SoundNotificationSwitcher = function ($container) {
		this.__construct($container);
	};
	Im.SoundNotificationSwitcher.prototype = {
		__construct: function __construct($button) {
			this.$button = $button;
			this.showButtonFromCache();
			this.$button.on('click', $1.context(this, 'switch'));
		},
		switch: function _switch() {
			Im.soundNotificationsEnabled = !Im.soundNotificationsEnabled;
			if (this.$button.hasClass('Disabled')) {
				localStorage.removeItem('im_sf_disabled');
			} else {
				localStorage.setItem('im_sf_disabled', '1');
			}
			this.$button.toggleClass('Disabled');
		},
		showButtonFromCache: function showButtonFromCache() {
			this.$button.toggleClass('Disabled', !Im.soundNotificationsEnabled);
		},
	};
	$1(function () {
		var obj = XenForo.create('Im.Start', '#Conversations');
		obj.markConversationAsRead();
	});
	Im.EditMessage = function ($button) {
		$button.on('click', function (e) {
			e.stopImmediatePropagation();
			$1('.MessageManagePanel').hide();
			$1('.message.Selected').removeClass('Selected');
			$1('#Conversations').data('Im.Start').editMessage(e);
		});
	};
	Im.Message = function ($message) {
		var $panel = $1('.MessageManagePanel');
		var $counter = $panel.find('.Counter');
		var updateCounter = function updateCounter() {
			$counter.text(declOfNum(Im.selectedMessages.length, XenForo.phrases.messageDodPhrases, 1));
		};
		$message.on('click', function (e) {
			if (
				$1(e.target).hasClass('TranslateMessageButton') ||
				$1(e.target).parents('.messageContent').length ||
				!$1('.MessageEditingBox:hidden').length
			) {
				return;
			}
			var $target = $1(e.target);
			if ($target.is('a, img, .quoteExpand') || $target.parents('a').length) return;
			var isSelected = $message.hasClass('Selected');
			if (isSelected) {
				Im.selectedMessages = Im.selectedMessages.filter(function (value) {
					return value !== $message.data('message-id');
				});
				if (!Im.selectedMessages.length) {
					$panel.hide();
				}
			} else {
				Im.selectedMessages.push($message.data('message-id'));
				$panel.show();
			}
			$message.toggleClass('Selected', !isSelected);
			updateCounter();
		});
		$message.on('dblclick', function () {
			$message.find('.EditMessage').trigger('click');
		});
	};
	Im.MessageManagePanel = function ($container) {
		this.__construct($container);
	};
	Im.MessageManagePanel.prototype = {
		__construct: function __construct($container) {
			this.$container = $container;
			$container.find('.Reply').on('click', $1.context(this, 'replyButtonClick'));
			$container.find('.Forward').on('click', $1.context(this, 'forwardButtonClick'));
			$container.find('.CancelSelected').on('click', $1.context(this, 'cancelMessageReply'));
			this.getMessageReplyBox().find('.Change').on('click', $1.context(this, 'changeRecipientButtonClick'));
			this.getMessageReplyBox().find('.Cancel').on('click', $1.context(this, 'cancelMessageReply'));
		},
		// Hide message reply box above editor and hide message manage panel in header
		cancelMessageReply: function cancelMessageReply() {
			Im.selectedMessages = [];
			this.$container.hide();
			$1('#ConversationMessageList .Selected.message').removeClass('Selected');
			$1('#ctrl_reply_message_ids').val('');
			this.getMessageReplyBox().hide();
		},
		fullModeEnabled: function fullModeEnabled() {
			return $1(document1).width() >= 800;
		},
		// Get message reply box above editor
		getMessageReplyBox: function getMessageReplyBox() {
			return $1('.MessageReplyBox');
		},
		replyButtonClick: function replyButtonClick(e) {
			this.$container.hide(); // Hide message manage panel
			var $box = this.getMessageReplyBox();
			var $title, $content;
			if (Im.selectedMessages.length > 1) {
				$title = $box.find('.Title').data('def-title');
				$content = declOfNum(Im.selectedMessages.length, XenForo.phrases.messageDodPhrases, 1);
			} else {
				var $message;
				if (Im.forwardingMessageFlag) {
					$message = Im.$selectedMessage;
				} else {
					$message = $1('#Conversations').data('Im.Start').getMessageSelector(Im.selectedMessages[0]);
				}
				$title = $message.find('.username').first().clone();
				$content = $message.find('.messageText').clone();
				$box.find('.Content').html($content);
			}
			$box.find('.Title').html($title);
			$box.find('.Content').html($content);
			$box.show();
			$1('#ctrl_reply_message_ids').val(Im.selectedMessages.join(','));
			Im.selectedMessages = [];
		},
		forwardButtonClick: function forwardButtonClick() {
			if (!this.fullModeEnabled()) {
				$1('.conversationList').show();
			} else {
				$1('.ForwardMessageCap').css('display', 'table');
			}
			Im.forwardingMessageFlag = true;
			if (Im.selectedMessages.length === 1) {
				Im.$selectedMessage = $1('#Conversations').data('Im.Start').getMessageSelector(Im.selectedMessages[0]);
			}
		},
		changeRecipientButtonClick: function changeRecipientButtonClick() {
			if (!this.fullModeEnabled()) {
				$1('.conversationList').show();
			} else {
				$1('.ForwardMessageCap').css('display', 'table');
			}
			Im.forwardingMessageFlag = true;
			Im.selectedMessages = $1('#ctrl_reply_message_ids').val().split(',');
			if (Im.selectedMessages.length === 1) {
				var $selectedMessage = $1('#Conversations').data('Im.Start').getMessageSelector(Im.selectedMessages[0]);
				if ($selectedMessage.length) {
					Im.$selectedMessage = $selectedMessage;
				}
			}
		},
	};
	Im.ShareContentButton = function ($button) {
		$button.on('click', function (e) {
			XenForo.ajax($button.data('href'), {}, function (ajaxData) {
				var obj = $1('#Conversations').data('Im.Start');
				obj.$ed.ed.html.set(ajaxData.content);
				obj.$quickReply.submit();
			});
		});
	};
	Im.TranslateMessageButton = function ($button) {
		$button.on('click', function (e) {
			e.preventDefault();
			if ($1(this).data('processing')) {
				return;
			}
			$1(this).data('processing', 1);
			var msgId = $1(this).data('msg-id');
			var $messageList = $1('#ConversationMessageList');
			XenForo.ajax($1(this).data('href'), {}, function (ajaxData) {
				if (XenForo.hasResponseError(ajaxData)) {
					return;
				}
				$1(ajaxData.templateHtml).xfInsert(
					'replaceAll',
					$messageList.find('#message-' + msgId),
					'show',
					0,
					$messageList.xfActivate.bind($messageList),
				);
			});
		});
	};
	(function (FroalaEditor1) {
		FroalaEditor1.PLUGINS.typingIm = function (ed) {
			var publish = true;
			ed.events.on('input', function () {
				if (publish) {
					$1('#Conversations').data('Im.Start').$container.trigger('typingIm');
					publish = false;
					setTimeout(function () {
						return (publish = true);
					}, 3000);
				}
			});
		};
	})(FroalaEditor);
	XenForo.register('#Conversations', 'Im.Start');
	XenForo.register('.TranslateMessageButton', 'Im.TranslateMessageButton');
	XenForo.register('.EditMessage', 'Im.EditMessage');
	XenForo.register('.redactor_box', 'Im.Editor');
	XenForo.register('.message-block', 'Im.Message');
	XenForo.register('.MessageManagePanel', 'Im.MessageManagePanel');
	XenForo.register('#SoundNotificationSwitcher', 'Im.SoundNotificationSwitcher');
	XenForo.register('.ShareContentButton', 'Im.ShareContentButton');
})(jQuery, window, document);
