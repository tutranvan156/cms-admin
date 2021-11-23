// #PACKAGE: author
// #MODULE: cms-comment-main
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 27/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file CommentMain
 * @author nbchicong
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.author.CommentList}
   */
  var list = new iNet.ui.author.CommentList();
  /**
   * @type {iNet.ui.author.CommentContent}
   */
  var content = null;
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: list
  });
  history.on('back', function (widget) {
    widget.show();
  });
  /**
   * @param {iNet.ui.author.CommentList} parent
   * @returns {iNet.ui.author.CommentContent}
   */
  var loadContentWg = function (parent) {
    if (!content) {
      content = new iNet.ui.author.CommentContent();
      content.on(content.getEvent('back'), function () {
        history.back();
      });
      content.on(content.getEvent('approved'), function (data) {
        var __cache = parent.getCache();
        __cache.ttlP += 1;
        __cache.ttlC -= 1;
        parent.update(data);
        parent.updateCount(__cache);
      });
      content.on(content.getEvent('rejected'), function (data) {
        var __cache = parent.getCache();
        __cache.ttlP -= 1;
        __cache.ttlC += 1;
        parent.update(data);
        parent.updateCount(__cache);
      });
      content.on(content.getEvent('deleted'), function (data) {
        var __cache = parent.getCache();
        __cache.ttlE -= 1;
        if (data.status == CMSConfig.MODE_CREATED) {
          __cache.ttlC -= 1;
        } else {
          __cache.ttlP -= 1;
        }
        parent.removeByID(data.uuid);
        parent.updateCount(__cache);
        history.back();
      });
    }
    if (parent) {
      content.setParent(parent);
      parent.hide();
    }
    history.push(content);
    content.passRoles(parent);
    content.show();
    return content;
  };
  list.on(list.getEvent('open'), function (record, parent) {
    var __contentWg = loadContentWg(parent);
    __contentWg.load(record);
  });
  // active menu
  //var layout = iNet.getLayout();
  //if (layout) {
  //  var menu = layout.window.sideBar;
  //  if (menu) {
  //    menu.activeById('#cms-comment');
  //  }
  //}
});