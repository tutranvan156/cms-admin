/**
 * #PACKAGE: review
 * #MODULE: cms-item-shared-review-main
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15:57 13/12/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ItemSharedReviewMain.js
 */
$(function () {
  /**
   * @type {iNet.ui.review.ItemSharedReviewList}
   */
  var listPost = new iNet.ui.review.ItemSharedReviewList();
  /**
   * @type {iNet.ui.review.ItemSharedReviewContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var localHistory = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: listPost
  });

  /**
   * @param {iNet.ui.review.ItemSharedReviewList} parent
   * @returns {iNet.ui.review.ItemSharedReviewContent}
   */
  function initComposerWg(parent) {
    if (!composer) {
      composer = new iNet.ui.review.ItemSharedReviewContent();
      composer.on(composer.getEvent('back'), function () {
        localHistory.back();
      });
      composer.on('reviewed', function (record) {
        parent.update(record);
      });
      composer.on('rejected', function (record) {
        parent.update(record);
        localHistory.back();
      });
    }
    if(parent){
      composer.setParent(parent);
      parent.hide();
    }
    localHistory.push(composer);
    composer.passRoles(parent);
    composer.show();
    return composer;
  }

  localHistory.on('back', function(widget){
    widget.show();
  });

  listPost.on(listPost.getEvent('open'), function (record, parent) {
    var composer = initComposerWg(parent);
    composer.loadReview(record.uuid);
  });
});