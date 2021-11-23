// #PACKAGE: admin
// #MODULE: cms-template-content

/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Huyen Doan <huyendv@inetcloud.vn>
 *  on 14:55 29/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file TemplateContent
 * @author huyendv
 */
$(function () {
  /**
   * @class iNet.ui.superad.TemplateContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.superad.TemplateContent');
  iNet.ui.superad.TemplateContent = function (config) {
    var that = this;
    iNet.apply(this, config || {});
    this.id = 'template-wg';
    this.module = 'template';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      save: iNet.getPUrl('cms/template/create'),
      update: iNet.getPUrl('cms/template/update'),
      del: iNet.getPUrl('cms/template/delete')
    };
    this.$toolbar = {
      BACK: $('#template-toolbar-btn-back'),
      CREATE: $('#template-toolbar-btn-create'),
      SAVE: $('#template-toolbar-btn-save'),
      DELETE: $('#template-toolbar-btn-delete')
    };
    this.$form = {
      name: $('#template-name-txt'),
      type: $('#template-type-select'),
      content: $('#template-content-editor')
    };
    this.formValidate = new iNet.ui.form.Validate({
      id : that.id,
      rules : [{
        id : that.$form.name.prop('id'),
        validate : function(v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('name', that.getModule()));
        }
      }, {
        id : that.$form.type.prop('id'),
        validate : function(v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('type', that.getModule()));
        }
      }]
    });
    this.editor = new iNet.ui.common.ContentEditor({id: '#' + this.$form.content.prop('id')});
    this.$toolbar.BACK.click(function(){
      that.hide();
      that.fireEvent(that.getEvent('back'), that);
    });
    this.$toolbar.CREATE.click(function () {
      that.resetData();
    });
    this.$toolbar.SAVE.click(function(){
      if (that.validate()) {
        var __data = that.getData();
        if (iNet.isEmpty(__data.uuid) || !iNet.isDefined(__data.uuid)) {
          delete __data.uuid;
        }
        $.postJSON(that.url.save, __data, function (result) {
          var __result = result || {};
          if (iNet.isDefined(__result.uuid)) {
            if (!iNet.isEmpty(__data.uuid)) {
              that.success(that.getText('update_title', that.getModule()), that.getText('update_success'));
              that.fireEvent(that.getEvent('updated'), __result, that);
            } else {
              that.success(that.getText('create_title', that.getModule()), that.getText('create_success'));
              that.fireEvent(that.getEvent('saved'), __result, that);
            }
            that.setData(__result);
          } else {
            if (!iNet.isEmpty(__data.uuid)) {
              that.error(that.getText('update_title', that.getModule()), that.getText('update_unsuccess'));
            } else {
              that.error(that.getText('create_title', that.getModule()), that.getText('create_unsuccess'));
            }
          }
        }, {
          mask : that.getMask(),
          msg : iNet.resources.ajaxLoading.saving
        });
      }
    });
    iNet.ui.superad.TemplateContent.superclass.constructor.call(this);
    FormUtils.showButton(this.$toolbar.CREATE, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));
    FormUtils.showButton(this.$toolbar.SAVE, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));
  };
  iNet.extend(iNet.ui.superad.TemplateContent, iNet.ui.WidgetExt, {
    validate: function(){
      return this.formValidate.check();
    },
    setData: function (data) {
      var __data = data || {};
      this.data = __data;
      this.$form.name.val(__data.name || '');
      this.$form.type.val(__data.type || 'PAGE');
      this.editor.setValue(__data.message || '');
      FormUtils.showButton(this.$toolbar.DELETE, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) && !iNet.isEmpty(__data.uuid));
      this.resize();
    },
    getData: function () {
      var __data = this.data || {};
      __data.name = this.$form.name.val();
      __data.type = this.$form.type.val();
      __data.message = this.editor.getValue();
      return __data;
    },
    resetData: function () {
      this.setData();
      FormUtils.showButton(this.$toolbar.DELETE, false);
    },
    load: function (data) {
      this.setData(data);
    },
    resize: function () {
      $(window).trigger('resize');
    }
  });
});