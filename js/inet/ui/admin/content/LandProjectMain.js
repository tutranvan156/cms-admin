
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:01 23/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file LandProjectMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.LandProjectList}
   */
  var list = new iNet.ui.admin.LandProjectList();
  /**
   * @type {iNet.ui.admin.LandProjectContent}
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
   * @param {iNet.ui.admin.LandProjectList} parent
   * @returns {iNet.ui.admin.LandProjectContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.admin.LandProjectContent();
      composer.on('back', function () {
        history.back();
      });
      composer.on('load', function () {
        list.getGrid().load();
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

  list.on('created', function (parent) {
    composer = loadContent(parent);
    composer.resetData();
  });

  list.on('open', function (record, parent) {
    composer = loadContent(parent);
    composer.load(record.uuid);
  });
});
