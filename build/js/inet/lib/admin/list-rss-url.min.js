/**
 * #PACKAGE: admin
 * #MODULE: list-rss-url
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 3:12 PM 09/09/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file RSSUrlList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.RSSUrlList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.RSSUrlList');
  iNet.ui.admin.RSSUrlList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'page-setting';
    this.gridID = 'list-rss';
    this.firstLoad = false;
    this.url = {
      list: iNet.getPUrl('cms/system/load')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'order',
        label: 'Order',
        type: 'rownumber',
        align: 'center',
        width: 35
      }, {
        property: 'name',
        label: 'RSS Name',
        type: 'text',
        width: 250,
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'Tên RSS không được để trống';
        }
      }, {
        property: 'url',
        label: 'RSS Url',
        type: 'text',
        width: 250,
        validate : function(v) {
          if (iNet.isEmpty(v))
            return 'RSS url không được để trống';

          var pattern = new RegExp('^((news|(ht|f)tp(s?)):\\/\\/)' +
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
              '((\\d{1,3}\\.){3}\\d{1,3}))' +
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
              '(\\?[;&a-z\\d%_.~+=-]*)?' +
              '(\\#[-a-z\\d_]*)?$', 'i');
          if (!pattern.test(v))
            return 'RSS url phải đúng định dạng';
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
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + 'Xóa RSS link');
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
      this.id = 'list-basic-search';
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
      _this.setSourceData(data.rssUrls || []);
      return convertData(_this.getSourceData());
    };

    iNet.ui.admin.RSSUrlList.superclass.constructor.call(this);

    this.getGrid().on('save', function (newData) {
      if (!newData.uuid)
        newData.uuid = iNet.generateId();

      _this.insert(newData);
    });

    this.getGrid().on('update', function (newData, oldData) {
      _this.update($.extend({}, oldData, newData));
    });
  };
  iNet.extend(iNet.ui.admin.RSSUrlList, iNet.ui.ListAbstract, {
    /**
     * @param {Array} data
     * @returns {iNet.ui.admin.RSSUrlList}
     */
    setSourceData: function (data) {
      this.data = data;
      return this;
    },
    /**
     * @returns {Array|*}
     */
    getSourceData: function () {
      return this.data;
    },
    /**
     * @returns {iNet.ui.admin.RSSUrlList}
     */
    loadData: function () {
      this.getGrid().loadData(convertData(this.getSourceData()));
      return this;
    },
    /**
     * @returns {Array}
     */
    getData: function () {
      return this.getGrid().getStore().values();
    }
  });

  /**
   * Convert List Data RSS Link
   * @param data
   * @returns {*|Array}
   */
  function convertData (data) {
    (data || []).forEach(function (item) {
      item.uuid = iNet.generateId();
      item.url = item.name;
      item.name = item.value;
    });
    return (data || []);
  }
});
