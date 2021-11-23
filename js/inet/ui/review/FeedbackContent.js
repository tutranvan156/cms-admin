/**
 * #PACKAGE: review
 * #MODULE: cms-feedback-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:23 12/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file FeedbackContent.js
 */
$(function () {
  /**
   * @class iNet.ui.review.FeedbackContent
   * @extends iNet.ui.author.FQAContent
   */
  iNet.ns('iNet.ui.review.FeedbackContent');
  iNet.ui.review.FeedbackContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.module = 'fqa';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    this.form = {
      owner: $('#txt-content-owner'),
      time: $('#txt-content-time'),
      subject: $('#txt-content-subject'),
      category: $('#cbb-content-category'),
      question: $('#txt-content-question'),
      answer: $('#txt-content-answer')
    };

    iNet.ui.review.FeedbackContent.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.review.FeedbackContent, iNet.ui.author.FQAContent, {
    setForm: function (data) {
      this.form.owner.text(data.owner || '');
      this.form.time.text(new Date(data.created).format(iNet.fullDateFormat));
      this.form.category.val(data.category || '');
      this.form.subject.val(data.subject || '');
      this.form.question.val(data.question || '');
      this.editor.setValue(data.answer || '');
    }
  });
});