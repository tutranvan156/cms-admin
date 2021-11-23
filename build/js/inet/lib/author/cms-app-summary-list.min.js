// #PACKAGE: author
// #MODULE: cms-app-summary-list
//
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09/09/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ApplicationSummaryList
 * @author nbchicong
 */

$(function () {
  /**
   * @class iNet.ui.apps.ApplicationSummaryList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.apps.ApplicationSummaryList');
  iNet.ui.apps.ApplicationSummaryList = function (options) {
    var _this = this, __opts = options || {};
    var appStatus = status || AppConfig.MODE_PUBLISHED;
    iNet.apply(this, __opts);
    this.id = this.id || 'list-app-summary-wg';
    this.gridID = 'list-app-summary';
    this.module = 'apps';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.remote = true;
    this.filterType = AppConfig.TYPE_THEME;
    this.url = {
      list: iNet.getUrl('application/summary/list'),
      del: iNet.getUrl('application/summary/delete')
    };
    this.$toolbar = {
      CREATE: $('#list-btn-create')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'name',
        label: this.getText('name'),
        type: 'label'
      }, {
        property: 'type',
        label: this.getText('type'),
        width: 110,
        sortable: true,
        type: 'label',
        cls: 'hidden-320 text-center'
      }, {
        property: 'category',
        label: this.getText('name', 'category'),
        width: 150,
        sortable: true,
        type: 'label',
        cls: 'hidden-320 text-center'
      }, {
        property: 'version',
        label: this.getText('version'),
        width: 80,
        sortable: true,
        type: 'label',
        cls: 'hidden-320 text-center'
      }, {
        property: 'publishedDate',
        label: this.getText('publishedDate'),
        sortable: true,
        type: 'text',
        width: 150,
        renderer: function (v) {
          return new Date(v).format(iNet.fullDateFormat);
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: this.getText('del', 'button', '', iNet.resources.message),
          icon: 'fa fa-trash',
          labelCls: 'label label-important',
          fn: function(record) {
            _this.dialog = _this.confirmDlg(
                _this.getText('del_title', _this.getModule()),
                _this.getText('del_content', _this.getModule()), function () {
                  $.postJSON(_this.url.del, this.getOptions(), function (result) {
                    _this.dialog.hide();
                    if (iNet.isDefined(result.uuid)) {
                      _this.removeByID(result.uuid);
                      _this.success(_this.getText('del_title'), String.format(_this.getText('del_success'), '<b>'+_this.dialog.getOptions().name+'</b>'));
                    } else {
                      _this.error(_this.getText('del_title'), String.format(_this.getText('del_error'), '<b>'+_this.dialog.getOptions().name+'</b>'));
                    }
                  }, {
                    mask : _this.getMask(),
                    msg : iNet.resources.ajaxLoading.deleting
                  });
                });
            _this.dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            _this.dialog.setOptions(record);
            _this.dialog.show();
          }
        }]
      }],
      delay: 250
    });
    this.basicSearch = function () {
      this.id = 'list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      constructor: this.basicSearch,
      intComponent: function () {
        var qSearch = this;
        this.$qSearch = $.getCmp(this.id);
        this.$inputSearch = this.$qSearch.find('.grid-search-input');
        this.$btnFilterAll =  this.$qSearch.find('#btn-filter-all');
        this.$btnFilterTheme = this.$qSearch.find('#btn-filter-theme');
        this.$btnFilterPlugin = this.$qSearch.find('#btn-filter-plugin');
        this.$btnFilterApp = this.$qSearch.find('#btn-filter-app');
        this.$btnSearch = this.$qSearch.find('[data-action-search="search"]:first');
        this.$btnFilterAll.on('click', function () {
          qSearch.setActive(this);
          qSearch.setType('');
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnFilterTheme.on('click', function () {
          qSearch.setActive(this);
          qSearch.setType(AppConfig.TYPE_THEME);
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnFilterPlugin.on('click', function () {
          qSearch.setActive(this);
          qSearch.setType(AppConfig.TYPE_PLUGIN);
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnFilterApp.on('click', function () {
          qSearch.setActive(this);
          qSearch.setType(AppConfig.TYPE_APP);
          qSearch.$btnSearch.trigger('click');
        });
      },
      setActive: function (el) {
        var $el = $(el);
        var $parent = $el.parent();
        $parent.children().removeClass('active');
        $el.addClass('active');
      },
      getUrl: function () {
        return _this.url.list;
      },
      getId: function () {
        return this.id;
      },
      setType: function (type) {
        _this.filterType = type;
        this.type = type;
      },
      getType: function () {
        return this.type;
      },
      getData: function () {
        return {
          pageSize: 10,
          pageNumber: 0,
          keywords: this.$inputSearch.val(),
          type: this.getType(),
          status: appStatus
        };
      }
    });
    iNet.ui.apps.ApplicationSummaryList.superclass.constructor.call(this);
    this.$toolbar.CREATE.on('click', function () {
      _this.fireEvent(_this.getEvent('create'), _this.filterType, _this);
    });
    this.grid.on('click', function (record) {
      _this.fireEvent(_this.getEvent('open'), new iNet.ui.model.ApplicationSummary(record), _this);
    });
  };
  iNet.extend(iNet.ui.apps.ApplicationSummaryList, iNet.ui.ListAbstract);
});