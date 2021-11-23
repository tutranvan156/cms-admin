/**
 * #PACKAGE: admin
 * #MODULE: cms-super-context-list
 */
/**
 * Copyright (c) 2016 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 2:28 PM 19/05/2016.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file MenuContextList.js
 */
$(function () {
  /**
   * @class iNet.ui.superad.MenuContextList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.superad.MenuContextList');
  iNet.ui.superad.MenuContextList = function (config) {
    var _this = this;
    iNet.apply(this, config || {});
    _this.id = _this.id || 'context-list-wg';
    _this.qSreachId = 'context-basic-search';
    _this.listId = 'list-context';
    _this.url = {
      list: iNet.getUrl('cmsdesign/themename')
    };
    _this.module = 'menu_context';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    /**
     * @class BasicSearch
     * @extends iNet.ui.list.AbstractListSearchForm
     */
    var BasicSearch = function () {
      this.id = _this.qSreachId;
      this.url = _this.url.list;
      BasicSearch.superclass.constructor.call(this);
    };
    iNet.extend(BasicSearch, iNet.ui.list.AbstractListSearchForm, {
      intComponent: function () {
        this.$keyword = $.getCmp('txt-basic-search-keyword');
      },
      getData: function () {
        return {
          keyword: this.$keyword.val(),
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0
        };
      }
    });
    _this.listContext = new iNet.ui.list.ListView({
      id: _this.listId,
      url: _this.url.list,
      firstLoad: true,
      htop: 41,
      pageSize: CMSConfig.PAGE_SIZE,
      basicSearch: BasicSearch,
      convertData: function (result) {
        result.items = [];
        (result.elements || []).forEach(function (item) {
          result.items.push(_this.convertItem(item));
        });
        return result;
      },
      renderer: function (item) {
        if(!iNet.isEmpty(item)) {
          var __item = item || {};
          var __html = String.format('<div {0}="{1}" class="messageListItem">', this.idAttribute, __item[this.getIdProperty()]);
          __html += '<div class="sidebarParent">&nbsp;</div>';
          __html += '<div class="delimiter"></div>';
          __html += '<div class="wrapper">';
          __html += '<div class="checkedParent">';
          __html += '<label>';
          __html += String.format('<input type="checkbox" class="ace" value="{0}">', __item[this.getIdProperty()]);
          __html += '<span class="lbl"></span>';
          __html += '</label>';
          __html += '</div>';
          __html += String.format('<div class="senderParent"><span class="sender"><strong>{0}</strong></span></div>', __item.name);
          __html += String.format('<div class="subjectParent actionHandle dragHandle"><span class="subject">{0}</span></div>', '');
          __html += '</div>';
          __html += '</div>';
          return __html;
        }
        return '';
      }
    });
    iNet.ui.superad.MenuContextList.superclass.constructor.call(_this);
    _this.getList().on('open', function (id, data, node) {
      _this.fireEvent(_this.getEvent('open'), id, data, node, _this);
    });
  };
  iNet.extend(iNet.ui.superad.MenuContextList, iNet.ui.WidgetExt, {
    convertItem: function (item) {
      return iNet.apply({}, {name: item, uuid: iNet.generateUUID()})
    },
    getList: function () {
      return this.listContext;
    }
  });
});
