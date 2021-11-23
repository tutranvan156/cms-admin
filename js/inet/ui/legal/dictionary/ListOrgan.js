/**
 * #PACKAGE: document
 * #MODULE: list-organ
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 09:54 08/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListOrgan.js
 */
$(function () {
  /**
   * @class iNet.ui.document.ListOrgan
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.document.ListOrgan');
  iNet.ui.document.ListOrgan = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id='wg-list-organ';
    this.gridID='grid-organ';
    this.module='document';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.remote=true;
    this.url={
      list:iNet.getPUrl('legal/dictionary/list'),
      created:iNet.getPUrl('legal/dictionary/create'),
      update:iNet.getPUrl('legal/dictionary/update'),
      remove:iNet.getPUrl('legal/dictionary/delete')
    };

    this.$toolbar={
      CREATE: $('#list-organ-btn-create')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'name',
          label: _this.getText('name_organ'),
          type: 'text',
          sortable: true,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_name_organ');
            }
          }
        }, {
          property: 'value',
          label: _this.getText('code_organ'),
          type: 'text',
          sortable: true,
          width: 220,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_code_organ');
            }
          }
        },{
          label: '',
          type: 'action',
          align: 'center',
          buttons: [{
            text: _this.getText('edit','link'),
            icon: 'icon-pencil',
            labelCls: 'label label-info',
            fn: function (record) {
              _this.getGrid().edit(record.uuid);
            }
          }, {
            text: _this.getText('delete','link'),
            icon: 'icon-trash',
            labelCls: 'label label-danger',
            fn: function (record) {
              var dialog = _this.confirmDlg(_this.getText('title_delete'), _this.getText('quesion_delete'), function () {
                rowRemove(dialog.getData(), record, this);
              });
              dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete'));
              dialog.show();
              dialog.setData({uuid:record.uuid});
            }
          }]
        }],
      delay: 250
    });
    function rowRemove(_uuid, record, _dialog) {
      _dialog.hide();
      $.postJSON(_this.url.remove, _uuid, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('delete','link'), _this.getText('delete_error','link'));
        else {
          _this.removeRecord(record);
          _this.success(_this.getText('delete','link'), _this.getText('delete_success','link'));
        }
      });
    }

    this.basicSearch = function () {
      this.id = 'list-basic-search-organ';
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
          keyword: this.inputSearch.val() || '',
          dictType:'PUBLISHER'
        };
      }

    });

    iNet.ui.document.ListOrgan.superclass.constructor.call(this);
    _this.$toolbar.CREATE.on('click', function () {
      _this.newRecord();
    });
    _this.getGrid().on('save', function (data) {
      data.dictType='PUBLISHER';
      $.postJSON(_this.url.created, data, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('create','link'), _this.getText('create_error','link'));
        else {
          _this.insert(result);
          _this.success(_this.getText('create','link'), _this.getText('create_success','link'));
        }
      });
    });
    _this.getGrid().on('update', function (newData, oldData) {
      var data = $.extend({}, oldData, newData);
      $.postJSON(_this.url.update, data, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('update','link'), _this.getText('update_error','link'));
        else {
          _this.update(result);
          _this.getGrid().load();
          _this.success(_this.getText('update','link'), _this.getText('update_success','link'));
        }
      });
    });
  };
  iNet.extend(iNet.ui.document.ListOrgan, iNet.ui.ListAbstract);
  new iNet.ui.document.ListOrgan();
});
