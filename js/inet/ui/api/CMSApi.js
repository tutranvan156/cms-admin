/**
 * #PACKAGE: api
 * #MODULE: cms-api
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:33 AM 02/06/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file CMSApi.js
 */

var CMSApi = {
  loadFirm: function (prefix, callback) {
    $.getJSON(iNet.getUrl('cmsdesign/prefix/verify'), {prefix: prefix}, function (result) {
      callback && callback(result);
    });
  },
  loadConfig: function () {
    var _this = this;
    this.loadPageService({service: CMSConfig.AD_PAGE_SERVICE}, function (results) {
      if (iNet.isArray(results)) {
        if (results.length > 0)
          CMSConfig.ADMIN_PAGE_URL = results[0].uri;
      }
    });
    this.loadPageService({service: CMSConfig.ENTRY_PAGE_SERVICE}, function (results) {
      if (iNet.isArray(results)) {
        for (var i = 0; i < results.length; i++) {
          var item = results[i];
          if (item.module === CMSConfig.SITE.theme)
            CMSConfig.ENTRY_PAGE_URL = item.uri;
        }
      }
    });
    this.loadPageService({service: CMSConfig.HOME_PAGE_SERVICE}, function (results) {
      if (iNet.isArray(results)) {
        for (var i = 0; i < results.length; i++) {
          var item = results[i];
          if (item.module === CMSConfig.SITE.theme)
            CMSConfig.HOME_PAGE_URL = item.uri;
        }
      }
    });
    this.loadPageService({service: CMSConfig.NEWS_PAGE_SERVICE}, function (results) {
      if (iNet.isArray(results)) {
        for (var i = 0; i < results.length; i++) {
          var item = results[i];
          if (item.module === CMSConfig.SITE.theme)
            CMSConfig.NEWS_PAGE_URL = item.uri;
        }
      }
    });
  },
  loadPageService: function (params, callback) {
    $.getJSON(iNet.getUrl('system/page/service'), params, function (result) {
      callback && callback(result.elements || []);
    });
  },
  loadConstants: function () {
    $.getJSON(iNet.getPUrl('cms/egov/field/list'), {}, function (result) {
      if (CMSConfig && result.type !== CMSConfig.TYPE_ERROR) {
        iNet.apply(CMSConfig, result);
      }
    });
  }
};
