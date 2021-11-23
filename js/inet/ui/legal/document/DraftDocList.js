/**
 * #PACKAGE: document
 * #MODULE: draft-docs-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:34 16/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file DraftDocList.js
 */
$(function () {
  /**
   * @class iNet.ui.document.LegalDraftDocList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.document');
  iNet.ui.document.LegalDraftDocList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'legaldoc-list-wg';
    this.module = 'document';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.resourceParent = 'link';
    this.gridID = this.gridID || 'legal-doc-list';
    this.draftList = this.draftList || true;
    this.remote = true;
    this.firstLoad = false;
    var layout = iNet.getLayout();
    this.toolbar = {
      CREATE: $('#list-btn-add')
    };
    this.form = {
      type: $('#type-edoc'),
      industry: $('#industry-doc'),
      organ: $('#organ-doc'),
      dateEnd: $('#date-timepicker1'),
      modal: $('#modal-form'),
      saveModal: $('#save-modal'),
      closeModal: $('#close-modal')
    };
    this.url = {
      listDraft: iNet.getPUrl('draft/document/cmmlist'),
      list: iNet.getPUrl('cms/egov/edoc/list'),
      del: iNet.getPUrl('legal/document/delete'),
      load: iNet.getPUrl('legal/dictionary/list'),
      industry: iNet.getPUrl('cms/egov/industry/search'),
      agency: iNet.getPUrl('cms/egov/agency/search'),
      category: iNet.getPUrl('cms/egov/category/search'),
      enable: iNet.getPUrl('legal/document/markcomment'),
      profile: iNet.getPUrl('cms/profile')
    };
    this.datepickerConfig = {
      format: 'dd/mm/yyyy',
      todayBtn: 'linked',
      autoclose: true,
      toggleActive: true,
      todayHighlight: true
    };

    this.form.dateEnd.datepicker(this.datepickerConfig);

    this.formValidate = new iNet.ui.form.Validate({
      id: this.form.modal.prop('id'),
      rules: [{
        id: _this.form.dateEnd.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_promul'));
        }
      }]
    });

    this.dataSource = this.dataSource || new iNet.ui.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'content',
        label: this.getText('content'),
        type: 'label'
      },
        //   {
        //   property: 'allowComment',
        //   label: 'Nhận ý kiến',
        //   width: 100,
        //   sortable: false,
        //   type: 'switches',
        //   typeCls: 'switch-4',
        //   cls: 'text-center',
        //   renderer: function (value) {
        //     return value;
        //   },
        //   onChange: function (record, activate) {
        //     var __record = record || {};
        //     _this.setCommentParams({
        //       uuid: __record.uuid,
        //       enable: activate
        //     });
        //     if (activate === true) {
        //       _this.form.modal.modal('show');
        //     }
        //     else {
        //       LegalDocumentAPI.markComment(_this.getCommentParams(), function (result) {
        //         _this.getGrid().reload();
        //       });
        //     }
        //   }
        // },
        {
          type: 'action',
          align: 'center',
          buttons: [{
            text: iNet.resources.message.button.view,
            icon: 'fa fa-eye',
            labelCls: 'label label-success',
            fn: function (record) {
              // var url = layout.page + '?uuid=' + record.uuid;
              // window.open(url, '_blank');
              record['orgName'] = _this.getOrgName();
              record['orgId'] = _this.getOrganID();
              _this.fireEvent('open', record, _this);
              // var dialog = _this.confirmDlg(
              //     _this.getText('title_delete', _this.resourceParent),
              //     _this.getText('quesion_delete', _this.resourceParent), function () {
              //       this.hide();
              //       LegalDocumentAPI.remove(dialog.getData(), function (result) {
              //         if (result.type === 'ERROR')
              //           _this.error(_this.getText('delete', 'link'), _this.getText('delete_error', 'link'));
              //         else {
              //           _this.removeRecord(record);
              //           _this.success(_this.getText('delete', 'link'), _this.getText('delete_success', 'link'));
              //         }
              //       });
              //     }
              // );
              // dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', _this.resourceParent));
              // dialog.setData({uuid: record.uuid});
              // dialog.show();
            }
          }, {
            text: 'Bình luận',
            icon: 'fa fa-comments',
            labelCls: 'label label-info',
            fn: function (record) {
              _this.fireEvent('view_comment', record, _this);
            }
          }, {
            text: 'Xóa',
            icon: 'fa fa-trash',
            labelCls: 'label label-danger',
            fn: function (record) {
              var dialog = _this.confirmDlg(
                  _this.getText('title_delete', _this.resourceParent),
                  _this.getText('quesion_delete', _this.resourceParent), function () {
                    this.hide();
                    LegalDocumentAPI.removeEgovEdoc(dialog.getData(), function (result) {
                      if (result.type === 'ERROR')
                        _this.error(_this.getText('delete', 'link'), _this.getText('delete_error', 'link'));
                      else {
                        _this.removeRecord(record);
                        _this.success(_this.getText('delete', 'link'), _this.getText('delete_success', 'link'));
                      }
                    });
                  }
              );
              dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', _this.resourceParent));
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
      constructor: BasicSearch,
      intComponent: function () {
        var search = this;
        this.cbbPublisher = this.getEl().find('#cbb-dict-publisher');
        this.cbbDictIndustry = this.getEl().find('#cbb-dict-industry');
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
        this.selectSort = this.getEl().find('#cbb-sort-doc');
        _this.initSelect2(this.cbbPublisher, _this.url.load, 'PUBLISHER', 'Đơn vị');
        _this.initSelect2(this.cbbDictIndustry, _this.url.load, 'INDUSTRY', 'Lĩnh vực');
        this.cbbDictIndustry.on('select2:select', function () {
          search.$btnSearch.click();
        });
        this.cbbPublisher.on('select2:select', function () {
          search.$btnSearch.click();
        });
        this.selectSort.on('change', function () {
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
          type: _this.getType(),
          sortField: this.selectSort.val() || '-receiveDate',
          publisher: _this.getOrganID()
          // industry: this.cbbDictIndustry.val() || '',
          // publisher: this.cbbPublisher.val() || '',
          // draft: true
        };
      }
    });
    this.basicSearch = this.basicSearch || BasicSearch;
    iNet.ui.document.LegalDraftDocList.superclass.constructor.call(this);

    this.appendSelect(_this.url.agency, 'PUBLISHER', 'list-organ-doc', _this.form.organ);
    this.appendSelect(_this.url.industry, 'INDUSTRY', 'list-industry-doc', _this.form.industry);

    this.initSelect2(_this.form.industry, _this.url.industry, 'INDUSTRY', 'Lĩnh vực', false);
    this.initSelect2(_this.form.organ, _this.url.agency, 'PUBLISHER', 'Đơn vị', true);

    this.toolbar.CREATE.on('click', function () {
      // var url = layout.page + '?created=' + true;
      // window.open(url, '_blank');
      _this.fireEvent('created', _this, {
        orgId: _this.getOrganID(),
        orgName: _this.getOrgName()
      });
    });

    this.form.closeModal.on('click', function () {
      _this.getGrid().reload();
      _this.form.dateEnd.val(null);
    });

    this.form.saveModal.on('click', function () {
      if (_this.formValidate.check()) {
        _this.setCommentParams(
            iNet.apply(_this.getCommentParams(), {
              expiredTime: new Date(_this.convertDate(_this.form.dateEnd.val())).getTime(),
              enable: true
            })
        );
        LegalDocumentAPI.markComment(_this.getCommentParams(), function (result) {
          _this.form.modal.modal('hide');
          _this.getGrid().reload();
        });
      }
    });

    this.getGrid().on('click', function (record) {
      // var url = layout.page + '?uuid=' + record.uuid;
      // window.open(url, '_blank');
      console.log('opening a legal document record: ', record);
      _this.fireEvent('open', record, _this);
    });
    this.loadProfileOrgan();
  };
  iNet.extend(iNet.ui.document.LegalDraftDocList, iNet.ui.ListAbstract, {
    getType: function () {
      return 'DRAFT';
    },
    initSelect2: function (element, url, dictType, placeholderMsg, type) {
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
              pageSize: CMSConfig.PAGE_SIZE,
              type: dictType
            };
          },
          processResults: function (data, params) {
            var __results = [];
            var __data = data.items || [];
            __data.forEach(function (item) {
              if (type) {
                __results.push({
                  id: item.code,
                  text: item.name
                });
              } else {
                console.log('items: ', item);
                __results.push({
                  id: item.description,
                  text: item.description
                });
              }
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
    },
    loadProfileOrgan: function () {
      var _this = this;
      $.getJSON(this.url.profile, {}, function (data) {
        if (data.type !== CMSConfig.TYPE_ERROR) {
          _this.setOrganID(data.organId);
          _this.setOrgName(data.orgName);
          _this.loadGrid();
        }
      });
    },
    setOrganID: function (org) {
      this.orgId = org;
    },
    getOrganID: function () {
      return this.orgId || '';
    },
    setOrgName: function (name) {
      this.orgName = name;
    },
    getOrgName: function () {
      return this.orgName || '';
    },
    loadGrid: function () {
      if (this.grid) {
        this.grid.getQuickSearch().search();
      }
    },
    convertDate: function (strDate) {
      var date = strDate.split('/');
      date = date[1] + '/' + date[0] + '/' + date[2];
      return date;
    },
    setCommentParams: function (params) {
      this.commentParams = params;
    },
    getCommentParams: function () {
      return this.commentParams || {};
    }
  });
});