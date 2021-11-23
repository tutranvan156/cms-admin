/**
 * #PACKAGE: admin
 * #MODULE: member-unit-list
 */
/**
 * Copyright (c) 2018 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * Date: 29/03/2018
 * Time: 7:38 AM
 * ---------------------------------------------------
 * Project: cms-admin
 * @name: MemberUnitList
 * @author: nbchicong
 */

$(function () {
  /**
   * @class iNet.ui.admin.MemberUnitList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.MemberUnitList');
  iNet.ui.admin.MemberUnitList = function (options) {
    var _this = this;
    iNet.apply(this, options);
    this.id = 'member-list-wg';
    this.gridID = 'member-unit-list';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.module = 'member';
    this.remote = true;
    this.firstLoad = false;

    this.toolbar = {
      BACK: $('#list-member-btn-back'),
      CREATE: $('#list-member-btn-create')
    };
    this.url = {
      list: iNet.getPUrl('cms/unit/member/list')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'fullname',
        label: _this.getText('fullname'),
        type: 'text',
        width: 200
      }, {
        property: 'title',
        label: _this.getText('title'),
        type: 'text',
        width: 180
      }, {
        property: 'industry',
        label: _this.getText('industry'),
        type: 'text'
      }, {
        property: 'phone',
        label: _this.getText('phone'),
        type: 'text',
        width: 120
      }, {
        property: 'email',
        label: _this.getText('email'),
        type: 'text',
        width: 180
      }, {
        property: 'displayIndex',
        label: _this.getText('displayIndex'),
        type: 'text',
        width: 50,
        renderer: function (v) {
          return parseInt(v);
        }
      }, {
        property: 'avatarImg',
        label: 'Hình đại diện',
        type: 'inputfile',
        align: 'center',
        width: 100,
        renderer: function (v) {
          if (v) {
            return '<img src="' + v + '" width="100px" />';
          }
          return '';
        }
      }, {
        type: 'action',
        align: 'left',
        buttons: [{
          text: iNet.resources.message.button.edit,
          icon: 'fa fa-pencil',
          fn: function (record) {
            // _this.edit(record);
            _this.fireEvent('edit',_this,record);
          }
        }, {
          text: iNet.resources.message.button.del,
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var dialog = _this.confirmDlg(
                _this.getText('del_title'),
                _this.getText('del_confirm'), function () {
                  this.hide();
                  UnitAPI.memberDelete(this.getData(), function (result) {
                    if (result.type !== CMSConfig.TYPE_ERROR) {
                      _this.success(_this.getText('del_title'), _this.getText('del_success'));
                      _this.getGrid().load();
                    } else {
                      _this.error(_this.getText('del_title'), _this.getText('del_error'));
                    }
                  });
                }
            );
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            dialog.setData({
              uuid: record.uuid,
              organization: record.organization
            });
            dialog.show();
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_ORG_STRUCTURE);
          }
        }]
      }]
    });
    iNet.ui.admin.MemberUnitList.superclass.constructor.call(this);
    this.toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back', _this);
    });
    this.toolbar.CREATE.on('click', function () {
      _this.fireEvent('create',_this,_this.getOrgId());
      // _this.newRecord();
    });
    // this.getGrid().on('save', function (record) {
    //   record.organization = _this.getOrgId();
    //   if (record.uuid) {
    //     UnitAPI.memberUpdate(convert2FormData(record), function (result) {
    //       if (result.type !== CMSConfig.TYPE_ERROR) {
    //         _this.update(result);
    //       }
    //     });
    //   } else {
    //     UnitAPI.memberCreate(convert2FormData(record), function (result) {
    //       if (result.type !== CMSConfig.TYPE_ERROR) {
    //       }
    //       _this.insert(result);
    //     });
    //   }
    // });
    // this.getGrid().on('update', function (record, oldData) {
    //   record = $.extend({}, oldData, record);
    //   record.organization = _this.getOrgId();
    //   if (record.uuid) {
    //     UnitAPI.memberUpdate(convert2FormData(record), function (result) {
    //       if (result.type !== CMSConfig.TYPE_ERROR) {
    //         _this.update(result);
    //       }
    //     });
    //   }
    // });
  };
  iNet.extend(iNet.ui.admin.MemberUnitList, iNet.ui.ListAbstract, {
    /**
     * @param orgId
     * @returns {iNet.ui.admin.MemberUnitList}
     */
    setOrgId: function (orgId) {
      this.orgId = orgId;
      this.setParams(iNet.apply({}, {
        group: orgId
      }, this.getParams()));
      return this;
    },
    getOrgId: function () {
      return this.orgId || '';
    }
  });

  // function convert2FormData(json) {
  //   var fd = new FormData();
  //   for (var key in json) {
  //     if (json.hasOwnProperty(key)) {
  //       if (key === 'avatarImg') {
  //         var avatar = json['avatarImg'];
  //         if (avatar && avatar.length > 0) {
  //           fd.append('avatar', avatar[0].file);
  //         }
  //       } else {
  //         fd.append(key, json[key]);
  //       }
  //     }
  //   }
  //   return fd;
  // }
});
