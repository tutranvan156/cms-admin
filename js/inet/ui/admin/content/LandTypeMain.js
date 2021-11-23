
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:02 21/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file LandMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.LandTypeList}
   */
  var list = new iNet.ui.admin.LandTypeList();
  /**
   * @type {iNet.ui.admin.LandTypeDetail}
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
   * @param {iNet.ui.admin.LandTypeList} parent
   * @returns {iNet.ui.admin.LandTypeDetail}
   */
  function loadContentWg(parent) {
    if (!content) {
      content = new iNet.ui.admin.LandTypeDetail();
      content.on('back', function () {
        history.back();
      });
      content.on('created', function (record) {
        parent.insert(record);
      });
      content.on('updated', function (record) {
        parent.update(record);
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