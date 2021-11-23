/**
 * #PACKAGE: review
 * #MODULE: cms-item-shared-review-content
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:38 13/12/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ItemSharedReviewContent.js
 */
$(function () {
  /**
   * @class iNet.ui.review.ItemSharedReviewContent
   * @extends iNet.ui.author.ItemCompose
   */
  iNet.ns('iNet.ui.review.ItemSharedReviewContent');
  iNet.ui.review.ItemSharedReviewContent = function (options) {
    var _this = this;
    var cateModalEl = $(modalId);
    iNet.apply(this, options || {});
    this.id = this.id || 'review-shared-content-wg';
    this.type = 'REVIEWER';

    this.btn = {
      approved: $('#btn-content-approved'),
      rejected: $('#btn-content-rejected')
    };

    iNet.ui.review.ItemSharedReviewContent.superclass.constructor.call(this);

    this.btn.approved.click(function () {
      cateModalEl.modal('show');
    });

    this.btn.rejected.click(function () {
      var record = _this.getPost();
      ItemAPI.rejectedItemShared({
        uuid: record.uuid,
        prefix: record.firm,
        site: record.site
      }, function (result) {
        var __result = result || {};
        if (iNet.isDefined(__result.uuid)) {
          _this.success(_this.getText('allow_publish'), _this.getText('approved_item_shared'));
          __result.reviewed = false;
          _this.hide();
          _this.fireEvent('rejected', __result, _this);
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
          uuid: record.uuid,
          prefix: record.firm,
          site: record.site,
          category: cateModalEl.find('#cbb-category').val()
        };
        ItemAPI.approvedItemShared(params, function (result) {
          var __result = result || {};
          if (iNet.isDefined(__result.uuid)) {
            _this.success(_this.getText('allow_publish'), _this.getText('approved_item_shared'));
            __result.reviewed = true;
            _this.checkShowBtn(__result.uuid);
            _this.fireEvent('reviewed', __result, _this);
          } else {
            _this.error(_this.getText('allow_publish'), _this.getText('approve_item_shared_error'));
          }
        });
      }
    });
  };
  iNet.extend(iNet.ui.review.ItemSharedReviewContent, iNet.ui.author.ItemCompose, {
    loadReview: function (uuid) {
      this.disableShare();
      if (uuid) {
        var _this = this;
        ItemAPI.loadShared({uuid: uuid}, function (result) {
          result = result || {};
          if (result.type !== 'ERROR') {
            _this.setData(result);
            _this.checkShowBtn(result.uuid);
            _this.disable();
          }
        });
      }
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
      var isShared = ItemAPI.isShared(uuid);
      FormUtils.showButton(this.btn.approved, !isShared);
      FormUtils.showButton(this.btn.rejected, isShared);
    }
  });
});