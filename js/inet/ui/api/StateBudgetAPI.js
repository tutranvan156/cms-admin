/**
 * #PACKAGE: api
 * #MODULE: state-budget-api
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09:55 28/08/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file StateBudgetAPI.js
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
  window.StateBudgetAPI = {
    URL: {
      LIST: iNet.getPUrl('cms/egov/budget/search'),
      LOAD: iNet.getPUrl('cms/egov/budget/load'),
      ITEM: iNet.getPUrl('cms/egov/budget/item'),
      SAVE: iNet.getPUrl('cms/egov/budget/save'),
      REMOVE: iNet.getPUrl('cms/egov/budget/remove')
    },
    list: function (params, callback) {
      $.postJSON(this.URL.LIST, params, function (results) {
        callback && callback(results);
      });
    },
    item: function (params, callback) {
      $.getJSON(this.URL.ITEM, params, function (results) {
        callback && callback(results);
      });
    },
    save: function (params, callback) {
      $.postJSON(this.URL.SAVE, params, function (results) {
        callback && callback(results);
      });
    },
    remove: function (params, callback) {
      $.postJSON(this.URL.REMOVE, params, function (results) {
        callback && callback(results);
      });
    }
  }
});