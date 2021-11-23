/**
 * #PACKAGE: document
 * #MODULE: draft-comment-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 14:49 10/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file DraftCommentList.js
 */
$(function () {
  /**
   * @class iNet.ui.document.DraftCommentList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.document.DraftCommentList');
  iNet.ui.document.DraftCommentList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'list-allowed-wg';
    this.gridID = 'list-allowed';
    this.remote = true;
    this.firstLoad = false;
    this.module = 'document';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.$toolbar = {
      BACK: $('#allowed-btn-back')
    };

    this.url = {
      list: iNet.getPUrl('draft/document/cmmlist')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'message',
        label: this.getText('content', 'comment'),
        type: 'label'
      }, {
        property: 'author',
        label: this.getText('owner', 'fqa'),
        type: 'label',
        width: 200
      }]
    });


    /**
     * @constructor
     * @class BasicSearch
     * @extends iNet.ui.grid.Search
     */
    var BasicSearch = function () {
      this.id = 'list-basic-search-allowed';
    };
    iNet.extend(BasicSearch, iNet.ui.grid.Search, {
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val() || '',
          uuid: _this.getUuid(),
          authorUnitCode: _this.getAuthorUnitCode()
        };
      }
    });
    iNet.ui.document.DraftCommentList.superclass.constructor.call(this);
    this.$toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back_content', _this);
    });
    this.getGrid().on('click', function (record) {
      _this.fireEvent('view_content', {
        commentId: record.uuid,
        uuid: _this.getUuid(),
        authorUnitCode: _this.getAuthorUnitCode()
      }, _this);
    });
  };
  iNet.extend(iNet.ui.document.DraftCommentList, iNet.ui.ListAbstract, {
    load: function () {
      var _this = this;
      this.getGrid().setParams({
        pageSize: CMSConfig.PAGE_SIZE,
        pageNumber: 0,
        keyword: '',
        uuid: _this.getUuid(),
        authorUnitCode: _this.getAuthorUnitCode()
      });
      this.getGrid().load();
    },
    setUuid: function (x) {
      this.__uuid = x;
    },
    getUuid: function () {
      return this.__uuid;
    },
    setPublisherCode: function (x) {
      this.organId = x;
    },
    getPublisherCode: function () {
      return this.organId || '';
    },
    setAuthorUnitCode: function (x) {
      this.unitCode = x;
    },
    getAuthorUnitCode: function () {
      return this.unitCode || '';
    }
  });
});
