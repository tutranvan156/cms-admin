
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 09:35 23/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file LandProjectContent.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.LandProjectContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.LandProjectContent');
  iNet.ui.admin.LandProjectContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'wg-land-project-content';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.resourceParent = 'link';
    this.count = 0;

    this.$toolbar = {
      SAVE: $('#land-project-btn-save'),
      BACK: $('#land-project-btn-back'),
      CREATED: $('#land-project-content-btn-create')
    };

    this.url = {
      load: iNet.getPUrl('land/price/load'),
      save: iNet.getPUrl('land/project/save')
    };

    this.$form = {
      title: $('#post-txt-title'),
      content: $('#post-txt-content')
    };

    this.editor = new iNet.ui.common.LittleEditor({id: '#post-txt-content'});
    iNet.ui.admin.LandProjectContent.superclass.constructor.call(this);
    this.$toolbar.CREATED.click(function () {
      _this.resetData();
    });

    this.$toolbar.BACK.click(function () {
      _this.hide();
      _this.fireEvent('back', _this);
      if (_this.count !== 0) {
        _this.fireEvent('load', _this);
      }
    });

    this.$toolbar.SAVE.click(function () {
      save(_this.getData(), function (result) {
        if (result.type === 'ERROR')
          if (!_this.getUuid())
            _this.error(_this.getText('create', 'link'), _this.getText('create_error', 'link'));
          else
            _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
        else {
          _this.count++;
          if (_this.getUuid())
            _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
          else {
            _this.success(_this.getText('create', 'link'), _this.getText('create_success', 'link'));
            _this.setUuid(result.uuid);
          }
        }
      });
    });
  };

  iNet.extend(iNet.ui.admin.LandProjectContent, iNet.ui.ViewWidget, {
    resetData: function () {
      this.count = 0;
      this.setData({});
      this.setUuid(null);
    },
    setData: function (data) {
      this.count = 0;
      this.$form.title.val(data.title || '');
      this.editor.setValue(data.content || '');
    },
    getData: function () {
      var fd = new FormData();
      fd.append('title', this.$form.title.val());
      fd.append('content', this.editor.getValue());
      if (this.getUuid()) {
        fd.append('uuid', this.getUuid());
      }
      return fd;
    },
    load: function (id) {
      var _this = this;
      this.setUuid(id);
      load({uuid: this.getUuid()}, function (data) {
        if (data.type !== 'ERROR') {
          _this.setData(data);
        }
      });
    },
    setUuid: function (v) {
      this.uuid = v;
    },
    getUuid: function () {
      return this.uuid;
    }
  });

  function load(params, callback) {
    $.getJSON(iNet.getPUrl('land/price/load'), params, function (data) {
      callback && callback(data);
    });
  }

  function save(fd, callback) {
    $.submitData({
      url: iNet.getPUrl('land/project/save'),
      params: fd,
      method: 'POST',
      callback: function (result) {
        callback && callback(result);
      }
    });
  }
});
