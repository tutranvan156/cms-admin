/**
 * #PACKAGE: admin
 * #MODULE: menu-item-design
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:03 17/06/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file MenuItemDesign.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.MenuItemDesign
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.MenuItemDesign');
  iNet.ui.admin.MenuItemDesign = function (options) {
    var that = this;
    iNet.apply(this, options || {});
    this.id = 'menu-item-design-wg';
    this.iframeAce = null;
    this.$toolbar = {
      SAVE: $('#design-btn-save-ace'),
      VIEW: $('#design-btn-view'),
      BACK: $('#design-btn-back'),
      CONTAINER: $('#btnContainer'),
      ROW: $('#btnRow'),
      BTN_GROUP: $('#btn-group-editor'),
      PREVIEW: $('#show-preview'),
      ADD_IMAGE: $('#btn-add-image'),
      ADD_FILE: $('#btn-add-file'),
      FORMAT_CODE: $('#btn-format-code')
    };

    this.$form = {
      preview_content: $('#preview-content')
    };
    this.editorCss = new iNet.ui.admin.AceEditor({
      id: 'editor-css',
      mode: CMSConfig.ACE_MODE.CSS
    });
    this.editorJs = new iNet.ui.admin.AceEditor({
      id: 'editor-js',
      mode: CMSConfig.ACE_MODE.JS
    });
    this.editorHtml = new iNet.ui.admin.AceEditor({
      id: 'editor-html',
      mode: CMSConfig.ACE_MODE.HTML
    });
    iNet.ui.admin.MenuItemDesign.superclass.constructor.call(this);
    this.$toolbar.ADD_FILE.click(function () {
      if (that.getTypeEditor() === CMSConfig.ACE_MODE.HTML) {
        CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_DOCUMENT, true, function (data) {
          var $data = data || [];
          var html = '';
          if ($data.length > 0) {
            var __path = window.location.origin;
            for (var i = 0; i < $data.length; i++) {
              html += '<a href="' + __path + CMSUtils.getMediaPath($data[i], true) + '" target="_blank"/>'
            }
            that.editorHtml.insertContent(html);
          }
        });
      }
    });

    this.$toolbar.ADD_IMAGE.click(function () {
      if (that.getTypeEditor() === CMSConfig.ACE_MODE.HTML) {
        CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_IMAGE, true, function (data) {
          var $data = data || [];
          var html = '';
          if ($data.length > 0) {
            var __path = window.location.origin;
            for (var i = 0; i < $data.length; i++) {
              html += '<img src="' + __path + CMSUtils.getMediaPath($data[i]) + '"/>';
            }
            that.editorHtml.insertContent(html);
          }
        });
      }
    });

    this.$toolbar.CONTAINER.click(function () {
      that.editorHtml.addContainer();
    });
    this.$toolbar.ROW.click(function () {
      that.editorHtml.addRow();
    });
    this.$toolbar.BACK.click(function () {
      that.hide();
      if (that.iframeAce) {
        that.iframeAce.remove();
        that.iframeAce = null;
      }
      that.editorHtml.setValue('');
      that.editorCss.setValue('');
      that.editorJs.setValue('');
      that.fireEvent('back');
    });
    this.$toolbar.BTN_GROUP.on('click', '[data-type]', function () {
      var type = $(this).attr('data-type');
      $('[data-type]').removeClass('active');
      $(this).addClass('active');
      $('.editor').parent().hide();
      if (type === 'data-preview') {
        that.previewIframe();
        that.$form.preview_content.show();
        that.setTypeEditor('');
        that.disabledBtnMedia();
      } else {
        $('[' + type + ']').show();
        that.$form.preview_content.hide();
        that.setTypeEditor(type);
        if (that.getTypeEditor() === CMSConfig.ACE_MODE.HTML) {
          that.enableBtnMedia();
        } else {
          that.disabledBtnMedia();
        }
      }
    });
    /**
     * Click Preview HTML by Iframe
     * */
    this.$toolbar.PREVIEW.click(function () {
    });

    /**
     * Click Save content to tinymce Editor
     * */
    this.$toolbar.SAVE.click(function () {
      that.previewIframe();
      var contentIframe = '<html>' + that.iframeAce.contents().find("html").html() + '</html>';
      that.fireEvent('save_ace', contentIframe);
    });
    /**
     * Click BUTTON Formar code in editor
     * */
    this.$toolbar.FORMAT_CODE.click(function () {
      that.editorHtml.formatCode(CMSConfig.ACE_MODE.HTML);
      that.editorJs.formatCode(CMSConfig.ACE_MODE.JS);
      that.editorCss.formatCode(CMSConfig.ACE_MODE.CSS);
    });
  };
  iNet.extend(iNet.ui.admin.MenuItemDesign, iNet.ui.ViewWidget, {
    disabledBtnMedia: function () {
      FormUtils.disableButton(this.$toolbar.ADD_IMAGE, true);
      FormUtils.disableButton(this.$toolbar.ADD_FILE, true);
    },
    enableBtnMedia: function () {
      FormUtils.disableButton(this.$toolbar.ADD_IMAGE, false);
      FormUtils.disableButton(this.$toolbar.ADD_FILE, false);
    },
    setTypeEditor: function (type) {
      this.typeEditor = type;
    },
    getTypeEditor: function () {
      return this.typeEditor || '';
    },
    getTagInHead: function (dom, inner) {
      var length = dom.length;
      var html = '';
      if (length !== 0) {
        for (var i = 0; i < length; i++) {
          if (inner) {
            html += dom[i].innerHTML;
          } else {
            html += dom[i].outerHTML;
          }
        }
      }
      return html;
    },
    /**
     * get Tags in <head> html : meta, link
     * */
    getContentByType: function (type) {
      var regex = '';
      var $content = $(this.getContent());
      if (type === "style") {
        for (var i = 0; i < $content.length; i++) {
          if ($content[i].localName === type) {
            regex += $content[i].innerHTML;
          }
        }
      } else {
        for (var i = 0; i < $content.length; i++) {
          if ($content[i].localName === type) {
            regex += $content[i].innerHTML;
          }
        }
      }
      return regex;
    },
    setContent: function (x) {
      this.content = x;
    },
    getContent: function () {
      return this.content || '';
    },
    setContentCss: function () {
      var $div = $('<div>').html(this.getContent());
      var $css = this.getTagInHead($div.find('style'), true);
      this.editorCss.setValue($css, CMSConfig.ACE_MODE.CSS);
    },
    setContentJs: function () {
      var $div = $('<div>').html(this.getContent());
      var $script = this.getTagInHead($div.find('script'), true);
      this.editorJs.setValue($script, CMSConfig.ACE_MODE.JS);
    },
    setContentHtml: function () {
      $('[data-type=' + CMSConfig.ACE_MODE.HTML + ']').trigger('click');
      var $div = $('<div>').html(this.getContent());
      $div.find('style').remove();
      $div.find('script').each(function () {
        if (this.innerHTML) {
          this.remove();
        }
      });
      // html.replace(/<script.*?<\/script>/g, '');
      // html.replace(/<style.*?<\/style>/g, '');
      this.editorHtml.setValue($div.html(), CMSConfig.ACE_MODE.HTML);
    },

    previewIframe: function () {
      var loading = new iNet.ui.form.LoadingItem({
        maskBody: $('#menu-item-design-wg'),
        msg: 'Đang tải trang ...'
      });
      if (this.iframeAce) {
        this.iframeAce.remove();
        this.iframeAce = null;
      }
      this.iframeAce = $('<iframe>', {
        src: 'about:lank',
        id: iNet.generateUUID(),
        width: '100%',
        height: '80vh',
        frameborder: 0,
        scrolling: 'yes'
      }).appendTo('#preview-content');
      var $div = $('<div>').html(this.editorHtml.getValue());
      var $link = this.getTagInHead($div.find('link'));
      var $meta = this.getTagInHead($div.find('meta'));
      $div.find('link').remove();
      $div.find('meta').remove();
      this.iframeAce.contents().find('body').html($div.html());
      this.iframeAce.contents().find('head')
          .append('<style>' + this.editorCss.getValue() + '</style>')
          .append($link)
          .append($meta);
      if (this.editorJs.getValue()) {
        this.iframeAce.contents().find('body').append($('<script>').html(this.editorJs.getValue()));
      }
      loading.destroy();
    }
  });
});
