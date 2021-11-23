/**
 * #PACKAGE: api
 * #MODULE: unit-api
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:48 29/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file UnitAPI.js
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
var UnitAPI = {
  create: function (params, callback, options) {
    sendAjax(iNet.getPUrl('cms/unit/create'), params, callback, options);
  },
  update: function (params, callback, options) {
    sendAjax(iNet.getPUrl('cms/unit/update'), params, callback, options);
  },
  remove: function (params, callback, options) {
    sendAjax(iNet.getPUrl('cms/unit/delete'), params, callback, options);
  },
  memberCreate: function (params, callback, options) {
    sendForm(iNet.getPUrl('cms/unit/member/create'), params, callback, options);
  },
  memberUpdate: function (params, callback, options) {
    sendForm(iNet.getPUrl('cms/unit/member/update'), params, callback, options);
  },
  memberDelete: function (params, callback, options) {
    sendAjax(iNet.getPUrl('cms/unit/member/delete'), params, callback, options);
  }
};