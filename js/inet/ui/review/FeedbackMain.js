/**
 * #PACKAGE: review
 * #MODULE: cms-feedback-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:35 12/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file FeedbackMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.review.FeedbackList}
   */
  var list = new iNet.ui.review.FeedbackList();
  /**
   * @type {iNet.ui.review.FeedbackContent}
   */
  var content = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: list
  });
  history.on('back', function(widget){
    widget.show();
  });
  /**
   * @param {iNet.ui.review.FeedbackList} parent
   * @returns {iNet.ui.review.FeedbackContent}
   */
  var loadContentWg = function (parent) {
    if (!content) {
      content = new iNet.ui.review.FeedbackContent();
      content.on('back', function () {
        history.back();
      });
      content.on('answered', function (data) {
        parent.update(data);
      });
      content.on('created', function (data) {
        parent.insert(data);
      });
      content.on('deleted', function (data) {
        parent.removeByID(data.uuid);
        history.back();
      });
    }
    if(parent){
      content.setParent(parent);
      parent.hide();
    }
    history.push(content);
    content.passRoles(parent);
    content.show();
    return content;
  };
  list.on('open', function (record, parent) {
    content = loadContentWg(parent);
    content.setMode(MODE.VIEW);
    content.setRecord(record);
    content.load(record);
  });
  list.on('create', function (mode, parent) {
    content = loadContentWg(parent);
    content.setMode(MODE.CREATE);
    content.setRecord(null);
    content.resetForm();
  });
});