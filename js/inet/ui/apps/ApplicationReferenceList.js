// #PACKAGE: author
// #MODULE: cms-app-ref-list
//
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10/09/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ApplicationReferenceList
 * @author nbchicong
 */

$(function () {
  /**
   * @class iNet.ui.apps.ApplicationReferenceList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.apps.ApplicationReferenceList');
  iNet.ui.apps.ApplicationReferenceList = function (options) {
    var _this = this, __opts = options || {};
    iNet.apply(this, __opts);
    this.id = this.id || 'ref-app-list-wg';
    this.gridID = this.gridID || 'list-ref-app';
    this.firstLoad = false;
    this.currentAppId = this.currentAppId || '';
    this.module = 'apps';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list: iNet.getUrl('application/summary/list')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'name',
        label: this.getText('name'),
        type: 'label'
      }, {
        property: 'type',
        label: this.getText('type'),
        type: 'label',
        align: 'center',
        cls: 'text-center',
        width: 120
      }, {
        property: 'publisher',
        label: this.getText('publisher'),
        type: 'label',
        align: 'center',
        cls: 'text-center',
        width: 200
      }, {
        property: 'publishedDate',
        label: this.getText('publishedDate'),
        type: 'label',
        align: 'center',
        cls: 'text-center',
        width: 100,
        renderer: function (v) {
          return new Date(v).format(iNet.dateFormat);
        }
      }]
    });
    this.basicSearch = function () {
      this.id = 'list-ref-app-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      intComponent: function () {
        this.$qSearch = $.getCmp(this.id);
        this.$btnUncheckAll =  this.$qSearch.find('#btn-un-check-all');
        this.$txtKeywords =  this.$qSearch.find('.grid-search-input');
        this.$btnSearch = this.$qSearch.find('[data-action-search="search"]:first');
        this.$btnUncheckAll.on('click', function () {
          _this.clearSelected();
          _this.fireEvent(_this.getEvent('uncheck_all'), [], _this);
        });
      },
      showButton: function (status) {
        FormUtils.showButton(this.$btnUncheckAll, status);
      },
      getUrl: function () {
        return _this.url.list;
      },
      getId: function () {
        return this.id;
      },
      getData: function () {
        return {
          keyword: this.$txtKeywords.val()
        };
      }
    });
    this.convertData = function (datas) {
      var __datas = datas || {};
      var __results = [];
      for (var i = 0; i < iNet.getSize(__datas.items); i ++) {
        var __item = __datas.items[i];
        if (__item.uuid != _this.getCurrentAppId()) {
          __results.push(__item);
        }
      }
      return __results;
    };
    iNet.ui.apps.ApplicationReferenceList.superclass.constructor.call(this);
    this.grid.on('selectionchange', function(sm, data) {
      var __records = sm.getSelection();
      var __count =  __records.length;
      _this.grid.quickSearch.showButton(__count > 0);
      _this.fireEvent(_this.getEvent('select'), data, __records, _this);
    });
  };
  iNet.extend(iNet.ui.apps.ApplicationReferenceList, iNet.ui.ListAbstract, {
    setCurrentAppId: function (uuid) {
      this.currentAppId = uuid;
    },
    getCurrentAppId: function () {
      return this.currentAppId;
    },
    setType: function (type) {
      this.setParams(iNet.apply(this.getParams(), {type: type || ''}));
      this.type = type || '';
      return this;
    },
    getType: function () {
      return this.type;
    },
    setCategory: function (cate) {
      this.setParams(iNet.apply(this.getParams(), {category: cate || ''}));
      this.cate = cate || '';
    },
    getCategory: function () {
      return this.cate;
    }
  });
});