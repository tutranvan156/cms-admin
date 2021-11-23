/**
 * #PACKAGE: admin
 * #MODULE: socioeconomic-report-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:17 23/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file SocioeconomicDataList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.SocioeconomicReportList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.SocioeconomicReportList');
  iNet.ui.admin.SocioeconomicReportList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'socioeconomic-report-list-wg';
    this.gridID = 'content-list';
    this.remote = true;
    this.module = 'socioeconomic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list: iNet.getPUrl('socioeconomic/search'),
      del: iNet.getPUrl('socioeconomic/remove')
    };
    this.toolbar = {
      CREATED: $('#btn-create')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'title',
        label: this.getText('title'),
        type: 'label'
      }, {
        property: 'categories',
        label: this.getText('category'),
        type: 'label',
        width: 200,
        renderer: function (v) {
          if (v && v.length > 0)
            return v[0].name;
          return v;
        }
      }, {
        property: 'createdDate',
        label: this.getText('createdDate'),
        type: 'label',
        width: 120,
        renderer: function (v) {
          return new Date(v).format(iNet.dateFormat);
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.del,
          icon: 'icon-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var dialog = _this.confirmDlg(
                _this.getText('title_delete'),
                _this.getText('question_delete'), function () {
                  rowRemove(dialog.getData(), record, this);
                }
            );
            dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete'));
            dialog.show();
            dialog.setData({uuid: record.uuid});
          }
        }]
      }]
    });
    /**
     * @constructor
     * @class BasicSearch
     * @extends iNet.ui.grid.Search
     */
    this.basicSearch = function () {
      this.id = 'list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          group: CMSConfig.GROUP_ECONOMY_REPORT,
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val() || ''
        };
      }
    });

    function rowRemove(params, record, _dialog) {
      _dialog.hide();
      remove(params, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR)
          _this.error(_this.getText('title_delete'), _this.getText('delete_error'));
        else {
          _this.removeRecord(record);
          _this.success(_this.getText('title_delete'), _this.getText('delete_success'));
        }
      });
    }

    iNet.ui.admin.SocioeconomicReportList.superclass.constructor.call(this);

    this.toolbar.CREATED.on('click', function () {
      _this.fireEvent('create', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };
  iNet.extend(iNet.ui.admin.SocioeconomicReportList, iNet.ui.ListAbstract, {});

  function remove(params, callback) {
    $.postJSON(iNet.getPUrl('socioeconomic/remove'), params, function (results) {
      callback && callback(results);
    });
  }
});