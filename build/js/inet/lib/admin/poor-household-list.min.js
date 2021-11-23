/**
 * #PACKAGE: admin
 * #MODULE: poor-household-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09:35 23/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file PoorHouseHoldList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.PoorHouseHoldList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.PoorHouseHoldList');
  iNet.ui.admin.PoorHouseHoldList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'poor-household-list-wg';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.gridID = 'poor-household-list';
    this.module = 'poor';
    this.remote = true;
    this.url = {
      list: iNet.getPUrl('poor/household/list')
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
        label: _this.getText('district'),
        type: 'label'
      }, {
        property: 'wardName',
        label: _this.getText('ward'),
        type: 'label',
        width: 250
      }, {
        property: 'poorNo',
        label: _this.getText('poor_household'),
        type: 'label',
        width: 150
      }, {
        property: 'nearPoorNo',
        label: _this.getText('near_poor_household'),
        type: 'label',
        width: 150
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.del,
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var uuid = record.uuid;
            _this.dialog = _this.confirmDlg(
                _this.getText('del_title'),
                _this.getText('del_confirm'), function () {
                  _this.dialog.hide();
                  PoorHouseAPI.remove({uuid: uuid}, function (result) {
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
            _this.dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            _this.dialog.show();
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_POORHOUSE);
          }
        }]
      }]
    });

    this.basicSearch = function () {
      this.id = 'list-basic-search';
      this.url = _this.url.list;
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.cbbYearSelectEl = this.getEl().find('#cbb-search-year');
        this.cbbUnitEl = this.getEl().find('#cbb-unit');
        this.txtKeywordEl = this.getEl().find('.grid-search-input');
        this.btnSearchEl = this.getEl().find('[data-action-search="search"]');
        this.cbbYearSelectEl.on('change', function () {
          search.btnSearchEl.trigger('click');
        });
        this.cbbUnitEl.on('change', function () {
          search.btnSearchEl.trigger('click');
        });
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.txtKeywordEl.val() || '',
          year: this.cbbYearSelectEl.val() || '',
          district: this.cbbUnitEl.val() || '',
          all: true
        };
      }
    });

    iNet.ui.admin.PoorHouseHoldList.superclass.constructor.call(this);
    this.toolbar.CREATE.on('click', function () {
      _this.fireEvent('create', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };
  iNet.extend(iNet.ui.admin.PoorHouseHoldList, iNet.ui.ListAbstract);
});