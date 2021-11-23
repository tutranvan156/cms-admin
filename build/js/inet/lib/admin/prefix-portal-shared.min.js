/**
 * #PACKAGE: admin
 * #MODULE: prefix-portal-shared
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:29 AM 27/11/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file PortalSharedList.js
 */
$(function () {
  var KEY_CACHED = '__categories_cached',
      SPLITTER = ',';

  /**
   * @class iNet.ui.admin.PortalSharedList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.PortalSharedList');
  iNet.ui.admin.PortalSharedList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'page-setting';
    this.gridID = 'list-prefix-shared';
    this.url = {
      list: iNet.getPUrl('cms/shared/load'),
      cate: iNet.getPUrl('cms/category/list')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'order',
        label: '#',
        type: 'rownumber',
        align: 'center',
        width: 35
      }, {
        property: 'brief',
        label: 'Portal Name',
        type: 'text',
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'Tên Portal không được để trống';
        }
      }, {
        property: 'destfirm',
        label: 'Portal Prefix',
        type: 'text',
        width: 200,
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'Prefix của Portal không được để trống';

          if (!FirmAPI.verifyPrefix({prefix: v}))
            return 'Prefix đã nhập không tồn tại';
        }
      }, {
        property: 'categories',
        label: 'Thể loại chia sẻ',
        sortable: true,
        type: 'selectx',
        valueField: 'uuid',
        displayField: 'name',
        width: 300,
        original: true,
        renderer: function (v) {
          var html = v;
          if (v) {
            var data = null;
            if (_this.cached.isCached(KEY_CACHED))
              data = _this.cached.getCache(KEY_CACHED);
            else
              AjaxAPI.ajax({
                async: false,
                data: {},
                url: _this.url.cate,
                success: function (result) {
                  data = result.items || [];
                  _this.cached.setCache(KEY_CACHED, data);
                }
              });

            if (iNet.isArray(data) && !iNet.isEmpty(data)) {
              html = '';
              for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (v.indexOf(item.uuid) !== -1)
                  html += '<label class="label label-info" title="' + item.name + '">' + item.name + '</label>';
              }
            }
          }
          return html;
        },
        config: {
          placeholder: 'Chọn thể loại',
          multiple: true,
          initSelection: function (element, callback) {
            var currentValue = element.val();
            if (currentValue) {
              currentValue = currentValue.split(SPLITTER);
              if (_this.cached.isCached(KEY_CACHED))
                bindSelected(currentValue, _this.cached.getCache(KEY_CACHED));
              else {
                $.ajax(_this.url.cate, {
                  data: {
                    group: ''
                  },
                  dataType: 'JSON'
                }).done(function (data) {
                  var items = data.items || [];
                  _this.cached.setCache(KEY_CACHED, items);
                  bindSelected(currentValue, items);
                });
              }

              /**
               * @param {Array} current
               * @param items
               */
              function bindSelected(current, items) {
                var list = [];
                for (var i = 0; i < items.length; i++) {
                  var item = items[i] || {};
                  if (current.indexOf(item.uuid) !== -1)
                    list.push(item);
                }
                callback(list);
              }
            }
          },
          formatResult: function (item) {
            return '<span><b>' + item.name + '</b></span>';
          },
          formatSelection: function (item) {
            return '<span><b>' + item.name + '</b></span>';
          },
          ajax: {
            placeholder: 'Tìm kiếm thể loại',
            url: _this.url.cate,
            dataType: 'JSON',
            quietMillis: 100,
            data: function (term) {
              return {};
            },
            results: function (data) {
              return {
                results: data.items || []
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
              this.hide();
              _this.removeRecord(this.getOptions());
            });
            dialog.setOptions(record);
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + 'Xóa Portal shared');
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
      this.id = 'list-portal-basic-search';
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

    iNet.ui.admin.PortalSharedList.superclass.constructor.call(this);

    this.getGrid().on('save', function (newData) {
      _this.insert(newData);
    });

    this.getGrid().on('update', function (newData, oldData) {
      _this.update($.extend({}, oldData, newData));
    });
  };

  iNet.extend(iNet.ui.admin.PortalSharedList, iNet.ui.ListAbstract, {
    /**
     * @returns {iNet.ui.admin.PortalSharedList}
     */
    loadData: function () {
      this.getGrid().load();
      return this;
    },
    /**
     * @returns {Array}
     */
    getData: function () {
      return this.getGrid().getStore().values();
    },
    save: function () {
      var data = this.getData();
      var params = [];
      (data || []).forEach(function (item) {
        item.prefix = item.destfirm;
        item.name = item.brief;
        item.category = (item.categories || []).join(SPLITTER);
        params.push(item);
      });
      save({
        prefixes: JSON.stringify(params)
      });
    }
  });

  /**
   * Convert List Data Portal Shared
   * @param data
   * @returns {*|Array}
   */
  function convertData (data) {
    return (data.items || []);
  }

  function save(params, callback) {
    $.postJSON(iNet.getPUrl('cms/shared/create'), params || {}, function (result) {
      callback && callback(result);
    });
  }
});
