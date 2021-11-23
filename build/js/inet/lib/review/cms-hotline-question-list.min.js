/**
 * #PACKAGE: review
 * #MODULE: cms-hotline-question-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:13 12/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file HotlineQuestionList.js
 */
$(function () {
  /**
   * @class iNet.ui.review.HotlineQuestionList
   * @extends iNet.ui.author.FQAList
   */
  iNet.ns('iNet.ui.review.HotlineQuestionList');
  iNet.ui.review.HotlineQuestionList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.module = 'fqa';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.group = CMSConfig.GROUP_HOTLINE;

    iNet.ui.review.HotlineQuestionList.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.review.HotlineQuestionList, iNet.ui.author.FQAList);
});