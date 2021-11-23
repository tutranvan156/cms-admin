/**
 * #PACKAGE: review
 * #MODULE: cms-entry-shared-review-content
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:38 13/12/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file OldEntrySharedReviewContent.js
 */
$(function () {
  /**
   * @class iNet.ui.review.OldEntrySharedReviewContent
   * @extends iNet.ui.author.ItemCompose
   */
  iNet.ns('iNet.ui.review.OldEntrySharedReviewContent');
  iNet.ui.review.OldEntrySharedReviewContent = function (options) {
    var _this = this;
    var cateModalEl = $(modalId);
    iNet.apply(this, options || {});
    this.id = this.id || 'review-shared-content-wg';
    this.resourceRoot = iNet.resources.cmsadmin;
    this.module = 'review';
    this.type = 'REVIEWER';

    this.btn = {
      approved: $('#btn-content-approved'),
      rejected: $('#btn-content-rejected')
    };

    this.iframeEl = $('#iframe-entry');

    iNet.ui.review.OldEntrySharedReviewContent.superclass.constructor.call(this);

    this.btn.approved.click(function () {
      cateModalEl.modal('show');
    });

    this.btn.rejected.click(function () {
      var record = _this.getPost();
      ItemAPI.rejectedOldItem({
        uuid: record.entryId,
        prefix: record.prefix
      }, function (result) {
        if (result.type !== 'ERROR') {
          _this.success(_this.getText('allow_publish'), _this.getText('approved_item_shared'));
          record.reviewed = false;
          _this.hide();
          _this.fireEvent('rejected', record, _this);
        } else {
          _this.error(_this.getText('allow_publish'), _this.getText('approve_item_shared_error'));
        }
      });
    });

    cateModalEl.on('click', '[action="ok"]', function () {
      cateModalEl.modal('hide');
      var record = _this.getPost();
      if (record) {
        var params = {
          uuid: record.entryId,
          prefix: record.prefix,
          category: cateModalEl.find('#cbb-category').val()
        };
        ItemAPI.approvedOldItem(params, function (result) {
          if (result.type !== 'ERROR') {
            _this.success(_this.getText('allow_publish'), _this.getText('approved_item_shared'));
            record.reviewed = true;
            _this.checkShowBtn(result);
            _this.fireEvent('reviewed', record, _this);
          } else {
            _this.error(_this.getText('allow_publish'), _this.getText('approve_item_shared_error'));
          }
        });
      }
    });
  };
  iNet.extend(iNet.ui.review.OldEntrySharedReviewContent, iNet.ui.author.ItemCompose, {
    loadReview: function (record) {
      this.disableShare();
      if (record) {
        this.setData(record);
        this.checkShowBtn(record.entryId);
      }
    },
    setData: function (data) {
      this.setPost(data);
      var url = '{0}{1}/-/view_content/content/{2}/{3}';
      url = String.format(url, data.domain, data.friendlyUrl, data.entryId, data.urlTitle);
      this.iframeEl.attr('src', url);
    },
    disableShare: function () {
      FormUtils.showButton(this.$toolbar.CREATE, false);
      FormUtils.showButton(this.$toolbar.SAVE, false);
      FormUtils.showButton(this.$toolbar.SEND, false);
      FormUtils.showButton(this.$toolbar.SEND_LIST, false);
      FormUtils.showButton(this.$toolbar.REMOVED, false);
      FormUtils.showButton(this.$toolbar.PUBLISH, false);
      FormUtils.showButton(this.$toolbar.REJECTED, false);
    },
    checkShowBtn: function (uuid) {
      var isShared = ItemAPI.isShared(uuid, true);
      FormUtils.showButton(this.btn.approved, !isShared);
      FormUtils.showButton(this.btn.rejected, isShared);
    }
  });
});