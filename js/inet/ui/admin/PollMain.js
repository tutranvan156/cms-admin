/**
 * #PACKAGE: admin
 * #MODULE: cms-poll-main
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:25 AM 28/10/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file PollMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.PollList}
   */
  var list = new iNet.ui.admin.PollList();

  /**
   * @type {iNet.ui.admin.PollContent}
   */
  var content = null;

  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId()
  });

  /**
   * @param {iNet.ui.admin.PollList} parent
   * @returns {iNet.ui.admin.PollContent}
   */
  function initPollContent(parent) {
    if (!content) {
      content = new iNet.ui.admin.PollContent();
      content.on('back', function () {
        history.back();
      });
      content.on('created', function (record) {
        parent.insert(record);
      });
      content.on('save-update',function(){
        list.getGrid().reload();
      });
      content.on('updated', function (record) {
        parent.update(record);
      });
      content.on('removed', function (record) {
        parent.removeRecord(record);
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
  }

  history.setRoot(list);
  history.on('back', function (widget) {
    widget.show();
  });

  list.on('open', function (record, clazz) {
    content = initPollContent(clazz);
    content.load(record.uuid);
  });

  list.on('create', function (clazz) {
    content = initPollContent(clazz);
    content.clear();
  });
});
