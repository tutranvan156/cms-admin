
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17:08 20/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file LandList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.LandList
   * @extends iNet.ui.admin.DynamicContentList
   */
  iNet.ns('iNet.ui.admin.LandList');
  iNet.ui.admin.LandList = function (options) {
    var _this = this;
    iNet.apply(this, options);
    this.id = 'land-list-wg';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.gridID = 'list-land';
    this.firstLoad = false;
    this.typeGroup = this.typeGroup || CMSConfig.GROUP_LAND_TYPE;
    this.group = CMSConfig.GROUP_LAND;
    this.module = 'land';

    this.basicSearch = function () {
      this.id = 'list-basic-search';
      this.url = _this.url.list;
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var cbbYearSelectEl = this.getEl().find('#cbb-search-year');
        var txtKeywordEl = this.getEl().find('.grid-search-input');
        var btnSearchEl = this.getEl().find('[data-action-search="search"]');
        cbbYearSelectEl.on('change', function () {
          _this.params.date = this.value;
          btnSearchEl.trigger('click');
        });
        txtKeywordEl.on('change', function () {
          _this.params.keyword = this.value;
          btnSearchEl.trigger('click');
        });
      },
      getData: function () {
        return _this.params;
      }
    });

    iNet.ui.admin.LandList.superclass.constructor.call(this);

    ContentAPI.list({group: this.typeGroup}, function (results) {
      _this.groups = results.items || [];
      _this.load();
    });
  };
  iNet.extend(iNet.ui.admin.LandList, iNet.ui.admin.DynamicContentList);
});