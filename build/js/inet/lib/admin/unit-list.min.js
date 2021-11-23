/**
 * #PACKAGE: admin
 * #MODULE: unit-list
 */
/**
 * Copyright (c) 2018 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * Date: 29/03/2018
 * Time: 7:37 AM
 * ---------------------------------------------------
 * Project: cms-admin
 * @name: UnitList
 * @author: nbchicong
 */

$(function () {
  var level = 0;
  /**
   * @class iNet.ui.admin.UnitList
   * @extends iNet.ui.ListAbstract
   */

  iNet.ns('iNet.ui.admin.UnitList');
  iNet.ui.admin.UnitList = function (options) {
    var _this = this;
    iNet.apply(this, options);
    this.id = 'org-list-wg';
    this.gridID = 'unit-list';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.module = 'unit';
    this.remote = true;
    this.params = {group: 'ROOT'};
    this.parents = {0: 'ROOT'};
    this.toolbar = {
      BACK: $('#list-btn-back'),
      CREATE: $('#list-btn-create')
    };
    this.url = {
      list: iNet.getPUrl('cms/unit/list')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'name',
        label: _this.getText('name'),
        type: 'text',
        width: 250
      }, {
        property: 'phone',
        label: _this.getText('phone'),
        type: 'text',
        width: 120
      }, {
        property: 'email',
        label: _this.getText('email'),
        type: 'text',
        width: 100
      }, {
        property: 'address1',
        label: _this.getText('address'),
        type: 'text'
      }, {
        type: 'action',
        align: 'left',
        buttons: [{
          text: iNet.resources.message.button.edit,
          icon: 'fa fa-pencil',
          fn: function (record) {
            _this.fireEvent('view_unit', _this, record);
            // _this.edit(record);
          }
        }, {
          text: _this.getText('view_member'),
          icon: 'fa fa-users',
          fn: function (record) {
            console.log('view member', record);
            _this.fireEvent('view_members', record, _this);
          }
        }, {
          text: _this.getText('view_child'),
          icon: 'fa fa-share-alt',
          fn: function (record) {
            _this.setParents(record.uuid);
            _this.setParams({
              group: record.uuid
            });
            _this.load();
          }
        }, {
          text: iNet.resources.message.button.del,
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var dialog = _this.confirmDlg(
                _this.getText('del_title'),
                _this.getText('del_confirm'), function () {
                  this.hide();
                  UnitAPI.remove(this.getData(), function (result) {
                    if (result.type !== CMSConfig.TYPE_ERROR) {
                      _this.success(_this.getText('del_title'), _this.getText('del_success'));
                      _this.getGrid().load();
                    } else {
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
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_ORG_STRUCTURE);
          }
        }]
      }]
    });

    this.basicSearch = function () {
      this.id = 'list-basic-search';
      this.url = _this.url.list;
      this.params = {
        pageSize: CMSConfig.PAGE_SIZE,
        group: 'ROOT',
        keyword: ''
      };
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        var txtKeywordEl = this.getEl().find('.grid-search-input');
        var btnSearchEl = this.getEl().find('[data-action-search="search"]');
        txtKeywordEl.on('change', function () {
          search.params.keyword = this.value;
          btnSearchEl.trigger('click');
        });
      },
      getData: function () {
        return this.params;
      }
    });

    iNet.ui.admin.UnitList.superclass.constructor.call(this);

    this.toolbar.CREATE.on('click', function () {
      _this.fireEvent('create', _this,_this.getParentId());
      // _this.newRecord();
    });

    this.toolbar.BACK.on('click', function () {
      delete _this.parents[(level--)];
      _this.setParams({group: _this.getParentId()});
      _this.load();
    });

    // this.getGrid().on('save', function (record) {
    //   record.type = iNet.cityCode;
    //   record.parent = _this.getParentId();
    //   UnitAPI.create(record, function (result) {
    //     _this.insert(result);
    //   });
    // });

    // this.getGrid().on('update', function (data, record) {
    //   data.type = iNet.cityCode;
    //   data.parent = _this.getParentId();
    //   var params = iNet.apply({}, data, record);
    //   UnitAPI.update(params, function (result) {
    //     _this.update(result);
    //   });
    // });

    this.getGrid().on('loaded', function () {
      FormUtils.showButton(_this.toolbar.BACK, _this.getParentId() !== 'ROOT');
    });
  };
  iNet.extend(iNet.ui.admin.UnitList, iNet.ui.ListAbstract, {
    setParents: function (parentId) {
      this.parents[(++level)] = parentId;
    },
    getParents: function () {
      return this.parents;
    },
    getParentId: function () {
      return this.parents[level] || 'ROOT';
    }
  });
});