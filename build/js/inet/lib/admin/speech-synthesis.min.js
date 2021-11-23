/**
 * #PACKAGE: admin
 * #MODULE: speech-synthesis
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 12:01 29/05/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file SpeechSynthesisList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.SpeechSynthesisList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.SpeechSynthesisList');
  iNet.ui.admin.SpeechSynthesisList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'page-setting';
    this.gridID = 'list-speech-synthesis';
    this.removeItems = [];
    this.url = {
      list: iNet.getPUrl('cms/speechsynthesis/list')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'order',
        label: '#',
        type: 'rownumber',
        align: 'center',
        width: 35
      }, {
        property: 'service',
        label: 'Service Utils',
        type: 'text',
        renderer: function(v) {
          return v || '';
        }
      }, {
        property: 'api',
        label: 'API',
        type: 'text',
        width: 200,
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'API không được để trống';
        }
      }, {
        property: 'apiKey',
        label: 'APIKey',
        type: 'text',
        width: 200,
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'API Key không được để trống';
        }
      }, {
        property: 'voice',
        label: 'Giọng đọc',
        type: 'text',
        width: 150
      }, {
        property: 'speed',
        label: 'Tốc độ',
        type: 'select',
        editData: [{value: '-3x'}, {value: '-2x'}, {value: '-1x'}, {value: '0'}, {value: '1x'}, {value: '2x'}, {value: '3x'}],
        valueField: 'value',
        displayField: 'value',
        width: 100
      }, {
        property: 'enable',
        label: 'Kích hoạt',
        width: 100,
        sortable: false,
        type: 'switches',
        typeCls: 'switch-6',
        cls: 'text-center',
        renderer: function (v) {
          return v || false;
        },
        onChange: function (record, status) {
          enable({
            uuid: record.uuid,
            enable: status
          }, function (result) {
            _this.update(result);
          });
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
              _this.putRemove(this.getData());
              _this.removeRecord({uuid: this.getData()});
              this.hide();
            });
            dialog.setData(record.uuid);
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + 'API đọc bài viết');
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
      this.id = 'list-speech-synthesis-basic-search';
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

    iNet.ui.admin.SpeechSynthesisList.superclass.constructor.call(this);

    this.getGrid().on('save', function (newData) {
      newData.isUpdate = false;
      _this.insert(newData);
    });

    this.getGrid().on('update', function (newData, oldData) {
      newData.isUpdate = true;
      _this.update($.extend({}, oldData, newData));
    });
  };
  iNet.extend(iNet.ui.admin.SpeechSynthesisList, iNet.ui.ListAbstract, {
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
    $.postJSON(iNet.getPUrl('cms/speechsynthesis/save'), params, function (result) {
      if (result.type !== CMSConfig.TYPE_ERROR) {
        callback && callback(result);
      }
    });
  }

  function remove(params, callback) {
    $.postJSON(iNet.getPUrl('cms/speechsynthesis/remove'), params, function (result) {
      if (result.type !== CMSConfig.TYPE_ERROR) {
        callback && callback(result);
      }
    });
  }

  function enable(params, callback) {
    $.postJSON(iNet.getPUrl('cms/speechsynthesis/enable'), params, function (result) {
      if (result.type !== CMSConfig.TYPE_ERROR) {
        callback && callback(result);
      }
    });
  }
});