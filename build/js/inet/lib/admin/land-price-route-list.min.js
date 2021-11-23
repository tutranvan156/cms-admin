/**
 * #PACKAGE: admin
 * #MODULE: land-price-route-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 13:37 22/08/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file LandPriceRouteList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.LandPriceRouteList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.LandPriceRouteList');
  iNet.ui.admin.LandPriceRouteList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'land-route-list-wg';
    this.gridID = 'land-route-list';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.module = 'land';
    this.remote = true;
    this.toolbar = {
      BACK: $('#list-btn-back'),
      CREATE: $('#list-btn-create')
    };
    this.url = {
      list: LandRouteAPI.URL.SEARCH
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'title',
        label: _this.getText('name'),
        type: 'text'
      }, {
        property: 'categories',
        label: _this.getText('category'),
        type: 'text',
        width: 200,
        renderer: function (parents) {
          if (!iNet.isEmpty(parents)) {
            return parents[0].name;
          }
          return null;
        }
      }, {
        property: 'yearCounted',
        label: _this.getText('year_counted'),
        type: 'text',
        width: 80
      }, {
        property: 'createdDate',
        label: _this.getText('created'),
        type: 'text',
        width: 100,
        renderer: function (v) {
          return new Date(v).format(iNet.dateFormat);
        }
      }, {
        property: 'modifiedDate',
        label: _this.getText('modified'),
        type: 'text',
        width: 120,
        renderer: function (v) {
          return new Date(v).format(iNet.dateFormat);
        }
      }, {
        type: 'action',
        align: 'left',
        buttons: [{
          text: iNet.resources.message.button.edit,
          icon: 'fa fa-pencil',
          fn: function(record) {
            _this.fireEvent('open', record, _this);
          }
        }, {
          text: iNet.resources.message.button.del,
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function(record) {
            var dialog = _this.confirmDlg(
                _this.getText('del_title'),
                _this.getText('del_confirm'), function () {
                  this.hide();
                  LandRouteAPI.remove(this.getData(), function (result) {
                    if (result.type !== CMSConfig.TYPE_ERROR) {
                      _this.success(_this.getText('del_title'), _this.getText('del_success'));
                      _this.getGrid().load();
                    }
                    else {
                      _this.error(_this.getText('del_title'), _this.getText('del_error'));
                    }
                  });
                }
            );
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            dialog.setData({
              uuid: record.uuid
            });
            dialog.show();
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_LAND);
          }
        }]
      }]
    });

    this.basicSearch = function () {
      this.id = 'list-basic-search';
      this.url = _this.url.list;
      this.params = {
        pageSize: CMSConfig.PAGE_SIZE,
        pageNumber: 0,
        keyword: '',
        category: ''
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

    iNet.ui.admin.LandPriceRouteList.superclass.constructor.call(this);

    this.toolbar.CREATE.on('click', function () {
      _this.fireEvent('create', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };

  iNet.extend(iNet.ui.admin.LandPriceRouteList, iNet.ui.ListAbstract);
});