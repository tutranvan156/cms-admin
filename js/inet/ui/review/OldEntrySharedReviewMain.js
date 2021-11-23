/**
 * #PACKAGE: review
 * #MODULE: cms-entry-shared-review-main
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15:57 13/12/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file OldEntrySharedReviewMain.js
 */
$(function () {
  /**
   * @type {iNet.ui.review.OldEntrySharedReviewList}
   */
  var listPost = new iNet.ui.review.OldEntrySharedReviewList();
  /**
   * @type {iNet.ui.review.OldEntrySharedReviewContent}
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
   * @param {iNet.ui.review.OldEntrySharedReviewList} parent
   * @returns {iNet.ui.review.OldEntrySharedReviewContent}
   */
  function initComposerWg(parent) {
    if (!composer) {
      composer = new iNet.ui.review.OldEntrySharedReviewContent();
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
    composer.loadReview(record);
  });
});