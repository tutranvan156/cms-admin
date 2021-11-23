// #PACKAGE: common
// #MODULE: cms-content-editor
/**
 * tinymce editor
 * created by huyendv@inetcloud.vn
 * 10:05 26/06/2015
 */
$(function () {
  /**
   * @class iNet.ui.common.ContentEditor
   * @extends iNet.ui.form.ContentEditor
   */
  iNet.ns('iNet.ui.common.ContentEditor');
  iNet.ui.common.ContentEditor = function (config) {
    var that = this, __cog = config || {};
    this.id = this.id || '#tinymce-editor';
    iNet.apply(this, __cog);
    this.defaultOptions = this.defaultOptions || {
      selector: this.id,
      height: "150",
      theme: "modern",
      skin: "lightgray",
      menubar: false,
      convert_urls: false,
      plugins: [
        "autolink link image lists charmap preview hr anchor spellchecker",
        "searchreplace wordcount code fullscreen insertdatetime media",
        "save table contextmenu emoticons template paste textcolor table imagetools ipreview inetmedia inetdocument itemplate colorpicker"
      ],
      toolbar: "undo redo pastetext | styleselect | fontselect fontsizeselect | bold italic strikethrough underline | forecolor backcolor | subscript superscript removeformat " +
          "| alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link customlink image mediadocument media | table inettemplate | inetpreview code fullscreen",
      image_caption: true,
      valid_elements: "*[*]",
      extended_valid_elements: "*[*],script[src|async|defer|type|charset],style",
      custom_elements: "*[*],script[charset|defer|language|src|type],style",
      valid_children: "+body[style],+body[script]",
      verify_html: false,
      media_strict: false,

      style_formats: [
        {title: 'Bold text', inline: 'b'},
        {title: 'Red text', inline: 'span', styles: {color: '#ff0000'}},
        {title: 'Red header', block: 'h1', styles: {color: '#ff0000'}},
        {title: 'Example 1', inline: 'span', classes: 'example1'},
        {title: 'Example 2', inline: 'span', classes: 'example2'},
        {title: 'Table styles'},
        {title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
      ]
    };
    iNet.ui.common.ContentEditor.superclass.constructor.call(this);
    this.editor.on('mediaimageselector', function () {
      CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_IMAGE, true, function (data) {
        var __data = data || [];
        var __src = '';
        if (__data.length > 0) {
          for (var i = 0; i < __data.length; i++) {
            __src = CMSUtils.getMediaPath(__data[i]);
            that.editor.inetmediaAddImage(__src, __data[i]);
          }
        }
      });
    });
    this.editor.on('mediaimageupload', function () {
      CMSUtils.loadUploader(CMSConfig.ASSET_TYPE_IMAGE, true, 'image/*', function (src, data) {
        var __src = src || '';
        var __data = data || {};
        if (!iNet.isEmpty(__src)) {
          that.editor.inetmediaAddImage(__src, __data);
        }
      });
    });
    this.editor.on('mediaimagelink', function () {
      if (!that.imgLinkDlg) {
        var __dialogId = iNet.alphaGenerateId();
        var __dialogContent = '<div class="row"><div class="col-sm-3 col-md-3"><label>' + iNet.resources.cmsadmin.media.image_link + '</label></div>';
        __dialogContent += '<div class="col-sm-9 col-md-9"><input type="text" class="col-sm-12 col-md-12 form-control" id="image-link-txt-link-' + __dialogId + '"></div></div>';
        __dialogContent += '<div class="row"><div class="col-sm-3 col-md-3"><label>' + iNet.resources.cmsadmin.media.image_link_note + '</label></div>';
        __dialogContent += '<div class="col-sm-9 col-md-9"><input type="text" class="col-sm-12 col-md-12 form-control" id="image-link-txt-note-' + __dialogId + '"></div></div>';
        that.imgLinkDlg = new iNet.ui.dialog.ModalDialog({
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
                that.editor.inetmediaAddImage(__src, {title: __title});
              }
              that.imgLinkDlg.hide();
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              that.imgLinkDlg.hide();
            }
          }]
        });
      }
      that.imgLinkDlg.setContent(__dialogContent);
      that.imgLinkDlg.show();
    });
    this.editor.on('mediadocumentselector', function () {
      console.log('document selector', CMSConfig.ASSET_TYPE_DOCUMENT);
      CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_DOCUMENT, true, function (data) {
        var __data = data || [];
        var __src = '';
        if (__data.length > 0) {
          for (var i = 0; i < __data.length; i++) {
            __src = CMSUtils.getMediaPath(__data[i], true);
            that.editor.inetMediaAddDocument(__src, __data[i]);
          }
        }
      });
    });
    this.editor.on('mediadocumentupload', function () {
      CMSUtils.loadUploader(CMSConfig.ASSET_TYPE_DOCUMENT, true, '*', function (src, data) {
        var __src = src || '';
        var __data = data || {};
        if (!iNet.isEmpty(__src)) {
          that.editor.inetMediaAddDocument(__src, __data);
        }
      });
    });
    this.editor.on('mediadocumentlink', function () {
      if (!that.documentLinkDlg) {
        var __dialogId = iNet.alphaGenerateId();
        var __dialogContent = '<div class="row"><div class="col-sm-3 col-md-3"><label>' + iNet.resources.cmsadmin.media.image_link + '</label></div>';
        __dialogContent += '<div class="col-sm-9 col-md-9"><input type="text" class="col-sm-12 col-md-12 form-control" id="image-link-txt-link-' + __dialogId + '"></div></div>';
        __dialogContent += '<div class="row"><div class="col-sm-3 col-md-3"><label>' + iNet.resources.cmsadmin.media.image_link_note + '</label></div>';
        __dialogContent += '<div class="col-sm-9 col-md-9"><input type="text" class="col-sm-12 col-md-12 form-control" id="image-link-txt-note-' + __dialogId + '"></div></div>';
        that.documentLinkDlg = new iNet.ui.dialog.ModalDialog({
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
                that.editor.inetMediaAddDocument(__src, {title: __title});
              }
              that.documentLinkDlg.hide();
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              that.documentLinkDlg.hide();
            }
          }]
        });
      }
      that.documentLinkDlg.setContent(__dialogContent);
      that.documentLinkDlg.show();
    });
    this.editor.on('ipreview', function (data) {
      if (data) {
        that.fireEvent('preview', data.uri);
      }
    });
  };
  iNet.extend(iNet.ui.common.ContentEditor, iNet.ui.form.ContentEditor, {
    loadParagraph: function (callback) {
      $.postJSON(iNet.getPUrl('cms/template/list'), {type: 'PARAGRAPH'}, function (result) {
        callback && callback(result);
      });
    },
    loadPreviewService: function (callback) {
      $.postJSON(iNet.getPUrl('cmsfirm/theme/service'), {service: CMSConfig.ENTRY_PAGE_SERVICE}, function (result) {
        callback && callback(result);
      });
    },
    init: function () {
      var _this = this;
      this.loadParagraph(function (paragraph) {
        var templates = null;
        if (paragraph.type !== CMSConfig.TYPE_ERROR) {
          templates = paragraph.items || [];
        }
        _this.loadPreviewService(function (pageData) {
          var elements = [];
          if (pageData.type !== CMSConfig.TYPE_ERROR) {
            elements = pageData.elements;
          }
          _this._initEditor(templates, elements);
        });
      });
    },
    _initEditor: function (templateData, previewData) {
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
        itemplateData: templateData || [],
        ipreviewData: previewData || [],
        init_instance_callback: function (editor) {
          //console.log('[ContentEditor]init_instance_callback', editor);
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
