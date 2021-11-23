/**
 * #PACKAGE: api
 * #MODULE: address-api
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 14:06 26/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AddressAPI.js
 */

function sendAjax(url, data, callback, options) {
  options = options || {};
  options.data = data || {};
  options.success = callback;
  options.type = 'post';
  options.url = url;
  AjaxAPI.sendRequest(options);
}
$(function () {
  window.AddressAPI = {
    URL: {
      DISTRICT_LIST: iNet.getPUrl('cms/district/list'),
      DISTRICT_CREATE: iNet.getPUrl('cms/district/create'),
      DISTRICT_UPDATE: iNet.getPUrl('cms/district/update'),
      DISTRICT_REMOVE: iNet.getPUrl('cms/district/delete'),
      WARD_LIST: iNet.getPUrl('cms/ward/list'),
      WARD_CREATE: iNet.getPUrl('cms/ward/create'),
      WARD_UPDATE: iNet.getPUrl('cms/ward/update'),
      WARD_REMOVE: iNet.getPUrl('cms/ward/delete')
    },

    listDistrict: function (params, callback, options) {
      sendAjax(this.URL.DISTRICT_LIST, params, callback, options);
    },
    createDistrict: function (params, callback, options) {
      sendAjax(this.URL.DISTRICT_CREATE, params, callback, options);
    },
    updateDistrict: function (params, callback, options) {
      sendAjax(this.URL.DISTRICT_UPDATE, params, callback, options);
    },
    deleteDistrict: function (params, callback, options) {
      sendAjax(this.URL.DISTRICT_REMOVE, params, callback, options);
    },
    listWard: function (params, callback, options) {
      sendAjax(this.URL.WARD_LIST, params, callback, options);
    },
    createWard: function (params, callback, options) {
      sendAjax(this.URL.WARD_CREATE, params, callback, options);
    },
    updateWard: function (params, callback, options) {
      sendAjax(this.URL.WARD_UPDATE, params, callback, options);
    },
    deleteWard: function (params, callback, options) {
      sendAjax(this.URL.WARD_REMOVE, params, callback, options);
    }
  };
});