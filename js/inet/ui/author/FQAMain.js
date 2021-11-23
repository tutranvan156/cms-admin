// #PACKAGE: author
// #MODULE: cms-fqa-main
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 27/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file FQAMain
 * @author nbchicong
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  var group = typeof fqaGroup !== 'undefined' ? fqaGroup : CMSConfig.GROUP_FQA;
  /**
   * @type {iNet.ui.author.FQAList}
   */
  var list = new iNet.ui.author.FQAList({group: group});
  /**
   * @type {iNet.ui.author.FQAContent}
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
   * @param {iNet.ui.author.FQAList} parent
   * @returns {iNet.ui.author.FQAContent}
   */
  var loadContentWg = function (parent) {
    if (!content) {
      content = new iNet.ui.author.FQAContent();
      content.on('back', function () {
        history.back();
      });
      content.on('answered', function (data) {
        parent.update(data);
      });
      content.on('created', function (data) {
        parent.insert(data);
      });
      content.on('deleted', function (data) {
        parent.removeByID(data.uuid);
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
  list.on('open', function (record, parent) {
    content = loadContentWg(parent);
    content.setMode(MODE.VIEW);
    content.setRecord(record);
    content.load(record);
  });
  list.on('create', function (mode, parent) {
    content = loadContentWg(parent);
    content.setMode(MODE.CREATE);
    content.setRecord(null);
    content.resetForm();
  });
  // active menu
  //var layout = iNet.getLayout();
  //if (layout) {
  //  var menu = layout.window.sideBar;
  //  if (menu) {
  //    menu.activeById('#cms-fqa');
  //  }
  //}
});