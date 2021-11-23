/**
 * #PACKAGE: review
 * #MODULE: cms-hotline-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:23 12/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file HotlineContent.js
 */
$(function () {
  /**
   * @class iNet.ui.review.HotlineContent
   * @extends iNet.ui.author.FQAContent
   */
  iNet.ns('iNet.ui.review.HotlineContent');
  iNet.ui.review.HotlineContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.module = 'fqa';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    iNet.ui.review.HotlineContent.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.review.HotlineContent, iNet.ui.author.FQAContent, {
    setForm: function (data) {
      this.form.owner.text(data.owner || '');
      this.form.category.val(data.category || '');
      this.form.subject.val(data.subject || '');
      this.form.question.val(data.question || '');
      this.editor.setValue(data.answer || '');
    }
  });
});