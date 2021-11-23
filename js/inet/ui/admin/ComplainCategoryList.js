/**
 * #PACKAGE: admin
 * #MODULE: complain-cate-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:26 07/09/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ComplainCategoryList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ComplainCategoryList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.ComplainCategoryList');
  iNet.ui.admin.ComplainCategoryList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'complain-category-wg';
    this.gridID = 'category-list';
    this.module = 'fqa';
    this.remote = true;
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    this.url = {
      list: iNet.getPUrl('fqa/cate/list'),
      save: iNet.getPUrl('cms/complain/cate/save'),
      remove: iNet.getPUrl('cms/complain/cate/remove')
    };

    this.toolbar = {
      CREATED: $('#list-btn-create')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'name',
        label: _this.getText('name'),
        type: 'text',
        sortable: true,
        validate: function (v) {
          if (iNet.isEmpty(v)) {
            return String.format(iNet.resources.message.field_not_empty, 'NAME');
          }
        }
      }, {
        property: 'created',
        label: _this.getText('date', 'link'),
        type: 'label',
        sortable: true,
        width: 100,
        renderer: function (value) {
          return new Date(value).format(iNet.dateFormat);
        }
      }, {
        label: '',
        type: 'action',
        align: 'center',
        buttons: [{
          text: _this.getText('edit', 'link'),
          icon: 'icon-pencil',
          labelCls: 'label label-info',
          fn: function (record) {
            _this.edit(record);
          }
        }, {
          text: _this.getText('delete', 'link'),
          icon: 'icon-trash',
          labelCls: 'label label-danger',
          fn: function (record) {
            var dialog = _this.confirmDlg(_this.getText('title_delete', 'link'), _this.getText('quesion_delete', 'link'), function () {
              this.hide();
              remove(this.getOptions(), function (result) {
                if (result.type === CMSConfig.TYPE_ERROR)
                  _this.error(_this.getText('delete', 'link'), _this.getText('delete_error', 'link'));
                else {
                  _this.removeRecord(result);
                  _this.success(_this.getText('delete', 'link'), _this.getText('delete_success', 'link'));
                }
              });
            });
            dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', 'link'));
            dialog.setOptions({uuid: record.uuid});
            dialog.show();
          }
        }]
      }],
      delay: 250
    });

    this.basicSearch = function () {
      this.id = 'list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        this.inputSearch = $('.grid-search-input');
        this.$btnSearch = $('.grid-search-btn');
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          pageSize: 10,
          pageNumber: 0,
          keyword: this.inputSearch.val() || '',
          group: CMSConfig.GROUP_COMPLAIN
        };
      }
    });

    iNet.ui.admin.ComplainCategoryList.superclass.constructor.call(this);

    this.toolbar.CREATED.on('click', function () {
      _this.newRecord();
    });
    this.getGrid().on('save', function (data) {
      $.postJSON(_this.url.save, data, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR)
          _this.error(_this.getText('create', 'link'), _this.getText('create_error', 'link'));
        else {
          _this.insert(result);
          _this.success(_this.getText('create', 'link'), _this.getText('create_success', 'link'));
        }
      });
    });
    this.getGrid().on('update', function (newData, oldData) {
      $.postJSON(_this.url.save, $.extend({}, oldData, newData), function (result) {
        if (result.type === CMSConfig.TYPE_ERROR)
          _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
        else {
          _this.update(result);
          _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
        }
      });
    });
  };
  iNet.extend(iNet.ui.admin.ComplainCategoryList, iNet.ui.ListAbstract);

  function remove(params, callback) {
    $.postJSON(iNet.getPUrl('cms/complain/cate/remove'), params, function (result) {
      callback && callback(result)
    });
  }

  new iNet.ui.admin.ComplainCategoryList();
});