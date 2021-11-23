/**
 * #PACKAGE: review
 * #MODULE: cms-contact-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:02 29/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ContactContentMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.review.ContactContentList}
   */
  var list = new iNet.ui.review.ContactContentList();
  /**
   * @type {iNet.ui.review.ContactContentView}
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
   * @param {iNet.ui.review.ContactContentList} parent
   * @returns {iNet.ui.review.ContactContentView}
   */
  var loadContentWg = function (parent) {
    if (!content) {
      content = new iNet.ui.review.ContactContentView();
      content.on('back', function () {
        history.back();
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
    content.setRecord(record);
    content.load(record);
  });
});