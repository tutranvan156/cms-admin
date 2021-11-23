// #PACKAGE: model
// #MODULE: cms-apps
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 22/07/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file Apps
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.model.Application
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.model.Application');
  iNet.ui.model.Application = function (config) {
    var __cog = config || {};
    iNet.apply(this, __cog);
    this.uuid = this.uuid || null;
    this.application = this.application || null;
    this.brief = this.brief || '';
    this.created = this.created || new Date().format('d/m/Y');
    this.update = this.update || new Date().format('d/m/Y');
    this.creator = this.creator || null;
    this.fullname = this.fullname || null;
    this.status = this.status || CMSConfig.getDesignConfig().getDesign();
    this.changed = this.changed || CMSConfig.getDesignConfig().getDesign();
    this.modules = this.modules || [];
    this.dependencies = this.dependencies || [];
  };
  iNet.extend(iNet.ui.model.Application, iNet.ui.CMSComponent, {
    setUuid: function (uuid) {
      this.uuid = uuid;
    },
    getUuid: function () {
      return this.uuid;
    },
    setApplication: function (apps) {
      this.application = apps;
    },
    getApplication: function () {
      return this.application;
    },
    setBrief: function (brief) {
      this.brief = brief;
    },
    getBrief: function () {
      return this.brief;
    },
    setCreated: function (created) {
      this.created = created;
    },
    getCreated: function () {
      return this.created;
    },
    setUpdate: function (update) {
      this.update = update;
    },
    getUpdate: function () {
      return this.update;
    },
    setCreator: function (creator) {
      this.creator = creator;
    },
    getCreator: function () {
      return this.creator;
    },
    setFullname: function (fullname) {
      this.fullname = fullname;
    },
    getFullname: function () {
      return this.fullname;
    },
    setStatus: function (status) {
      this.status = status;
    },
    getStatus: function () {
      return this.status;
    },
    setChanged: function (changed) {
      this.changed = changed;
    },
    getChanged: function () {
      return this.changed;
    },
    setModules: function (modules) {
      this.modules = modules;
    },
    getModules: function () {
      return this.modules;
    },
    setDependencies: function (dependencies) {
      this.dependencies = dependencies;
    },
    getDependencies: function () {
      return this.dependencies;
    }
  });
});