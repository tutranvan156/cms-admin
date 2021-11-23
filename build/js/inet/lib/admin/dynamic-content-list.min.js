/**
 * #PACKAGE: admin
 * #MODULE: dynamic-content-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 14:12 20/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file DynamicContentList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.DynamicContentList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.DynamicContentList');
  iNet.ui.admin.DynamicContentList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'dynamic-content-list-wg';
    this.$element = $('#' + this.id);
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.gridID = this.gridID || 'list-dynamic-content';
    this.module = this.module || 'content';
    this.firstLoad = this.firstLoad || true;
    this.remote = this.remote || true;
    this.typeGroup = iNet.isDefined(this.typeGroup) ? this.typeGroup : CMSConfig.GROUP_LAND_TYPE;
    this.group = iNet.isDefined(this.group) ? this.group : CMSConfig.GROUP_LAND_TYPE;
    this.status = iNet.isDefined(this.status) ? this.status : CMSConfig.MODE_PUBLISHED;
    this.groups = this.groups || null;
    this.url = this.url || {
      list: ContentAPI.URL.LIST
    };
    this.toolbar = this.toolbar || {
      CREATE: $('#list-btn-create')
    };
    this.params = {
      pageSize: CMSConfig.PAGE_SIZE,
      pageNumber: 0,
      category: '',
      group: this.group,
      status: this.status,
      keyword: '',
      date: 0,
      all: true
    };
    this.dataSource = this.dataSource || new iNet.ui.grid.DataSource({
      columns: [{
        property: 'name',
        label: _this.getText('name'),
        type: 'label'
      }, {
        property: 'type',
        label: _this.getText('type'),
        type: 'label',
        width: 200,
        renderer: function (value) {
          if (_this.groups) {
            for (var i = 0; i < _this.groups.length; i++) {
              if (_this.groups[i].uuid === value)
                return _this.groups[i].name;
            }
          }
          return value;
        }
      }, {
        property: 'published',
        label: _this.getText('published'),
        type: 'label',
        width: 120,
        renderer: function (value) {
          return new Date(value).format(iNet.dateFormat);
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.del,
          icon: 'icon-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var uuid = record.uuid;
            _this.dialog = _this.confirmDlg(
                _this.getText('del_title'),
                _this.getText('del_content'), function () {
                  _this.dialog.hide();
                  ContentAPI.remove({uuid: uuid}, function (result) {
                    if (result.type !== CMSConfig.TYPE_ERROR) {
                      _this.success(_this.getText('del_title'), _this.getText('del_success'));
                      _this.getGrid().load();
                    }
                    else {
                      _this.error(_this.getText('del_title'), _this.getText('del_unsuccess'));
                    }
                  });
                }
            );
            _this.dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            _this.dialog.show();
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN);
          }
        }]
      }],
      delay: 250
    });

    iNet.ui.admin.DynamicContentList.superclass.constructor.call(this);

    this.toolbar.CREATE.on('click', function () {
      _this.fireEvent('create', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });
  };
  iNet.extend(iNet.ui.admin.DynamicContentList, iNet.ui.ListAbstract, {
    constructor: iNet.ui.admin.DynamicContentList
  });
});