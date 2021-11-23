/**
 * #PACKAGE: admin
 * #MODULE: portal-group-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15:05 03/05/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file PortalGroupList.js
 */
$(function () {
  var KEY_CACHED = '__categories_cached',
    KEY_SUB_CACHED = '__sub_categories_cached';
  /**
   * @class iNet.ui.admin.PortalGroupList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.PortalGroupList');
  iNet.ui.admin.PortalGroupList = function (options) {
    var _this = this;
    var cateUri = 'cms/cate/list';
    iNet.apply(this, options || {});
    this.id = this.id || 'page-setting';
    this.gridID = 'list-portal-group';
    this.idProperty = 'destcate';
    this.remote = false;
    this.destPrefix = null;
    this.url = {
      list: iNet.getPUrl('cms/frmgroup/list'),
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
        property: 'destprefix',
        label: 'Portal Prefix',
        type: 'text',
        width: 200,
        validate: function (v) {
          if (iNet.isEmpty(v))
            return 'Prefix của Portal không được để trống';

          if (!FirmAPI.verifyPrefix({prefix: v}))
            return 'Prefix đã nhập không tồn tại';
          else
            _this.destPrefix = v;
        }
      }, {
        property: 'destcate',
        label: 'Thể loại lấy tin',
        width: 300,
        type: 'selectx',
        valueField: 'uuid',
        displayField: 'name',
        original: true,
        renderer: function (v, record) {
          var html = v;
          if (v) {
            var data = null;
            if (_this.cached.isCached(KEY_SUB_CACHED)) {
              data = _this.cached.getCache(KEY_SUB_CACHED);
            } else {
              if (record.destprefix) {
                AjaxAPI.ajax({
                  async: false,
                  data: {},
                  url: AjaxAPI.getPUrl(cateUri, null, record.destprefix),
                  success: function (result) {
                    data = result.items || [];
                    _this.cached.setCache(KEY_SUB_CACHED, data);
                  }
                });
              }
            }
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
          multiple: false,
          initSelection: function (element, callback) {
            var currentValue = element.val();
            if (currentValue) {
              if (_this.cached.isCached(KEY_SUB_CACHED))
                bindSelected(currentValue, _this.cached.getCache(KEY_SUB_CACHED));
              else {
                if (_this.destPrefix) {
                  $.ajax(AjaxAPI.getPUrl(cateUri, null, _this.destPrefix), {
                    data: {
                      group: ''
                    },
                    dataType: 'JSON'
                  }).done(function (data) {
                    var items = data.items || [];
                    _this.cached.setCache(KEY_SUB_CACHED, items);
                    bindSelected(currentValue, items);
                  });
                }
              }

              /**
               * @param {Array} current
               * @param items
               */
              function bindSelected(current, items) {
                var list = [];
                for (var i = 0; i < items.length; i++) {
                  var item = items[i] || {};
                  if (current === item.uuid)
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
            url: function () {
              return AjaxAPI.getPUrl(cateUri, null, _this.destPrefix);
            },
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
        },
        validate: function (v) {
          if (iNet.isEmpty(v))
            return 'Thể loại của Portal không được để trống';
        }
      }, {
        property: 'srccate',
        label: '',
        type: 'label',
        width: 120,
        renderer: function () {
          return 'gắn với thể loại';
        }
      }, {
        property: 'srccate',
        label: 'Thể loại',
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
          multiple: false,
          initSelection: function (element, callback) {
            var currentValue = element.val();
            if (currentValue) {
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
                  if (current === item.uuid)
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
          text: _this.getText('edit', 'button', '', iNet.resources.message),
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
              if ((record.destfirm || []).length <= 1) {
                remove({srccate: this.getOptions().srccate}, function (result) {
                  _this.removeRecord(result);
                });
              } else {
                _this.removeRecord(this.getOptions());
              }
            });
            dialog.setOptions(record);
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + 'Xóa Portal Group');
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
      this.id = 'portal-group-basic-search';
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
      var items = convertData(data);
      _this.grid.setTotal(items.length);
      return items;
    };

    iNet.ui.admin.PortalGroupList.superclass.constructor.call(this);

    this.getGrid().on('save', function (newData) {
      _this.insert(newData);
    });

    this.getGrid().on('update', function (newData, oldData) {
      _this.update($.extend({}, oldData, newData));
    });

  };

  iNet.extend(iNet.ui.admin.PortalGroupList, iNet.ui.ListAbstract, {
    /**
     * @returns {iNet.ui.admin.PortalGroupList}
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
      (data || []).forEach(function (item) {
        item.prefixes = JSON.stringify([{
          prefix: item.destprefix,
          category: item.destcate
        }]);
        if (!CMSUtils.isObjectId(item.uuid)) {
          delete item.uuid;
        }
        save(item);
      });
    }
  });

  function convertData(data) {
    var items = [];
    (data.items || []).forEach(function (item) {
      (item.destfirm || []).forEach(function (firm) {
        item.destprefix = firm.group;
        item.destcate = firm.name;
        items.push(item);
      });
    });
    return items;
  }

  function save(params, callback) {
    $.postJSON(iNet.getPUrl('cms/frmgroup/create'), params || {}, function (result) {
      callback && callback(result);
    });
  }

  function remove(params, callback) {
    $.postJSON(iNet.getPUrl('cms/frmgroup/delete'), params || {}, function (result) {
      callback && callback(result);
    });
  }
});