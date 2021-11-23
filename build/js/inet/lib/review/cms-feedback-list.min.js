/**
 * #PACKAGE: review
 * #MODULE: cms-feedback-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:13 12/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file FeedbackList.js
 */
$(function () {
  /**
   * @class iNet.ui.review.FeedbackList
   * @extends iNet.ui.author.FQAList
   */
  iNet.ns('iNet.ui.review.FeedbackList');
  iNet.ui.review.FeedbackList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.module = 'fqa';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.group = CMSConfig.GROUP_FEEDBACK;

    iNet.ui.review.FeedbackList.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.review.FeedbackList, iNet.ui.author.FQAList);
});