/**
 * #PACKAGE: admin
 * #MODULE: land-route-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:19 22/08/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file RouteMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.RouteList}
   */
  var list = new iNet.ui.admin.RouteList();
  /**
   * @type {iNet.ui.admin.RouteContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: list
  });
  /**
   * @param {iNet.ui.admin.RouteList} parent
   * @returns {iNet.ui.admin.RouteContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.admin.RouteContent();
      composer.on('back', function () {
        history.back();
      });
      composer.on('saved', function () {
        list.getGrid().load();
      });
      composer.on('removed', function () {
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

  history.on('back', function (widget) {
    widget.show();
  });

  list.show();

  list.on('create', function (parent) {
    composer = loadContent(parent);
    composer.resetForm();
  });

  list.on('open', function (record, parent) {
    composer = loadContent(parent);
    composer.resetForm();
    composer.setRecord(record);
  });
});