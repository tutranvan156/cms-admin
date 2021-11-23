/**
 * #PACKAGE: admin
 * #MODULE: cms-super-menu-content
 */
/**
 * Copyright (c) 2016 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 2:47 PM 19/05/2016.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file MenuContent.js
 */
$(function () {
  /**
   * @class iNet.ui.superad.MenuContent
   * @extends iNet.ui.ViewWidget
   */
  iNet.ns('iNet.ui.superad.MenuContent');
  iNet.ui.superad.MenuContent = function (config) {
    var _this = this;
    iNet.apply(this, config || {});
    _this.id = 'menu-content-wg';
    _this.module = 'menu';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    _this.url = {
      load: iNet.getUrl('cms/menucontext/load'),
      create: iNet.getUrl('cms/menucontext/create'),
      update: iNet.getUrl('cms/menucontext/update'),
      remove: iNet.getUrl('cms/menucontext/delete'),
      template: iNet.getUrl('cms/template/list')
    };
    _this.$toolbar = {
      BACK: $('#btn-content-back'),
      CREATE: $('#btn-content-create'),
      SAVE: $('#btn-content-save'),
      DELETE: $('#btn-content-delete')
    };
    _this.$form = {
      title: $('#menu-txt-title'),
      template: $('#cbb-template'),
      content: $('#menu-txt-content')
    };
    _this.formValidate = new iNet.ui.form.Validate({
      id : _this.id,
      rules : [{
        id : _this.$form.title.prop('id'),
        validate : function(v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('name'));
        }
      }]
    });
    _this.editor = new iNet.ui.common.ContentEditor({id: '#'+_this.$form.content.prop('id')});
    iNet.ui.superad.MenuContent.superclass.constructor.call(_this);
    _this.$toolbar.BACK.click(function(){
      _this.hide();
      _this.fireEvent(_this.getEvent('back'), _this);
    });
    _this.$toolbar.CREATE.click(function () {
      _this.resetData();
    });
    _this.$toolbar.SAVE.click(function(){
      if (_this.validate()) {
        var __url = _this.url.update;
        var __menuItem = _this.getData();

        console.log("__menuItem : ", __menuItem);

        if (iNet.isEmpty(__menuItem.uuid) || !iNet.isDefined(__menuItem.uuid)) {
          __url = _this.url.create;
          delete __menuItem.uuid;
          delete __menuItem.menu;
        }
        _this.disable();
        $.postJSON(__url, __menuItem, function (result) {
          var __result = result || {};
          if (iNet.isDefined(__result.uuid)) {
            if (!iNet.isEmpty(__menuItem.uuid)) {
              _this.success(_this.getText('update_title', _this.getModule()), String.format(_this.getText('update_success', _this.getModule()), __result.subject));
              _this.fireEvent(_this.getEvent('updated'), __result, _this);
            } else {
              _this.toggleDelete(true);
              _this.success(_this.getText('create_title', _this.getModule()), String.format(_this.getText('create_success', _this.getModule()), __result.subject));
              _this.fireEvent(_this.getEvent('created'), __result, _this);
            }
          } else {
            if (!iNet.isEmpty(__menuItem.uuid)) {
              _this.error(_this.getText('update_title', _this.getModule()), String.format(_this.getText('update_unsuccess', _this.getModule()), __result.subject));
            } else {
              _this.error(_this.getText('create_title', _this.getModule()), String.format(_this.getText('create_unsuccess', _this.getModule()), __result.subject));
            }
          }
          _this.enable();
        }, {
          mask : _this.getMask(),
          msg : iNet.resources.ajaxLoading.saving
        });
      }
    });
    _this.$toolbar.DELETE.on('click', function () {
      _this.confirmDlg('', '', function () {
        $.postJSON(_this.url.remove, _this.dialog.getOptions(), function (result) {
          if (iNet.isDefined(result.uuid)) {
            _this.fireEvent(_this.getEvent('removed'), result);
            _this.success(_this.getText('del_title'), String.format(_this.getText('del_success'), result.title));
          } else {
            _this.error(_this.getText('del_title'), String.format(_this.getText('del_unsuccess'), result.title));
          }
          _this.dialog.hide();
        }, {
          mask: _this.getMask(),
          msg: iNet.resources.ajaxLoading.deleting
        });
      });
      _this.dialog.setOptions({menu: _this.getCache().uuid});
      _this.dialog.setTitle('<i class="fa fa-trash red"></i> ' + 'Xóa!');
      _this.dialog.setContent(String.format(_this.getText('del_content'), '<b>'+_this.$form.title.val()+'</b>'));
      _this.dialog.show();
    });
    _this.$form.template.on('change', function () {
      var __uuid = _this.$form.template.val() || '';
      if (!iNet.isEmpty(__uuid)) {
        for (var i = 0; i < _this.templates.length; i++) {
          if (_this.templates[i].uuid == __uuid) {
            _this.getEditor().setValue(_this.templates[i].message);
            return;
          }
        }
      } else {
        _this.getEditor().setValue('');
      }
    });
    this.loadTemplate();
  };
  iNet.extend(iNet.ui.superad.MenuContent, iNet.ui.ViewWidget, {
    validate: function(){
      return this.formValidate.check() && !iNet.isEmpty(this.getEditor().getValue());
    },
    setContext: function (context) {
      this.context = context || '';
    },
    getContext: function () {
      return this.context;
    },
    setEditor: function (editor) {
      this.editor = editor;
    },
    /**
     * @returns {iNet.ui.common.ContentEditor|*}
     */
    getEditor: function () {
      return this.editor;
    },
    setData: function (record) {
      var __item = record || {};
      this.$form.title.val(__item.title || '');
      this.getEditor().setValue(__item.content || '');
      this.cache.uuid = __item.uuid;
      this.cache.menuId = __item.menuID;
      this.enable();
      this.hideLoading();
    },
    getData: function () {
      return {
        name: (this.$form.title.val()||'').removeAccents().replaceSpace().toLowerCase(),
        title: this.$form.title.val(),
        context: this.getContext(),
        content: this.getEditor().getValue(),
        menu: this.getCache().menuId,
        uuid: this.getCache().uuid
      };
    },
    resetData: function () {
      this.setEditor(new iNet.ui.common.ContentEditor({id: '#'+this.$form.content.prop('id')}));
      this.setData({
        title: '',
        content: '',
        uuid: null
      });
      this.toggleSave(true);
      this.toggleDelete(false);
    },
    toggleCreate: function (show) {
      FormUtils.showButton(this.$toolbar.CREATE, show);
    },
    toggleDelete: function (show) {
      FormUtils.showButton(this.$toolbar.DELETE, show);
    },
    toggleSave: function (show) {
      FormUtils.showButton(this.$toolbar.SAVE, show);
    },
    enable: function () {
      this.$toolbar.BACK.removeClass('disabled').removeAttr('disabled');
      this.$toolbar.CREATE.removeClass('disabled').removeAttr('disabled');
      this.$toolbar.SAVE.removeClass('disabled').removeAttr('disabled');
      this.$toolbar.DELETE.removeClass('disabled').removeAttr('disabled');
      this.$form.title.removeClass('disabled').removeAttr('disabled');
      this.getEditor().enable();
    },
    disable: function () {
      this.$toolbar.BACK.addClass('disabled').attr('disabled', 'disbaled');
      this.$toolbar.CREATE.addClass('disabled').attr('disabled', 'disbaled');
      this.$toolbar.SAVE.addClass('disabled').attr('disabled', 'disbaled');
      this.$toolbar.DELETE.addClass('disabled').attr('disabled', 'disbaled');
      this.$form.title.addClass('disabled').attr('disabled', 'disbaled');
      this.getEditor().disable();
    },
    loadTemplate: function () {
      var _this = this;
      $.postJSON(this.url.template, {type: 'PAGE'}, function(result) {
        var __result = result || {};
        var __opt = '', __list = __result.items || [];
        _this.templates = __list;
        for (var i = 0; i < __list.length; i++) {
          __opt = String.format('<option value="{0}">{1}</option>', __list[i].uuid, __list[i].name);
          _this.$form.template.append(__opt);
        }
      });
    },
    load: function (menu) {
      var _this = this;
      this.showLoading();
      if (iNet.isDefined(menu.uuid))
        $.postJSON(this.url.load, {menu: menu.uuid}, function(result) {
          var __result = result || {};
          _this.resetData();
          if (iNet.isDefined(__result.uuid)) {
            _this.setData(__result);
            _this.toggleSave(true);
            _this.toggleDelete(true);
            _this.resize();
          }
        });
      else {
        this.resetData();
        this.resize();
      }
    }
  });
});
