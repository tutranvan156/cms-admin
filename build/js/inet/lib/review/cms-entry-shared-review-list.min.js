/**
 * #PACKAGE: review
 * #MODULE: cms-entry-shared-review-list
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
   * @class iNet.ui.review.OldEntrySharedReviewList
   * @extends iNet.ui.author.ItemListAbstract
   */
  iNet.ns('iNet.ui.review.OldEntrySharedReviewList');
  iNet.ui.review.OldEntrySharedReviewList = function (options) {
    var _this = this;
    var cateModalEl = $(modalId);
    iNet.apply(this, options || {});
    this.id = this.id || 'review-share-wg';
    this.gridID = 'review-list-grid';
    this.idProperty = 'entryId';
    this.module = 'review';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list: iNet.getPUrl('subportal/review/list')
    };
    this.cbbSubPortalEl = $('#cbb-subportal-config');
    this.selected = null;
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'title',
        label: this.getText('name','post'),
        sortable: true,
        type: 'text'
      }, {
        property: 'firmName',
        label: this.getText('firm'),
        sortable: true,
        type: 'text',
        width: 250,
        renderer: function (v) {
          return '<span class="badge badge-info">' + v + '</span>';
        }
      }, {
        property: 'publishDate',
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
            ItemAPI.rejectedOldItem({
              uuid: record.entryId,
              prefix: record.prefix
            }, function (result) {
              if (result.type !== 'ERROR') {
                _this.success(_this.getText('allow_publish'), _this.getText('approved_item_shared'));
                record.reviewed = false;
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

    this.convertData = convertData;

    iNet.ui.review.OldEntrySharedReviewList.superclass.constructor.call(this);

    this.cbbSubPortalEl.on('change', function () {
      _this.setParams(iNet.apply(_this.getGrid().getParams(), {prefix: this.value}));
      _this.load();
    });

    cateModalEl.on('click', '[action="ok"]', function () {
      cateModalEl.modal('hide');
      if (_this.selected) {
        var params = {
          uuid: _this.selected.entryId,
          prefix: _this.selected.prefix,
          category: cateModalEl.find('#cbb-category').val()
        };
        ItemAPI.approvedOldItem(params, function (result) {
          if (result.type !== 'ERROR') {
            _this.success(_this.getText('allow_publish'), _this.getText('approved_item_shared'));
            _this.selected.reviewed = true;
            _this.update(_this.selected);
          } else {
            _this.error(_this.getText('allow_publish'), _this.getText('approve_item_shared_error'));
          }
        });
      }
    });
  };
  iNet.extend(iNet.ui.review.OldEntrySharedReviewList, iNet.ui.author.ItemListAbstract);

  function convertData(data) {
    var reviewed = ItemAPI.loadReviewed(true);
    var results = [];
    (data || []).forEach(function (portal) {
      (portal.data.items || []).forEach(function (item) {
        item.reviewed = (reviewed.indexOf(item.entryId) !== -1);
        results.push(item);
      });
    });
    return results;
  }
});