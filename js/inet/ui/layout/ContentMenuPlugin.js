/**
 * #PACKAGE: admin
 * #MODULE: content-menu-plugin
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 15:29 21/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ContentMenuPlugin.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ContentMenuPlugin
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ContentMenuPlugin');
  iNet.ui.admin.ContentMenuPlugin = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'menu-select';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.module = 'layout';
    this.$toolbar = {
      BACK: $('#site-menu-back-btn'),
      SELECT: $('#site-menu-select-btn')
    };
    iNet.ui.admin.ContentMenuPlugin.superclass.constructor.call(this);
    this.$toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back');
    });

    this.$toolbar.SELECT.on('click', function () {
      console.log(window.MenuList.getItemsSelect());
      _this.fireEvent('update', window.MenuList.getItemsSelect(), PluginKey.menuCMS);
    });

  };
  iNet.extend(iNet.ui.admin.ContentMenuPlugin, iNet.ui.ViewWidget, {
    setSelect: function (data) {
      window.MenuList.setItemsSelect(data);
    }
  });
});
