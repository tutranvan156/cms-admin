/**
 * #PACKAGE: document
 * #MODULE: list-published
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 11:20 19/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListPublished.js
 */
$(function () {
  /**
   * @class iNet.ui.document.ListPublished
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.document.ListPublished');
  iNet.ui.document.ListPublished = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'list-published-wg';
    this.gridID = 'list-published';
    this.remote = true;
    this.module = 'land';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list: iNet.getPUrl('steering/pending/search'),
      approved: iNet.getPUrl('steering/document/approved')
    };

    this.$toolbar = {
      CREATED: $('#published-btn-add')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'signNumber',
          label: 'Số kí hiệu',
          type: 'text',
          sortable: true,
          width: 220
        }, {
          property: 'promulgationDateStr',
          label: 'Ngày ban hành',
          type: 'text',
          sortable: true,
          width: 150
        }, {
          property: 'content',
          label: 'Nội dung',
          type: 'text',
          sortable: true
        }, {
          property: 'documentName',
          label: 'Tên văn bản',
          type: 'text',
          sortable: true,
          width: 220
        }, {
          label: '',
          type: 'action',
          align: 'center',
          buttons: [{
            text: 'Xem chi tiết',
            icon: 'fa fa-eye',
            labelCls: 'label label-primary',
            fn: function (record) {
              _this.fireEvent('open', record, _this);
            }
          }, {
            text: 'Phê duyệt',
            icon: 'fa fa-share',
            labelCls: 'label label-success',
            fn: function (record) {
              record['documentTypeId'] = record.documentTypeId || '';
              record['industryId'] = record.industryId || '';
              record['publisherId'] = record.publisherId || '';
              record['effectedDate'] = record.effectedDate || '';
              record['expiredDate'] = record.expiredDate || '';
              record['signer'] = record.signer || '';
              record['steeringRefId'] = record.uuid || '';
              record['steeringRefOrganId'] = record.publisherCode || '';
              _this.publishApprovedDocument(record);
            },
            visibled: function (record) {
              return !record.publicStatus;
            }
          }, {
            text: 'Ngưng phê duyệt',
            icon: 'fa fa-reply',
            labelCls: 'label label-warning',
            fn: function (record) {
            },
            visibled: function (record) {
              return record.publicStatus;
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
      _this.grid.setTotal(data.total);
      for (var i = 0; i < items.length; i++) {
        if (items[i].receivers.length > 0) {
          items[i]['organName'] = items[i].receivers[0].organName;
        }
        items[i].receiveDate = new Date(items[i].receiveDate).format('d/m/Y');
        __items.push(items[i]);
      }
      return __items;
    }

    this.publishApprovedDocument = function (params) {
      $.postJSON(_this.url.approved, params, function (result) {
        if (result.type === 'ERROR')
          _this.error('Phê duyệt', 'Phê duyệt thành công');
        else {
          _this.getGrid().load();
          _this.success('Phê duyệt', 'Phê duyệt xảy ra lỗi');
        }
      });
    };

    this.basicSearch = function () {
      this.id = 'list-published-basic-search';
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

    iNet.ui.document.ListPublished.superclass.constructor.call(this);
    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };
  iNet.extend(iNet.ui.document.ListPublished, iNet.ui.ListAbstract);
  new iNet.ui.document.ListPublished();
});
