/**
 * #PACKAGE: document
 * #MODULE: draft-comment-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 15:47 10/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file DraftCommentContent.js
 */
$(function () {
  /**
   * @class iNet.ui.document.DraftCommentContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.document.DraftCommentContent');
  iNet.ui.document.DraftCommentContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    _this.id = 'allowed-content-wg';
    this.module = 'document';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      view: iNet.getPUrl('cms/egov/edoc/cmmview')
    };

    this.$form = {};

    this.bar = {
      BACK: $('#allowed-content-btn-back')
    };

    iNet.ui.document.DraftCommentContent.superclass.constructor.call(this);
    this.bar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back_list', _this);
    });
  };
  iNet.extend(iNet.ui.document.DraftCommentContent, iNet.ui.WidgetExt, {
    setData: function (record) {
      for (var x in record) {
        $('[name="' + x + '"]').val(record[x]);
      }
    },
    setFqaId: function (x) {
      this._uuid = x;
    },
    getFqaId: function () {
      return this._uuid;
    },
    setRecord: function (record) {
      this.record = record;
    },
    getRecord: function () {
      return this.record || {};
    },
    load: function (params) {
      var _this = this;
      $.getJSON(this.url.view, params, function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          _this.setData(result);
        }
      });
    }
  });
});
