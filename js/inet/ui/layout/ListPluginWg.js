/**
 * #PACKAGE: admin
 * #MODULE: list-plugin-wg
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:18 21/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListPluginWg.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ListPluginWg
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ListPluginWg');
  iNet.ui.admin.SearchPluginDialog = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    iNet.ui.admin.SearchPluginDialog.superclass.constructor.call(this);
    this.id = this.id || 'plugin-list-dialog';
    this.url = {
      list:  iNet.getPUrl('cmsplugin/available')
    };

    this.$btnOK = $('#plugin-list-dialog-btn-save');
    this.$btnCancel = $('#plugin-list-dialog-btn-cancel');
    this.$pluginContent = $('#plugin-list-dialog-content');
    this.$txtKeyword = $('#plugin-list-dialog-txt-keyword');
    this.$btnSearch = $('#plugin-list-dialog-btn-search');
    var me = this;
    this.$btnOK.on('click', function (e) {
      this.hide();
      this.fireEvent('select', this.getData());
    }.createDelegate(this));

    this.$btnCancel.on('click', function () {
      this.hide();
    }.createDelegate(this));

    this.getEl().on('click', '.plugin-item', function () {
      var $current = $(this);
      if($current.hasClass('active')) {
        $current.removeClass('active');
        return;
      }
      me.clearSelected();
      $current.addClass('active');
    });

    this.$txtKeyword.on('input', function () {
      var $txt = $(this);
      var $btn = $txt.next();
      var value = $txt.val();
      if (iNet.isEmpty(value)) {
        $btn.removeClass('icon-remove').addClass('icon-search');
      } else {
        $btn.removeClass('icon-search').addClass('icon-remove');
      }
    });

    this.$btnSearch.on('click', function () {
       if(this.$btnSearch.hasClass('icon-remove')) {
         this.$txtKeyword.val('').trigger('input').trigger('change');
       }
    }.createDelegate(this));

    this.initComponent();
  };
  iNet.extend(iNet.ui.admin.SearchPluginDialog, iNet.Component, {
    clearSelected: function(){
      this.$pluginContent.find('.plugin-item.active').removeClass('active');
    },
    initComponent: function(){
      $.getJSON(this.url.list, function (result) {
        var __result = result || {};
        var __plugins = __result.items || [];
        var __html='', __plugin, $el;
        for(var i=0;i<__plugins.length;i++) {
          __plugin = __plugins[i] || {};
          if(__plugin.createdTime){
            __plugin.createdTime = new Date(__plugin.createdTime).format('d/m/Y');
          } else
            __plugin.createdTime = "Chưa xác định";
          __plugin['image'] = iNet.getPUrl('cmsdesign/image/logo') + '?name=' + __plugin.name;
          $el  = $(iNet.Template.parse('dialog-list-plugin-template', __plugin));
          $el.data('data' ,__plugin);
          this.$pluginContent.append($el);
        }
        if(iNet.isEmpty(this.$pluginContent.html().trim())) {
          this.$pluginContent.html('<i>Chưa có dữ liệu để hiển thị</i>');
        }
        if ($.fn.searchable) {
          this.$pluginContent.searchable({
            searchField: 'input#plugin-list-dialog-txt-keyword',
            selector: '.plugin-item',
            childSelector: '.card',
            hide: function (elem) {
              elem.hide();
            },
            show: function (elem) {
              elem.show();
            },
            onSearchEmpty: function (elem) {
            },
            clearOnLoad: true
          });
        }
      }.createDelegate(this));
    },
    getData: function(){
      return this.$pluginContent.find('.plugin-item.active').data('data');
    },
    getEl: function () {
      return $.getCmp(this.id);
    },
    getMask: function(){
      return this.getEl();
    },
    show: function () {
      this.getEl().modal('show');
    },
    hide: function () {
      this.getEl().modal('hide');
    }
  });

  iNet.ui.admin.ListPluginWg = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'wg-list-plugin';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.module = 'layout';
    this.plugins = [];
    this.$toolbar = {
      BACK: $('#list-plugin-btn-back'),
      SAVE: $('#list-plugin-btn-save'),
      REPLACE: $('#list-plugin-btn-replace')
      //LOAD: $('#list-plugin-btn-load'),
      //SEARCH_TEXT: $('#search-name-plugin'),
      //ICON_SEARCH: $('#icon-search'),
      //ICON_CLEAR: $('#icon-clear-search')
    };

    this.url = {
      url_img: iNet.getPUrl('cmsdesign/image/logo'),
      //list_plugin: iNet.getPUrl('cmsfirm/theme/plugins'),
      list_plugin: iNet.getPUrl('cmsplugin/available'),
      free_plugin: iNet.getPUrl('cmsfirm/theme/plugins/free'),
      // list_plugin: iNet.getPUrl('cmsfirm/plugin/areas'),
      update_plugin: iNet.getPUrl('cmsfirm/custom/update'),
      list_area: iNet.getPUrl('cmsfirm/custom/areas')
    };

    this.$plugin = {
      list_plugin: $('#list-card-plugin')
    };

    this.rendererPlugin = function () {
      this.listPluginByArea(this.getArea(), function () {

      });
    };

    iNet.ui.admin.ListPluginWg.superclass.constructor.call(this);

    /*
    this.$toolbar.ICON_CLEAR.click(function () {
      _this.searchPlugin('');
      _this.$toolbar.ICON_SEARCH.show();
      $(this).hide();
      _this.$toolbar.SEARCH_TEXT.val('');
    });

    this.$toolbar.SEARCH_TEXT.on('keyup', function (e) {
      if (e.keyCode == 13) {
        var value = $(this).val().toLowerCase();
        if (!value) {
          _this.showButtonSearch();
        } else {
          _this.hideButtonSearch();
        }
        _this.searchPlugin(value);
      }
    });

     */
    this.$toolbar.BACK.click(function () {
      _this.hide();
      //_this.showButtonSearch();
      //_this.$toolbar.SEARCH_TEXT.val('');
      _this.fireEvent('back', _this);
    });
    this.$toolbar.REPLACE.click(function () {
      var dialog = this.createSearchPluginDialog();
      dialog.clearSelected();
      dialog.show();
    }.createDelegate(this));
    /*
    this.$toolbar.LOAD.click(function () {
      var __name = _this.$toolbar.SEARCH_TEXT.val() || "";
      $.postJSON(_this.url.free_plugin, {name: __name}, function (data) {
        _this.rendererPlugin();
      }, {
        mask: _this.getMask(),
        msg: iNet.resources.ajaxLoading.loading
      });
    });

     */
    this.$toolbar.SAVE.click(function () {
      var params = {
        pageID: _this.getPage()
      };
      params[_this.getArea()] = _this.getPluginSelect();
      _this.updatePlugin(params, function (data) {
        if (data.type !== CMSConfig.TYPE_ERROR) {
          _this.success('Thay đổi plugin', 'Thay đổi plugin thành công');
        } else {
          _this.error('Thay đổi plugin', 'Thay đổi plugin xảy ra lỗi');
        }
      });
    });
    this.$plugin.list_plugin.on('click', '.btn-setting-content', function () {
      var el = this;
      var index = _this.plugins.findIndex(function (item) {
        return item.uuid === $(el).attr('data-uuid');
      });
     // console.log('index: ', index, _this.plugins[index]);
      if (index !== -1) {
        _this.setTypePlugin(_this.plugins[index].pluginTypes || []);
      }
      //console.log('view_content: ', _this);
      _this.fireEvent('view_content', _this, {
        page: _this.getPage(),
        area: _this.getArea(),
        plugin: $(this).attr('data-name'),
        types: _this.getTypePlugin(),
        name: _this.getNamePage()
      });
    });
    this.$plugin.list_plugin.on('click', '.btn-setting-info', function () {
      var el = this;
      var index = _this.plugins.findIndex(function (item) {
        return item.uuid === $(el).attr('data-uuid');
      });
      //console.log('index: ', index, _this.plugins[index]);
      if (index !== -1) {
        _this.setTypePlugin(_this.plugins[index].pluginTypes || []);
      }
      _this.fireEvent('view_info', _this, {
        page: _this.getPage(),
        area: _this.getArea(),
        plugin: $(this).attr('data-name'),
        types: _this.getTypePlugin(),
        name: _this.getNamePage()
      });
    });
  };
  iNet.extend(iNet.ui.admin.ListPluginWg, iNet.ui.ViewWidget, {
    /*
    showButtonSearch: function () {
      this.$toolbar.ICON_SEARCH.show();
      this.$toolbar.ICON_CLEAR.hide();
    },
    hideButtonSearch: function () {
      this.$toolbar.ICON_SEARCH.hide();
      this.$toolbar.ICON_CLEAR.show();
    },

     */
    searchPlugin: function (value) {
      //this.listPluginByArea(value);
      /*
      this.$plugin.list_plugin.find('.name-plugin').filter(function () {
        $(this).parents('.item-card:first').toggle($(this).text().toLowerCase().indexOf(value.toLowerCase()) !== -1);
      });
       */
    },
    setTypePlugin: function (plugin) {
      this.pluginTypes = plugin;
    },
    getTypePlugin: function () {
      return this.pluginTypes || [];
    },
    updatePlugin: function (params, callback) {
      $.postJSON(this.url.update_plugin, params, function (data) {
        callback && callback(data);
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.saving
      });
    },
    setPluginSelect: function (name) {
      this.plugin = name
    },
    getPluginSelect: function () {
      return this.plugin;
    },
    setNamePage: function (name) {
      this.namePage = name
    },
    getNamePage: function () {
      return this.namePage || '';
    },
    setArea: function (area) {
      this.area = area;
    },
      setPlugin: function (plugin) {
          this.plugin = plugin;
      },
      getPlugin: function () {
          return this.plugin;
      },
    getArea: function () {
      return this.area;
    },
    setPage: function (page) {
      this.page = page;
    },
    getPage: function () {
      return this.page;
    },
    rendererHtmlPlugin: function (items) {
      var html = '';
      var _this = this;
      for (var i = 0; i < items.length; i++) {
        //console.log(" items[i]",  items[i]);
        var __plugin = items[i] || {};
        console.log("__plugin: ", __plugin);
        if(__plugin.createdTime){
          __plugin.createdTime = new Date(__plugin.createdTime).format('d/m/Y');
        } else
          __plugin.createdTime = "Không xác định";
        __plugin['image'] = this.url.url_img + '?name=' + __plugin.name;
        __plugin.publisherCls = iNet.isEmpty(__plugin.publisher) ? 'hide' : '';
        __plugin.briefCls = iNet.isEmpty(__plugin.brief) ? 'hide' : '';
        html += iNet.Template.parse('tpl-list-plugin', __plugin);
      }
      this.$plugin.list_plugin.html(html);
      /*
      this.$plugin.list_plugin.on('click', '[name="plugin-check"]', function () {
        //console.log('$(this)',$(this));
        if ($(this).is(':checked')) {
          $('[name="plugin-check"]').prop('checked', false);
          $(this).prop('checked', true);
          _this.setPluginSelect($(this).val());
        }
      });

       */
    },
    listPluginByArea: function (area, callback) {
      var _this = this;
      $.getJSON(this.url.list_area, {
        area: area || ''
      },function (result) {
        var __result = result || {};
        var __elements = __result.elements || [];
        var __element , __plugins= [];
        for(var i = 0,count=__elements.length; i < count ; i++) {
          __element = __elements[i] || {};
          if(__element.hasOwnProperty('plugin')) {
            __plugins.push(__element['plugin']);
          } else {
            __plugins.push({
              name:  __element.pluginName
            })
          }
        }
        _this.plugins =  __plugins;
        _this.rendererHtmlPlugin(__plugins);
        _this.showLoading();

        callback && callback(__plugins)

      } , {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.loading
      })
    },
    updatePluginName: function(pluginName){
      var params = {
        pageID: this.getPage()
      };
      var __area = this.getArea();
      params[__area] = pluginName;
      this.updatePlugin(params, function (data) {
        if (data.type !== CMSConfig.TYPE_ERROR) {
          this.fireEvent('updated', {
            area: __area,
            pluginName: pluginName
          });
          this.success('Thay đổi plugin', 'Thay đổi plugin thành công');
          this.rendererPlugin();
        } else {
          this.error('Thay đổi plugin', 'Thay đổi plugin xảy ra lỗi');
        }
      }.bind(this));
    },
    createSearchPluginDialog: function () {
      if(!this.searchPluginDialog) {
        this.searchPluginDialog =  new iNet.ui.admin.SearchPluginDialog();
        this.searchPluginDialog.on('select', function (plugin) {
          if(plugin) {
            console.log(plugin);
            this.updatePluginName(plugin.name);
          }
        }.bind(this))
      }
      return this.searchPluginDialog;
    }
  });
});
