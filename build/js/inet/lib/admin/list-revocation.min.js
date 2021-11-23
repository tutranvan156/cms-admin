/**
 * #PACKAGE: admin
 * #MODULE: list-revocation
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 11:18 18/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListRevocation.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ListRevocation
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ListRevocation');
  iNet.ui.admin.ListRevocation = function (options) {
    this.id = 'list-revocation-wg';
    this.gridID = 'list-revocation';
    this.remote = true;
    this.module = 'revocation';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list_formality: iNet.getPUrl('land/revocation/formality/search'),
      list: iNet.getPUrl('land/revocation/search'),
      remove: iNet.getPUrl('land/revocation/remove')
    };
    var _this = this;
    iNet.apply(this, options || {});
    this.$toolbar = {
      CREATED: $('#revocation-btn-add')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'content',
        label: this.getText('content'),
        type: 'text',
        sortable: true
      }, {
        property: 'expiredDateStr',
        label: _this.getText('expired_date'),
        type: 'text',
        sortable: true,
        width: 220
      }, {
        property: 'formality',
        label: this.getText('formality'),
        type: 'text',
        sortable: true,
        width: 180
      }, {
        property: 'note',
        label: this.getText('note'),
        type: 'text',
        sortable: true,
        width: 220
      }, {
        label: '',
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.edit,
          icon: 'icon-pencil',
          labelCls: 'label label-info',
          fn: function (record) {
            _this.fireEvent('open', record, _this);
          }
        }, {
          text: iNet.resources.message.button.del,
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

    this.convertData = function (data) {
      var items = data.items || [];
      var __items = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].formality.length > 0) {
          items[i]['formality'] = items[i].formality[0].name;
        }
        __items.push(items[i]);
      }
      _this.grid.setTotal(data.total);
      return __items;
    }

    /**
     * @constructor
     * @class BasicSearch
     * @extends iNet.ui.grid.Search
     */
    var BasicSearch = function () {
      this.id = 'list-revocation-basic-search';
    };
    iNet.extend(BasicSearch, iNet.ui.grid.Search, {
      constructor: BasicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
        this.cbbPublisher = this.getEl().find('#formality-select2');
        _this.initSelect2(this.cbbPublisher, _this.url.list_formality, 'Hình thức');
        this.cbbPublisher.on('select2:select', function () {
          search.$btnSearch.click();
        });
        this.cbbPublisher.on('change', function () {
          search.$btnSearch.click();
        });
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val() || '',
          formalityId: this.cbbPublisher.val() || ''
        };
      }
    });
    this.basicSearch = this.basicSearch || BasicSearch;
    iNet.ui.admin.ListRevocation.superclass.constructor.call(this);

    this.$toolbar.CREATED.on('click', function () {
      _this.fireEvent('created', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };
  iNet.extend(iNet.ui.admin.ListRevocation, iNet.ui.ListAbstract, {
    initSelect2: function (element, url, placeholderMsg) {
      return element.select2({
        placeholder: placeholderMsg,
        allowClear: true,
        ajax: {
          url: url,
          dataType: 'json',
          multiple: true,
          delay: 250,
          data: function (params) {
            params.page = params.page || 0;
            return {
              keyword: params.term,
              pageNumber: params.page,
              pageSize: CMSConfig.PAGE_SIZE
            };
          },
          processResults: function (data, params) {
            var __results = [];
            var __data = data.items || [];
            __data.forEach(function (item) {
              __results.push({
                id: item.uuid,
                text: item.name
              });
            });
            return {
              results: __results,
              pagination: {
                more: (CMSConfig.PAGE_SIZE * 30) < data.total
              }
            };
          },
          cache: true
        }
      });
    },
    appendSelect: function (url, params, tplId, element) {
      $.get(url, params, function (result) {
        var html = '';
        var items = result.items || [];
        for (var i = 0; i < items.length; i++)
          html += iNet.Template.parse(tplId, items[i]);

        element.append(html);
      });
    }

  });


});
