/**
 * #PACKAGE: admin
 * #MODULE: socioeconomic-report-main
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
   * @type {iNet.ui.admin.SocioeconomicReportList}
   */
  var list = new iNet.ui.admin.SocioeconomicReportList();

  /**
   * @type {iNet.ui.admin.SocioeconomicReportContent}
   */
  var content = null;

  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId()
  });

  /**
   * @param {iNet.ui.admin.SocioeconomicReportList} parent
   * @returns {iNet.ui.admin.SocioeconomicReportContent}
   */
  function initContentWidget(parent) {
    if (!content) {
      content = new iNet.ui.admin.SocioeconomicReportContent();

      content.on('back', function () {
        history.back();
        list.reload();
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