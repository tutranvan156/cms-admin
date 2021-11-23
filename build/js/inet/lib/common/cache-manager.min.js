/**
 * #PACKAGE: common
 * #MODULE: cache-manager
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 2:06 PM 11/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file CacheManager.js
 */
$(function () {
  /**
   * @class CacheManager
   * @extends iNet.Component
   */
  var cached = {};
  var timeCached = 30 * 60 * 1000; // 30min

  CacheManager = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
  };
  iNet.extend(CacheManager, iNet.Component, {
    setTimeCached: function (time) {
      timeCached = time;
    },
    clear: function () {
      cached = {};
    },
    getCache: function (key) {
      return cached[key] && cached[key]['data'];
    },
    setCache: function (key, data) {
      cached[key] = {
        data: data,
        time: new Date().getTime()
      };
    },
    isCached: function (key) {
      return cached[key] && (new Date().getTime() - cached[key].time <= timeCached);
    }
  });

  window.CACHED = new CacheManager();

  if (window.CACHED)
    setInterval(function () {
      for (var key in cached) {
        if (cached.hasOwnProperty(key) && (new Date().getTime() - cached[key].time > timeCached))
          delete cached[key];
      }
    }, timeCached);
});
