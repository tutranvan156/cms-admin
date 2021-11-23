/**
 * #PACKAGE: common
 * #MODULE: little-editor
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17:06 21/09/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file LittleEditor.js
 */
$(function () {
  /**
   * @class iNet.ui.common.LittleEditor
   * @extends iNet.ui.form.ContentEditor
   */
  iNet.ns('iNet.ui.common.LittleEditor');
  iNet.ui.common.LittleEditor = function (options) {
    var modalPage = null;
    iNet.apply(this, options || {});
    var _this = this;
    this.id = this.id || '#tinymce-editor';
    this.defaultOptions = this.defaultOptions || {
      selector: this.id,
      theme: "modern",
      skin: "lightgray",
      menubar: true,
      convert_urls: false,
      setup: function (editor) {
        editor.addButton('customlink', {
          text: 'Liên kết trang',
          icon: false,
          onclick: function () {
            console.log('click...');
            tinymce.fire('custom_link');
          }
        });
      },
      plugins: [
        "autolink link image lists charmap preview hr anchor spellchecker fullpage",
        "searchreplace wordcount code fullscreen insertdatetime media",
        "save table contextmenu emoticons template paste textcolor imagetools ipreview inetmedia inetdocument itemplate colorpicker"
      ],
      toolbar: "undo redo pastetext | styleselect | fontselect fontsizeselect | bold italic strikethrough underline | forecolor backcolor | subscript superscript removeformat " +
          "| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link customlink image mediadocument media | table inettemplate | inetpreview code fullscreen",
      image_caption: true,
      valid_elements: "*[*]",
      extended_valid_elements: "@[itemscope|itemtype|itemprop|content,meta],*[*],script[src|async|defer|type|charset],meta,style,title",
      custom_elements: "*[*],script[charset|defer|language|src|type],style,title,@[itemscope|itemtype|itemprop|content,meta]",
      valid_children: "+body[style],+body[script]",
      content_css: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'],
      verify_html: false,
      media_strict: false,
      fullpage_default_doctype: "<!DOCTYPE html>",
      style_formats: [
        {title: 'Bold text', inline: 'b'},
        {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
        {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
        {title: 'Example 1', inline: 'span', classes: 'example1'},
        {title: 'Example 2', inline: 'span', classes: 'example2'},
        {title: 'Table styles'},
        {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'},
        {
          title: 'Image Left',
          selector: 'img',
          styles: {
            'float': 'left',
            'margin': '0 10px 0 10px'
          }
        },
        {
          title: 'Image Right',
          selector: 'img',
          styles: {
            'float': 'right',
            'margin': '0 0 10px 10px'
          }
        }
      ]
    };
    iNet.ui.common.LittleEditor.superclass.constructor.call(this);
    this.editor.on('mediaimageselector', function () {
      CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_IMAGE, true, function (data) {
        var __data = data || [];
        var __src = '';
        if (__data.length > 0) {
          for (var i = 0; i < __data.length; i++) {
            __src = CMSUtils.getMediaPath(__data[i]);
            _this.editor.inetmediaAddImage(__src, __data[i]);
          }
        }
      });
    });
    this.editor.on('mediaimageupload', function () {
      CMSUtils.loadUploader(CMSConfig.ASSET_TYPE_IMAGE, true, 'image/*', function (src, data) {
        var __src = src || '';
        var __data = data || {};
        if (!iNet.isEmpty(__src)) {
          _this.editor.inetmediaAddImage(__src, __data);
        }
      });
    });
    this.editor.on('mediaimagelink', function () {
      if (!_this.imgLinkDlg) {
        var __dialogId = iNet.alphaGenerateId();
        var __dialogContent = '<div class="row"><div class="col-sm-3 col-md-3"><label>' + iNet.resources.cmsadmin.media.image_link + '</label></div>';
        __dialogContent += '<div class="col-sm-9 col-md-9"><input type="text" class="col-sm-12 col-md-12 form-control" id="image-link-txt-link-' + __dialogId + '"></div></div>';
        __dialogContent += '<div class="row"><div class="col-sm-3 col-md-3"><label>' + iNet.resources.cmsadmin.media.image_link_note + '</label></div>';
        __dialogContent += '<div class="col-sm-9 col-md-9"><input type="text" class="col-sm-12 col-md-12 form-control" id="image-link-txt-note-' + __dialogId + '"></div></div>';
        _this.imgLinkDlg = new iNet.ui.dialog.ModalDialog({
          id: 'dialog-image-link-' + __dialogId,
          title: '<i class="icon-link"></i> ' + iNet.resources.cmsadmin.media.image_link_title,
          buttons: [{
            text: iNet.resources.message.button.ok,
            cls: 'btn-primary',
            icon: 'icon-ok icon-white',
            fn: function () {
              var __src = $('#image-link-txt-link-' + __dialogId).val() || '';
              var __title = $('#image-link-txt-note-' + __dialogId).val() || '';
              if (!iNet.isEmpty(__src)) {
                _this.editor.inetmediaAddImage(__src, {title: __title});
              }
              _this.imgLinkDlg.hide();
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              _this.imgLinkDlg.hide();
            }
          }]
        });
      }
      _this.imgLinkDlg.setContent(__dialogContent);
      _this.imgLinkDlg.show();
    });
    this.editor.on('mediadocumentselector', function () {
      console.log('document selector', CMSConfig.ASSET_TYPE_DOCUMENT);
      CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_DOCUMENT, true, function (data) {
        var __data = data || [];
        var __src = '';
        if (__data.length > 0) {
          for (var i = 0; i < __data.length; i++) {
            __src = CMSUtils.getMediaPath(__data[i], true);
            _this.editor.inetMediaAddDocument(__src, __data[i]);
          }
        }
      });
    });
    this.editor.on('mediadocumentupload', function () {
      CMSUtils.loadUploader(CMSConfig.ASSET_TYPE_DOCUMENT, true, '*', function (src, data) {
        var __src = src || '';
        var __data = data || {};
        if (!iNet.isEmpty(__src)) {
          _this.editor.inetMediaAddDocument(__src, __data);
        }
      });
    });
    this.editor.on('custom_link', function () {
      if (!modalPage) {
        modalPage = new iNet.ui.admin.ModalPageContent();
      }
      var text = _this.editor.activeEditor.selection.getContent();
      modalPage.showModal();
      modalPage.setTextSelect(text || '');
      modalPage.on('insert_link', function (e) {
        var html = '<a href="#" data-uuid="' + e.menuID + '" data-type="' + e.typePage + '" target="' + e.type + '">' + e.text + '</a>';
        if (text) {
          _this.editor.activeEditor.selection.setContent(html);
        } else {
          _this.editor.execCommand('mceInsertContent', false, html);
        }
      });
    });
    this.editor.on('mediadocumentlink', function () {
      if (!_this.documentLinkDlg) {
        var __dialogId = iNet.alphaGenerateId();
        var __dialogContent = '<div class="row"><div class="col-sm-3 col-md-3"><label>' + iNet.resources.cmsadmin.media.image_link + '</label></div>';
        __dialogContent += '<div class="col-sm-9 col-md-9"><input type="text" class="col-sm-12 col-md-12 form-control" id="image-link-txt-link-' + __dialogId + '"></div></div>';
        __dialogContent += '<div class="row"><div class="col-sm-3 col-md-3"><label>' + iNet.resources.cmsadmin.media.image_link_note + '</label></div>';
        __dialogContent += '<div class="col-sm-9 col-md-9"><input type="text" class="col-sm-12 col-md-12 form-control" id="image-link-txt-note-' + __dialogId + '"></div></div>';
        _this.documentLinkDlg = new iNet.ui.dialog.ModalDialog({
          id: 'dialog-image-link-' + __dialogId,
          title: '<i class="icon-link"></i> ' + iNet.resources.cmsadmin.media.image_link_title,
          buttons: [{
            text: iNet.resources.message.button.ok,
            cls: 'btn-primary',
            icon: 'icon-ok icon-white',
            fn: function () {
              var __src = $('#image-link-txt-link-' + __dialogId).val() || '';
              var __title = $('#image-link-txt-note-' + __dialogId).val() || '';
              if (!iNet.isEmpty(__src)) {
                _this.editor.inetMediaAddDocument(__src, {title: __title});
              }
              _this.documentLinkDlg.hide();
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              _this.documentLinkDlg.hide();
            }
          }]
        });
      }
      _this.documentLinkDlg.setContent(__dialogContent);
      _this.documentLinkDlg.show();
    });
  };
  iNet.extend(iNet.ui.common.LittleEditor, iNet.ui.form.ContentEditor, {
    _initEditor: function () {
      this.editor.init(iNet.apply(this.defaultOptions, {
        language: iNet.lang,
        imediaData: [{
          code: 'LIB_IMAGE',
          name: 'Chọn hình ảnh'
        }, {
          code: 'UPLOAD_IMAGE',
          name: 'Tải lên hình ảnh'
        }, {
          code: 'LINK_IMAGE',
          name: 'Nhập đường dẫn hình ảnh'
        }],
        init_instance_callback: function (editor) {
          //console.log('[LittleEditor]init_instance_callback', editor);
          if(this.init_instance_callback) {
            this.init_instance_callback(editor);
          }
        }.bind(this)
      }));
    },
    getValue: function () {
      return this.getActiveEditor() !== null ? this.getActiveEditor().getContent({format: 'raw'}) : '';
    },
    setValue: function (value) {
      //console.log('[setValue]', this.editorReady);
      if(this.editorReady) {
        this.getActiveEditor().setContent(value || '');
      } else {
        this.init_instance_callback = function (editor) {
          editor.setContent(value || '');
          this.editorReady = true;
        }.bind(this);
      }
    }
  });
});
