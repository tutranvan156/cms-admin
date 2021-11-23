// #PACKAGE: common
// #MODULE: list-abstract
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 25/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ListAbstract
 * @author nbchicong
 */
$(function () {
  if (!iNet) {
    throw new Error('iNet Core is not defined!');
  }
  /**
   * List Abstract
   * @class iNet.ui.ListAbstract
   * @extends iNet.ui.ViewWidget
   * @param {Object} options
   * @constructor
   */
  iNet.ns('iNet.ui.ListAbstract');
  iNet.ui.ListAbstract = function (options) {
    var _this = this, __opts = options || {};
    iNet.apply(this, __opts);
    this.id = this.id || 'wg-list';
    this.gridID = this.gridID || 'grid-id';
    this.idProperty = this.idProperty || 'uuid';
    this.params = {};
    this.url = this.url || {
      list: iNet.getUrl('')
    };
    this.$grid = $(String.format('#{0}', this.gridID));
    this.$toolbar = this.$toolbar || {};
    var convertData = function (data) {
      _this.grid.setTotal(data.total);
      return data.items;
    };
    this.convertData = this.convertData || convertData;
    this.grid = new iNet.ui.grid.Grid({
      id: this.$grid.prop('id'),
      url: this.url.list,
      dataSource: this.dataSource,
      basicSearch: this.getQSearch(),
      params: this.getParams(),
      convertData : this.convertData,
      stretchHeight: false,
      remotePaging: iNet.isDefined(this.remote) ? this.remote : false,
      firstLoad: iNet.isDefined(this.firstLoad) ? this.firstLoad : true,
      editable: iNet.isDefined(this.editable) ? this.editable : false,
      idProperty: this.idProperty
    });
    iNet.ui.ListAbstract.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.ListAbstract, iNet.ui.ViewWidget, {
    /**
     * @constructor
     */
    constructor: iNet.ui.ListAbstract,
    /**
     * Get instance grid
     * @returns {iNet.ui.grid.Grid}
     */
    getGrid: function () {
      return this.grid;
    },
    /**
     * Set Data Source for Grid
     * @param {iNet.ui.grid.DataSource} dataSrc
     */
    setDataSrc: function (dataSrc) {
      this.grid.setDataSource(dataSrc);
    },
    /**
     * Set BasicSearch for Grid
     * @param {iNet.Component|*} bSearch
     */
    setQSearch: function (bSearch) {
      this.basicSearch = bSearch;
    },
    /**
     * Return BasicSearch of Grid
     * @returns {iNet.Component|*}
     */
    getQSearch: function () {
      return this.basicSearch;
    },
    /**
     * Return Instance BasicSearch
     * @returns {iNet.Component|*}
     */
    getBasicSearch: function () {
      return this.getGrid().getQuickSearch();
    },
    /**
     * Returns the selected records
     * @returns {Array} Array records
     */
    getSelection: function () {
      var sm = this.grid.getSelectionModel();
      return sm.getSelection();
    },
    /**
     * Clear all record selected
     */
    clearSelected: function () {
      var sm = this.grid.getSelectionModel();
      sm.clearSelected();
    },
    /**
     * Set Data to Grid
     * @param {Array} data
     */
    setData: function (data) {
      this.grid.dataSource.setData(data);
    },
    /**
     * Set Params to Grid
     * @param params
     */
    setParams: function (params) {
      this.params = params;
      this.grid.setParams(params);
    },
    /**
     * Get Params
     * @returns {Object}
     */
    getParams: function () {
      return this.params || {};
    },
    /**
     * Load this Grid
     */
    load: function () {
      this.grid.load();
    },
    /**
     * Reload this Grid
     */
    reload: function () {
      this.grid.reload();
    },
    /**
     * Update a record of Grid
     * @param {Object} record
     */
    update: function (record) {
      this.grid.update(record);
      this.grid.commit();
    },
    /**
     * Insert a record to Grid
     * @param {Object} record
     */
    insert: function (record) {
      this.grid.insert(record);
      this.grid.commit();
    },
    /**
     * Edit a record of grid
     * @param {Object} record
     */
    edit: function (record) {
      this.grid.edit(record[this.grid.getIdProperty()]);
    },
    /**
     * Edit all record of grid
     */
    editAll: function () {
      this.grid.editAll();
    },
    /**
     * Cancel current record edit
     */
    endEdit: function () {
      this.grid.endEdit();
    },
    /**
     * Cancel all record edit
     */
    cancelEdit: function () {
      this.grid.cancelEdit();
    },
    /**
     * Cancel edit all record
     */
    cancelEditAll: function () {
      this.grid.cancelEditAll();
    },
    /**
     * New Record
     */
    newRecord: function () {
      this.grid.newRecord();
    },
    /**
     * Remove record from Grid by record id
     * @param {String} ids
     */
    removeByID: function (ids) {
      this.grid.remove(ids);
      this.grid.commit();
    },
    /**
     * Remove record from Grid by record object
     * @param {Object} record
     */
    removeRecord: function (record) {
      this.removeByID(record[this.grid.getIdProperty()]);
    }
  });
});