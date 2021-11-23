/**
 * #PACKAGE: admin
 * #MODULE: cms-super-menu-list
 */
/**
 * Copyright (c) 2016 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 2:28 PM 19/05/2016.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file MenuList.js
 */
$(function () {
  /**
   * @class iNet.ui.superad.MenuList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.superad.MenuList');
  iNet.ui.superad.MenuList = function (config) {
    var _this = this;
    iNet.apply(this, config || {});
    _this.id = 'menu-list-wg';
    _this.gridID = 'list-items';
    _this.url = {
      list: iNet.getUrl('cms/menucontext/list'),
      copy: iNet.getUrl('cms/menucontext/copy'),
      context: iNet.getUrl('cmsdesign/themename'),
      remove: iNet.getUrl('cms/menucontext/delete')
    };
    _this.$toolbar = {
      CREATE: $('#btn-menu-create'),
      COPY: $('#btn-menu-copy')
    };
    _this.module = 'menu_context';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    _this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'title',
        label: 'Title',
        sortable: true,
        type: 'text'
      }, {
        property: 'context',
        label: 'Context',
        type: 'text',
        width: 150
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: _this.getText('del', 'button', '', iNet.resources.message),
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            _this.confirmDlg('', '', function () {
              $.postJSON(_this.url.remove, _this.dialog.getOptions(), function (result) {
                if (iNet.isDefined(result.uuid)) {
                  _this.removeRecord(record);
                  _this.success('Xóa', 'Xóa thành công.');
                } else {
                  _this.error('Xóa', 'Quá trình xóa xảy ra lỗi.');
                }
                _this.dialog.hide();
              }, {
                mask: _this.getMask(),
                msg: iNet.resources.ajaxLoading.deleting
              });
            });
            _this.dialog.setOptions({menu: record.uuid});
            _this.dialog.setTitle('<i class="fa fa-trash red"></i> ' + 'Xóa!');
            _this.dialog.show();
          }
        }]
      }],
      delay: 250
    });
    iNet.ui.superad.MenuList.superclass.constructor.call(_this);
    _this.$toolbar.CREATE.on('click', function () {
      _this.fireEvent(_this.getEvent('create'), _this.getContext(), _this);
    });
    _this.$toolbar.COPY.on('click', function () {
      _this.showCopyDialog();
    });
    _this.getGrid().on('click', function (record) {
      _this.fireEvent(_this.getEvent('open'), record, _this.getContext(), _this);
    });
    _this.getGrid().on('loaded', function () {
      FormUtils.showButton(_this.$toolbar.COPY, _this.getGrid().getStore().size() > 0);
    });
  };
  iNet.extend(iNet.ui.superad.MenuList, iNet.ui.ListAbstract, {
    resizeView: function () {
      this.resize();
      this.getGrid().getEl().find('.datagrid-header-left').removeClass('col-md-7 col-xs-7 col-sm-7').addClass('col-md-6 col-xs-6 col-sm-6');
      this.getGrid().getEl().find('.datagrid-header-right').removeClass('col-md-5 col-xs-5 col-sm-5').addClass('col-md-6 col-xs-6 col-sm-6');
    },
    setContext: function (context) {
      this.setParams({context: context});
      this.context = context || '';
      return this;
    },
    getContext: function () {
      return this.context;
    },
    loadGrid: function () {
      this.showLoading();
      this.load();
      this.resizeView();
      this.hideLoading();
      FormUtils.showButton(this.$toolbar.CREATE, true);
      return this;
    },
    loadContextList: function (callback) {
      var __fn = callback || iNet.emptyFn;
      $.getJSON(this.url.context, {}, function (result) {
        __fn(result);
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.loading
      });
    },
    showCopyDialog: function () {
      var _this = this;
      this.loadContextList(function (contextList) {
        var __items = contextList.elements || [];
        var formHTML = '<div class="container-fluid"><div class="row"><div class="form-group">' +
            '<label class="ilabel col-md-4">Copy to context (<span class="required"></span>)</label>' +
            '<div class="col-md-8"><select id="clone-context" class="form-control col-md-12"></select></div>' +
            '</div></div></div>';
        var $formHtml = $(formHTML);
        var $cbbContext = $formHtml.find('#clone-context');
        for (var i = 0; i < __items.length; i++)
          if (__items[i] != _this.getContext())
            $cbbContext.append(String.format('<option value="{0}"><b>{0}</b></option>', __items[i]));
        _this.dialog = _this.confirmDlg('Sao chép', '', function () {
          _this.copyMenu(this.getEl().find('#clone-context').val(), function () {
            _this.dialog.hide();
            _this.dialog.destory();
          });
        });
        _this.dialog.setTitle('<i class="fa fa-clone blue"></i> ' + 'Sao chép');
        _this.dialog.setContent($formHtml[0].outerHTML);
        _this.dialog.show();
      });
    },
    copyMenu: function (toContext, callback) {
      var __fn = callback || iNet.emptyFn;
      var _this = this;
      $.postJSON(this.url.copy, {fromctx: this.getContext(), context: toContext}, function (result) {
        if (result.total > 0) {
          _this.success('Sao chép', 'Sao chép thành công.');
        } else {
          _this.error('Sao chép', 'Quá trình sao chép xảy ra lỗi.');
        }
        __fn(result);
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.acting
      });
    }
  });
});
