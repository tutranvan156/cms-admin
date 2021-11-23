/**
 * #PACKAGE: document
 * #MODULE: publish-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 13:55 19/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file PublishMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.document.ListPublished}
   */
  var list = new iNet.ui.document.ListPublished();
  /**
   * @type {iNet.ui.document.PublishContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.document.PublishedApproved}
   */
  var draft = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: list
  });
  history.on('back', function (widget) {
    widget.show();
  });
  list.show();
  /**
   * @param {iNet.ui.document.ListPublished} parent
   * @returns {iNet.ui.document.PublishContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.document.PublishContent();
      composer.on(composer.getEvent('back_list'), function () {
        history.back();
        // list.getGrid().load();
      });
      composer.on(composer.getEvent('promulgation'), function (record, parent) {
        draft = loadDraftContent(parent);
        draft.load(record);
      });

    }
    if (parent) {
      composer.setParent(parent);
      parent.hide();
    }
    history.push(composer);
    composer.passRoles(parent);
    composer.show();
    return composer;
  };

  /**
   * @param {iNet.ui.document.ListPublished} parent
   * @returns {iNet.ui.document.PublishedApproved}
   */
  var loadDraftContent = function (parent) {
    if (!draft) {
      draft = new iNet.ui.document.PublishedApproved();
      draft.on(draft.getEvent('back'), function () {
        history.back();
      });

      draft.on(draft.getEvent('published'), function (data, parent) {
        list.show();
        composer.hide();
        list.getGrid().load();
      });
    }
    if (parent) {
      draft.setParent(parent);
      parent.hide();
    }
    history.push(draft);
    draft.passRoles(parent);
    draft.show();
    return draft;
  };


  list.on('open', function (record, parent) {
    composer = loadContent(parent);
    composer.setData(record);
  });
});
