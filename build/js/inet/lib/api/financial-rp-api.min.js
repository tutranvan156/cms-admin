// #PACKAGE: api
// #MODULE: financial-rp-api
var FinancialReportAPI = {
  aSave: function (params, callback) {
    AjaxAPI.postForm({
      url: iNet.getPUrl('cms/financial/admin/save'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  aSearch: function (params, callback) {
    AjaxAPI.postForm({
      url: iNet.getPUrl('cms/financial/admin/search'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  aUpdateInfo: function (params, callback) {
    AjaxAPI.postForm({
      url: iNet.getPUrl('cms/financial/admin/updateinfo'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  active: function(params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      type: 'post',
      url: iNet.getPUrl('cms/financial/active'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  aRemove: function (params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('cms/financial/admin/remove'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  rmFile: function (params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('cms/financial/admin/removefile'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  uploadFile: function (params, callback) {
    AjaxAPI.postForm({
      url: iNet.getPUrl('cms/financial/admin/uploadfiles'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  downloadFile: function (params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      type: 'post',
      url: iNet.getPUrl('cms/financial/download'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  saveOrUpdateOrgan: function(params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('cms/financial/admin/organ/saveorupdate'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  rmOrgan: function(params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('cms/financial/admin/organ/remove'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  }
};