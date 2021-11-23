// #PACKAGE: common
// #MODULE: cms-hashstore
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 27/01/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file CMSHashStore
 * @author nbchiconng
 */

$(function () {
  /**
   * @class iNet.ui.CMSHashStore
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.CMSHashStore');
  iNet.ui.CMSHashStore = function (config) {
    var cog = config || {};
    iNet.apply(this, cog);
    this.store = this.store || new Hashtable();
    this.type = this.type || 'LINK';
    this.formatID = this.formatID || '{0}_{1}';
  };
  iNet.extend(iNet.ui.CMSHashStore, iNet.ui.CMSComponent, {
    getStore: function () {
      return this.store;
    },
    setType: function (type) {
      this.type = type;
    },
    getType: function () {
      return this.type;
    },
    setFormatID: function (format) {
      this.formatID = format;
    },
    getFormatID: function () {
      return this.formatID;
    },
    /**
     * @param item : is an object with id and value
     */
    setItem: function (item) {
      this.getStore().put(String.format(this.getFormatID(), this.getType(), item.id), item.value);
    },
    getItem: function (itemID) {
      return this.getStore().get(itemID);
    },
    removeItem: function (key) {
      this.store.remove(key);
    },
    clearAll: function () {
      this.store.clear();
    },
    clearStoreByType: function () {
      var that = this;
      var __type = this.getType();
      this.store.each(function (key, value) {
        if (key.toString().localeCompare(__type) === 1) {
          that.removeItem(key);
        }
      });
    }
  });
});