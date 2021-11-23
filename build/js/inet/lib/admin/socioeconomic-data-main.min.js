/**
 * #PACKAGE: admin
 * #MODULE: socioeconomic-data-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:21 23/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file SocioeconomicDataMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.SocioeconomicDataList}
   */
  var list = new iNet.ui.admin.SocioeconomicDataList();

  /**
   * @type {iNet.ui.admin.SocioeconomicDataContent}
   */
  var content = null;

  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId()
  });

  /**
   * @param {iNet.ui.admin.SocioeconomicDataList} parent
   * @returns {iNet.ui.admin.SocioeconomicDataContent}
   */
  function initContentWidget(parent) {
    if (!content) {
      content = new iNet.ui.admin.SocioeconomicDataContent();

      content.on('back', function () {
        history.back();
      });

      content.on('saved', function () {
        parent.reload();
      });

      content.on('deleted', function (record) {
        parent.removeRecord(record);
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

  history.setRoot(list);
  history.on('back', function (widget) {
    widget.show();
  });

  list.on('create', function (parent) {
    content = initContentWidget(parent);
    content.clear();
  });

  list.on('open', function (record, parent) {
    content = initContentWidget(parent);
    content.clear();
    content.setRecord(record);
  });
});