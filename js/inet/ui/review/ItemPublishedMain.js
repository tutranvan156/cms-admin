// #PACKAGE: review
// #MODULE: cms-item-published-main
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file PublishedMain
 * @author nbchicong
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.review.ItemPublishedList}
   */
  var listPost = new iNet.ui.review.ItemPublishedList();
  /**
   * @type {iNet.ui.author.ItemCompose}
   */
  var composer = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: listPost
  });
  history.on('back', function (widget) {
    widget.show();
  });
  /**
   * @param {iNet.ui.author.ItemPublishedList} parent
   * @returns {iNet.ui.author.ItemCompose}
   */
  var loadComposerWg = function (parent) {
    if (!composer) {
      composer = new iNet.ui.author.ItemCompose();
      composer.on(composer.getEvent('back'), function () {
        history.back();
      });
      composer.on(composer.getEvent('removed'), function (post) {
        console.log('post: ', post);
        parent.removeByID(post.uuid);
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
  listPost.on(listPost.getEvent('open'), function (record, parent) {
    var composer = loadComposerWg(parent);
    composer.setLoadUrl(iNet.getPUrl('cms/view'));
    composer.load(record);
  });
  //var layout = iNet.getLayout();
  //if (layout) {
  //  var menu = layout.window.sideBar;
  //  if (menu) {
  //    menu.activeById('#cms-published');
  //  }
  //}
});