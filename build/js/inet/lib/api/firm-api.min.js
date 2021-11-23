/**
 * #PACKAGE: api
 * #MODULE: firm-api
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:56 AM 11/05/2017.
 * -------------------------------------------
 * @project isphere
 * @author nbccong
 * @file FirmAPI.js
 */
$(function () {
  function send(url, data, callback, options) {
    options = options || {};
    options.data = data || {};
    options.success = callback;
    options.type = 'post';
    options.url = AjaxAPI.getPUrl(url);
    AjaxAPI.sendRequest(options);
  }
  window.FirmAPI = {
    verifyPrefix: function (data) {
      var enabled = false;
      AjaxAPI.ajax({
        async: false,
        data: data,
        url: AjaxAPI.getPUrl('cmsdesign/prefix/verify'),
        success: function (result) {
          enabled = result.prefix && result.enabled;
        }
      });
      return enabled;
    },
    verifyAccount: function (data) {
      var enabled = false;
      AjaxAPI.ajax({
        async: false,
        data: data,
        url: AjaxAPI.getPUrl('system/account/ldap'),
        success: function (result) {
          enabled = !!result.username;
        }
      });
      return enabled;
    },
    createSite: function (data, callback) {
      send(AjaxAPI.getPUrl('cmsdesign/firm/create'), data, callback);
    },
    updateSite: function (data, callback) {
      send(AjaxAPI.getPUrl('cmsdesign/firm/update'), data, callback);
    },
    removeSite: function (data, callback) {
      send(AjaxAPI.getPUrl('cmsdesign/firm/remove'), data, callback);
    },
    addMember: function (data, callback) {
      send(AjaxAPI.getPUrl('cmsfirm/member/update'), data, callback);
    },
    updateMember: function (data, callback) {
      send(AjaxAPI.getPUrl('cmsfirm/member/update'), data, callback);
    },
    removeMember: function (data, callback) {
      send(AjaxAPI.getPUrl('cmsfirm/member/update'), data, callback);
    },
    listMenu: function (data, callback) {
      send(AjaxAPI.getPUrl('cms/menucontext/list'), data, callback);
    },
    loadMenu: function (data, callback) {
      send(AjaxAPI.getPUrl('cms/menucontext/load'), data, callback);
    },
    createMenu: function (data, callback) {
      send(AjaxAPI.getPUrl('cms/menucontext/create'), data, callback);
    },
    updateMenu: function (data, callback) {
      send(AjaxAPI.getPUrl('cms/menucontext/update'), data, callback);
    },
    removeMenu: function (data, callback) {
      send(AjaxAPI.getPUrl('cms/menucontext/delete'), data, callback);
    },
    copyMenu: function (data, callback) {
      send(AjaxAPI.getPUrl('cms/menucontext/copy'), data, callback);
    },
    loadPage: function (data, callback) {
      send(AjaxAPI.getPUrl('cms/theme/page/list'), data, callback);
    }
  }
});
