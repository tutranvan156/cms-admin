/**
 * #PACKAGE: admin
 * #MODULE: site-menu-list
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 2:36 PM 02/06/2017.
 * -------------------------------------------
 * @project isphere
 * @author nbccong
 * @file SiteMenuList.js
 */

$(function () {
  // 'use strict';

  var url = {
    listPost: AjaxAPI.getPUrl('cms/item/textsearch'),
    listCate: AjaxAPI.getPUrl('cms/category/list'),
    listPageContent: AjaxAPI.getPUrl('cms/menuitem/list')
  };
  /**
   * @type Hashtable
   */
  var store = new Hashtable();
  /**
   * @type {Object}
   */
  var current = {};
  var selectedId = null;
  var selectedCls = 'btn-primary';
  var loadingId = 'loading-box';
  var newMenuId = 'new-menu-id';
  var menuItemTemplateId = 'menu-item-template';
  var subMenuTemplateId = 'sub-menu-template';
  var itemTemplateId = 'item-template';
  var itemTextTemplateId = 'item-text-template';
  var optionTplId = 'option-tpl';

  var MENU_ATTR = {
    PARENT: 'parent',
    POSITION: 'position',
    REFERENCE_TYPE: '_referenceType',
    REFERENCE_ID: '_referenceId',
    REFERENCE_TARGET: '_referenceTarget',
    REFERENCE_PARENT: '_referenceParent',
    CMS_ITEM_ID: 'cmsItemID',
    OWNER_INFO: 'ownerInfo',
    PAGE_PATH: 'path',
    PARAM_NAME: '_paramName'
  };
  var REF_ATTR = {
    TYPE_THEME_PAGE: '__theme_page',
    TYPE_CONTENT_PAGE: '__content_page',
    TYPE_CATEGORY: '__category',
    TYPE_ABSOLUTE_LINK: '__absolute_link'
  };
  var ROOT = '__root';

  function getPathLink(menu) {
    var attribute = menu.attribute;
    var link = '#undefined';
    if (attribute) {
      var type = attribute[MENU_ATTR.REFERENCE_TYPE.substring(1)];
      if (type === REF_ATTR.TYPE_ABSOLUTE_LINK || type === REF_ATTR.TYPE_THEME_PAGE)
        link = attribute[MENU_ATTR.PAGE_PATH];
      else {
        var paramStr = null;
        if (attribute[MENU_ATTR.PARAM_NAME.substring(1)]
            && attribute[MENU_ATTR.REFERENCE_ID.substring(1)])
          paramStr = '?' + attribute[MENU_ATTR.PARAM_NAME.substring(1)] + '=' + attribute[MENU_ATTR.REFERENCE_ID.substring(1)];

        link = attribute[MENU_ATTR.PAGE_PATH] + (paramStr ? paramStr : '');
      }
      if (type !== REF_ATTR.TYPE_ABSOLUTE_LINK)
        link = location.origin + iNet.path + '/' + link;

      var __extParam = attribute["extParam"] ||"";
      if (!iNet.isEmpty(__extParam) && !iNet.isEmpty(link)){
        if (link.indexOf("?")<0){
          link += "?";
        }

        link += "&" + __extParam;
      }
    }
    return link;
  }

  function copyToClipboard(value) {
    var tempEl = $('<input>');
    $('body').append(tempEl);
    tempEl.val(value).select();
    document.execCommand("copy");
    tempEl.remove();
  }

  /**
   * @param {Array} items
   * @returns {string}
   */
  function renderMenu(items) {
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      getStore().put(item.uuid, item);

      if (item.childrens && item.childrens.length > 0) {
        item.subMenu = iNet.Template.parse(subMenuTemplateId, {subList: renderMenu(item.childrens)});
      } else
        item.subMenu = '';

      item.tipPos = (i === 0 ? 'bottom' : 'top');
      var index = window.MenuList.getItemsSelect().findIndex(function (element) {
        return element.uuid === item.uuid
      });
      if (index !== -1) {
        console.log('index: ', index);
        item['selected'] = 'selected';
      }

      html += iNet.Template.parse(menuItemTemplateId, item);
    }

    return html;
  }

  function renderMenuType() {
    var html = '';
    for (var key in REF_ATTR) {
      if (REF_ATTR.hasOwnProperty(key))
        html += iNet.Template.parse(optionTplId, {
          value: REF_ATTR[key],
          name: iNet.resources.cmsadmin.menu[REF_ATTR[key]]
        });
    }

    return html;
  }

  function renderRefItem(items) {
    var html = '';
    for (var i = 0; i < items.length; i++)
      html += iNet.Template.parse(itemTemplateId, convertItem(items[i]));

    return html;
  }

  function convertItem(item) {
    return iNet.apply(item, {
      uuid: item.menuID || item.uuid,
      name: item.name || (item.subject || item.page)
    });
  }

  function showLoading() {
    $.getCmp(loadingId).show();
  }

  function hideLoading() {
    $.getCmp(loadingId).hide();
  }

  function updateAttribute(element, data) {
    if (element.length > 0) {
      element.attr({
        'data-parent': data.parentId || ''
      });
    }
  }

  /**
   * @param {Object} item
   * @returns {Object}
   */
  function convertMenuItem(item) {
    item.children = [];
    return item;
  }

  /**
   * Convert flat data to tree data
   * @param {Array} data
   * @returns {Array}
   */
  function convert2Tree(data) {
    var treeData = [];
    if (data && data.length > 0) {
      var children = [];
      data.forEach(function (item) {
        if (item.attribute) {
          if (!item.childrens)
            item.childrens = [];

          if (!item.attribute[MENU_ATTR.REFERENCE_PARENT.substring(1)]
              || item.attribute[MENU_ATTR.REFERENCE_PARENT.substring(1)] === ROOT || item.attribute[MENU_ATTR.REFERENCE_PARENT.substring(1)] === 'root') {
            treeData.push(item);
          } else {
            children.push(item);
          }
        }
      });
      convertChildren(children, treeData);
    }
    return treeData;
  }

  function findNode(id, data) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if (item.uuid === id)
        return item;
    }
    return null;
  }

  /**
   * @param {Array} data
   * @param {Array} parents
   */
  function convertChildren(data, parents) {
    var temp = [];
    for (var i = 0; i < (data || []).length; i++) {
      var item = data[i];
      if (item.attribute) {
        if (item.attribute[MENU_ATTR.REFERENCE_PARENT.substring(1)]) {
          var parentId = item.attribute[MENU_ATTR.REFERENCE_PARENT.substring(1)];
          var parent = findNode(parentId, parents);
          if (parent) {
            parent.childrens.push(item);
          } else {
            temp.push(item);
          }
        }
      }
    }
    if (temp.length > 0) {
      for (i = 0; i < parents.length; i++) {
        convertChildren(temp, parents[i].childrens);
      }
    }
  }

  function removeChild(item) {
    delete item.childrens;
    delete item.subMenu;
    delete item.attribute;
    return item;
  }

  /**
   * @returns {Hashtable}
   */
  function getStore() {
    return store;
  }

  /**
   * @param key
   * @param item
   */
  function updateStoreItem(key, item) {
    if (getStore().containsKey(key))
      getStore().remove(key);

    getStore().put(key, item);
  }

  function getCurrent() {
    return current;
  }

  /**
   * @class iNet.ui.firm.SiteMenuList
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.firm.SiteMenuList');
  iNet.ui.firm.SiteMenuList = function (options) {
    // var itemType='';
    console.log('window.options: ', window.options);
    // var referenId='';
    var _this = this;
    var isDragging = false;
    iNet.apply(this, window.options || {});
    this.id = this.id || 'site-menu-wg';
    this.module = 'site_menu';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.menuListEl = $('#site-menu-list');
    this.menuTypeEl = $('#site-menu-type');
    this.refItemListEl = $('#ref-item-list');
    this.panelList = $('#panel-list');
    this.panelContent = $('#panel-content');
    this.linkModal = $('#menu-link-modal');
    this.menus = [];
    this.toolbar = {
      CREATE: $('#site-menu-add-btn'),
      SAVE: $('#site-menu-save-btn'),
      LOAD: $('#site-menu-load-btn'),
      UPDATE: $('#site-menu-update-btn'),
      EXPEND_ALL: $('#site-menu-expend'),
      COLLAPSE_ALL: $('#site-menu-collapse')
    };
    this.$modal = {
      modal: $('#modal-menu')
    };
    this.itemSelect = null;
    this.menuTypeEl.html(renderMenuType());
    iNet.ui.firm.SiteMenuList.superclass.constructor.call(this);
    // this.menuListEl.on('click', '.dd-collapse', function () {
    //   $(this).hide();
    //   $(this).next().show();
    // });
    // this.menuListEl.on('click', '.dd-expand', function () {
    //   $(this).hide();
    //   $(this).prev().show();
    // });
    this.toolbar.COLLAPSE_ALL.on('click', function () {
      _this.menuListEl.parent().nestable('expandAll');
    });
    this.toolbar.EXPEND_ALL.on('click', function () {
      _this.menuListEl.parent().nestable('collapseAll');
    });
    this.toolbar.CREATE.on('click', function () {
      _this.menuListEl.find('li.dd-item').removeClass('selected');
      _this.menuListEl.find('.no-item').hide();
      var randomId = iNet.generateUUID();
      current = {
        uuid: randomId,
        name: 'Menu mới',
        type: CMSConfig.CONTENT_PAGE_SERVICE,
        category: '',
        group: '',
        _extParam: ""
      };
      _this.itemSelect = current;
      _this.append(current);
      _this.fillPanel(current);
    });
    this.toolbar.LOAD.on('click', function () {
      _this.load();
    });
    this.menuTypeEl.on('change', function () {
      showLoading();
      _this.loadRefItem(this.value);
    });
    this.menuListEl.on('click', '.dd2-content', function () {
      var thisEl = $(this).closest('li');
      var uuid = getStore().get(thisEl.data('uuid'));
      current = uuid;
      if (!window.options) {
        _this.menuListEl.find('li.dd-item').removeClass('selected');
        thisEl.addClass('selected');
        _this.itemSelect = current;
      } else {
        var __index = _this.menus.findIndex(function (item) {
          return item.uuid === uuid.uuid;
        });
        if (__index !== -1) {
          thisEl.removeClass('selected');
          _this.menus.splice(__index, 1);
          _this.setItemsSelect(_this.menus);
        } else {
          _this.menus.push(uuid);
          _this.setItemsSelect(_this.menus);
          thisEl.addClass('selected');
        }
      }
      _this.fillPanel(current);
      if (current.uuid === newMenuId)
        return;
      $.getCmp(newMenuId).remove();
    });
    this.menuListEl.on('click', '[data-action="remove"]', function () {
      var thisEl = $(this).closest('li');
      var uuid = thisEl.data('uuid');
      var menuID = thisEl.data('menuid');

      console.log("menuID : ", menuID);

      var dialog = _this.confirmDlg('', '', function () {
        this.hide();
        if (CMSUtils.isObjectId(uuid)) {
          var params = this.getOptions();

          console.log("params : ", params);

          FirmAPI.removeMenu(params, function (result) {
            if (getStore().containsKey(params.menu))
              getStore().remove(params.menu);
            if (result.uuid) {
              $('[data-uuid="' + result.uuid + '"]').remove();
              _this.success(
                  'Xóa menu',
                  'Xóa menu thành công'
              );
            } else {
              _this.error(
                  'Xóa menu',
                  'Xảy ra lỗi khi xóa menu'
              );
            }
            _this.itemSelect = null;
            _this.load();
          });
        } else {
          thisEl.remove();
          getStore().remove(menuID);
        }
      });
      dialog.setTitle('<i class="fa fa-trash red"></i> Xóa menu');
      dialog.setOptions({menu: menuID});
      dialog.show();
    });
    this.menuListEl.on('click', '[data-action="copy"]', function () {
      var parentEl = $(this).closest('li');
      var uuid = parentEl.data('uuid');
      var menuID = parentEl.data('menuID');

      _this.linkModal.find('.menu-link').html('<p class="text-center"><i class="fa fa-refresh fa-spin"></i></p>');
      _this.linkModal.modal('show');
      FirmAPI.loadMenu({menu: uuid, path: true}, function (result) {
        if (result.attribute) {
          var value = getPathLink(result);
          _this.linkModal.find('.menu-link').html(value);
        }
      });
    });
    _this.menuListEl.on('mousedown', '.dd-handle', function () {
      var thisEl = $(this).closest('li');
      _this.itemSelect = getStore().get(thisEl.data('uuid'));
      _this.itemSelect.updated = true;
    });
    this.on('loaded', function () {
      $('[data-toggle="tooltip"]').tooltip();
      _this.menuListEl.parent().nestable({
        callback: function (l, e) {
          var parentRoot = _this.menuListEl.children('.dd-item');
          var idRoot = $(parentRoot).attr('class');
          idRoot = idRoot.substr(0, 0) + '.' + idRoot.substr(0);
          idRoot = idRoot.replace(/ /g, '.');
          if (idRoot.length > 0) {
            $(idRoot).each(function () {
              var el = $(this);
              var item = getStore().get(el.attr('data-uuid'));
              if (item) {
                el.attr('data-parent', ROOT);
                var parentEl = el.parents('li.dd-item');
                if (parentEl.length > 0) {
                  var parentId = $(parentEl).attr('data-uuid');
                  el.attr('data-parent', parentId);
                  item.attribute[MENU_ATTR.REFERENCE_PARENT] = parentId;
                } else {
                  item.attribute[MENU_ATTR.REFERENCE_PARENT] = ROOT;
                }
                item.updated = true;
                updateStoreItem(item.uuid, item);
              }
            });
            updateData();
          }
        }
      });

    });

    this.refItemListEl.on('click', '.list-group-item', function () {
      _this.refItemListEl.find('.list-group-item').removeClass(selectedCls);
      var thisEl = $(this);
      thisEl.addClass(selectedCls);
      if (!current.attribute)
        current.attribute = {};

      current.type = getServiceMenuType(_this.menuTypeEl.val());
      current.attribute[getAttrByType(current.type)] = thisEl.prop('id');
      current.attribute[MENU_ATTR.REFERENCE_ID] = thisEl.prop('id');
      current.attribute[MENU_ATTR.REFERENCE_TYPE] = _this.menuTypeEl.val();
      current.attribute[MENU_ATTR.PARAM_NAME] = getParamNameByType(_this.menuTypeEl.val());
      current.updated = true;
      _this.itemSelect = current;

      updateStoreItem(current.uuid, current);
    });

    this.panelContent.find('.menu-property').on('focusout', function () {
      if (!current.updated)
        current.updated = current[this.getAttribute('name')] !== this.value;

      current[this.getAttribute('name')] = this.value;
      updateStoreItem(current.uuid, current);
    });

    this.panelContent.on('change', '.target-absolute-link', function () {
      if (!current.updated)
        current.updated = current.attribute[MENU_ATTR.REFERENCE_TARGET] !== this.value;

      current.attribute[MENU_ATTR.REFERENCE_TARGET] = this.value;
      updateStoreItem(current.uuid, current);
    });

    function updateData() {
      console.log("_this.itemSelect : ",_this.itemSelect);
      if (_this.itemSelect) {
        if (!_this.itemSelect.attribute)
          _this.itemSelect.attribute = {};
        _this.itemSelect.attribute[MENU_ATTR.POSITION] = $('[data-uuid="' + _this.itemSelect.uuid + '"]').index();

        for (var key in _this.itemSelect.attribute)
          _this.itemSelect[key] = _this.itemSelect.attribute[key];

        if (_this.itemSelect.path && _this.itemSelect.type !== MENU_ATTR.PAGE_PATH)
          delete _this.itemSelect.path;

        removeChild(_this.itemSelect);

        console.log("_this.itemSelect.uuid : ",_this.itemSelect.uuid);

        if (CMSUtils.isObjectId(_this.itemSelect.uuid))
          FirmAPI.updateMenu(_this.itemSelect, function (data) {
            // _this.itemSelect = null;
            // _this.load();
            if(data.type!==CMSConfig.TYPE_ERROR) {
              _this.success(
                  'Cập nhật menu',
                  'Cập nhật menu thành công'
              );
            }
            else{
              _this.error(
                  'Cập nhật menu',
                  'Cập nhật menu xảy ra lỗi'
              );
            }
          });
        else {
          var data = _this.itemSelect;
          data.uuid = "";

          console.log("data : ", data);

          FirmAPI.createMenu(data, function (data) {
            _this.load();
            if(data.type!==CMSConfig.TYPE_ERROR) {
              if (getStore().containsKey(_this.itemSelect.uuid))
                getStore().remove(_this.itemSelect.uuid);
              _this.itemSelect = null;
              _this.success(
                'Tạo menu',
                'Tạo menu thành công'
              );
            }
            else{
              _this.error(
                'Tạo menu',
                'Tạo menu xảy ra lỗi'
              );
            }
          });
        }
      }
    }

    this.toolbar.UPDATE.on('click', function () {
      updateData();
    });
    this.load();
    $(window).on('resize', function () {
      _this.resize();
    });
  };
  iNet.extend(iNet.ui.firm.SiteMenuList, iNet.ui.WidgetExt, {
    setItemsSelect: function (data) {
      this.menus = data;
    },
    getItemsSelect: function () {
      return this.menus || [];
    },
    resize: function () {
      this.panelList.find('.dd').css('max-height', $(window).height() - 45);
      this.refItemListEl.css('max-height', $(window).height() - 274);
    },
    load: function () {
      var _this = this;
      FirmAPI.listMenu({}, function (result) {
        var items = convert2Tree(result.items || []);
        if (items.length <= 0) {
          _this.panelContent.hide();
          return;
        }
        _this.menuListEl.html(renderMenu(items));
        _this.resize();
        _this.fireEvent('loaded');
      });
    },
    loadRefItem: function (type, callback) {
      if (type === REF_ATTR.TYPE_THEME_PAGE)
        this.loadPageTheme(callback);
      else if (type === REF_ATTR.TYPE_CATEGORY)
        this.loadCate(callback);
      else if (type === REF_ATTR.TYPE_CONTENT_PAGE)
        this.loadPageContent(callback);
      else
        this.loadInput(callback);
      this.panelContent.show();
    },
    loadPageTheme: function (callback) {
      var _this = this;
      FirmAPI.loadPage({}, function (result) {
        var items = result.items || [];
        if (items.length > 0) {
          hideLoading();
          _this.refItemListEl.html(renderRefItem(items));
          $.getCmp(selectedId).addClass(selectedCls);
        } else {
          hideLoading();
          _this.refItemListEl.html('<div class="error-list-empty">Không có dữ liệu hiển thị.</div>');
          $.getCmp(selectedId).addClass(selectedCls);
        }
        callback && callback(result);
      });
    },
    loadPageContent: function (callback) {
      var _this = this;
      $.postJSON(url.listPageContent, {all: true}, function (result) {
        var items = result.items || [];
        if (items.length > 0) {
          hideLoading();
          _this.refItemListEl.html(renderRefItem(items));
          $.getCmp(selectedId).addClass(selectedCls);
        } else {
          hideLoading();
          _this.refItemListEl.html('<div class="error-list-empty">Không có dữ liệu hiển thị.</div>');
          $.getCmp(selectedId).addClass(selectedCls);
        }
        callback && callback(result);
      });
    },
    loadPost: function (callback) {
      var _this = this;
      AjaxAPI.sendRequest({
        data: {pageSize: -1},
        type: 'post',
        url: url.listPost,
        success: function (result) {
          var items = result.items || [];
          if (items.length > 0) {
            hideLoading();
            _this.refItemListEl.html(renderRefItem(items));
            $.getCmp(selectedId).addClass(selectedCls);
          } else {
            hideLoading();
            _this.refItemListEl.html('<div class="error-list-empty">Không có dữ liệu hiển thị.</div>');
            $.getCmp(selectedId).addClass(selectedCls);
          }
          callback && callback(result);
        }
      });
    },
    loadCate: function (callback) {
      var _this = this;
      AjaxAPI.sendRequest({
        data: {},
        type: 'post',
        url: url.listCate,
        success: function (result) {
          var items = result.items || [];
          if (items.length > 0) {
            hideLoading();
            var cates = [];
            for (var i = 0; i < items.length; i++)
              if (items[i].name !== items[i].group)
                cates.push(items[i]);

            _this.refItemListEl.html(renderRefItem(cates));
            $.getCmp(selectedId).addClass(selectedCls);
          } else {
            hideLoading();
            _this.refItemListEl.html('<div class="error-list-empty">Không có dữ liệu hiển thị.</div>');
            $.getCmp(selectedId).addClass(selectedCls);
          }
          callback && callback(result);
        }
      });
    },
    loadInput: function (callback) {
      var _this = this;
      var html = $('#' + itemTextTemplateId).html();
      var refInputEl = $(html);
      refInputEl.find('input').on('focusout', function () {
        var thisEl = $(this);

        if (!current.attribute)
          current.attribute = {};

        current.type = getServiceMenuType(_this.menuTypeEl.val());
        current.attribute[getAttrByType(current.type)] = thisEl.val();
        current.attribute[MENU_ATTR.REFERENCE_TYPE] = _this.menuTypeEl.val();
        current.attribute[MENU_ATTR.REFERENCE_TARGET] = refInputEl.find('select').val();
        current.updated = true;

        delete current.attribute[MENU_ATTR.REFERENCE_ID];
        delete current.attribute[MENU_ATTR.PARAM_NAME];

        updateStoreItem(current.uuid, current);
      });
      this.refItemListEl.html(refInputEl);
      callback && callback(refInputEl);
    },
    updateTree: function (data) {
      if (data) {
        if (data.length > 0)
          for (var i = 0; i < data.length; i++) {
            var item = data[i] || {};
            var parentEl = $('[data-uuid="' + item.uuid + '"]');
            if (parentEl.length > 0) {
              updateAttribute(parentEl, item);
              updateParentId(item.children, item.uuid);
              this.updateTree(item.children);
            }
          }
      }
    },
    append: function (record) {
      record = convertMenuItem(record);
      this.menuListEl.append(iNet.Template.parse(menuItemTemplateId, record));
      this.menuTypeEl.val(record.type).change();
      getStore().put(record.uuid, record);
    },
    clearFormProperties: function () {
      this.panelContent.find('.menu-property').val('');
    },
    selectRefItem: function (type, refId, target) {
      showLoading();
      var _this = this;
      this.menuTypeEl.val(type);
      this.loadRefItem(type, function () {
        if (type === REF_ATTR.TYPE_ABSOLUTE_LINK) {
          _this.refItemListEl.find('input').val(refId);
          _this.refItemListEl.find('select').val(target);
        } else
          $.getCmp(refId).addClass(selectedCls);
      });
    },
    fillPanel: function (record) {
      if (record) {
        this.clearFormProperties();
        this.panelContent.show();
        for (var key in record) {
          if (record.hasOwnProperty(key))
            this.panelContent.find('.menu-property[name="' + key + '"]').val(record[key]);
        }
        if (record.attribute) {
          var refType = record.attribute[(MENU_ATTR.REFERENCE_TYPE.substring(1))];
          if (record.type === MENU_ATTR.PAGE_PATH
              && refType === REF_ATTR.TYPE_ABSOLUTE_LINK) {
            var path = record.attribute[MENU_ATTR.PAGE_PATH];
            if (path)
              this.selectRefItem(refType, path, record.attribute[(MENU_ATTR.REFERENCE_TARGET.substring(1))]);
          } else {
            var refId = record.attribute[(MENU_ATTR.REFERENCE_ID.substring(1))];
            if (refId)
              this.selectRefItem(refType, refId);
          }
        }
      }
    },
    getStore: function () {
      return getStore();
    }
  });

  function getMenuTypeByService(type) {
    switch (type) {
      case CMSConfig.CONTENT_PAGE_SERVICE:
        return REF_ATTR.TYPE_CONTENT_PAGE;
      case CMSConfig.NEWS_PAGE_SERVICE:
        return REF_ATTR.TYPE_CATEGORY;
      case MENU_ATTR.PAGE_PATH:
        return REF_ATTR.TYPE_THEME_PAGE;
    }
  }

  function getServiceMenuType(type) {
    switch (type) {
      case REF_ATTR.TYPE_CONTENT_PAGE:
        return CMSConfig.CONTENT_PAGE_SERVICE;
      case REF_ATTR.TYPE_CATEGORY:
        return CMSConfig.NEWS_PAGE_SERVICE;
      case REF_ATTR.TYPE_THEME_PAGE:
        return MENU_ATTR.PAGE_PATH;
      default:
        return MENU_ATTR.PAGE_PATH;
    }
  }

  function getAttrByType(type) {
    switch (type) {
      case CMSConfig.CONTENT_PAGE_SERVICE:
        return MENU_ATTR.CMS_ITEM_ID;
      case CMSConfig.NEWS_PAGE_SERVICE:
        return MENU_ATTR.CMS_ITEM_ID;
      case MENU_ATTR.PAGE_PATH:
        return MENU_ATTR.PAGE_PATH;
      default:
        return MENU_ATTR.PAGE_PATH;
    }
  }

  function getParamNameByType(type) {
    switch (type) {
      case REF_ATTR.TYPE_CONTENT_PAGE:
        return 'menu';
      case REF_ATTR.TYPE_CATEGORY:
        return 'category';
    }
  }

  function updateParentId(childrens, parentId) {
    (childrens || []).forEach(function (children) {
      children.parentId = parentId;
    });
    return childrens;
  }

  window.MenuList = new iNet.ui.firm.SiteMenuList(window.options || {});
});