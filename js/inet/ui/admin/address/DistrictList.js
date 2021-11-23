/**
 * #PACKAGE: admin
 * #MODULE: district-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15:30 21/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file DistrictList.js
 */
$(function () {

  /**
   * @param record
   * @param data
   * @returns {*|Object|void}
   */
  function getParams(record, data) {
    $.extend(record, {
      cityId: data.city
    });
    return record;
  }

  /**
   * @class iNet.ui.admin.address.DistrictList
   * @extends iNet.ui.admin.address.AbstractAddressList
   */
  iNet.ns('iNet.ui.admin.address.DistrictList');
  iNet.ui.admin.address.DistrictList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'district-wg';
    this.gridID = 'district-list';
    this.type = 'district';
    this.hasSub = true;
    this.subName = 'Ward';
    this.isRoot = true;
    this.firstLoad = false;
    this.url =  {
      list: AddressAPI.URL.DISTRICT_LIST
    };
    this.resources = iNet.resources.message.address.district;

    this.toolbar = {
      BACK: $('#tb-btn-district-back'),
      CREATE: $('#tb-btn-district-create')
    };

    iNet.ui.admin.address.DistrictList.superclass.constructor.call(this);

    _this.setParams({
      country: 'VN',
      city: iNet.cityCode
    });
    _this.getGrid().load();

  };
  iNet.extend(iNet.ui.admin.address.DistrictList, iNet.ui.admin.address.AbstractAddressList, {
    constructor: iNet.ui.admin.address.DistrictList,

    /**
     * @param {Object} record
     * @returns {iNet.ui.admin.address.DistrictList}
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
      AddressAPI.createDistrict(getParams(record, this.getParams()), function (result) {
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
      AddressAPI.updateDistrict(getParams(record, this.getParams()), function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          _this.success(
              iNet.resources.notify.update,
              iNet.resources.message.address.updated);
          _this.update(result);
        }
      });
    },
    removeItem: function (recordId) {
      var _this = this;
      if (!this.confirmDeleteDlg)
        this.confirmDeleteDlg = this.confirmDlg(
          iNet.resources.message.dialog_del_confirm_title,
          iNet.resources.message.dialog_del_confirm_content,
          function () {
              var __data = this.getData();
              // console.log('__data',__data);
              var _uuid = __data.uuid;
              // var __grid = __data.grid;
            _this.confirmDeleteDlg.hide();
            AddressAPI.deleteDistrict({uuid: _uuid}, function (result) {
              if (result.type !== CMSConfig.TYPE_ERROR) {
                _this.success(
                    iNet.resources.notify.del,
                    iNet.resources.message.address.deleted);
                 _this.removeRecord(result);

              }
            });
            // this.hide();
          }
        );
      this.confirmDeleteDlg.setData({uuid: recordId});
      this.confirmDeleteDlg.show();
    },
    getSyncParams: function () {
      var syncParams = {type: 'district'};
      syncParams.parentCode = this.getParentRecord().postalcode;
      return syncParams;
    }
  });
});
