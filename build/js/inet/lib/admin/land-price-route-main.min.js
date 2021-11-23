/**
 * #PACKAGE: admin
 * #MODULE: land-price-route-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15:16 22/08/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file LandPriceRouteMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.LandPriceRouteList}
   */
  var list = new iNet.ui.admin.LandPriceRouteList();
  /**
   * @type {iNet.ui.admin.LandPriceRouteContent}
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
   * @param {iNet.ui.admin.LandPriceRouteList} parent
   * @returns {iNet.ui.admin.LandPriceRouteContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.admin.LandPriceRouteContent();
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
    composer.setRecordId(record.uuid);
    composer.load();
  });
});