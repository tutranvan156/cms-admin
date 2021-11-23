/**
 * #PACKAGE: api
 * #MODULE: content-api
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 14:24 20/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ContentAPI.js
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
  window.ContentAPI = {
    URL: {
      LIST: iNet.getPUrl('dynamic/content/glblist'),
      LOAD: iNet.getPUrl('dynamic/content/load'),
      CREATE: iNet.getPUrl('dynamic/content/create'),
      UPDATE: iNet.getPUrl('dynamic/content/update'),
      REMOVE: iNet.getPUrl('dynamic/content/delete'),
      DOWN_ATTACH: iNet.getPUrl('dynamic/content/downfile'),
      RM_ATTACH: iNet.getPUrl('dynamic/content/rmattach')
    },

    list: function (params, callback, options) {
      sendAjax(this.URL.LIST, params, callback, options);
    },
    load: function (params, callback, options) {
      sendAjax(this.URL.LOAD, params, callback, options);
    },
    create: function (params, callback, options) {
      sendForm(this.URL.CREATE, params, callback, options);
    },
    update: function (params, callback, options) {
      sendForm(this.URL.UPDATE, params, callback, options);
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