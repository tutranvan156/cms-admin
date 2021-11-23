/**
 * #PACKAGE: admin
 * #MODULE: content-category-plugin
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 15:31 21/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ContentCategoryPlugin.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ContentCategoryPlugin
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ContentCategoryPlugin');
  iNet.ui.admin.ContentCategoryPlugin = function (options) {
    var _this = this;
    var categoryModal = null;
    this.id = this.id || 'box-category';
    iNet.apply(this, options || {});

    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.module = 'layout';
    this.$toolbar = {
      ADD: $('#btn-add-category')
    };
    this.url = {
      list_category: iNet.getPUrl('cms/category/list')
    };
    this.$box = {
      content: $('#box-category'),
      box_group: $('.box-group'),
      box_none: $('.box-none')
    };

    iNet.ui.admin.ContentCategoryPlugin.superclass.constructor.call(this);
    this.on('show_modal', function (select) {

    });
  };
  iNet.extend(iNet.ui.admin.ContentCategoryPlugin, iNet.ui.ViewWidget, {
    setAssetCategory: function (asset) {
      this.assetCategory = asset;
    },
    getAssetCategory: function () {
      return this.assetCategory || [];
    },
    setCategorySelected: function (cate) {
      this.categorySelected = cate;
    },
    getCategorySelected: function () {
      return this.categorySelected || [];
    },
    setCategory: function (category) {
      this.category = category;
    },
    getCategory: function () {
      return this.category || [];
    },
    renderHtmlCategory: function (data) {
      var length = data.length;
      if (length !== 0) {
        var html = '';
        for (var i = 0; i < length; i++) {
          html += iNet.Template.parse('tpl-item-group', data[i]);
        }
        this.$box.content.find('.box-none').hide();
        this.$box.content.find('ul').html(html);
        this.$box.content.find('.box-group').show();
      } else {
        this.$box.content.find('.box-none').show();
        this.$box.content.find('ul').html('');
        this.$box.content.find('.box-group').hide();
      }
    },
    listCategory: function () {
      var _this = this;
      $.getJSON(this.url.list_category, {}, function (data) {
        if (data.type !== CMSConfig.TYPE_ERROR) {
          var items = data.items || [];
          _this.setCategory(items);
        }
      });
    }
  });
});
