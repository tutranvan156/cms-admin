/**
 * #PACKAGE: admin
 * #MODULE: city-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 14:43 21/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file CityList.js
 */
$(function () {

  /**
   * Load country
   * @param {Function} callback
   */
  function loadCountry(callback) {
    $.getJSON(iNet.getUrl('cloudapp/country/list'), {}, function (result) {
      for (var i = 0; i < result.items.length; i++) {
        if (result.items[i].code === 'VN') {
          callback(result.items[i]);
          break;
        }
      }
    });
  }

  /**
   * @param record
   * @param country
   * @returns {*|Object|void}
   */
  function getParams(record, country) {
    $.extend(record, {
      countryID: country.uuid
    });
    return record;
  }

  /**
   * @class iNet.ui.admin.address.CityList
   * @extends iNet.ui.admin.address.AbstractAddressList
   */
  iNet.ns('iNet.ui.admin.address.CityList');
  iNet.ui.admin.address.CityList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'city-wg';
    this.gridId = 'city-list';
    this.type = 'city';
    this.hasSub = true;
    this.subName = 'District';
    this.firstLoad = false;
    this.isRoot = true;
    this.url = this.url || {
      list: iNet.getPUrl('cloudapp/city/list'),
      create: iNet.getPUrl('cloudapp/city/create'),
      update: iNet.getPUrl('cloudapp/city/update'),
      remove: iNet.getPUrl('cloudapp/city/delete')
    };
    this.resources = {
      name: iNet.resources.message.address.city.name,
      name_missed: iNet.resources.message.address.city.name_missed,
      code: iNet.resources.message.address.city.code,
      code_missed: iNet.resources.message.address.city.code_missed
    };

    this.toolbar = {
      CREATE: $('#tb-btn-city-create')
    };

    iNet.ui.admin.address.CityList.superclass.constructor.call(this);

    loadCountry(function (item) {
      _this.setParams({country: item.uuid});
      _this.getGrid().load();
    });
  };
  iNet.extend(iNet.ui.admin.address.CityList, iNet.ui.admin.address.AbstractAddressList, {
    constructor: iNet.ui.admin.address.CityList,
    createItem: function (record) {
      var _this = this;
      $.postJSON(this.url.create, getParams(record, this.getParams()), function (result) {
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
      $.postJSON(this.url.update, getParams(record, this.getParams()), function (result) {
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
              $.postJSON(_this.url.remove, this.getData(), function (result) {
                if (result.type !== CMSConfig.TYPE_ERROR) {
                  _this.success(
                      iNet.resources.notify.del,
                      iNet.resources.message.address.deleted);
                  _this.removeRecord(result);
                }
              });
              this.hide();
            });
      this.confirmDeleteDlg.setData({city: recordId});
      this.confirmDeleteDlg.show();
    },
    getSyncParams: function () {
      return {type: 'province'}
    }
  });
});
