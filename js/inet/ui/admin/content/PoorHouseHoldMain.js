/**
 * #PACKAGE: admin
 * #MODULE: poor-household-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 14:17 23/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file PoorHouseHoldMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.PoorHouseHoldList}
   */
  var list = new iNet.ui.admin.PoorHouseHoldList();
  /**
   * @type {iNet.ui.admin.PoorHouseHoldDetail}
   */
  var content = null;

  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId()
  });

  history.setRoot(list);

  history.on('back', function (widget) {
    widget.show();
  });

  list.on('create', function (parent) {
    content = loadContentWg(parent);
    content.resetForm();
  });

  list.on('open', function (record, parent) {
    content = loadContentWg(parent);
    content.setRecordId(record.uuid);
    content.load();
  });

  /**
   * @param {iNet.ui.admin.PoorHouseHoldList} parent
   * @returns {iNet.ui.admin.PoorHouseHoldDetail}
   */
  function loadContentWg(parent) {
    if (!content) {
      content = new iNet.ui.admin.PoorHouseHoldDetail();
      content.on('back', function () {
        history.back();
      });
      content.on('saved', function (record) {
        parent.reload();
      });
    }
    if (parent) {
      content.setParent(parent);
      parent.hide();
    }
    history.push(content);
    content.passRoles(parent);
    content.show();
    return content;
  }
});