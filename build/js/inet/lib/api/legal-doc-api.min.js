/**
 * #PACKAGE: api
 * #MODULE: legal-doc-api
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:57 12/02/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file LegalDocumentAPI.js
 */

var LegalDocumentAPI = {
  createEgovEdoc:function(params,callback){
    AjaxAPI.postForm({
      url: iNet.getPUrl('cms/egov/edoc/create'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  create: function (params, callback) {
    AjaxAPI.postForm({
      url: iNet.getPUrl('legal/document/create'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  updateEgovEdoc:function(params,callback){
    AjaxAPI.postForm({
      url: iNet.getPUrl('cms/egov/edoc/update'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  update: function (params, callback) {
    AjaxAPI.postForm({
      url: iNet.getPUrl('legal/document/update'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  removeEgovEdoc:function(params,callback){
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('cms/egov/edoc/remove'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  shareEdoc: function(params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      type: 'post',
      url: iNet.getPUrl('cms/egov/edoc/share'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  remove: function (params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('legal/document/delete'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  loadSteeringDoc:function(params,callback){
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('steering/document/load'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  load: function (params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('legal/document/load'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  rmAttachEgovEdoc:function(params, callback){
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('cms/egov/edoc/rmattach'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  markAgency: function(params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('cms/egov/agency/mark/use'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  rmAttach: function (params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      url: iNet.getPUrl('legal/document/rmattach'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  markComment: function (params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      type: 'post',
      url: iNet.getPUrl('legal/document/markcomment'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  },
  downloadAttach: function (params, callback) {
    AjaxAPI.sendRequest({
      subfirm: true,
      type: 'post',
      url: iNet.getPUrl('land/revocation/downfile'),
      data: params,
      success: function (result) {
        callback && callback(result);
      }
    });
  }
};