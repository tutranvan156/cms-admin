/**
 * #PACKAGE: admin
 * #MODULE: estimated-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09:37 28/08/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file EstimatedList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.EstimatedList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.EstimatedList');
  iNet.ui.admin.EstimatedList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'estimated-list-wg';
    this.gridID = 'estimated-list';
    this.module = 'estimated';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.remote = true;

    this.url = {
      list: StateBudgetAPI.URL.LIST
    };

    this.toolbar = {
      CREATE: $('#list-btn-create')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'year',
        label: _this.getText('year'),
        type: 'label',
        width: 100
      }, {
        property: 'districtName',
        label: _this.getText('unit'),
        type: 'label'
      }, {
        property: 'revenue',
        label: _this.getText('total_revenue'),
        type: 'label',
        renderer: function (value) {
          return '<b>' + (value.total || 0) + '</b>';
        },
        width: 150
      }, {
        property: 'expenditure',
        label: _this.getText('total_expenditure'),
        type: 'label',
        renderer: function (value) {
          return '<b>' + (value.total || 0) + '</b>';
        },
        width: 150
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.del,
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function(record) {
            var uuid = record.uuid;
            _this.dialog = _this.confirmDlg(
                _this.getText('del_title'),
                _this.getText('del_confirm'), function () {
                  _this.dialog.hide();
                  StateBudgetAPI.remove(this.getData(), function (result) {
                    if (result.type !== CMSConfig.TYPE_ERROR) {
                      _this.success(_this.getText('del_title'), _this.getText('del_success'));
                      _this.removeRecord(result);
                    }
                    else {
                      _this.error(_this.getText('del_title'), _this.getText('del_error'));
                    }
                  });
                }
            );
            _this.dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            _this.dialog.setData({uuid: uuid});
            _this.dialog.show();
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_BUDGET);
          }
        }]
      }]
    });

    this.basicSearch = function () {
      this.id = 'list-basic-search';
      this.url = _this.url.list;
      this.params = {
        pageSize: CMSConfig.PAGE_SIZE,
        type: CMSConfig.GROUP_ESTIMATED,
        keyword: '',
        all: true
      };
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        var cbbYearSelectEl = this.getEl().find('#cbb-search-year');
        var txtKeywordEl = this.getEl().find('.grid-search-input');
        var btnSearchEl = this.getEl().find('[data-action-search="search"]');
        cbbYearSelectEl.on('change', function () {
          search.params.year = this.value;
          console.log('change year select', search.params);
          btnSearchEl.trigger('click');
        });
        txtKeywordEl.on('change', function () {
          search.params.keyword = this.value;
          btnSearchEl.trigger('click');
        });
      },
      getData: function () {
        return this.params;
      }
    });

    iNet.ui.admin.EstimatedList.superclass.constructor.call(this);

    this.toolbar.CREATE.on('click', function () {
      _this.fireEvent('create', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };
  iNet.extend(iNet.ui.admin.EstimatedList, iNet.ui.ListAbstract);
});