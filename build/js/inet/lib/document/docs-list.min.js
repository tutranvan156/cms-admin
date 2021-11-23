/**
 * #PACKAGE: document
 * #MODULE: docs-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:22 06/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file LegalDocList.js
 */
$(function () {
  /**
   * @class iNet.ui.document.LegalDocList
   * @extends iNet.ui.document.LegalDraftDocList
   */
  iNet.ns('iNet.ui.document.LegalDocList');
  iNet.ui.document.LegalDocList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'legaldoc-list-wg';
    this.module = 'document';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.gridID = this.gridID || 'legal-doc-list';
    this.selected = [];
    this.firstLoad = true;

    this.$toolbar = {
      CREATE: $('#list-btn-add-wg'),
      PUBLISH: $('#list-btn-publish-edoc')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'signNumber',
        label: this.getText('sign_number'),
        type: 'label',
        width: 200
      }, {
        property: 'content',
        label: this.getText('content'),
        type: 'label'
      }, {
        property: 'promulgationDate',
        label: this.getText('promulgation_date'),
        sortable: true,
        type: 'text',
        width: 150,
        renderer: function (v) {
          return new Date(v).format(iNet.dateFormat);
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: this.getText('published'),
          icon: 'fa fa-globe',
          labelCls: 'label label-success',
          visibled: function (record) {
            record._isPublished = record.exploitation.indexOf(CMSConfig.APPLICATION) !== -1;
            return _this.getSecurity().hasRoles([CMSConfig.ROLE_ADMIN, CMSConfig.ROLE_LEGAL_DOC])
                && !record._isPublished;
          },
          fn: function (record) {
            _this.showPublishConfirm({
              uuid: record.uuid,
              authorUnitCode: record.authorUnitCode
            });
          }
        }, {
          text: this.getText('remove'),
          icon: 'fa fa-trash',
          labelCls: 'label label-danger',
          visibled: function (record) {
            return _this.getSecurity().hasRoles([CMSConfig.ROLE_ADMIN, CMSConfig.ROLE_LEGAL_DOC]);
          },
          fn: function (record) {
            var dialog = _this.confirmDlg(
                _this.getText('remove'),
                _this.getText('remove_confirm'), function () {
                  this.hide();
                  LegalDocumentAPI.removeEgovEdoc(dialog.getData(), function (result) {
                    if (result.type === CMSConfig.TYPE_ERROR)
                      _this.error(_this.getText('remove'), _this.getText('remove_error'));
                    else {
                      _this.removeRecord(record);
                      _this.success(_this.getText('remove'), _this.getText('remove_success'));
                    }
                  });
                }
            );
            dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('remove'));
            dialog.setData({
              uuid: record.uuid,
              authorUnitCode: record.authorUnitCode
            });
            dialog.show();
          }
        }]
      }]
    });

    /**
     * @constructor
     * @class BasicSearch
     * @extends iNet.ui.grid.Search
     */
    var BasicSearch = function () {
      this.id = 'list-docs-basic-search';
    };
    iNet.extend(BasicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.startDate = this.getEl().find('#startDate');
        this.endDate = this.getEl().find('#endDate');
        this.cbbPublisher = this.getEl().find('#cbb-dict-publisher');
        this.cbbDictType = this.getEl().find('#cbb-dict-type');
        this.cbbDictIndustry = this.getEl().find('#cbb-dict-industry');
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
        this.cbbType = this.getEl().find('#cbb-type-publisher');
        var dateRangeEl = this.getEl().find('.input-daterange');
        this.selectSort = this.getEl().find('#cbb-sort-doc');
        if (dateRangeEl.length > 0)
          dateRangeEl.datepicker(_this.datepickerConfig);

        _this.initSelect2(this.cbbDictType, _this.url.load, 'CATEGORY', 'Thể loại');
        _this.initSelect2(this.cbbPublisher, _this.url.load, 'PUBLISHER', 'Đơn vị');
        _this.initSelect2(this.cbbDictIndustry, _this.url.load, 'INDUSTRY', 'Lĩnh vực');

        this.selectSort.on('change', function () {
          search.$btnSearch.click();
        });
        this.cbbType.on('change', function () {
          search.$btnSearch.click();
        });
        this.cbbDictIndustry.on('select2:select', function () {
          search.$btnSearch.click();
        });
        this.cbbDictType.on('select2:select', function () {
          search.$btnSearch.click();
        });
        this.cbbPublisher.on('select2:select', function () {
          search.$btnSearch.click();
        });
        this.endDate.on('change', function () {
          if (search.startDate.val())
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
          industry: this.cbbDictIndustry.val() || '',
          publisher: this.cbbPublisher.val() || '',
          type: this.cbbType.val() || _this.getType(),
          draft: false,
          startDate: this.startDate.val() ? new Date(_this.convertDate(this.startDate.val())).getTime() : '',
          endDate: this.endDate.val() ? new Date(_this.convertDate(this.endDate.val())).getTime() : '',
          sortField: this.selectSort.val() || '-receiveDate',
          docType: -1
        };
      }
    });

    this.basicSearch = BasicSearch;

    iNet.ui.document.LegalDocList.superclass.constructor.call(this);

    this.appendSelect(_this.url.category, 'CATEGORY', 'list-type-doc', _this.form.type);

    this.initSelect2(_this.form.type, _this.url.category, 'CATEGORY', 'Thể loại', false);

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
    this.getGrid().on('selectionchange', function (sm) {
      _this.selected = sm.getSelection();
      FormUtils.disableButton(_this.$toolbar.PUBLISH, !_this.selected.length && isCanPublish(_this.selected));
    });
    this.$toolbar.CREATE.on('click', function () {
      _this.fireEvent('created', _this);
    });
    this.$toolbar.PUBLISH.on('click', function () {
      _this.showPublishConfirm({
        ids: _this.selected.map(function (item) {
          return item.uuid;
        }).join(CMSConfig.ARRAY_SEPARATOR)
      });
    });
  };

  iNet.extend(iNet.ui.document.LegalDocList, iNet.ui.document.LegalDraftDocList, {
    publish: function (params) {
      var _this = this;
      LegalDocumentAPI.shareEdoc(params, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR)
          _this.error(_this.getText('published'), _this.getText('published_error'));
        else {
          _this.reload();
          _this.success(_this.getText('published'), _this.getText('published_success'));
        }
      });
    },
    getType: function () {
      return 'PROMULGATE';
    },
    showPublishConfirm: function (publishData) {
      var _this = this;
      var dialog = this.confirmDlg(
          this.getText('published'),
          this.getText('published_confirm'),
          function () {
            var params = dialog.getData();
            _this.publish(params);
            dialog.hide();
          });
      dialog.setTitle('<i class="fa fa-globe text-success"></i> ' + _this.getText('published'));
      dialog.setData(publishData);
      dialog.show();
    }
  });

  function isCanPublish(records) {
    for (var i = 0; i < records.length; i++) {
      if (records[i]._isPublished) {
        return false;
      }
    }
    return true;
  }
});