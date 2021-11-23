/**
 * #PACKAGE: admin
 * #MODULE: abstract-address-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 12:13 21/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AbstractAddressList.js
 */
var EVENT_LOAD_SUB = 'load_sub';
var EVENT_BACK = 'back';
$(function () {
  /**
   * @class iNet.ui.admin.address.AbstractAddressList
   * @extends iNet.ui.ListAbstract
   */

  var cached = {},
      timeCached = 5 * 60 * 1000,
      WARD_CACHED = 'province',
      PROVINCE_CACHED = 'province',
      DISTRICT_CACHED = 'district';

  function setCache(key, data, clear) {
    if (hasCache(key))
      if (clear)
        delete cached[key];

    cached[key] = {
      data: data,
      time: new Date().getTime()
    };
  }

  function getCache(key) {
    if (hasCache(key))
      return cached[key] && cached[key]['data'];

    return null;
  }

  function hasCache(key) {
    return cached[key] && (new Date().getTime() - cached[key].time <= timeCached);
  }

  setInterval(function () {
    for (var key in cached) {
      if (cached.hasOwnProperty(key) && (new Date().getTime() - cached[key].time > timeCached))
        delete cached[key];
    }
  }, timeCached);

  iNet.ns('iNet.ui.admin.address.AbstractAddressList');
  iNet.ui.admin.address.AbstractAddressList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || null;
    this.gridID = this.gridID || 'list-address';
    this.type = this.type || '';
    this.hasSub = this.hasSub || false;
    this.subName = this.subName || null;
    this.idProperty = this.idProperty || 'uuid';
    this.remotePaging = this.remotePaging || true;
    this.remote = this.remotePaging;
    this.firstLoad = this.firstLoad || false;
    this.pageSize = this.pageSize || 10;
    this.isRoot = this.isRoot || false;
    this.resources = this.resources || {
      name: 'Tên',
      name_missed: 'Vui lòng nhập tên',
      code: 'Mã',
      code_missed: 'Vui lòng nhập mã',
      syncCode: 'Mã bưu điện'
    };

    this.url = this.url || null;

    if (!this.url)
      throw new Error('Url is not null');

    this.toolbar = this.toolbar || {};

    this.convertData = this.convertData ||
    function (data) {
      _this.grid.setTotal(data.total || 0);
      return data.items || [];
    };

    this.dataSource = this.dataSource ||
    new iNet.ui.grid.DataSource({
      columns: [{
        label: '#',
        type: 'rownumber',
        align: 'center',
        width: 30
      }, {
        property: 'name',
        label: this.resources.name,
        sortable: true,
        type: 'text',
        validate: function (v) {
          if (iNet.isEmpty(v))
            return _this.resources.name_missed;
        }
      }, {
        property: 'code',
        label: this.resources.code,
        sortable: true,
        type: 'text',
        width: 300,
        validate: function (v) {
          if (iNet.isEmpty(v))
            return _this.resources.code_missed;
        }
      }, {
        label: '',
        type: 'action',
        separate: '&nbsp;',
        align: 'center',
        cls: 'hidden-767',
        buttons: [{
          text: iNet.resources.message.button.edit,
          icon: 'fa fa-pencil',
          labelCls: 'label label-info',
          fn: function (record) {
            _this.getGrid().edit(record.uuid);
          }
        }, {
          text: iNet.resources.message.button.del,
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            _this.removeItem(record.uuid);
          }
        }]
      }]
    });

    iNet.ui.admin.address.AbstractAddressList.superclass.constructor.call(this);

    this.getGrid().on('save', function (record) {
      _this.createItem(record);
    });

    this.getGrid().on('update', function (record, oldRecord) {
      $.extend(oldRecord, record);
      _this.updateItem(oldRecord);
    });

    this.getGrid().on('click', function (record) {
      if (_this.hasSub && !_this.getGrid().hasEdit())
        _this.fireEvent(EVENT_LOAD_SUB, record, _this);
    });

    if (this.toolbar.BACK)
      this.toolbar.BACK.on('click', function () {
        _this.hide();
        _this.fireEvent(EVENT_BACK, _this);
      });

    if (this.toolbar.CREATE)
      this.toolbar.CREATE.on('click', function () {
        _this.newRecord();
      });
  };
  iNet.extend(iNet.ui.admin.address.AbstractAddressList, iNet.ui.ListAbstract, {
    constructor: iNet.ui.admin.address.AbstractAddressList,
    /**
     * @param {Object} params
     * @returns {iNet.ui.admin.address.AbstractAddressList}
     */
    setParams: function (params) {
      this.params = params;
      this.getGrid().setParams(params);
      return this;
    },
    /**
     * @returns {Object|*}
     */
    getParams: function () {
      return this.params;
    },
    /**
     * @returns {iNet.ui.admin.address.AbstractAddressList}
     */
    load: function () {
      this.getGrid().load();
      return this;
    },
    /**
     * @returns {iNet.ui.admin.address.AbstractAddressList}
     */
    first: function () {
      this.getGrid().first();
      return this;
    },
    createItem: function (record) {},
    updateItem: function (record) {},
    removeItem: function (record) {},
    getSyncParams: function () {
      return {};
    },
    getSubParams: function (record) {
      var param = {};
      if (this.hasSub)
        param[this.type] = record.code || record.uuid;

      return param;
    }
  });
});
