/**
 * #PACKAGE: admin
 * #MODULE: land-project-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 09:21 23/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file LandProjectList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.LandProjectList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.LandProjectList');
  iNet.ui.admin.LandProjectList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'list-land-project-wg';
    this.gridID = 'list-land-project';
    this.remote = true;
    this.module = 'land';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    this.$btn = {
      CREATED: $('#land-project-btn-add')
    };

    this.url = {
      list: iNet.getPUrl('land/project/search'),
      remove: iNet.getPUrl('land/project/remove')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
          property: 'title',
          label: 'Tiêu đề',
          type: 'text',
          sortable: true
        }, {
          property: 'createdDate',
          label: 'Ngày tạo',
          type: 'text',
          sortable: true,
          renderer: function (v) {
            return new Date(v).format(iNet.dateFormat);
          },
          width: 200
        }, {
          label: '',
          type: 'action',
          align: 'center',
          buttons: [{
            text: _this.getText('edit', 'link'),
            icon: 'icon-pencil',
            labelCls: 'label label-info',
            fn: function (record) {
              _this.fireEvent('open', record, _this);
            }
          }, {
            text: _this.getText('delete', 'link'),
            icon: 'icon-trash',
            labelCls: 'label label-danger',
            fn: function (record) {
              var dialog = _this.confirmDlg(_this.getText('title_delete'), _this.getText('question_remove'), function () {
                rowRemove(dialog.getData(), record, this);
              });
              dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete'));
              dialog.show();
              dialog.setData({uuid: record.uuid});
            }
          }]
        }],
      delay: 250
    });


    function rowRemove(_uuid, record, _dialog) {
      _dialog.hide();
      $.postJSON(_this.url.remove, _uuid, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('delete', 'link'), _this.getText('delete_error', 'link'));
        else {
          _this.removeRecord(record);
          _this.success(_this.getText('delete', 'link'), _this.getText('delete_success', 'link'));
        }
      });
    }

    this.basicSearch = function () {
      this.id = 'land-project-basic-search';
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
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val() || ''
        };
      }

    });

    iNet.ui.admin.LandProjectList.superclass.constructor.call(this);
    this.$btn.CREATED.on('click', function () {
      _this.fireEvent('created', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };
  iNet.extend(iNet.ui.admin.LandProjectList, iNet.ui.ListAbstract);
});
