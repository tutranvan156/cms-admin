// #PACKAGE: model
// #MODULE: cms-fqa
//
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Huyen Doan<huyendv@inetcloud.vn>
 *         on 16/07/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file FQA
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.model.FQA
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.model.FQA');
  iNet.ui.model.FQA = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.uuid = this.uuid || null;
    this.subject = this.subject || null;
    this.category = this.category || null;
    this.question = this.question || null;
    this.answer = this.answer || null;
    this.created = this.created || new Date();
    this.published = this.published || null;
    this.owner = this.owner || null;
    this.email = this.email || null;
    this.address = this.address || null;
    this.phone = this.phone || null;
    this.firm = this.firm || null;
    this.status = this.status || null;
  };
  iNet.extend(iNet.ui.model.FQA, iNet.ui.CMSComponent, {
    setUUID: function (uuid) {
      this.uuid = uuid;
    },
    getUUID: function () {
      return this.uuid;
    },
    getSubject: function () {
      return this.subject;
    },
    setSubject: function (subject) {
      this.subject = subject;
    },
    setCategory: function (category) {
      this.category = category;
    },
    getCategory: function () {
      return this.category;
    },
    setQuestion: function (question) {
      this.question = question;
    },
    getQuestion: function () {
      return this.question;
    },
    setAnswer: function (answer) {
      this.answer = answer;
    },
    getAnswer: function () {
      return this.answer;
    },
    setCreated: function (created) {
      this.created = created;
    },
    getCreated: function () {
      return this.created;
    },
    setPublished: function (published) {
      this.published = published;
    },
    getPublished: function () {
      return this.published;
    },
    setOwner: function (owner) {
      this.owner = owner;
    },
    getOwner: function () {
      return this.owner;
    },
    setEmail: function (email) {
      this.email = email;
    },
    getEmail: function () {
      return this.email;
    },
    setAddress: function (address) {
      this.address = address;
    },
    getAddress: function () {
      return this.address;
    },
    setPhone: function (phone) {
      this.phone = phone;
    },
    getPhone: function () {
      return this.phone;
    },
    setFirm: function (firm) {
      this.firm = firm;
    },
    getFirm: function () {
      return this.firm;
    },
    setStatus: function (status) {
      this.status = status;
    },
    getStatus: function () {
      return this.status;
    }
  });
});