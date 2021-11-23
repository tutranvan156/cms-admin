/**
 * #PACKAGE: api
 * #MODULE: poll-api
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:39 AM 28/10/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file PollApi.js
 */

function send(url, data, callback, options) {
  options = options || {};
  options.data = data || {};
  options.success = callback;
  options.type = 'post';
  options.url = url;
  AjaxAPI.sendRequest(options);
}
var PollAPI = {
  create: function (params, callback) {
    send(AjaxAPI.getPUrl('cms/poll/create'), params, callback);
  },
  update: function (params, callback) {
    send(AjaxAPI.getPUrl('cms/poll/update'), params, callback);
  },
  remove: function (params, callback) {
    send(AjaxAPI.getPUrl('cms/poll/delete'), params, callback);
  },
  load: function (params, callback) {
    send(AjaxAPI.getPUrl('cms/poll/load'), params, callback);
  }
};