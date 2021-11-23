// #PACKAGE: author
// #MODULE: cms-queue-main
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 23/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file QueueMain
 * @author nbchicong
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.author.ItemQueueList}
   */
  var listPost = new iNet.ui.author.ItemQueueList();
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
  history.on('back', function(widget){
    widget.show();
  });
  /**
   * @param {iNet.ui.author.ItemQueueList} parent
   * @returns {iNet.ui.author.ItemCompose}
   */
  var loadComposerWg = function (parent) {
    if (!composer) {
      composer = new iNet.ui.author.ItemCompose();
      composer.on('back_post', function () {
        history.back();
        listPost.reload();
      });
      composer.on('saved_post', function (data) {
        var __cache = parent.getCache();
        __cache.ttlE += 1;
        __cache.ttlC += 1;
        //parent.insert(data);
        listPost.reload();
        parent.updateCount(__cache);
      });
      composer.on('updated_post', function (data) {
        //parent.update(data);
        listPost.reload();
      });
      composer.on('send_post', function (data, code, status) {
        var __cache = parent.getCache();
        composer.hide();
        history.back();
        listPost.reload();
        parent.updateCount(__cache);
      });
    }
    if(parent){
      composer.setParent(parent);
      parent.hide();
    }
    history.push(composer);
    composer.passRoles(parent);
    composer.show();
    return composer;
  };
  listPost.on('open_post', function (record, parent) {
    //if (record.getStatus() == 'CREATED') {
      var __contentWg = loadComposerWg(parent);
      __contentWg.load(record);
    //}
  });
  listPost.on('create_post', function (parent) {
    var __contentWg = loadComposerWg(parent);
    __contentWg.resetData();
  });
  // active menu
  //var layout = iNet.getLayout();
  //if (layout) {
  //  var menu = layout.window.sideBar;
  //  if (menu) {
  //    menu.activeById('#cms-post');
  //  }
  //}
});