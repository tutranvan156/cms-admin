// #PACKAGE: model
// #MODULE: cms-app-summary
//
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09/09/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ApplicationSummary
 * @author nbchicong
 */

$(function () {
  /**
   * @class iNet.ui.model.ApplicationSummary
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.model.ApplicationSummary');
  iNet.ui.model.ApplicationSummary = function (config) {
    var _this = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.uuid = this.uuid || null;
    this.name = this.name || null;
    this.type = this.type || AppConfig.TYPE_THEME;
    this.category = this.category || null;
    this.brief = this.brief || '';
    this.price = this.price || '';
    this.version = this.version || '';
    this.publishedDate = this.publishedDate || '';
    this.contentID = this.contentID || '';
    this.publisher = this.publisher || '';
    this.authors = this.authors || [];
    this.images = this.images || [];
    this.elements = this.elements || [];
    this.references = this.references || [];
    this.download = this.download || 0;
    this.rating = this.rating || 0;
    this.points = this.points || [];
    this.ownerID = this.ownerID || '';
    this.status = this.status || AppConfig.MODE_REVIEW;
  };
  iNet.extend(iNet.ui.model.ApplicationSummary, iNet.ui.CMSComponent, {
    setUuid: function (uuid) {
      this.uuid = uuid;
    },
    getUuid: function () {
      return this.uuid;
    },
    setName: function (name) {
      this.name = name;
    },
    getName: function () {
      return this.name;
    },
    setType: function (type) {
      this.type = type;
    },
    getType: function () {
      return this.type;
    },
    setCategory: function (cate) {
      this.category = cate;
    },
    getCategory: function () {
     return this.category;
    },
    setBrief: function (brief) {
      this.brief = brief;
    },
    getBrief: function () {
      return this.brief;
    },
    setPrice: function (price) {
      this.price = price;
    },
    getPrice: function () {
      return this.price;
    },
    setVersion: function (price) {
      this.version = price;
    },
    getVersion: function () {
      return this.version;
    },
    setPublishedDate: function (publishedDate) {
      this.publishedDate = publishedDate;
    },
    getPublishedDate: function () {
      return this.publishedDate;
    },
    setContentId: function (contentId) {
      this.contentID = contentId;
    },
    getContentId: function () {
      return this.contentID;
    },
    setPublisher: function (publisher) {
      this.publisher = publisher;
    },
    getPublisher: function () {
      return this.publisher;
    },
    setAuthors: function (authors) {
      this.authors = authors;
    },
    getAuthors: function () {
      return this.authors;
    },
    setImages: function (images) {
      this.images = images;
    },
    getImages: function () {
      return this.images;
    },
    setElements: function (elements) {
      this.elements = elements;
    },
    getElements: function () {
      return this.elements;
    },
    setReferences: function (references) {
      this.references = references;
    },
    getReferences: function () {
      return this.references;
    },
    setDownload: function (download) {
      this.download = download;
    },
    getDownload: function () {
      return this.download;
    },
    setRating: function (rating) {
      this.rating = rating;
    },
    getRating: function () {
      return this.rating;
    },
    setPoints: function (points) {
      this.points = points;
    },
    getPoints: function () {
      return this.points;
    },
    setOwnerId: function (ownerId) {
      this.ownerID = ownerId;
    },
    getOwnerId: function () {
      return this.ownerID;
    },
    setStatus: function (status) {
      this.status = status;
    },
    getStatus: function () {
      return this.status;
    }
  });
});