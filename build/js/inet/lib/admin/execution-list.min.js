/**
 * #PACKAGE: admin
 * #MODULE: execution-list
 */
/**
 * Copyright (c) 2018 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * Date: 28/03/2018
 * Time: 10:03 PM
 * ---------------------------------------------------
 * Project: cms-admin
 * @name: ExecutionList
 * @author: nbchicong
 */

$(function () {
  /**
   * @class iNet.ui.admin.ExecutionList
   * @extends iNet.ui.admin.DynamicContentList
   */
  iNet.ns('iNet.ui.admin.ExecutionList');
  iNet.ui.admin.ExecutionList = function (options) {
    var _this = this;
    iNet.apply(this, options);
    this.id = 'execution-list-wg';
    this.gridID = 'execution-list';
    this.module = 'execution';
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
        width: 80
      }, {
        property: 'period',
        label: _this.getText('period'),
        type: 'label',
        width: 150,
        renderer: function (v) {
          if (v === 6)
            return '6 Tháng';
          return '1 năm';
        }
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
        type: CMSConfig.GROUP_EXECUTION,
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

    iNet.ui.admin.ExecutionList.superclass.constructor.call(this);

    this.toolbar.CREATE.on('click', function () {
      _this.fireEvent('create', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };
  iNet.extend(iNet.ui.admin.ExecutionList, iNet.ui.ListAbstract, {
  });
});