/**
 * #PACKAGE: exchange
 * #MODULE: topic-question-content
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 20:35 28/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file TopicQuestionContent.js
 */
$(function () {
  /**
   * @class iNet.ui.exchange.TopicQuestionContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.exchange.TopicQuestionContent');
  iNet.ui.exchange.TopicQuestionContent = function (options) {
    var _this = this, config = options || {};
    iNet.apply(this, config);
    this.id = 'menu-question-content-wg';
    this.module = 'topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.param = {};
    this.url = {
      create: iNet.getPUrl('onl/exch/question/create'),
      update: iNet.getPUrl('onl/exch/question/update')
    };

    this.$btn = {
      CREATED: $('#question-btn-create'),
      BACK: $('#question-btn-back'),
      SAVE: $('#question-btn-save')
    };

    this.$form = {
      fullName: $('#txt-question-fullname'),
      address: $('#txt-question-address'),
      email: $('#txt-question-email'),
      phone: $('#txt-question-phone'),
      age: $('#txt-question-age'),
      note: $('#txt-question-note'),
      content: $('#txt-question-content')
    };
    this.editor = new iNet.ui.common.LittleEditor({id: '#' + this.$form.content.prop('id')});
    this.formValidate = new iNet.ui.form.Validate({
      id: _this.id,
      rules: [{
        id: _this.$form.fullName.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v)) {
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_user_question', _this.getModule()));
          }
        }
      }, {
        id: _this.$form.address.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v)) {
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_address', _this.getModule()));
          }
        }
      }, {
        id: _this.$form.note.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v)) {
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_content', _this.getModule()));
          }
        }
      }, {
        id: _this.$form.email.prop('id'),
        validate: function (v) {
          if (!iNet.isEmpty(v)) {
            var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            if (!pattern.test(v))
              return _this.getText('validate_regex');
          }
        }
      },{
        id: _this.$form.age.prop('id'),
        validate: function (v) {
          if (!iNet.isEmpty(v)) {
            var pattern = /[0-9]/g;
            if (!pattern.test(v))
              return _this.getText('validate_age');
          }
        }
      }]
    });
    iNet.ui.exchange.TopicQuestionContent.superclass.constructor.call(this);
    this.$btn.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent(_this.getEvent('back_list'), _this);
    });

    this.$btn.CREATED.on('click', function () {
      _this.setTopicIdUpdate(null);
      _this.resetData();
    });

    this.$btn.SAVE.on('click', function () {
      var url=null;
      if (_this.formValidate.check()) {
        if(_this.getTopicIdUpdate()!==null) {
          url = _this.url.update;
          //console.log('uuid: ',_this.getTopicIdUpdate());
          _this.param.uuid=_this.getTopicIdUpdate();
        }
        else {
          url = _this.url.create;
        }
        _this.param.fullname = _this.$form.fullName.val() || '';
        _this.param.address = _this.$form.address.val() || '';
        _this.param.email = _this.$form.email.val() || '';
        _this.param.phone = _this.$form.phone.val() || '';
        _this.param.age = _this.$form.age.val() || '';
        _this.param.content = _this.$form.note.val() || '';
        _this.param.topic = _this.getTopicId() || '';
        $.postJSON(url, _this.param, function (result) {
          if (result.type === 'ERROR') {
            if(_this.getTopicIdUpdate()===null)
              _this.error(_this.getText('create', 'link'), _this.getText('create_error', 'link'));
            else
              _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
          }
          else {
            _this.fireEvent(_this.getEvent('saved'));
            if(_this.getTopicIdUpdate()===null)
              _this.success(_this.getText('create', 'link'), _this.getText('create_success', 'link'));
            else
              _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
          }
        });
      }
    });
  };
  iNet.extend(iNet.ui.exchange.TopicQuestionContent, iNet.ui.WidgetExt, {
    setTopicId: function (id) {
      this.topicId = id;
    },
    getTopicId: function () {
      return this.topicId;
    },
    setTopicIdUpdate:function(id){
      this.idUpdate=id;
    },
    getTopicIdUpdate:function(){
      return this.idUpdate;
    },
    setData: function (post) {
      var __post = post;
      var __timer = null;
      var that = this;
      this.$form.fullName.val(__post.fullname);
      this.$form.address.val(__post.address);
      this.$form.age.val(__post.age);
      this.$form.email.val(__post.email);
      this.$form.note.val(__post.content);
      this.$form.phone.val(__post.phone);
      if (iNet.isDefined(that.editor.getActiveEditor())) {
        clearTimeout(__timer);
        that.editor.setValue(__post.answer || '');
      } else {
        __timer = setTimeout(function () {
          that.editor.setValue(__post.answer || '');
        }, 1000);
      }
    },
    resetData: function () {
      this.$form.fullName.val('');
      this.$form.address.val('');
      this.$form.age.val('');
      this.$form.email.val('');
      this.$form.note.val('');
      this.$form.phone.val('');
      this.editor.setValue('');
    },
    resize: function () {
      $(window).trigger('resize');
    }
  });
});
