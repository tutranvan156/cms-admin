/**
 * #PACKAGE: review
 * #MODULE: cms-item-shared-review-list
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:48 13/12/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ItemSharedReviewList.js
 */
var modalId = '#category-modal';
$(function () {
  /**
   * @class iNet.ui.review.ItemSharedReviewList
   * @extends iNet.ui.author.ItemListAbstract
   */
  iNet.ns('iNet.ui.review.ItemSharedReviewList');
  iNet.ui.review.ItemSharedReviewList = function (options) {
    var _this = this;
    var cateModalEl = $(modalId);
    iNet.apply(this, options || {});
    this.id = this.id || 'review-share-wg';
    this.gridID = 'review-list-grid';
    this.module = 'review';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list: iNet.getPUrl('cms/itemshared/reviewlist')
    };
    this.selected = null;
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'subject',
        label: this.getText('name','post'),
        sortable: true,
        type: 'text'
      }, {
        property: 'writername',
        label: this.getText('owner','fqa'),
        sortable: true,
        type: 'text',
        width: 180
      }, {
        property: 'created',
        label: this.getText('date','post'),
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
          text: iNet.resources.message.button.approve,
          icon: 'fa fa-check',
          labelCls: 'label label-success',
          visibled: function (record) {
            console.log(!record.reviewed, _this.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER));
            return !record.reviewed
                && _this.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER);
          },
          fn: function(record) {
            _this.selected = record;
            cateModalEl.modal('show');
          }
        }, {
          text: _this.getText('unpublish', 'published'),
          icon: 'fa fa-times',
          labelCls: 'label label-important',
          visibled: function (record) {
            return record.reviewed
                && _this.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER);
          },
          fn: function(record) {
            ItemAPI.rejectedItemShared({
              uuid: record.uuid,
              prefix: record.firm,
              site: record.site
            }, function (result) {
              var __result = result || {};
              if (iNet.isDefined(__result)) {
                _this.success(_this.getText('allow_publish'), _this.getText('approved_item_shared'));
                _this.update(record);
              } else {
                _this.error(_this.getText('allow_publish'), _this.getText('approve_item_shared_error'));
              }
            });
          }
        }]
      }],
      delay : 250
    });
    this.basicSearch = function () {
      this.id = 'review-list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var qSearch = this;
        this.$qSearch = $.getCmp(this.id);
        this.$inputSearch = $('#list-published-keyword-txt');
        this.$btnSearch = this.$qSearch.find('[data-action-search="search"]:first');
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.$inputSearch.val()
        };
      }
    });

    this.convertData = convertData;

    iNet.ui.review.ItemSharedReviewList.superclass.constructor.call(this);

    cateModalEl.on('click', '[action="ok"]', function () {
      cateModalEl.modal('hide');
      if (_this.selected) {
        var params = {
          uuid: _this.selected.uuid,
          prefix: _this.selected.firm,
          site: _this.selected.site,
          category: cateModalEl.find('#cbb-category').val()
        };
        ItemAPI.approvedItemShared(params, function (result) {
          var __result = result || {};
          if (iNet.isDefined(__result.uuid)) {
            _this.success(_this.getText('allow_publish'), _this.getText('approved_item_shared'));
            __result.reviewed = true;
            _this.update(__result);
          } else {
            _this.error(_this.getText('allow_publish'), _this.getText('approve_item_shared_error'));
          }
        });
      }
    });
  };
  iNet.extend(iNet.ui.review.ItemSharedReviewList, iNet.ui.author.ItemListAbstract);

  function convertData(data) {
    var reviewed = ItemAPI.loadReviewed();
    (data.items || []).forEach(function (item) {
      item.reviewed = (reviewed.indexOf(item.uuid) !== -1);
    });
    return data.items || [];
  }
});
