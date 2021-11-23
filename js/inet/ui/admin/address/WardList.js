/**
 * #PACKAGE: admin
 * #MODULE: ward-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 16:25 AM 21/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file WardList.js
 */
$(function () {

  /**
   * @param record
   * @param data
   * @returns {*|Object|void}
   */
  function getParams(record, data) {
    $.extend(record, {
      districtId: data.district
    });
    return record;
  }

  /**
   * @class iNet.ui.admin.address.WardList
   * @extends iNet.ui.admin.address.AbstractAddressList
   */
  iNet.ns('iNet.ui.admin.address.WardList');
  iNet.ui.admin.address.WardList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'ward-wg';
    this.gridID = 'ward-list';
    this.hasSub = false;
    this.url = this.url || {
      list: AddressAPI.URL.WARD_LIST
    };
    this.resources = iNet.resources.message.address.ward;

    this.toolbar = {
      BACK: $('#tb-btn-ward-back'),
      CREATE: $('#tb-btn-ward-create')
    };

    iNet.ui.admin.address.WardList.superclass.constructor.call(this);

  };
  iNet.extend(iNet.ui.admin.address.WardList, iNet.ui.admin.address.AbstractAddressList, {
    /**
     * @param {Object} record
     * @returns {iNet.ui.admin.address.WardList}
     */
    setParentRecord: function (record) {
      this.parentRecord = record;
      return this;
    },
    /**
     * @returns {Object}
     */
    getParentRecord: function () {
      return this.parentRecord || null;
    },
    createItem: function (record) {
      var _this = this;
      AddressAPI.createWard(getParams(record, this.getParams()), function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          _this.success(
              iNet.resources.notify.create,
              iNet.resources.message.address.created);
          _this.insert(result);
        }
      });
    },
    updateItem: function (record) {
      var _this = this;
      AddressAPI.updateWard(getParams(record, this.getParams()), function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR)
          _this.success(
              iNet.resources.notify.update,
              iNet.resources.message.address.updated);
        _this.update(result);
      });
    },
    removeItem: function (recordId) {
      var _this = this;
      if (!this.confirmDeleteDlg)
        this.confirmDeleteDlg = this.confirmDlg(
            iNet.resources.message.dialog_del_confirm_title,
            iNet.resources.message.dialog_del_confirm_content,
            function () {
              AddressAPI.deleteWard(this.getData(), function (result) {
                if (result.type !== CMSConfig.TYPE_ERROR) {
                  _this.success(
                      iNet.resources.notify.del,
                      iNet.resources.message.address.deleted);
                  _this.remove(result);
                }
              });
              this.hide();
            }
        );
      this.confirmDeleteDlg.setData({uuid: recordId});
      this.confirmDeleteDlg.show();
    },
    getSyncParams: function () {
      var syncParams = {type: 'ward'};
      syncParams.parentCode = this.getParentRecord().postalcode;
      return syncParams;
    }
  });
});
