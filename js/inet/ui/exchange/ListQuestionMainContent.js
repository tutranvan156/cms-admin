/**
 * #PACKAGE: exchange
 * #MODULE: list-question-main-content
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 15:45 29/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListQuestionMainContent.js
 */
$(function () {
  /**
   * @class iNet.ui..ListQuestionMainContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.exchange.ListQuestionMainContent');
  iNet.ui.exchange.ListQuestionMainContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'menu-question-content-wg';
    this.module = 'topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.param = {};
    this.url = {
      update: iNet.getPUrl('onl/exch/question/update'),
      _delete: iNet.getPUrl('onl/exch/question/delete'),
      assign: iNet.getPUrl('onl/exch/question/assign'),
      listMember: iNet.getPUrl('onl/exch/topic/member/list')
    };

    this.$btn = {
      BACK: $('#detail-question-btn-back'),
      SAVE: $('#detail-question-btn-save'),
      REMOVE:$('#detail-question-btn-remove'),
      SEND:$('#detail-question-btn-send'),
      PUBLISH:$('#detail-question-btn-publish')
    };

    this.$form = {
      fullName: $('#txt-question-fullname'),
      address: $('#txt-question-address'),
      email: $('#txt-question-email'),
      phone: $('#txt-question-phone'),
      age: $('#txt-question-age'),
      note: $('#txt-question-note'),
      content: $('#txt-question-content'),
      modal:$('.modal-body')
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
    iNet.ui.exchange.ListQuestionMainContent.superclass.constructor.call(this);

    this.$btn.SAVE.on('click',function(){
      _this.param.uuid=_this.getUuid();
      _this.param.topic=_this.getTopicIdUpdate();
      _this.param.fullname = _this.$form.fullName.val() || '';
      _this.param.address = _this.$form.address.val() || '';
      _this.param.email = _this.$form.email.val() || '';
      _this.param.phone = _this.$form.phone.val() || '';
      _this.param.age = _this.$form.age.val() || '';
      _this.param.content = _this.$form.note.val() || '';
      $.postJSON(_this.url.update,_this.param,function(result){
        if (result.type === 'ERROR')
          _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
        else {
          _this.fireEvent(_this.getEvent('saved'));
          _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
        }
      });
    });
    this.$btn.REMOVE.on('click',function(){
      var dialog = _this.confirmDlg(_this.getText('title_delete', 'link'), _this.getText('quesion_delete', 'link'), function () {
        this.hide();
        $.postJSON(_this.url._delete,this.getOptions(),function(result){
          if (result.type === 'ERROR')
            _this.error(_this.getText('delete', 'link'), _this.getText('delete_error', 'link'));
          else {
            _this.fireEvent(_this.getEvent('deleted'));
            _this.success(_this.getText('delete', 'link'), _this.getText('delete_success', 'link'));
          }
        });
      });
      dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', 'link'));
      dialog.setOptions({
        uuid: _this.getUuid(),
        topic:_this.getTopicIdUpdate()
      });
      dialog.show();
    });

    this.$btn.SEND.on('click',function(){
      _this.fireEvent(_this.getEvent('open_modal'),_this.getTopicIdUpdate(),_this.getUuid(),_this);
    });
    this.$btn.BACK.on('click',function(){
      _this.hide();
      _this.fireEvent(_this.getEvent('back_list'),_this);
      //console.log('vào click back.');
    });
  };
  iNet.extend(iNet.ui.exchange.ListQuestionMainContent, iNet.ui.WidgetExt, {
    setTopicIdUpdate:function(id){
      this.idUpdate=id;
    },
    getTopicIdUpdate:function(){
      return this.idUpdate;
    },
    setUuid:function(id){
      this.uuid=id;
    },
    getUuid:function(){
      return this.uuid;
    },
    setStatusQuestion:function(status){
      this.status=status;
    },
    getStatusQuestion:function(){
      return this.status;
    },
    setData: function (post) {
      //console.log('status: ',this.getStatusQuestion());
      if(this.getStatusQuestion()==='CREATED') {
        this.$btn.PUBLISH.hide();
        this.$btn.SAVE.show();
        this.$btn.REMOVE.show();
        this.$btn.SEND.show();
        this.$btn.BACK.show();
      }
      if(this.getStatusQuestion()==='PROCESS'){
        this.$btn.PUBLISH.hide();
        this.$btn.SEND.hide();
        this.$btn.REMOVE.hide();
        this.$btn.SAVE.show();
        this.$btn.BACK.show();
      }
      if(this.getStatusQuestion()==='REJECT'){
        this.$btn.PUBLISH.hide();
        this.$btn.SEND.hide();
        this.$btn.SAVE.show();
        this.$btn.REMOVE.show();
        this.$btn.BACK.show();
      }
      if(this.setStatusQuestion()==='PUBLISHED'){
        this.$btn.SEND.hide();
        this.$btn.PUBLISH.hide();
        this.$btn.REMOVE.hide();
        this.$btn.SAVE.hide();
        this.$btn.BACK.show();
      }
      if(this.setStatusQuestion()==='REVIEW'){
        this.$btn.SAVE.hide();
        this.$btn.PUBLISH.show();
        this.$btn.SEND.show();
        this.$btn.REMOVE.show();
        this.$btn.BACK.show();
      }
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
    resize: function () {
      $(window).trigger('resize');
    }
  });

});
