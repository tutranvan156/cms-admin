/**
 * #PACKAGE: admin
 * #MODULE: firm-member-list
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 16:41 04/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file FirmMemberList.js
 */
$(function () {
  var SPLITER = ',';
  var ignoredRole = ['$cloud_marketplace', '$admin_online_exchange', '$manager_online_exchange', '$online_exchange'];

  /**
   * Init cached manager
   */
  var cached        = {},
      timeCached    = 5 * 60 * 1000,
      MEMBER_CACHED = '__firm_members',
      ROLES_CACHED  = '__firm_roles';

  function setCache(key, data, clear) {
    if (hasCache(key))
      if (clear)
        delete cached[key];

    cached[key] = {
      data: data,
      time: new Date().getTime()
    };
  }

  function getCache(key) {
    if (hasCache(key))
      return cached[key] && cached[key]['data'];

    return null;
  }

  function hasCache(key) {
    return cached[key] && (new Date().getTime() - cached[key].time <= timeCached);
  }

  setInterval(function () {
    for (var key in cached) {
      if (cached.hasOwnProperty(key) && (new Date().getTime() - cached[key].time > timeCached))
        delete cached[key];
    }
  }, timeCached);

  /**
   * @class iNet.ui.admin.FirmMemberList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin','iNet.ui.admin.FirmMemberList');
  iNet.ui.admin.FirmMemberList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'site-members-wg';
    this.module = 'site';
    this.gridID = 'member-list';
    this.firstLoad = false;
    this.$toolbar = {
      BACK: $('#btn-site-members-back'),
      CREATE: $('#btn-site-members-add')
    };
    this.url = {
      list: AjaxAPI.getPUrl('cmsfirm/member/list'),
      search: AjaxAPI.getPUrl('subfirm/account/search'),
      roles: AjaxAPI.getPUrl('cmsdesign/member/role')
    };
    var columnRole = {
      property: 'accRole',
      label: 'Quyền hạn',
      sortable: true,
      type: 'selectx',
      valueField: 'role',
      displayField: 'name',
      width: 300,
      original: true,
      renderer: function (v) {
        var html = v;
        if (v) {
          var data = null;
          if (hasCache(ROLES_CACHED))
            data = getCache(ROLES_CACHED);
          else
            AjaxAPI.ajax({
              async: false,
              data: {},
              url: _this.url.roles,
              success: function (result) {
                console.log('result',result);
                data = convertRolesList(result);
                setCache(ROLES_CACHED, data, true);
              }
            });

          if (iNet.isArray(data) && !iNet.isEmpty(data)) {
            html = '';
            var value = [];
            (v || []).forEach(function (role) {
              value.push(role.role);
            });
            for (var i = 0; i < data.length; i++) {
              var item = data[i];
              if (value.indexOf(item.role) > -1 && ignoredRole.indexOf(item.role) === -1)
                html += '<label class="label label-info" title="' + item.role + '">' + item.name + '</label>';
            }
          }
        } else
          html = '<i class="fa fa-frown-o"></i> Chưa được cấp quyền';
        return html;
      },
      config: {
        placeholder: 'Chọn quyền',
        multiple: true,
        initSelection: function (element, callback) {
          var currentValue = element.val();
          if (currentValue) {
            currentValue = currentValue.split(SPLITER);
            if (hasCache(ROLES_CACHED))
              bindSelected(currentValue, getCache(ROLES_CACHED));
            else {
              $.ajax(_this.url.roles, {
                data: {
                  keyword: ''
                },
                dataType: 'JSON'
              }).done(function (data) {
                console.log('data1',data);
                var items = convertRolesList(data);
                setCache(ROLES_CACHED, items, true);
                bindSelected(currentValue, items);
              });
            }

            /**
             * @param {Array} current
             * @param items
             */
            function bindSelected(current, items) {
              var list = [];
              for (var i = 0; i < items.length; i++) {
                var item = items[i] || {};
                if (current.indexOf(item.role) > -1 && ignoredRole.indexOf(item.role) === -1)
                  list.push(item);
              }
              callback(list);
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
          placeholder: 'Tìm kiếm quyền',
          url: _this.url.roles,
          dataType: 'JSON',
          quietMillis: 100,
          data: function (term) {
            return {};
          },
          results: function (data) {
            console.log('data2',data);
            return {
              results: convertRolesList(data)
            };
          }
        },
        escapeMarkup: function (m) {
          return m;
        }
      }
    };
    var columnAccount = {
      property: 'member',
      label: 'Tài khoản',
      sortable: true,
      type: 'text',
      width: 250,
      validate: function (v) {
        if (!v)
          return 'Bạn chưa nhập tài khoản!';

        if (!iNet.isEmail(v))
          return 'Tài khoản phải là một email!';

        if (!FirmAPI.verifyAccount({account: v}))
          return 'Tài khoản không tồn tại trên hệ thống!';
      }
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [columnAccount, {
        property: 'fullname',
        label: 'Tên thành viên',
        sortable: true,
        type: 'text',
        validate: function (v) {
          if (!v)
            return 'Bạn chưa nhập tên thành viên!';
        }
      }, columnRole, {
        property: 'activated',
        label: 'Trạng thái',
        align: 'center',
        cls: 'text-center',
        type: 'checkbox',
        width: 80
      }, {
        label: '',
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.edit,
          icon: 'icon-pencil',
          fn: function (record) {
            console.log('recordEdit',record);
            _this.edit(record);
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_SUP_ADMIN);
          }
        }, {
          text: iNet.resources.message.button.del,
          icon: 'icon-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var dialog = _this.confirmDlg('', '', function () {
              var params = this.getOptions();
              this.hide();
              _this.showLoading();
              FirmAPI.removeMember(params, function (result) {
                _this.removeRecord(result);
                _this.hideLoading();
                _this.success('Xóa thành viên', 'Xóa thành viên thành công');
              });
            });
            dialog.setTitle('<i class="fa fa-trash red"></i> Xóa thành viên');
            dialog.setOptions({
              prefix: _this.getPrefix(),
              members: JSON.stringify({usercode: record.member})
            });
            dialog.show();
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_SUP_ADMIN);
          }
        }]
      }]
    });
    this.convertData = function (data) {
      var items = data.items || [];
      items.forEach(function (item) {
        item.accRole = convertRole(item.roles);
      });
      return items;
    };

    /**
     * @param roles
     * @returns {Array}
     */
    function convertRole(roles) {
      var accRole = [];
      (roles || []).forEach(function (role) {
        accRole.push(getRole(role));
      });
      return accRole;
    }

    /**
     * @param role
     * @returns {Object}
     */
    function getRole(role) {
      var name = role;
      if (hasCache(ROLES_CACHED)) {
        var roleSearch = getCache(ROLES_CACHED);
        for (var i = 0; i < roleSearch.length; i++)
          if (role === roleSearch[i].role) {
            name = roleSearch[i].name;
            break;
          }
      }
      return {role: role, name: name};
    }

    /**
     * @param {Object} data
     * @returns {Array}
     */
    function convertRolesList(data) {
      var list = [];
      for (var key in (data || {})) {
        if (data.hasOwnProperty(key) && ignoredRole.indexOf(key) === -1)
          list.push({role: key, name: iNet.resources.cmsadmin.roles[getRoleKey(key)]});
      }
      return list;
    }

    /**
     * @param role
     * @returns {string|*}
     */
    function getRoleKey(role) {
      console.log('role',role)
      var _role = role || "";
      if(_role.startsWith("$")) {
        _role = _role.substr(1, _role.length);
      }
      return _role;
    }

    iNet.ui.admin.FirmMemberList.superclass.constructor.call(this);
    this.getGrid().on('save', function (data) {
      console.log('dataEdit',data);
      var __data = data || {};
      if (__data.member) {
        __data.usercode = __data.member;
        __data.prefix = _this.getPrefix();
        __data.roles = __data.accRole.join(SPLITER);
        _this.showLoading();
        FirmAPI.addMember({
          prefix: _this.getPrefix(),
          members: JSON.stringify(__data)
        }, function (result) {
          var __result = result || {};
          if (__result.type !== 'ERROR') {
            __data.accRole = convertRole(__data.accRole);
            _this.insert(__data);
          } else {
            _this.error(
                'Tạo thành viên',
                'Tạo thành viên xảy ra lỗi'
            );
          }
          _this.hideLoading();
        });
      }
    });
    this.getGrid().on('update', function (newData, oldData) {
      var __data = iNet.apply(oldData, newData) || {};
      __data.usercode = __data.member;
      __data.roles = __data.accRole.join(SPLITER);
      _this.showLoading();
      FirmAPI.updateMember({
        prefix: _this.getPrefix(),
        members: JSON.stringify(__data)
      }, function (result) {
        var __result = result || {};
        if (__result.type !== 'ERROR') {
          __data.accRole = convertRole(__data.accRole);
          _this.update(__data);
        } else {
          _this.error(
              'Cập nhật thành viên',
              'Cập nhật thành viên xảy ra lỗi'
          );
        }
        _this.hideLoading();
      });
    });
    this.getGrid().on('blur', function (action, control) {
      if (action === 'update') {
        _this.getGrid().endEdit();
      } else {
        control.save();
      }
    });
    this.$toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back', _this);
    });
    this.$toolbar.CREATE.on('click', function () {
      _this.newRecord();
    });
  };
  iNet.extend(iNet.ui.admin.FirmMemberList, iNet.ui.ListAbstract, {
    setPrefix: function (prefix) {
      this.prefix = prefix;
      this.setParams({prefix: prefix});
    },
    getPrefix: function () {
      return this.prefix;
    }
  });
});
