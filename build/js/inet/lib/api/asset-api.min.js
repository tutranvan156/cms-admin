/**
 * #PACKAGE: api
 * #MODULE: asset-api
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 16:52 04/09/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AssetAPI.js
 */
$(function () {
  function sendForm(url, data, callback, options) {
    options = options || {};
    options.params = data || {};
    options.method = 'post';
    options.url = url;
    return $.submitData(options, options.index);
  }
  window.AssetAPI = {
    URL: {
      LIST: iNet.getPUrl('cms/asset/list'),
      CATE: iNet.getPUrl('cms/asset/category'),
      PUBLISHED: iNet.getPUrl('cms/asset/published'),
      FOLDER_PUBLISHED: iNet.getPUrl('cms/asset/pubcategory'),
      CREATE_FOLDER: iNet.getPUrl('cms/asset/create'),
      REMOVE: iNet.getPUrl('cms/asset/remove'),
      UPDATE_INFO: iNet.getPUrl('cms/asset/udinfo'),
      UPLOAD: iNet.getPUrl('cms/asset/upload'),
      VIEW: iNet.getPUrl('cms/asset/view')
    },
    list: function (params, callback, options) {
      $.postJSON(this.URL.LIST, params, callback, options);
    },
    listFolder: function (params, callback, options) {
      $.postJSON(this.URL.CATE, params, callback, options);
    },
    listFolderPublished: function (params, callback, options) {
      $.postJSON(this.URL.FOLDER_PUBLISHED, params, callback, options);
    },
    publishedFolder: function (params, callback, options) {
      $.postJSON(this.URL.PUBLISHED, params, callback, options);
    },
    createFolder: function (params, callback, options) {
      $.postJSON(this.URL.CREATE_FOLDER, params, callback, options);
    },
    remove: function (params, callback, options) {
      $.postJSON(this.URL.REMOVE, params, callback, options);
    },
    updateInfo: function (params, callback, options) {
      $.postJSON(this.URL.UPDATE_INFO, params, callback, options);
    },
    upload: function (params, options) {
      return sendForm(this.URL.UPLOAD, params, options);
    }
  }
});