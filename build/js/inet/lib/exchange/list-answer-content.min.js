/**
 * #PACKAGE: exchange
 * #MODULE: list-answer-content
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 14:45 30/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListAnswerContent.js
 */
$(function () {
  /**
   * @class iNet.ui.exchange.ListAnswerContent
   * @extends  iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.exchange.ListAnswerContent');
  iNet.ui.exchange.ListAnswerContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'menu-answer-content-wg';
    this.module = 'topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.param = {};
    this.url = {
      answer: iNet.getPUrl('onl/exch/question/answer')
    };

    this.$btn = {
      BACK: $('#detail-answer-btn-back'),
      SAVE: $('#detail-answer-btn-save')
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

    iNet.ui.exchange.ListAnswerContent.superclass.constructor.call(this);
    this.$btn.SAVE.on('click',function(){
      _this.param.answer=_this.editor.getValue();
      _this.param.topic=_this.getTopic();
      _this.param.uuid=_this.getUuid();
      $.postJSON(_this.url.answer,_this.param,function(result){
        if (result.type === 'ERROR')
          _this.error(_this.getText('answer'), _this.getText('answer_error'));
        else {
          _this.fireEvent(_this.getEvent('answered'));
          _this.success(_this.getText('answer'), _this.getText('answer_success'));
        }
      });
    });
    this.$btn.BACK.on('click',function(){
      _this.hide();
      _this.fireEvent(_this.getEvent('back_list'),_this);
    });
  };
  iNet.extend(iNet.ui.exchange.ListAnswerContent, iNet.ui.WidgetExt, {
    setTopic:function(topic){
      this.topic=topic;
    },
    getTopic:function(){
      return this.topic;
    },
    setUuid:function(uuid){
      this.uuid=uuid;
    },
    getUuid:function(){
      return this.uuid;
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
    resize: function () {
      $(window).trigger('resize');
    }
  });
});
