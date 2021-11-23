// #PACKAGE: admin
// #MODULE: cms-menu-item-main
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 25/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file MenuItemMain
 * @author nbchicong
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.MenuItemList}
   */
  var listMenu = new iNet.ui.admin.MenuItemList();
  /**
   * @type {iNet.ui.admin.MenuItemContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.admin.MenuItemDesign}
   */
  var design = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: listMenu
  });
  history.on('back', function (widget) {
    widget.show();
  });
  /**
   * @param {iNet.ui.admin.MenuItemList} parent
   * @returns {iNet.ui.admin.MenuItemContent}
   */
  var loadComposerWg = function (parent) {
    if (!composer) {
      composer = new iNet.ui.admin.MenuItemContent();
      composer.on(composer.getEvent('back'), function () {
        listMenu.reload();
        history.back();
      });
      composer.on(composer.getEvent('saved'), function (data) {
        parent.insert(data);
      });
      composer.on(composer.getEvent('updated'), function (data) {
        parent.update(data);
      });
      composer.on('design_editor', function (data, parent) {
        design = loadItemDesign(parent);
        design.setTypeEditor(CMSConfig.ACE_MODE.HTML);
        design.setContent(data);
        design.setContentJs();
        design.setContentCss();
        design.setContentHtml();
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
  var loadItemDesign = function (parent) {
    if (!design) {
      design = new iNet.ui.admin.MenuItemDesign();
    }
    design.on('back', function () {
      history.back();
    });
    design.on('save_ace', function (data) {
      composer.editor.setValue(data);
    });
    if (parent) {
      design.setParent(parent);
      parent.hide();
    }
    history.push(design);
    design.passRoles(parent);
    design.show();
    return design;
  };
  listMenu.on(listMenu.getEvent('open'), function (record, parent) {
    var __contentWg = loadComposerWg(parent);
    __contentWg.load(record);
  });
  listMenu.on(listMenu.getEvent('create'), function (parent) {
    var __contentWg = loadComposerWg(parent);
    __contentWg.resetData();
  });
  // active menu
  //var layout = iNet.getLayout();
  //if (layout) {
  //  var menu = layout.window.sideBar;
  //  if (menu) {
  //    menu.activeById('#menu-item');
  //  }
  //}
});