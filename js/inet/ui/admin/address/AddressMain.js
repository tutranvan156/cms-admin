/**
 * #PACKAGE: admin
 * #MODULE: address-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17:10 21/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AddressMain.js
 */
$(function () {

  $.fn.modalmanager.defaults.resize = true;

  /**
   * @type {iNet.ui.admin.address.DistrictList}
   */
  var districtList = new iNet.ui.admin.address.DistrictList();

  /**
   * @type {iNet.ui.admin.address.WardList}
   */
  var wardList = null;

  /**
   * @type {iNet.ui.form.History}
   * @private
   */
  var _history = new iNet.ui.form.History({
    id: 'address-history'
  });

  /**
   * @param {iNet.ui.admin.address.DistrictList} parent
   * @returns {iNet.ui.admin.address.WardList}
   */
  function initWardList(parent) {
    if (!wardList) {
      wardList = new iNet.ui.admin.address.WardList();
      wardList.on(EVENT_BACK, function () {
        _history.back();
      });
    }
    if (parent) {
      wardList.setParent(parent);
      parent.hide();
    }
    _history.push(wardList);
    wardList.show();
    return wardList;
  }

  _history.setRoot(districtList);
  _history.on('back', function(widget) {
    widget.show();
  });

  districtList.on(EVENT_LOAD_SUB, function (record, parentClass) {
    initWardList(parentClass)
        .setParams(parentClass.getSubParams(record))
        .setParentRecord(record)
        .first();
  });
});
