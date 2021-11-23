/**
 * #PACKAGE: admin
 * #MODULE: suportal-config-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17:48 21/06/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file SubPortalConfigList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.SubPortalConfigList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.SubPortalConfigList');
  iNet.ui.admin.SubPortalConfigList = function (options) {
    var _this = this;
    var serviceList = webserviceList || [];
    iNet.apply(this, options || {});
    this.id = 'page-setting';
    this.gridID = 'list-subportal-config';
    this.removeItems = [];
    this.url = {
      list: iNet.getPUrl('cms/subportal/configlist'),
      service: iNet.getPUrl('cms/subportal/service')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'order',
        label: '#',
        type: 'rownumber',
        align: 'center',
        width: 35
      }, {
        property: 'name',
        label: 'Name',
        type: 'text',
        width: 200,
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'Name không được để trống';
        }
      }, {
        property: 'prefix',
        label: 'Prefix',
        type: 'text',
        width: 100,
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'Prefix không được để trống';
        }
      }, {
        property: 'domain',
        label: 'Domain',
        type: 'text',
        width: 200,
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'Domain không được để trống';
        }
      }, {
        property: 'serviceNamed',
        label: 'Service',
        type: 'select',
        editData: serviceList,
        valueField: 'value',
        displayField: 'text',
        width: 150
      }, {
        property: 'listUrl',
        label: 'List Url',
        type: 'text'
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: 'Edit',
          icon: 'fa fa-pencil',
          fn: function (record) {
            _this.edit(record);
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN);
          }
        }, {
          text: _this.getText('del', 'button', '', iNet.resources.message),
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var dialog = _this.confirmDlg('', '', function () {
              _this.putRemove(this.getData());
              _this.removeRecord({uuid: this.getData()});
              this.hide();
            });
            dialog.setData(record.uuid);
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + 'Xóa cấu hình SubPortal');
            dialog.show();
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN);
          }
        }]
      }]
    });

    /**
     * @class BasicSearch
     * @extends iNet.ui.grid.Search
     */
    var BasicSearch = function () {
      this.id = 'list-subportal-config-basic-search';
    };
    iNet.extend(BasicSearch, iNet.ui.grid.Search, {
      intComponent: function () {
        var btnNewRecord = this.getEl().find('.btn-new-record');
        btnNewRecord.on('click', function () {
          _this.newRecord();
        });
      },
      getUrl: function () {
        return _this.url.list;
      }
    });
    this.basicSearch = BasicSearch;

    this.convertData = function (data) {
      _this.grid.setTotal(data.total || 0);
      return convertData(data);
    };

    iNet.ui.admin.SubPortalConfigList.superclass.constructor.call(this);

    this.getGrid().on('save', function (newData) {
      newData.isUpdate = false;
      _this.insert(newData);
    });

    this.getGrid().on('update', function (newData, oldData) {
      newData.isUpdate = true;
      _this.update($.extend({}, oldData, newData));
    });
  };

  iNet.extend(iNet.ui.admin.SubPortalConfigList, iNet.ui.ListAbstract, {
    loadData: function () {
      this.getGrid().load();
      return this;
    },
    putRemove: function (id) {
      this.removeItems.push(id);
    },
    /**
     * @returns {Array}
     */
    getData: function () {
      return this.getGrid().getStore().values();
    },
    save: function () {
      saveItem(0, this.getData());
      removeItem(0, this.removeItems);
    }
  });


  /**
   * @private saveItem
   * @param index
   * @param data
   * @private
   */
  function saveItem(index, data) {
    if (index < data.length) {
      var item = data[index];
      if (iNet.isDefined(item.isUpdate) && !item.isUpdate) {
        delete item.uuid;
      }
      save(item, function () {
        saveItem(index + 1, data);
      });
    }
  }

  /**
   * @private removeItem
   * @param index
   * @param data
   * @private
   */
  function removeItem(index, data) {
    if (index < data.length) {
      remove({uuid: data[index]}, function () {
        removeItem(index + 1, data);
      });
    }
  }

  function convertData(data) {
    return data.items || [];
  }

  function save(params, callback) {
    $.postJSON(iNet.getPUrl('cms/subportal/configsave'), params, function (result) {
      if (result.type !== CMSConfig.TYPE_ERROR) {
        callback && callback(result);
      }
    });
  }

  function remove(params, callback) {
    $.postJSON(iNet.getPUrl('cms/subportal/configremove'), params, function (result) {
      if (result.type !== CMSConfig.TYPE_ERROR) {
        callback && callback(result);
      }
    });
  }
});