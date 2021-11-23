// #PACKAGE: common
// #MODULE: cms-security-utils
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11/07/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file SecurityUtils
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.SecurityUtils
   * @extends iNet.ui.CMSComponent
   */
  var spliter = ';';
  iNet.ns('iNet.ui.SecurityUtils');
  iNet.ui.SecurityUtils = function (config) {
    var _this = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.roles = '';
    this.rolesArr = this.rolesArr || [];
    if (!iNet.isEmpty(this.getRoleArr())) {
      this.register();
    }
  };
  iNet.extend(iNet.ui.SecurityUtils, iNet.ui.CMSComponent, {
    /**
     * Copy system roles to other object
     * @param dest Destination Security Class
     */
    copyRoles: function (dest) {
      dest.setRoles(this.getRoles());
    },
    register: function () {
      var __roleArr = this.getRoleArr();
      if (iNet.isArray(__roleArr) && !iNet.isEmpty(__roleArr)) {
        this.setRoles(__roleArr.join(spliter));
      }
    },
    setRoleArr: function (rolesArr) {
      this.rolesArr = rolesArr;
    },
    getRoleArr: function () {
      return this.rolesArr;
    },
    setRoles: function (roles) {
      this.roles = roles;
    },
    getRoles: function () {
      return this.roles;
    },
    isAuth: function () {
      return !iNet.isEmpty(this.getRoleArr());
    },
    hasRoles: function (roles, isAll) {
      var __checkRoles = roles || '';
      var __isAll = isAll || false;
      var __roles = this.getRoles().split(spliter);
      if (iNet.isArray(__checkRoles) && !iNet.isEmpty(__checkRoles)) {
        var __hasRole = true;
        var i = 0;
        if (__isAll) {
          for (i = 0; i < iNet.getSize(__checkRoles); i ++) {
            if (__roles.indexOf(__checkRoles[i]) !== -1) {
              __hasRole = true;
            } else {
              __hasRole = false;
              break;
            }
          }
        } else {
          for (i = 0; i < iNet.getSize(__checkRoles); i ++) {
            if (__roles.indexOf(__checkRoles[i]) !== -1) {
              __hasRole = true;
              break;
            } else {
              __hasRole = false;
            }
          }
        }
        return __hasRole;
      } else if (iNet.isString(__checkRoles) && !iNet.isEmpty(__checkRoles)) {
        if (__checkRoles.indexOf(spliter) !== -1) {
          return this.hasRoles(__checkRoles.split(spliter));
        }
        return __roles.indexOf(__checkRoles) !== -1;
      } else {
        return false;
      }
    }
  });
});