/**
 * #PACKAGE: admin
 * #MODULE: site-link-service
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:23 18/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file SiteLink.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.SiteLink
   */
  iNet.ns('iNet.ui.admin.SiteLink');
  iNet.ui.admin.SiteLink = function (options) {
    var _this = this, config = options || {};
    iNet.apply(this, config);
    this.id = 'wg-list';
    this.module = 'link';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.remote = true;
    this.arrGroup = [];
    this.paramsRequest = {};
    this.url = {
      list: iNet.getPUrl('cms/linkgroup/list'),
      group: iNet.getPUrl('cms/link/group'),
      create: iNet.getPUrl('cms/link/create'),
      update: iNet.getPUrl('cms/link/update'),
      remove: iNet.getPUrl('cms/link/delete')
    };
    this.$btn = {
      CREATED: $('#list-menu-btn-create')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'name',
          label: _this.getText('name'),
          type: 'text',
          sortable: true,
          width: 220,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_name');
            }
          }
        }, {
          property: 'href',
          label: _this.getText('name_link'),
          type: 'text',
          sortable: true
        }, {
          property: 'type',
          label: _this.getText('type'),
          type: 'select',
          editData: [
            {value: CMSConfig.VAL_INTERNAL, text: _this.getText('internal')},
            {value: CMSConfig.VAL_EXTERNAL, text: _this.getText('external')}
          ],
          sortable: true,
          width: 130
        }, {
          property: 'group',
          label: _this.getText('group'),
          type: 'typeahead',
          editData: _this.arrGroup,
          sortable: true,
          width: 130
        }, {
          property: 'position',
          label: _this.getText('position'),
          type: 'text',
          sortable: true,
          width: 60
        }, {
          label: '',
          type: 'action',
          align: 'center',
          buttons: [{
            text: _this.getText('edit'),
            icon: 'icon-pencil',
            labelCls: 'label label-info',
            fn: function (record) {
              _this.getGrid().edit(record.uuid);
            }
          }, {
            text: _this.getText('delete'),
            icon: 'icon-trash',
            labelCls: 'label label-danger',
            fn: function (record) {
              _this.paramsRequest.uuid = record.uuid;
              var dialog = _this.confirmDlg(_this.getText('title_delete'), _this.getText('quesion_delete'), function () {
                rowRemove(_this.paramsRequest, record, this);
              });
              dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete'));
              dialog.show();
            }
          }]
        }],
      delay: 250
    });

    $.postJSON(_this.url.group, {}, function (result) {
      (result.elements).forEach(function (item) {
        _this.arrGroup.push(item);
      });
    });

    function rowRemove(_uuid, record, _dialog) {
      _dialog.hide();
      $.postJSON(_this.url.remove, _uuid, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('delete'), _this.getText('delete_error'));
        else {
          _this.removeRecord(record);
          _this.success(_this.getText('delete'), _this.getText('delete_success'));
        }
      });
    }

    this.basicSearch = function () {
      this.id = 'list-basic-search-link';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.selectType = $('#selected-type-link');
        this.selectGroup = $('#selected-group-link');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
        this.selectType.on('change', function () {
          search.setValSelect($(this).val());
          search.$btnSearch.trigger('click');
        });
      },
      getId: function () {
        return this.id;
      },
      getUrl: function () {
        return _this.url.list;
      },
      setValSelect: function (cate) {
        this.valSelect = cate;
      },
      getValSelect: function () {
        return this.valSelect;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          type: this.selectType.val() || '',
          group: this.selectGroup.val() || '',
          keyword: this.inputSearch.val() || ''
        };
      }

    });
    iNet.ui.admin.SiteLink.superclass.constructor.call(this);
    _this.$btn.CREATED.on('click', function () {
      // console.log('vào created');
      _this.newRecord();
    });
    _this.getGrid().on('save', function (data) {
      $.postJSON(_this.url.create, data, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('create'), _this.getText('create_error'));
        else {
          _this.insert(result);
          _this.success(_this.getText('create'), _this.getText('create_success'));
        }
      });
    });
    _this.getGrid().on('update', function (newData, oldData) {
      newData.uuid = oldData.uuid;
      $.postJSON(_this.url.update, newData, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('update'), _this.getText('update_error'));
        else {
          _this.update(result);
          _this.success(_this.getText('update'), _this.getText('update_success'));
        }
      });
    });
  };
  iNet.extend(iNet.ui.admin.SiteLink, iNet.ui.ListAbstract);
  new iNet.ui.admin.SiteLink();
});
