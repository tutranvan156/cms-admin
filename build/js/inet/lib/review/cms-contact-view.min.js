/**
 * #PACKAGE: review
 * #MODULE: cms-contact-view
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:01 29/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ContactContentView.js
 */
$(function () {
  /**
   * @class iNet.ui.review.ContactContentView
   * @extends iNet.ui.author.FQAContent
   */
  iNet.ns('iNet.ui.review.ContactContentView');
  iNet.ui.review.ContactContentView = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.module = 'fqa';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    this.form = {
      owner: $('#txt-content-owner'),
      time: $('#txt-content-time'),
      subject: $('#txt-content-subject'),
      question: $('#txt-content-question'),
      answer: $('#txt-content-answer'),
      category: $('#txt-content-category')
    };

    iNet.ui.review.ContactContentView.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.review.ContactContentView, iNet.ui.author.FQAContent, {
    setForm: function (data) {
      this.form.owner.text(data.owner || '');
      this.form.time.text(new Date(data.created).format(iNet.fullDateFormat));
      this.form.subject.val(data.subject || '');
      this.form.question.val(data.question || '');
    }
  });
});