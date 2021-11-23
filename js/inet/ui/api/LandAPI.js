/**
 * #PACKAGE: api
 * #MODULE: land-api
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:13 22/08/2018.
 * -------------------------------------------
 * @project XPortalEGovCMS
 * @author nbchicong
 * @file LandAPI.js
 */

function sendForm(url, data, callback, options) {
  options = options || {};
  options.params = data || {};
  options.callback = callback;
  options.method = 'post';
  options.url = url;
  $.submitData(options);
}
function sendAjax(url, data, callback, options) {
  options = options || {};
  options.data = data || {};
  options.success = callback;
  options.type = 'post';
  options.url = url;
  AjaxAPI.sendRequest(options);
}

$(function () {
  window.LandCateAPI = {
    URL: {
      SEARCH: iNet.getPUrl('land/category/search'),
      SAVE: iNet.getPUrl('land/category/save'),
      REMOVE: iNet.getPUrl('land/category/remove')
    },
    list: function (params, callback, options) {
      sendAjax(this.URL.SEARCH, params, callback, options);
    },
    save: function (params, callback, options) {
      sendForm(this.URL.SAVE, params, callback, options);
    },
    remove: function (params, callback, options) {
      sendAjax(this.URL.REMOVE, params, callback, options);
    }
  };
  window.LandRouteAPI = {
    URL: {
      SEARCH: iNet.getPUrl('land/route/search'),
      LOAD: iNet.getPUrl('land/price/load'),
      SAVE: iNet.getPUrl('land/route/save'),
      REMOVE: iNet.getPUrl('land/route/remove')
    },
    list: function (params, callback, options) {
      sendAjax(this.URL.SEARCH, params, callback, options);
    },
    load: function (params, callback, options) {
      sendAjax(this.URL.LOAD, params, callback, options);
    },
    /**
     * @param {FormData} params
     * @param {Function} callback
     * @param {Object} [options]
     */
    save: function (params, callback, options) {
      sendForm(this.URL.SAVE, params, callback, options);
    },
    remove: function (params, callback, options) {
      sendAjax(this.URL.REMOVE, params, callback, options);
    }
  };
  window.LandProjectAPI = {
    URL: {
      SEARCH: iNet.getPUrl('land/project/search'),
      LOAD: iNet.getPUrl('land/price/load'),
      SAVE: iNet.getPUrl('land/project/save'),
      REMOVE: iNet.getPUrl('land/project/remove')
    },
    list: function (params, callback, options) {
      sendAjax(this.URL.SEARCH, params, callback, options);
    },
    load: function (params, callback, options) {
      sendAjax(this.URL.LOAD, params, callback, options);
    },
    /**
     * @param {FormData} params
     * @param {Function} callback
     * @param {Object} [options]
     */
    save: function (params, callback, options) {
      sendForm(this.URL.SAVE, params, callback, options);
    },
    remove: function (params, callback, options) {
      sendAjax(this.URL.REMOVE, params, callback, options);
    }
  };
});