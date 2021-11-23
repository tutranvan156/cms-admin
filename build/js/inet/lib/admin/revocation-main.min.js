/**
 * #PACKAGE: admin
 * #MODULE: revocation-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 11:22 18/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file RevocationMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.ListRevocation}
   */
  var list = new iNet.ui.admin.ListRevocation();
  /**
   * @type {iNet.ui.admin.RevocationContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: list
  });
  history.on('back', function (widget) {
    widget.show();
  });
  list.show();
  /**
   * @param {iNet.ui.admin.ListRevocation} parent
   * @returns {iNet.ui.admin.RevocationContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.admin.RevocationContent();
      composer.on(composer.getEvent('back'), function () {
        history.back();
      });
      composer.on(composer.getEvent('load'), function () {
        list.getGrid().load();
      });
      // composer.on('doc_created', function () {
      //   list.reload();
      // });
      // composer.on('doc_updated', function () {
      //   list.reload();
      // });
      // composer.on('load', function () {
      //   list.getGrid().reload();
      // });
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

  list.on('created', function (parent) {
    composer = loadContent(parent);
    composer.setUuid(null);
    composer.resetData();
  });

  list.on('open', function (record, parent) {
    composer = loadContent(parent);
    composer.setUuid(record.uuid);
    composer.setData(record);
  });
});
