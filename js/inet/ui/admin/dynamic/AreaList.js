/**
 * #PACKAGE: admin
 * #MODULE: area-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 09:39 26/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file AreaList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.AreaList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.AreaList');
  iNet.ui.admin.AreaList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'list-area-wg';
    this.gridID = 'list-area';
    this.remote = false;
    this.module = 'area';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list: iNet.getPUrl('cms/plugindynamic/theme')
    };
    this.toolbar = {
      UNDO: $('#list-btn-undo')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'area',
          label: 'Tên vùng',
          type: 'text',
          sortable: true
        }, {
          property: 'plugin',
          label: 'Tên plugin',
          type: 'text',
          sortable: true
        }, {
          property: 'theme',
          label: 'Tên gói giao diện',
          type: 'text',
          sortable: true
        }, {
          label: '',
          type: 'action',
          align: 'center',
          buttons: [{
            text: iNet.resources.message.button.edit,
            icon: 'fa fa-cog',
            labelCls: 'label label-info',
            fn: function (record) {
              _this.fireEvent('open', record, _this);
            }
          }]
        }],
      delay: 250
    });

    this.basicSearch = function () {
      this.id = 'list-area-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val() || ''
        };
      }

    });

    iNet.ui.admin.AreaList.superclass.constructor.call(this);
    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });

    this.toolbar.UNDO.on('click', function () {
      reset(function () {
        _this.getGrid().reload();
      });
    });
  };

  iNet.extend(iNet.ui.admin.AreaList, iNet.ui.ListAbstract);

  function reset(callback) {
    $.postJSON(iNet.getPUrl('cms/plugindynamic/reset'), {}, function (result) {
      if (result === 'SUCCESS') {
        callback && callback();
      }
    });
  }
});
