/**
 * #PACKAGE: admin
 * #MODULE: complain-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 13:53 11/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ComplainMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;

  /**
   * @type {iNet.ui.admin.ListComplain}
   */
  var listTopic = new iNet.ui.admin.ListComplain();
  /**
   * @type {iNet.ui.admin.ComplainContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: listTopic
  });
  history.on('back', function (widget) {
    widget.show();
  });
  listTopic.show();
  /**
   * @param {iNet.ui.admin.ListComplain} parent
   * @returns {iNet.ui.admin.ComplainContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.admin.ComplainContent();
      composer.on(composer.getEvent('back'), function () {
        history.back();
      });
      composer.on(composer.getEvent('load'), function () {
        listTopic.getGrid().reload();
      });
    }
    if (parent) {
      composer.setParent(parent);
      parent.hide();
    }
    history.push(composer);
    composer.passRoles(parent);
    composer.show();
    return composer;
  };

  listTopic.on(listTopic.getEvent('created'), function (parent) {
    composer = loadContent(parent);
    composer.clearDataForm();
    composer.setComplainId('');
    // composer.clearArrayFile();
    // composer.setDocId('');
  });

  listTopic.on(listTopic.getEvent('open'), function (record, parent) {
    composer = loadContent(parent);
    composer.setComplainId(record.uuid);
    composer.mapDataForm();
  });
});