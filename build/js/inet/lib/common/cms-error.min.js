// #PACKAGE: common
// #MODULE: cms-error
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 18/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file Error
 * @author nbchicong
 */
$(function () {
  iNet.ns('iNet.ui.Error');
  iNet.ui.Error = function (options) {
    var __options = options || {};
    iNet.apply(this, __options);
    this.root = this.root || iNet.resources.cmsadmin.errors;
    this._key = null;
    this.errors = [
      'THEME_NOT_FOUND',
      'THEME_IN_USED',
      'THEME_EXISTED',
      'PLUGIN_NOT_FOUND',
      'PLUGIN_EXISTED',
      'PLUGIN_IN_USED'
    ];
  };
  iNet.extend(iNet.ui.Error, iNet.ui.CMSComponent, {
    constructor: iNet.ui.Error,
    _setKey: function (key) {
      this._key = key;
    },
    getKey: function () {
      return this._key;
    },
    put: function (errorKey) {
      this._setKey(errorKey);
      if (this.errors.indexOf(errorKey) === -1) {
        this.errors.push(errorKey);
      }
    },
    get: function (errorKey) {
      var __key = errorKey || iNet.isEmpty(this.getKey())?this.errors[0]:this.getKey();
      return iNet.resources.cmsadmin.errors[__key];
    }
  });
});