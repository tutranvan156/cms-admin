// #PACKAGE: author
// #MODULE: cms-item-quick-compose-box-ext
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 22/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ItemQuickComposeBoxExt
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.author.ItemQuickComposeBoxExt
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.author.ItemQuickComposeBoxExt');
  iNet.ui.author.ItemQuickComposeBoxExt = function (options) {

    var that = this, __opt = options || {};
    iNet.apply(this, __opt);
    this.id = this.id || 'panel-quick-compose';
    this.$element = $.getCmp(this.id);
    this.url = {
      save: iNet.getPUrl('cms/item/modify')
    };
    this.$toolbar = {
      SAVE: $('#btn-save-quick')
    };
    this.$form = {
      subject: $('#txt-post-title-quick'),
      brief: $('#txt-post-brief-quick'),
      content: $('#txt-post-content-quick'),
      input_form:$('#panel-quick-compose'),
      connection_title:$('#txt-post-title-quick'),
      connection_brief:$('#txt-post-brief-quick'),
      connection_content:$('#txt-post-content-quick')
    };

    this.cnnValidate = new iNet.ui.form.Validate({
      id : that.$form.input_form.prop('id'),
      rules : [{
        id : this.$form.connection_title.prop('id'),
        validate : function(v) {
          if (iNet.isEmpty(v))
            return iNet.resources.message.field_not_empty;
        }
      },
      {
        id : this.$form.connection_brief.prop('id'),
        validate : function(v) {
          if (iNet.isEmpty(v))
            return iNet.resources.message.field_not_empty;
        }
      },
      {
        id : this.$form.connection_content.prop('id'),
        validate : function(v) {
          if (iNet.isEmpty(v))
            return iNet.resources.message.field_not_empty;
        }
      }]
    });
    this.$toolbar.SAVE.on('click', function () {
      if(that.cnnValidate.check()) {
        var __post = that.getData();
        $.postJSON(that.url.save, __post, function (result) {
          var __result = result || {};
          if (iNet.isDefined(__result.uuid)) {
            that.reset();
          } else {
          }
        });
      }
    });
  };
  iNet.extend(iNet.ui.author.ItemQuickComposeBoxExt, iNet.ui.CMSComponent, {
    getData: function () {
      return {
        subject: this.$form.subject.val(),
        brief: this.$form.brief.val(),
        message: this.$form.content.val()
      };
    },
    reset: function () {
      this.$form.subject.val('');
      this.$form.brief.val('');
      this.$form.content.val('')
    }
  });
});