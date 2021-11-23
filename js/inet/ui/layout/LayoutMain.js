/**
 * #PACKAGE: admin
 * #MODULE: layout-main
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:17 21/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file LayoutMain.js
 */

$(function () {

  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.ListAreaWg}
   */
  var listArea = new iNet.ui.admin.ListAreaWg();
  /**
   * @type {iNet.ui.admin.ListPluginWg}
   */
  var composer = null;
  /**
   * @type {iNet.ui.admin.ContentPlugin}
   * */
  var content = null;
  /**
   * @type {iNet.ui.admin.PluginsList}
   * */
  var contentInfo = null;
  /**
   * @type {iNet.ui.admin.ListMediaGroup}
   * */
  var listMediaGroup = null;

  /**
   * @type {iNet.ui.admin.ImageContentList}
   * */
  var listImageContent = null;
  /**
   * @type {iNet.ui.admin.ContentCategoryPlugin};
   * */
  var contentCategory = null;
  /**
   * @type {iNet.ui.admin.ContentMenuPlugin}
   * */
  var contentMenu = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: listArea
  });
  history.on('back', function (widget) {
    widget.show();
  });
  listArea.show();

  var loadListPlugin = function (parent) {
    if (!composer) {
      composer = new iNet.ui.admin.ListPluginWg();
      composer.on('back', function () {
        //todo
        history.back();
      });
      composer.on('updated', function (params) {
        listArea.updateItem(params);
      });
      composer.on('view_content', function (parent, data) {
        content = loadContentPlugin(parent);
        content.setArea(data.area);
        content.setPage(data.page);
        content.setPlugin(data.plugin);
        content.setPluginType(data.types);
        content.setNamePage(data.name);
        content.loadPlugin();
      });
      composer.on('view_info', function (parent, data) {
        contentInfo = loadInfoPlugin(parent);
        contentInfo.setFirstLoad(false);
        contentInfo.setArea(data.area);
        contentInfo.setPage(data.page);
        contentInfo.setPlugin(data.plugin);
        contentInfo.setNamePage(data.name);

        if (!iNet.isEmpty(data.plugin)){
          contentInfo.getGrid().getQuickSearch().setValSelect(data.plugin);
          contentInfo.getGrid().getQuickSearch().$selectPlugin.val(data.plugin);
          contentInfo.getGrid().getQuickSearch().$btnSearch.trigger('click');
        }

        contentInfo.show();
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

  var loadMenuContent = function (parent) {
    if (!contentMenu) {
      contentMenu = new iNet.ui.admin.ContentMenuPlugin();
      contentMenu.on('back', function () {
        history.back();
      });
      contentMenu.on('update', function (data, type) {
        content.fireEvent('update', data, type);
      });

    }
    if (parent) {
      contentMenu.setParent(parent);
      parent.hide();
    }
    history.push(contentMenu);
    contentMenu.passRoles(parent);
    contentMenu.show();
    return contentMenu;
  };

  var loadGroupMedia = function (parent) {
    if (!listMediaGroup) {
      listMediaGroup = new iNet.ui.admin.ListMediaGroup();
      listMediaGroup.on('back', function () {
        history.back();
      });
      listMediaGroup.on('view_content', function (_this, type, category) {
        listImageContent = loadImageCategory(_this);
        listImageContent.setCategory(category);
        listImageContent.setType(type);
        if (type === CMSConfig.ASSET_TYPE_IMAGE) {
          listImageContent.renderHtmlImage();
        } else if (type === CMSConfig.ASSET_TYPE_VIDEO) {
          listImageContent.runVideoEmbed();
        } else {
          listImageContent.loadGrid();
        }
      });

      listMediaGroup.on('update', function (data, type) {
        content.fireEvent('update', data, type);
      });

    }
    if (parent) {
      listMediaGroup.setParent(parent);
      parent.hide();
    }
    history.push(listMediaGroup);
    listMediaGroup.passRoles(parent);
    listMediaGroup.show();
    return listMediaGroup;
  };

  var loadImageCategory = function (parent) {
    if (!listImageContent) {
      listImageContent = new iNet.ui.admin.ImageContentList();
      listImageContent.on('back', function () {
        history.back();
      });

    }
    if (parent) {
      listImageContent.setParent(parent);
      parent.hide();
    }
    history.push(listImageContent);
    listImageContent.passRoles(parent);
    listImageContent.show();
    return listImageContent;
  };

  var loadContentPlugin = function (parent) {
    if (!content) {
      content = new iNet.ui.admin.ContentPlugin();
      content.on('back_plugin', function () {
        history.back();
      });
      content.on('add_content', function (_this, type, data) {
        listMediaGroup = loadGroupMedia(_this);
        listMediaGroup.setType(type);
        listMediaGroup.setDataSelect(data);
        listMediaGroup.renderGroupMedia();
      });

      content.on('add_menu', function (_this, data) {
        contentMenu = loadMenuContent(_this);
        contentMenu.setSelect(data);
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

  var loadInfoPlugin = function (parent) {
    if (!contentInfo) {
      contentInfo = new iNet.ui.admin.PluginsList();
      contentInfo.on('back_plugin', function () {
        history.back();
      });
    }
    if (parent) {
      contentInfo.setParent(parent);
      parent.hide();
    }
    history.push(contentInfo);
    contentInfo.passRoles(parent);
    contentInfo.show();
    return contentInfo;
  };

  listArea.on('list_plugin', function (parent, area,plugin, page, name) {
    //todo
    composer = loadListPlugin(parent);
    composer.setArea(area);
    composer.setPage(page);
    composer.setPlugin(plugin);
    composer.setNamePage(name);
    composer.rendererPlugin();

  });


});
