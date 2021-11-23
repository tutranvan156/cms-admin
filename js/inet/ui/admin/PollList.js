/**
 * #PACKAGE: admin
 * #MODULE: cms-poll-list
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:25 AM 28/10/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file PollList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.PollList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.PollList');
  iNet.ui.admin.PollList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'poll-list-wg';
    this.gridID = this.gridID || 'list-poll';
    this.module = 'poll';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    this.url = {
      list: AjaxAPI.getPUrl('cms/poll/search'),
      active: AjaxAPI.getPUrl('cms/poll/active')
    };

    this.toolbar = {
      CREATE: $('#list-btn-create')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'subject',
        label: this.getText('subject','post'),
        type: 'label',
        width:170
      }, {
        property: 'fullname',
        label: this.getText('creator'),
        sortable: true,
        type: 'label',
        width: 230
      }, {
        property: 'created',
        label: this.getText('date', 'post'),
        sortable: true,
        type: 'label',
        width: 150,
        renderer: function (v) {
          return new Date(v).format(iNet.fullDateFormat);
        }
      },{
        property: 'activate',
        label: 'Kích hoạt',
        width: 100,
        sortable: false,
        type: 'switches',
        typeCls: 'switch-7',
        cls: 'text-center',
        renderer: function (value) {
          return value;
        },
        onChange: function (record, activate) {
          var __record = record || {};
            $.postJSON(_this.url.active,{uuid:__record.uuid,active:activate},function(result) {
              _this.getGrid().reload();
            });
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.del,
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function(record) {
            var dialog = _this.confirmDlg(
                _this.getText('del_title'),
                _this.getText('del_content'),
                function () {
                  PollAPI.remove(this.getData(), function (result) {
                    if (result && result.uuid) {
                      _this.removeRecord(result);
                      _this.success(_this.getText('del_title'), _this.getText('del_success'));
                    }
                    else
                      _this.error(_this.getText('del_title'), _this.getText('del_error'));
                  });
                  this.hide();
                });
            dialog.setData({uuid: record.uuid});
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            dialog.show();
          }
        }]
      }],
      delay: 250
    });

    /**
     * @class BasicSearch
     * @extends iNet.ui.grid.Search
     */
    var BasicSearch = function () {
      this.id = 'list-basic-search';
    };
    iNet.extend(BasicSearch, iNet.ui.grid.Search, {
      intComponent: function () {
        this.inputSearch = this.getEl().find('.grid-search-input');
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val()
        };
      }
    });

    this.basicSearch = BasicSearch;

    iNet.ui.admin.PollList.superclass.constructor.call(this);

    this.toolbar.CREATE.on('click', function () {
      _this.fireEvent('create', _this);
    });

    this.getGrid().on('click', function (record) {
      _this.fireEvent('open', record, _this);
    });

    //Remove searched, cleared & changed  events handler when implement basic search to grid
    this.getGrid().$searchcontrol.off('searched cleared');
    this.getGrid().$filtercontrol.off('changed');

  };
  iNet.extend(iNet.ui.admin.PollList, iNet.ui.ListAbstract);
});
