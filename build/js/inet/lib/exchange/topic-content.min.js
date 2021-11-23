/**
 * #PACKAGE: exchange
 * #MODULE: topic-content
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:00 26/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file TopicContent.js
 */
$(function () {
  /**
   * @class iNet.ui.exchange.TopicContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.exchange.TopicContent');
  iNet.ui.exchange.TopicContent = function (options) {
    var that = this, config = options || {};
    iNet.apply(this, config);
    this.id = 'menu-item-content-wg';
    this.module = 'topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.param = {};
    var submit = false;
    this.$toolbar = {
      BACK: $('#content-btn-back'),
      CREATE: $('#content-btn-create'),
      SAVE: $('#content-btn-save')
    };
    this.$form = {
      name: $('#txt-title-name'),
      firmJoned: $('#txt-firm-joned'),
      submitBefore: $('#checkbox-submit'),
      brief: $('#txt-title-brief'),
      content: $('#txt-menu-content'),
      timeStart: $('#time-start'),
      timeEnd: $('#time-end')
    };
    this.url = {
      list: iNet.getPUrl('onl/exch/topic/list'),
      save: iNet.getPUrl('onl/exch/topic/save')
    };
    this.longDayStart = that.$form.timeStart.datepicker({
      format: 'dd/mm/yyyy'
    }).on('changeDate', function (start) {
      that.longDayStart.hide();
      that.$form.timeEnd[0].focus();
    }).data('datepicker');
    this.longDayEnd = that.$form.timeEnd.datepicker({
      format: 'dd/mm/yyyy',
      onRender: function (date) {
        return date.valueOf() <= that.longDayStart.date.valueOf() ? 'disabled' : '';
      }
    }).on('changeDate', function (end) {
      that.longDayEnd.hide();
    }).data('datepicker');
    that.$form.submitBefore.on('change', function () {
      submit = this.checked;
    });
    this.formValidate = new iNet.ui.form.Validate({
      id: that.id,
      rules: [{
        id: that.$form.name.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('name_subject', that.getModule()));
        }
      }, {
        id: that.$form.brief.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('brief', that.getModule()));
        }
      }, {
        id: that.$form.timeStart.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('timestart', that.getModule()));
        }
      }, {
        id: that.$form.timeEnd.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('timeend', that.getModule()));
        }
      }]
    });
    this.editor = new iNet.ui.common.LittleEditor({id: '#' + this.$form.content.prop('id')});
    iNet.ui.exchange.TopicContent.superclass.constructor.call(this);
    // init category auto complete
    this.$toolbar.BACK.click(function () {
      that.param.uuid = null;
      that.hide();
      that.fireEvent(that.getEvent('back'), that);
    });
    this.$toolbar.CREATE.click(function () {
      that.resetData();
    });
    this.$toolbar.SAVE.click(function () {
      if (that.formValidate.check()) {
        that.param.subject = that.$form.name.val() || '';
        that.param.submitBefore = submit;
        that.param.brief = that.$form.brief.val() || '';
        that.param.firmJoined = that.$form.firmJoned.val() || '';
        that.param.start = new Date(that.longDayStart.date).getTime();
        that.param.end = new Date(that.longDayEnd.date).getTime();
        that.param.content = that.editor.getValue() || '';
        $.postJSON(that.url.save, that.param, function (result) {

          if (result.type === 'ERROR') {
            if (that.param.uuid)
              that.error(that.getText('update', 'link'), that.getText('update_error', 'link'));
            else
              that.error(that.getText('create', 'link'), that.getText('create_error', 'link'));
          }
          else {
            that.fireEvent(that.getEvent('save_update'), that);
            // that.hide();
            if (that.param.uuid)
              that.success(that.getText('update', 'link'), that.getText('update_success', 'link'));
            else
              that.success(that.getText('create', 'link'), that.getText('create_success', 'link'));
          }
        });
      }
    });
  };

  iNet.extend(iNet.ui.exchange.TopicContent, iNet.ui.WidgetExt, {
    setUUID: function (uuid) {
      this.cache.uuid = uuid;
    },
    setData: function (post) {
      this.param.uuid = post.uuid;
      var __post = post;
      var __timer = null;
      var that = this;
      this.$form.submitBefore.prop('checked', __post.submitBefore || false);
      this.$form.name.val(__post.subject || '');
      this.$form.content.val(__post.content || '');
      this.$form.firmJoned.val(__post.firmJoined || '');
      this.$form.brief.val(__post.brief || '');

      if (__post.start)
        this.$form.timeStart.val(new Date(__post.start).format('d/m/Y'));

      if (__post.end)
        this.$form.timeEnd.val(new Date(__post.end).format('d/m/Y'));

      if (iNet.isDefined(that.editor.getActiveEditor())) {
        clearTimeout(__timer);
        that.editor.setValue(__post.content || '');
      } else {
        __timer = setTimeout(function () {
          that.editor.setValue(__post.content || '');
        }, 1000);
      }
    },
    resetData: function () {
      this.$form.name.val('');
      this.$form.timeEnd.val('');
      this.$form.brief.val('');
      this.$form.timeStart.val('');
      this.$form.firmJoned.val('');
      this.editor.setValue('');
    },
    resize: function () {
      $(window).trigger('resize');
    }
  });
});
