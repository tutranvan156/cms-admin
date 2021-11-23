/**
 * #PACKAGE: api
 * #MODULE: item-api
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 3:57 PM 07/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file ItemApi.js
 */
function send(url, data, callback, options) {
  options = options || {};
  options.data = data || {};
  options.success = callback;
  options.type = 'post';
  options.url = url;
  AjaxAPI.sendRequest(options);
}
var ItemAPI = {
  /**
   * @param params
   * @param [callback]
   * @param [options]
   */
  approvedItemShared: function (params, callback, options) {
    send(iNet.getPUrl('cms/itemshared/reviewapproved'), params, callback, options);
  },
  approvedOldItem: function (params, callback, options) {
    send(iNet.getPUrl('subportal/review/approved'), params, callback, options);
  },
  /**
   * @param params
   * @param [callback]
   * @param [options]
   */
  rejectedItemShared: function (params, callback, options) {
    send(iNet.getPUrl('cms/itemshared/reviewrejected'), params, callback, options);
  },
  rejectedOldItem: function (params, callback, options) {
    send(iNet.getPUrl('subportal/review/rejected'), params, callback, options);
  },
  /**
   * params [older]
   * @returns {Array}
   */
  loadReviewed: function (older) {
    var reviewed = [];
    if (older) {
      AjaxAPI.ajax({
        async: false,
        url: iNet.getPUrl('subportal/entries/reviewed'),
        type: 'get',
        data: {pageSize: 0},
        success: function (results) {
          (results.items || []).forEach(function (item) {
            reviewed.push(item.entryId);
          });
        }
      });
    }
    else {
      AjaxAPI.ajax({
        async: false,
        url: iNet.getPUrl('cms/reviewed/share'),
        type: 'get',
        data: {pageSize: 0},
        success: function (results) {
          (results.items || []).forEach(function (item) {
            reviewed.push(item.uuid);
          });
        }
      });
    }
    return reviewed;
  },
  /**
   * @param params
   * @param [callback]
   * @param [options]
   */
  loadShared: function (params, callback, options) {
    send(iNet.getPUrl('cms/view/public'), params, callback, options);
  },
  /**
   * Check an item is shared
   * @param itemId
   * @param [older]
   * @returns {boolean} true if item is shared
   */
  isShared: function (itemId, older) {
    var reviewed = false;
    if (older) {
      AjaxAPI.ajax({
        async: false,
        url: iNet.getPUrl('subportal/entries/reviewed'),
        type: 'get',
        data: {pageSize: 0},
        success: function (results) {
          var items = results.items || [];
          for (var i = 0; i < items.length; i++) {
            if (items[i].entryId === itemId) {
              reviewed = true;
              break;
            }
          }
        }
      });
    }
    else {
      AjaxAPI.ajax({
        async: false,
        url: iNet.getPUrl('cms/reviewed/share'),
        type: 'get',
        data: {pageSize: 0},
        success: function (results) {
          var items = results.items || [];
          for (var i = 0; i < items.length; i++) {
            if (items[i].uuid === itemId) {
              reviewed = true;
              break;
            }
          }
        }
      });
    }
    return reviewed;
  },
  withdraw: function(params, callback) {
    params.withdraw = true;
    send(iNet.getPUrl('cms/item/modify'), params, function(result) {
      callback && callback(result);
    });
  }
};
