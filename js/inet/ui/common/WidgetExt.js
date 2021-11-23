// #PACKAGE: common
// #MODULE: cms-widget
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 16/01/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file WidgetExt
 * @author nbchicong
 */

// var Debugger = require('../../../../ts/Console');

$(function () {
  /**
   * @class iNet.ui.WidgetExt
   * @extends iNet.ui.Widget
   */
  iNet.ns('iNet.ui.WidgetExt');
  iNet.ui.WidgetExt = function (config) {
    var __config = config || {};
    var back = iNet.getParam('back');
    iNet.apply(this, __config);
    /**
     * @type {iNet.ui.form.Notify}
     */
    this.notify = null;
    /**
     * @type {iNet.ui.dialog.ModalDialog}
     */
    this.dialog = null;
    this.cache = this.cache || {};
    /**
     * @type {CacheManager}
     */
    this.cached = new CacheManager();
    /**
     * @type {iNet.ui.Error}
     */
    this.Error = new iNet.ui.Error();
    /**
     * @type {iNet.ui.SecurityUtils}
     */
    this.security = new iNet.ui.SecurityUtils({rolesArr: checking});
    // this.debugger = new Debugger(iNet.debug);

    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    iNet.ui.WidgetExt.superclass.constructor.call(this);
    if (back) {
      this.getEl().find('.wg-toolbar').prepend('<button class="btn-back btn-warning btn-sm btn"><i class="fa fa-sign-out" aria-hidden="true"></i> Thoát ra</button>');
      $('.btn-back').on('click', function () {
        window.history.back();
      });
    }
  };
  iNet.extend(iNet.ui.WidgetExt, iNet.ui.Widget, {
    constructor: iNet.ui.WidgetExt,
    version: '2.0',
    description: String.format('Extend iNet Widget, depend iNet Core version {0}', iNet.version),
    /**
     * @param text
     * @param [parent]
     * @param [children]
     * @param [root]
     * @returns {*|String}
     */
    getText: function (text, parent, children, root) {
      var __parents = parent,
          __children = children,
          __resource = this.resourceRoot;
      if (iNet.isDefined(root)) {
        __resource = root;
      }
      if (iNet.isEmpty(__parents)) {
        if (!iNet.isEmpty(this.getModule())) {
          __parents = this.getModule();
        } else {
          __parents = 'post';
        }
      }
      __resource = __resource[__parents];
      if (iNet.isDefined(__children) && !iNet.isEmpty(__children)) {
        __resource = __resource[__children];
      }
      return __resource[text] || text;
    },
    /**
     * @param type
     * @param title
     * @param content
     * @returns {iNet.ui.form.Notify}
     */
    showMessage: function (type, title, content) {
      var __title = !iNet.isEmpty(title) ? title : iNet.resources.notify.notice;
      if (!this.notify) {
        this.notify = new iNet.ui.form.Notify();
      }
      this.notify.setType(type || 'info');
      this.notify.setTitle(title || '');
      this.notify.setContent(content || "");
      this.notify.show();
      return this.notify;
    },
    /**
     * @param title
     * @param content
     * @returns {*|iNet.ui.form.Notify}
     */
    success: function (title, content) {
      return this.showMessage('success', title, content);
    },
    /**
     * @param title
     * @param content
     * @returns {*|iNet.ui.form.Notify}
     */
    error: function (title, content) {
      return this.showMessage('error', title, content);
    },
    /**
     * @param title
     * @param content
     * @returns {*|iNet.ui.form.Notify}
     */
    info: function (title, content) {
      return this.showMessage('info', title, content);
    },
    /**
     * @param title
     * @param content
     * @returns {*|iNet.ui.form.Notify}
     */
    warning: function (title, content) {
      return this.showMessage('warning', title, content);
    },
    /**
     * @param title
     * @param content
     * @param callback
     * @returns {iNet.ui.dialog.ModalDialog}
     */
    confirmDlg: function (title, content, callback) {
      var __fn = callback || iNet.emptyFn;
      var dialog = new iNet.ui.dialog.ModalDialog({
        id: iNet.alphaGenerateId(),
        buttons: [{
          text: iNet.resources.message.button.ok,
          cls: 'btn-primary',
          icon: 'icon-ok icon-white',
          fn: __fn
        }, {
          text: iNet.resources.message.button.cancel,
          cls: 'btn-default',
          icon: 'icon-remove',
          fn: function () {
            this.hide();
          }
        }]
      });
      dialog.setTitle((!iNet.isEmpty(title)) ? title : iNet.resources.message.dialog_del_confirm_title);
      dialog.setContent((!iNet.isEmpty(content)) ? content : iNet.resources.message.dialog_del_confirm_content);
      // dialog.getEl().on('hidden', function () {
      //   $(this).remove();
      // });
      return dialog;
    },
    setModule: function (module) {
      this.module = module;
    },
    getModule: function () {
      return this.module;
    },
    /**
     *
     * @param {String} event
     * @returns {String}
     */
    getEvent: function (event) {
      return String.format('{0}_{1}', event, this.getModule());
    },
    /**
     * @returns {*|Object}
     */
    getCache: function () {
      return this.cache;
    },
    /**
     * Get Cache manager
     * @returns {CacheManager}
     */
    getCached: function () {
      return this.cached;
    },
    /**
     * Get Security Class of this object
     * @returns {iNet.ui.SecurityUtils}
     */
    getSecurity: function () {
      return this.security;
    },
    /**
     * Get Instance Console
     * @returns {Debugger}
     */
    getConsole: function () {
      return this.debugger;
    },
    /**
     *
     * @param {iNet.ui.WidgetExt} sourceObject
     * @returns {iNet.ui.WidgetExt}
     */
    passRoles: function (sourceObject) {
      sourceObject.getSecurity().copyRoles(this.getSecurity());
      return this;
    },
    /**
     *
     * @param model
     * @returns {Object}
     */
    getModelData: function (model) {
      if (iNet.isObject(model)) {
        var __model = model;
        var __data = {};
        var __keysOfModel = Object.keys(__model);
        for (var i = 0; i < iNet.getSize(__keysOfModel); i++) {
          var __value = __model[__keysOfModel[i]];
          if (iNet.isArray(__value)) {
            __value = __value.join(',');
          }
          __data[__keysOfModel[i]] = __value;
        }
        return __data;
      }
      return {};
    }
  });
  /**
   * @class iNet.ui.ViewWidget
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns("iNet.ui.ViewWidget");
  iNet.ui.ViewWidget = function (config) {
    var _this = this;
    iNet.apply(this, config || {});
    iNet.ui.ViewWidget.superclass.constructor.call(this);
    this.$btnFullScreen = $('button[data-action="fullscreen"]');
    this.getEl().find('button[data-action="fullscreen"]').data('scope', this);
    this.$messageSelected = this.getEl().find('.messageSelected');
    this.$messageContainer = this.getEl().find('.messageItem');
    this.$messageContent = this.getEl().find('.messageItemContent');
    this.$messageHeader = this.getEl().find('.messageItemHeader');
    this.$messageBody = this.getEl().find('.messageItemBody');
    this.$messageLoading = this.getEl().find('.messageLoading');
    this.$btnFullScreen.off('click').on('click', function () {
      var $btn = $(this);
      var control = $btn.data('scope');
      if (control) {
        if (control.isFullScreen(control)) {
          control.viewNormal();
          _this.resize();
        } else {
          control.viewFull();
        }
      }
    });
    $(window).resize(function () {
      _this.resize();
    });
  };
  iNet.extend(iNet.ui.ViewWidget, iNet.ui.WidgetExt, {
    constructor: iNet.ui.ViewWidget,
    viewFull: function () {
      this.fireEvent('beforeresize', this);
      $('.listWidget').hide();
      $('.messageView').css('width', '100%');//Giai phap tam thoi
      this.$btnFullScreen.find('i:first').removeClass('icon-fullscreen').addClass('icon-resize-small');
      this.$btnFullScreen.data('fullscreen', true);
      this.resize();
      return this;
    },
    viewNormal: function () {
      this.fireEvent('beforeresize', this);
      $('.listWidget').show();
      $('.messageView').css('width', '70%');//Giai phap tam thoi
      this.$btnFullScreen.find('i:first').removeClass('icon-resize-small').addClass('icon-fullscreen');
      this.$btnFullScreen.data('fullscreen', false);
      this.resize();
      return this;
    },
    isFullScreen: function () {
      return this.$btnFullScreen.data('fullscreen');
    },
    getWindow: function () {
      return $(window);
    },
    showLoading: function () {
      this.$messageSelected.hide();
      this.$messageContainer.show();
      this.$messageHeader.hide();
      this.$messageBody.hide();
      this.$messageLoading.show();
    },
    hideLoading: function () {
      this.$messageLoading.hide();
      this.$messageHeader.show();
      this.$messageBody.show();
    },
    resize: function () {
      var h = this.getWindow().height();
      this.getEl().height(h - 5);
      h = h - 45;
      this.$messageContainer.height(h);
      this.$messageContent.height(h);
      if ($.fn.slimScroll) {
        this.$messageContent.slimscroll({scrollTo: 0, height: h, width: '100%'});
      }
      this.fireEvent('resize', {height: this.getEl().height(), width: this.getEl().width()}, this);
      return this;
    }
  });
});