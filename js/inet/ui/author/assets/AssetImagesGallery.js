/**
 * #PACKAGE: author
 * #MODULE: asset-images-gallery
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 14:51 13/06/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file AssetImagesGallery.js
 */
$(function () {
  /**
   * @class iNet.ui.author.AssetImagesGallery
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.author.AssetImagesGallery');
  iNet.ui.author.AssetImagesGallery = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.tplId = 'tpl-list-image-gallery';
    this.id = this.id || 'content-gallery-images';
    this.url = {
      list_category: iNet.getPUrl('cms/asset/category'),
      list_image: iNet.getPUrl('cms/asset/list'),
      view_image: iNet.getPUrl('cms/asset/photoview')
    };
    this.$toolbar = {
      SAVE: $('#btn-check-image')
    };
    this.$modal = {
      modal: $('#modal-gallery-images'),
      select_category: $('#gallery-images-category'),
      list_image: $('#list-image-gallery')
    };
    this.listCategoryImage({type: CMSConfig.ASSET_TYPE_IMAGE}, function (data) {
      var items = data.elements || [];
      var length = items.length;
      var html = '';
      _this.__data = data;
      for (var i = 0; i < length; i++) {
        html += '<option value="' + items[i] + '">' + items[i] + '</option>';
      }
      _this.$modal.select_category.html(html);
      if (length !== 0) {
        _this.setParams(items[0])
        _this.listImageByCategory(_this.getParams(), function (data) {
          //todo
          var items = data.items || [];
          _this.renderImage(items);
        });
      }
    });

    iNet.ui.author.AssetImagesGallery.superclass.constructor.call(this);

    this.$toolbar.SAVE.click(function () {
      _this.fireEvent('save_avatar', _this.getSrcImage());
      _this.hideModal();
    });

    this.$modal.select_category.on('change', function () {
      _this.setParams($(this).val())
      _this.listImageByCategory(_this.getParams(), function (data) {
        var items = data.items || [];
        _this.renderImage(items);
      });
    });

    this.$modal.modal.on('click', '.thumbnail', function () {
      _this.$toolbar.SAVE.prop('disabled', false);
      $('.thumbnail').removeClass('active');
      $(this).addClass('active');
      _this.setSrcImage($(this).children('img').attr('src'));
    });
  };
  iNet.extend(iNet.ui.author.AssetImagesGallery, iNet.ui.WidgetExt, {
    setSrcImage: function (src) {
      this.image = src;
    },
    getSrcImage: function () {
      return this.image || '';
    },
    renderImage: function (data) {
      var html = '';
      var length = data.length;
      for (var i = 0; i < length; i++) {
        data[i]['image'] = this.url.view_image + '?code=' + data[i].code;
        html += iNet.Template.parse(this.tplId, data[i]);
      }
      this.$modal.list_image.html(html);
    },
    setParams: function (category) {
      this.params = {
        type: CMSConfig.ASSET_TYPE_IMAGE,
        category: category,
        order: '-created',
        pageSize: 0
      }
    },
    getParams: function () {
      return this.params;
    },
    showModal: function () {
      this.$modal.modal.modal('show');
    },
    hideModal: function () {
      this.$modal.modal.modal('hide');
    },
    listCategoryImage: function (params, callback) {
      $.getJSON(this.url.list_category, params, function (data) {
        if (data.type !== CMSConfig.TYPE_ERROR) {
          callback && callback(data);
        }
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.deleting
      });
    },
    listImageByCategory: function (params, callback) {
      $.getJSON(this.url.list_image, params, function (data) {
        callback && callback(data);
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.deleting
      });
    }
  });
});
