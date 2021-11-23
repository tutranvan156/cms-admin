// #PACKAGE: model
// #MODULE: cms-comment
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 27/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file Comment
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.model.Comment
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.model.Comment');
  iNet.ui.model.Comment = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.uuid = this.uuid || null;
    this.item = this.item || null;
    this.itemSubject = this.itemSubject || null;
    this.subject = this.subject || null;
    this.message = this.message || null;
    this.email = this.email || null;
    this.author = this.author || null;
    this.status = this.status || null;
    this.created = this.created || null;
  };
  iNet.extend(iNet.ui.model.Comment, iNet.ui.CMSComponent, {
    setUUID: function (uuid) {
      this.uuid = uuid;
    },
    getUUID: function () {
      return this.uuid;
    },
    setItem: function (item) {
      this.item = item;
    },
    getItem: function () {
      return this.item;
    },
    setItemSubject: function (itemSubject) {
      this.itemSubject = itemSubject;
    },
    getItemSubject: function () {
      return this.itemSubject;
    },
    getSubject: function () {
      return this.subject;
    },
    setSubject: function (subject) {
      this.subject = subject;
    },
    setContent: function (content) {
      this.message = content;
    },
    getContent: function () {
      return this.message;
    },
    setEmail: function (email) {
      this.email = email;
    },
    getEmail: function () {
      return this.email;
    },
    setAuthor: function (author) {
      this.author = author;
    },
    getAuthor: function () {
      return this.author;
    },
    setStatus: function (status) {
      this.status = status;
    },
    getStatus: function () {
      return this.status;
    },
    setCreated: function (created) {
      this.created = created;
    },
    getCreated: function () {
      return this.created;
    }
  });
});