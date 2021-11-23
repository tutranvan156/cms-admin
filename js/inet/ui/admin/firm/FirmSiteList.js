/**
 * #PACKAGE: admin
 * #MODULE: firm-site-list
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 16:23 04/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file FirmSiteList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.FirmSiteList
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin', 'iNet.ui.admin.FirmSiteList');
  iNet.ui.admin.FirmSiteList = function (options) {
    var _this = this;
    var adminPage = 'cmsadmin/page/index';
    iNet.apply(this, options || {});
    this.id = this.id || 'site-list-wg';
    this.module = 'site';
    this.gridID = 'site-list';
    this.$toolbar = {
      CREATE: $('#site-list-add-btn'),
      EDIT: $('#site-list-edit-btn'),
      GO_HOME: $('#site-list-go-home-btn')
    };
    this.$createModal = $('#modal-create-site');
    this.url = {
      list: AjaxAPI.getPUrl('cmsdesign/firm/list'),
      listTheme: AjaxAPI.getPUrl('cmsdesign/sitepublished'),
      verifyPrefix: AjaxAPI.getPUrl('cmsdesign/prefix/verify'),
      gohome: iNet.getUrl('page/home')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'prefix',
        label: 'Prefix',
        sortable: true,
        type: 'text',
        width: 200,
        validate: function (v) {
          if (!v)
            return 'Bạn chưa nhập prefix!';

          if (_this.getRecord().uuid && _this.getRecord().prefix !== v)
            return 'Bạn không được thay đổi prefix khi cập nhật!';

          if (_this.getRecord().prefix !== v && FirmAPI.verifyPrefix({prefix: v}))
            return 'Prefix này đã tồn tại. Vui lòng chọn một prefix khác!';
        }
      }, {
        property: 'brief',
        label: 'Brief',
        sortable: true,
        type: 'text'
      }, {
        property: 'theme',
        label: 'Giao diện',
        width: 300,
        sortable: true,
        type: 'selectx',
        valueField: 'name',
        displayField: 'brief',
        cls: 'hidden-767',
        original: true,
        renderer: function (code) {
          return '<span><b>' + code + '</b></span>';
        },
        config: {
          placeholder: 'Chọn site mẫu',
          multiple: false,
          initSelection: function (element, callback) {
            var currentCode = element.val();
            if (currentCode) {
              $.ajax(_this.url.listTheme, {
                data: {},
                dataType: 'JSON'
              }).done(function (data) {
                bindSelected(currentCode, (data.items || []));
              });
            }

            function bindSelected(currentCode, items) {
              for (var i = 0; i < items.length; i++) {
                var item = items[i] || {};
                if (currentCode === item.name) {
                  callback(item);
                  break;
                }
              }
            }
          },
          formatResult: function (item) {
            return '<span><b>' + item.name + '</b></span>';
          },
          formatSelection: function (item) {
            return '<span><b>' + item.name + '</b></span>';
          },
          ajax: {
            placeholder: 'Tìm kiếm site mẫu',
            url: _this.url.listTheme,
            dataType: 'JSON',
            quietMillis: 100,
            data: function (term) {
              return term;
            },
            results: function (data) {
              return {
                results: data.items || []
              };
            }
          },
          escapeMarkup: function (m) {
            return m;
          }
        },
        validate: function (v) {
          if (!v)
            return 'Site template must not be empty';
        }
      }, {
        label: '',
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.edit,
          icon: 'icon-pencil',
          fn: function (record) {
            _this.setRecord(record);
            _this.getGrid().edit(record.uuid);
          },
          visibled: function (data) {
            var __data = data || {};
            return !!__data.prefix;
          }
        }, {
          text: 'Thành viên',
          icon: 'fa fa-users',
          labelCls: 'label label-info',
          fn: function (record) {
            _this.fireEvent('member_list', record, _this);
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_SUP_ADMIN);
          }
        }, {
          text: 'Trang quản trị',
          icon: 'fa fa-user-secret',
          labelCls: 'label label-info',
          fn: function (record) {
            window.open(AjaxAPI.getPUrl(adminPage, null, record.prefix), '_blank');
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_SUP_ADMIN);
          }
        }, {
          text: 'Xem trước',
          icon: 'fa fa-external-link-square',
          labelCls: 'label label-success',
          fn: function (record) {
            window.open(AjaxAPI.getPUrl(record.pageIndex, null, record.prefix), '_blank');
          },
          visibled: function (data) {
            var __data = data || {};
            return !!__data.pageIndex && __data.enabled;
          }
        }, {
          text: iNet.resources.message.button.del,
          icon: 'icon-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            _this.setRecord(record);
            var dialog = _this.confirmDlg('', '', function () {
              var params = this.getOptions();
              this.hide();
              _this.showLoading();
              FirmAPI.removeSite(params, function (result) {
                if (result.prefix === params.prefix) {
                  _this.removeRecord(record);
                  _this.success(
                      'Xóa site',
                      String.format('Bạn đã xóa thành công site', _this.getRecord().prefix)
                  );
                } else {
                  _this.error(
                      'Xóa site',
                      String.format('Xóa site xảy ra lỗi', _this.getRecord().prefix)
                  );
                }
                _this.hideLoading();
              });
            });
            dialog.setTitle('<i class="fa fa-trash red"></i> Xóa site');
            dialog.setOptions({prefix: record.prefix});
            dialog.show();
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_SUP_ADMIN);
          }
        }]
      }]
    });
    this.convertData = function (data) {
      var listSite = [];
      _this.grid.setTotal(data.total || 0);
      (data.items || []).forEach(function (item) {
        if ((item.application || []).length > 0) {
          item.theme = item.application[0].theme;
          item.pageIndex = item.application[0].pageIndex;
        }
        listSite.push(item);
      });
      return listSite;
    };
    iNet.ui.admin.FirmSiteList.superclass.constructor.call(this);
    this.grid.on('save', function (data) {
      var __data = data || {};
      if (__data.theme && __data.prefix) {
        __data.name = data.theme;
        _this.showLoading();
        FirmAPI.createSite(__data, function (result) {
          var __result = result || {};
          if (__result.type !== 'ERROR') {
            _this.insert(__result);
          } else {
            _this.error(
                'Tạo site',
                'Tạo site xảy ra lỗi'
            );
          }
          _this.hideLoading();
        });
      }
    });
    this.grid.on('update', function (newData, oldData) {
      var __data = iNet.apply(oldData, newData) || {};
      __data.name = __data.theme;
      console.log('data_update: ', __data);
      delete __data['application'];
      _this.showLoading();
      FirmAPI.updateSite(__data, function (result) {
        var __result = result || {};
        if (__result.type !== 'ERROR') {
          _this.update(__result);
        } else {
          _this.error(
              'Cập nhật site',
              'Cập nhật site xảy ra lỗi'
          );
        }
        _this.hideLoading();
      });
    });
    this.grid.on('blur', function (action, control) {
      if (action === 'update') {
        _this.grid.endEdit();
      } else {
        control.save();
      }
    });
    this.$toolbar.CREATE.on('click', function () {
      _this.setRecord({});
      _this.newRecord();
    });
  };
  iNet.extend(iNet.ui.admin.FirmSiteList, iNet.ui.ListAbstract, {
    setRecord: function (record) {
      this.cache.record = record;
    },
    getRecord: function () {
      return this.cache.record;
    }
  });
});
