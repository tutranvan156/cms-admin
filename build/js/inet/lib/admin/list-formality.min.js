/**
 * #PACKAGE: admin
 * #MODULE: list-formality
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:14 18/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListFormality.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @class iNet.ui.admin.ListFormality
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ListFormality');
  iNet.ui.admin.ListFormality = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'list-formality-wg';
    this.gridID = 'list-formality';
    this.remote = true;
    this.module = 'land';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list: iNet.getPUrl('land/revocation/formality/search'),
      update: iNet.getPUrl('land/revocation/formality/save'),
      remove: iNet.getPUrl('land/revocation/formality/remove')
    };
    this.$toolbar = {
      CREATED: $('#formality-btn-add')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'name',
          label: _this.getText('name'),
          type: 'text',
          sortable: true,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_name');
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
        }, {
          label: '',
          type: 'action',
          align: 'center',
          buttons: [{
            text: _this.getText('edit', 'link'),
            icon: 'icon-pencil',
            labelCls: 'label label-info',
            fn: function (record) {
              _this.getGrid().edit(record.uuid);
            },
            visibled: function () {
              return _this.getSecurity().hasRoles(CMSConfig.ROLE_LAND);
            }
          }, {
            text: _this.getText('title_delete'),
            icon: 'icon-trash',
            labelCls: 'label label-danger',
            fn: function (record) {
              var dialog = _this.confirmDlg(_this.getText('title_delete'), _this.getText('question_remove'), function () {
                rowRemove(dialog.getData(), record, this);
              });
              dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete'));
              dialog.show();
              dialog.setData({uuid: record.uuid});
            },
            visibled: function () {
              return _this.getSecurity().hasRoles(CMSConfig.ROLE_LAND);
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
      this.id = 'list-formality-basic-search';
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


    iNet.ui.admin.ListFormality.superclass.constructor.call(this);
    _this.$toolbar.CREATED.on('click', function () {
      _this.newRecord();
    });

    _this.getGrid().on('save', function (data) {
      $.postJSON(_this.url.update, data, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('create', 'link'), _this.getText('create_error', 'link'));
        else {
          _this.insert(result);
          _this.success(_this.getText('create', 'link'), _this.getText('create_success', 'link'));
        }
      });
    });

    _this.getGrid().on('update', function (newData, oldData) {
      var data = $.extend({}, oldData, newData);
      $.postJSON(_this.url.update, data, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
        else {
          _this.update(result);
          _this.getGrid().load();
          _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
        }
      });
    });

  };

  iNet.extend(iNet.ui.admin.ListFormality, iNet.ui.ListAbstract);
  new iNet.ui.admin.ListFormality();
});
