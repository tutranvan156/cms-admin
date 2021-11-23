/**
 * #PACKAGE: api
 * #MODULE: poor-house-api
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17:40 02/08/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file PoorHouseAPI.js
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
  window.PoorHouseAPI = {
    URL: {
      LIST: iNet.getPUrl('poor/household/list'),
      LOAD: iNet.getPUrl('poor/household/load'),
      SAVE: iNet.getPUrl('poor/household/save'),
      REMOVE: iNet.getPUrl('poor/household/remove'),
      DOWN_ATTACH: iNet.getPUrl('poor/household/downfile'),
      RM_ATTACH: iNet.getPUrl('poor/household/rmattach')
    },
    list: function (params, callback, options) {
      sendAjax(this.URL.LIST, params, callback, options);
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
    },
    downAttach: function (params, callback, options) {
      $.download(this.URL.DOWN_ATTACH, params);
    },
    rmAttach: function (params, callback, options) {
      sendAjax(this.URL.RM_ATTACH, params, callback, options);
    }
  };
});