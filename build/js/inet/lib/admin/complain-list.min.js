/**
 * #PACKAGE: admin
 * #MODULE: complain-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 13:37 11/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ComplainList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ListComplain
   * @extends iNet.ui.ListAbstract
   */
  var END_DATE = 23 * 3600 * 100 + 59 * 60 * 1000 + 59 * 1000 + 999;
  iNet.ns('iNet.ui.admin.ListComplain');
  iNet.ui.admin.ListComplain = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'list-complain-wg';
    this.gridID = 'list-complain';
    this.remote = true;
    this.module = 'plain';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.resourceParent = 'link';
    this.dataGroup = 'GROUP_KHIEUNAITOCAO';
    this.url = {
      list: iNet.getPUrl('cms/complain/list'),
      cate_list: iNet.getPUrl('fqa/cate/list'),
      del: iNet.getPUrl('cms/complain/delete')
    };
    this.$bar = {
      CREATED: $('#plain-btn-add')
    };
    this.form = {
      select: $('#category-complain')
    };

    function appendSelect(url, id, idAppend) {
      var html = '';
      $.get(url, {group: 'GROUP_KHIEUNAITOCAO'}, function (result) {
        for (var i = 0; i < result.items.length; i++) {
          html += iNet.Template.parse(id, result.items[i]);
        }
        idAppend.append(html);
      });
    }

    appendSelect(_this.url.cate_list, 'list-category', _this.form.select);


    var searchDataSelect2 = function (element, url, group, mes) {
      element.select2({
        placeholder: mes,
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
              group: group
            };
          },
          processResults: function (data, params) {
            var __results = [];
            var __data = data.items || [];
            __data.forEach(function (item) {
              var __item = item || {};
              __item.id = item.uuid;
              __item.text = item.name;
              __results.push(__item);
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
    };

    searchDataSelect2(this.form.select, this.url.cate_list, this.dataGroup, 'Tìm chọn thể loại');
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'subject',
        label: this.getText('subject', 'fqa'),
        type: 'label'
      },
        {
          property: 'created',
          label: this.getText('date', 'fqa'),
          type: 'label',
          renderer: function (v) {
            return new Date(v).format(iNet.dateFormat);
          }
        },
        {
          type: 'action',
          align: 'center',
          buttons: [{
            text: iNet.resources.message.button.del,
            icon: 'icon-trash',
            labelCls: 'label label-important',
            fn: function (record) {
              var dialog = _this.confirmDlg(
                  _this.getText('title_delete', _this.resourceParent),
                  _this.getText('quesion_delete', _this.resourceParent), function () {
                    rowRemove(dialog.getData(), record, this);
                  }
              );
              dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', _this.resourceParent));
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
      this.id = 'list-complain-basic-search';
      this.params = {
        pageSize: CMSConfig.PAGE_SIZE,
        pageNumber: 0,
        keyword: '',
        category: '',
        fromDate: 0,
        toDate: 0
      }
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.cateSearch = this.getEl().find('.grid-search-cate');
        this.datepicker = this.getEl().find('#grid-datepicker');
        this.btnSearch = this.getEl().find('.grid-search-btn');
        this.cateSearch.on('change', function () {
          search.params.category = this.value;
          search.btnSearch[0].click();
        });
        this.datepicker.datepicker({
          format: 'dd/mm/yyyy',
          todayBtn: 'linked',
          clearBtn: true,
          autoclose: true,
          todayHighlight: true
        }).on('changeDate', function (e) {
          if (e.target.name === 'start') {
            search.params.fromDate = e.date.setHours(0, 0, 1);
          }
          if (e.target.name === 'end') {
            search.params.toDate = e.date.setHours(23, 59, 59);
          }
          search.btnSearch[0].click();
        });
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        this.params.keyword = this.inputSearch.val();
        return this.params;
      }
    });

    function rowRemove(_uuid, record, _dialog) {
      _dialog.hide();
      $.postJSON(_this.url.del, _uuid, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('delete', 'link'), _this.getText('delete_error', 'link'));
        else {
          _this.removeRecord(record);
          _this.success(_this.getText('delete', 'link'), _this.getText('delete_success', 'link'));
        }
      });
    }

    iNet.ui.admin.ListComplain.superclass.constructor.call(this);
    this.$bar.CREATED.on('click', function () {
      _this.fireEvent(_this.getEvent('created'), _this);
    });
    this.getGrid().on('click', function (record) {
      _this.fireEvent(_this.getEvent('open'), record, _this);
    });
  };
  iNet.extend(iNet.ui.admin.ListComplain, iNet.ui.ListAbstract, {});
});
