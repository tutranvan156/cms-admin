// #PACKAGE: author
// #MODULE: cms-tab-item-list
//
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11/09/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file TabItemList
 * @author nbchicong
 */

$(function () {
  /**
   * @class iNet.ui.apps.TabItemList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.apps.TabItemList');
  iNet.ui.apps.TabItemList = function (options) {
    var _this = this, __opts = options || {};
    iNet.apply(this, __opts);
    this.id = this.id || 'tab-element-list-wg';
    this.gridID = this.gridID || 'tab-element-list';
    this.firstLoad = false;
    this.editable = this.editable || false;
    this.idProperty = 'xid';
    this.module = 'tab_element';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.menuItems = new Hashtable();
    this.url = {
      list: iNet.getUrl('application/summary/tab'),
      listItem: iNet.getUrl('cms/menuitem/list')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'name',
        label: 'Name',
        width: 250,
        sortable: true,
        type: 'text'
      }, {
        property: 'item',
        label: 'Item',
        type: 'selectx',
        disabled: false,
        valueField: 'menuID',
        displayField: 'text',
        cls: 'hidden-767',
        renderer: function (item) {
          return item.subject;
        },
        config: {
          multiple: false,
          initSelection: function (element, callback) {
            var id = $(element).val();
            if (!iNet.isEmpty(id)) {
              var ids = id.split(',');
              $.postJSON(_this.url.listItem, {}, function (result) {
                var datas = [];
                if (!!result.items) {
                  var items = result.items || [];
                  for (var i = 0; i < items.length; i++) {
                    var __item = items[i] || {};
                    _this.putItem(__item);
                    if (ids.indexOf(__item.uuid.toString()) > -1) {
                      datas.push(__item);
                    }
                  }
                  callback(datas);
                }
              });
            }
          },
          formatResult: function (item) {
            return item.text;
          },
          formatSelection: function (item) {
            return item.text;
          },
          ajax: {
            placeholder: 'Select an item',
            url: _this.url.listItem,
            dataType: 'json',
            quietMillis: 100,
            data: function (term) {
              return {
                keyword: term
              };
            },
            results: function (data) {
              var results = [];
              $.each(data.items || [], function (index, item) {
                results.push(iNet.apply({
                  id: item.menuID,
                  text: item.subject
                }, item));
              });
              return {
                results: results
              };
            }
          },
          escapeMarkup: function (m) {
            return m;
          }
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: this.getText('edit', 'button', '', iNet.resources.message),
          icon: 'fa fa-pencil',
          labelCls: 'label label-success',
          fn: function(record) {
            _this.edit(record);
          }
        }, {
          text: this.getText('del', 'button', '', iNet.resources.message),
          icon: 'fa fa-times',
          labelCls: 'label label-important',
          fn: function(record) {
            _this.dialog = _this.confirmDlg('', '', function () {
              _this.removeRecord(this.getOptions());
              _this.fireEvent(_this.getEvent('remove'), this.getOptions(), _this);
              this.hide();
            });
            _this.dialog.setOptions(record);
            _this.dialog.show();
          }
        }]
      }]
    });
    this.convertData = function (data) {
      var __els = _this.getElements();
      var __dataEls = data.elements || [];
      var __datas = [];
      for (var i = 0; i < iNet.getSize(__dataEls); i ++) {
        var __item = {xid: iNet.generateId(), name: __dataEls[i], item: {menuID: '', subject: ''}};
        for (var j = 0; j < iNet.getSize(__els); j ++) {
          var __elItem = __els[j];
          if (__elItem.name == __dataEls[i]) {
            __item.item.subject = __elItem.value;
            __item.item.menuID = __elItem.uuid;
            break;
          }
        }
        __datas.push(__item);
      }
      return __datas;
    };
    this.basicSearch = function () {
      this.id = 'list-element-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      intComponent: function () {
        this.$qSearch = $.getCmp(this.id);
        this.$btnAddRecord =  this.$qSearch.find('#add-new-items-info');
        this.$btnSearch = this.$qSearch.find('[data-action-search="search"]:first');
        this.$btnAddRecord.on('click', function () {
          _this.newRecord();
        });
      },
      getUrl: function () {
        return _this.url.list;
      },
      getId: function () {
        return this.id;
      },
      getData: function () {
        return {};
      }
    });
    iNet.ui.apps.TabItemList.superclass.constructor.call(this);
    this.grid.on('save', function (data) {
      var __data = iNet.apply(data, {item: _this.findItemById(data.item)});
      _this.fireEvent(_this.getEvent('save'), __data, _this);
    });
    this.grid.on('update', function (data, oldData) {
      var __data = iNet.apply(data, {item: _this.findItemById(data.item)});
      _this.fireEvent(_this.getEvent('update'), __data, oldData, _this);
    });
    this.grid.on('selectionchange', function (sm, data) {
      _this.fireEvent(_this.getEvent('selected'), sm, data, _this.getSelection(), _this);
    });
    //this.loadItems();
  };
  iNet.extend(iNet.ui.apps.TabItemList, iNet.ui.ListAbstract, {
    setParams: function (params) {
      this.params = params;
      return this;
    },
    getParams: function () {
      return this.params || {};
    },
    setOwnerId: function (ownerId) {
      this.ownerId = ownerId;
      return this;
    },
    getOwnerId: function () {
      return this.ownerId || '';
    },
    loadItems: function () {
      var _this = this;
      $.postJSON(this.url.listItem, {}, function (results) {
        var __results = results || {};
        if (!!__results.items) {
          for (var i = 0; i < __results.items.length; i ++) {
            _this.putItem(__results.items[i]);
          }
        }
      });
    },
    findItemById: function (id) {
      return this.getItems().get(id);
    },
    putItem: function (item) {
      if (!iNet.isEmpty(this.findItemById(item.menuID))) {
        this.getItems().remove(item.menuID);
      }
      this.menuItems.put(item.menuID, item);
    },
    setItems: function (items) {
      this.menuItems = items;
    },
    getItems: function () {
      return this.menuItems;
    },
    setElements: function (elements) {
      this.elements = elements;
    },
    getElements: function () {
      return this.elements;
    }
  });
});