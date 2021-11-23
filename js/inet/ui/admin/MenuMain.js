/**
 * #PACKAGE: admin
 * #MODULE: cms-super-menu-main
 */
/**
 * Copyright (c) 2016 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 3:10 PM 19/05/2016.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file MenuMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.superad.MenuContextList}
   */
  var contextList = new iNet.ui.superad.MenuContextList();
  /**
   * @type {iNet.ui.superad.MenuList}
   */
  var list = new iNet.ui.superad.MenuList();
  /**
   * @type {iNet.ui.superad.MenuContent}
   */
  var content = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: list
  });
  history.on('back', function(widget){
    widget.show();
  });
  /**
   * @param {iNet.ui.superad.MenuList} parent
   * @returns {iNet.ui.superad.MenuContent}
   */
  var loadComposerWg = function (parent) {
    if (!content) {
      content = new iNet.ui.superad.MenuContent();
      content.on(content.getEvent('back'), function () {
        history.back();
      });
      content.on(content.getEvent('created'), function (data) {
        parent.insert(data);
      });
      content.on(content.getEvent('updated'), function (data) {
        parent.update(data);
      });
      content.on(content.getEvent('removed'), function (record) {
        parent.removeRecord(record);
        history.back();
      });
    }
    if(parent){
      content.setParent(parent);
      parent.hide();
    }
    history.push(content);
    content.passRoles(parent);
    content.show();
    return content;
  };
  contextList.on(contextList.getEvent('open'), function (id, data, node) {
    history.first();
    list.setContext(data.name);
    list.loadGrid();
  });
  list.on(list.getEvent('open'), function (record, context, parent) {
    content = loadComposerWg(parent);
    content.setContext(context);
    content.load(record);
  });
  list.on(list.getEvent('create'), function (context, parent) {
    content = loadComposerWg(parent);
    content.setContext(context);
    content.load({});
  });
});
