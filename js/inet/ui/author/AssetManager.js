// #PACKAGE: author
// #MODULE: cms-asset-manager
$(function () {
  /**
   * @class iNet.ui.author.AssetManager
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.author.AssetManager');
  iNet.ui.author.AssetManager = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);
    this.id = this.id || 'wg-media';
    this.pagingId = this.pagingId || 'paging-tb';
    this.$wg = $('#' + this.id);
    this.$element = this.$wg;
    this.$wrapper = $('#file-list');
    this.assetFolder = this.assetFolder || 'cms_asset';
    this.isEdit = this.isEdit || false;
    this.isSelect = this.isSelect || false;
    this.multiSelect = this.multiSelect || false;
    this.store = new Hashtable();
    this.folders = [];
    this.selected = [];
    this.submiter = {};
    this.uploadIndex = 1;
    var checked = false;
    this.isEditFolder = false;
    this.avatarVideo = null;
    this.sourcePosterVideo = '';
    $("#checkbox-submit-checked").prop( "checked", false );
    this.files = [];
    if (iNet.ui.author.AssetVideo) {
      this.listVideo = new iNet.ui.author.AssetVideo();
      this.listVideo.on('edit_video', function (record) {
        if (!_this.avatarVideo) {
          _this.avatarVideo = new iNet.ui.author.AssetImagesGallery();
        }
        _this.avatarVideo.on('save_avatar', function (src) {
          console.log('[[save_avatar]', src);
          _this.$viewer.$image_avatar.attr('src', src);
          _this.sourcePosterVideo = src;
        });
        viewImage(false, false, record);
      });
    }
    if (iNet.ui.author.AssetDocument) {
      this.listDocument = new iNet.ui.author.AssetDocument();
      this.listDocument.on('edit_document', function (record) {
        viewImage(false, false, record);
      });
    }
    this.isUpload = false;
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.folderInsertLink = '';
    this.codeInsertLink = '';
    var _this = this;
    this.$toolbar = {
      total: $('#paging-tb'),
      back: $('#media-lib-toolbar-btn-back'),
      edit: $('#media-lib-toolbar-btn-edit-file'),
      select: $('#media-lib-toolbar-btn-select-file'),
      cancel: $('#media-lib-toolbar-btn-cancel-file'),
      upload: $('#media-lib-toolbar-btn-upload-file,#file-add-btn'),
      uploadasset: $('#asset-id-input-file'),
      grid: $('#media-lib-toolbar-btn-grid'),
      list: $('#media-lib-toolbar-btn-list'),
      folder: $('#gallery-cbb-folder'),
      create_folder: $('#media-lib-toolbar-btn-create'),
      edit_folder: $('#media-lib-toolbar-btn-edit-folder'),
      delete_folder: $('#media-lib-toolbar-btn-remove-folder'),
      publish_folder: $('#media-lib-toolbar-btn-publish-folder'),
      unpublish_folder: $('#media-lib-toolbar-btn-unpublish-folder'),
      btnSearch: $('#btn-search'),
      inputSearch: $('#search-input'),
      insertLink: $('#btn-insert-link'),
      upload_other: $('#btn-upload-other')
    };
    this.$form = {
      new_folder: $('#new-folder-modal'),
      new_folder_name: $('#new-folder-name'),
      new_folder_ok: $('#new-folder-modal-btn-ok'),
      create_first: $('#new-floder-create-first'),
      upload_video: $('#file-uploader-video'),
      upload_document: $('#file-uploader-document')
    };
    this.$viewer = {
      image_poster_video: $('#avatar-box'),
      $image_avatar: $('#avatar-box-image'),
      viewer: $('#view-image-modal'),
      viewer_img: $('#view-image-img'),
      viewer_name: $('#view-image-name'),
      viewer_date: $('#view-image-date'),
      viewer_type: $('#view-image-type'),
      viewer_size: $('#view-image-size'),
      viewer_pixel: $('#view-image-pixel'),
      viewer_src: $('#view-image-src'),
      viewer_link: $('#view-image-link'),
      next: $('#view-image-next'),
      prev: $('#view-image-prev'),
      description: $('#description-image'),
      position: $('#position-image'),
      image_content: $('.img-container')
    };
    this.$upload = $('#file-uploader');
    this.$modal = $('#media-lib-modal');
    this.url = {
      file: iNet.getPUrl('cms/asset/list'),
      upload: iNet.getPUrl('cms/asset/upload'),
      uploadCheckImage: iNet.getPUrl('cms/egov/asset/upload'),
      delete_file: iNet.getPUrl('cms/asset/remove'),
      view_file: iNet.getPUrl('cms/asset/photoview'),
      folder: iNet.getPUrl('cms/asset/category'),
      folder_published: iNet.getPUrl('cms/asset/pubcategory'),
      create_folder: iNet.getPUrl('cms/asset/create'),
      rename_folder: iNet.getPUrl('cms/asset/rename'),
      delete_folder: iNet.getPUrl('cms/asset/remove'),
      publish_folder: iNet.getPUrl('cms/asset/published'),
      insert_link: iNet.getPUrl('cms/asset/udinfo')
    };
    this.mediaType = {
      image: 'IMAGE',
      document: 'DOCUMENT',
      video: 'VIDEO'
    };

    this.paging = new iNet.ui.common.PagingToolbar({
      id: this.pagingId,
      url: this.url.file,
      params: {type: this.mediaType.image},
      idProperty: 'uuid'
    });


    iNet.ui.author.AssetManager.superclass.constructor.call(this);

    /***************************************************************
     * IMAGE VIEWER
     ***************************************************************/
    var fileList = [];
    var fileStore = new Hashtable();
    var currentView = '';
    var viewImage = function (next, prev, data) {
      if (_this.getType() === _this.mediaType.image) {
        var __index = 0;
        for (var i = 0; i < fileList.length; i++) {
          if (fileList[i].uuid === currentView) {
            __index = i;
            break;
          }
        }
        if (next) {
          __index = (__index < fileList.length - 1) ? __index + 1 : 0;
        } else if (prev) {
          __index = (__index > 0) ? __index - 1 : fileList.length - 1;
        }
        currentView = fileList[__index].uuid;
      }
      var __data = data ? data : fileStore.get(currentView);
      if (fileList.length === 1) {
        _this.$viewer.next.hide();
        _this.$viewer.prev.hide();
      } else {
        _this.$viewer.next.show();
        _this.$viewer.prev.show();
      }
      //console.log('source: ', _this.getPathImage('images/cmsadmin/common/no-thumb.png'));
      _this.sourcePosterVideo = __data.link || '';

      //_this.$viewer.image_poster_video.find('img').attr('src', __data.link ? __data.link : _this.getPathImage('images/cmsadmin/common/no-thumb.png'));

      _this.folderInsertLink = __data.folder;
      _this.codeInsertLink = __data.code;
      _this.$viewer.viewer_name.html(__data.brief);
      _this.$viewer.viewer_date.html(!iNet.isEmpty(__data.created) ? new Date(__data.created).format(iNet.fullDateFormat) : '');
      _this.$viewer.viewer_type.html(__data.mimetype);
      _this.$viewer.viewer_size.html(FileUtils.getSize(__data.size));
      if (_this.getType() === _this.mediaType.image) {
        // _this.$viewer.image_poster_video.hide();
        _this.$viewer.viewer_img.attr('onerror', 'this.src="' + __data.viewUrl + '"');
        _this.$viewer.viewer_img.attr('src', __data.src);
        _this.$viewer.viewer_src.show();
        _this.$viewer.viewer_link.show();
        _this.$viewer.viewer_src.parents('.row').prev().show();
        _this.$viewer.viewer_link.parents('.row').prev().show();
        _this.$viewer.viewer_src.val(__data.viewUrl);
        _this.$viewer.viewer_link.val(__data.link);
        _this.$viewer.image_content.show();
      } else {
        if (_this.getType() === _this.mediaType.video) {
          _this.$viewer.image_poster_video.show();
        }
        _this.$viewer.image_content.hide();
        _this.$viewer.viewer_src.hide();
        _this.$viewer.viewer_link.hide();
        _this.$viewer.viewer_src.parents('.row').prev().hide();
        _this.$viewer.viewer_link.parents('.row').prev().hide();
      }
      _this.$viewer.description.val(__data.description || '');
      _this.$viewer.position.val(__data.position);
      _this.$viewer.viewer.modal('show');
    };
    this.$viewer.next.on('click', function () {
      viewImage(true, false);
    });
    this.$viewer.prev.on('click', function () {
      viewImage(false, true);
    });

    this.$viewer.$image_avatar.click(function () {
      // _this.avatarVideo.showModal();
    });


    /***************************************************************/

    this.$toolbar.upload_other.on('click', function () {
      if (_this.getType() === _this.mediaType.video) {
        _this.$form.upload_video.trigger('click');
      } else if (_this.getType() === _this.mediaType.document) {
        _this.$form.upload_document.trigger('click');
      }
    });

    this.$form.upload_video.on('change', function () {
      _this.listVideo.upload(this.files[0]);
    });
    this.$form.upload_document.on('change', function () {
      _this.listDocument.upload(this.files[0]);
    });

    this.$toolbar.back.click(function () {
      _this.hide();
      _this.setStatusEdit(false);
      _this.changeBtn(false);
      _this.$toolbar.inputSearch.val('');
      _this.listVideo && _this.listVideo.hide();
      _this.listDocument && _this.listDocument.hide();
      _this.fireEvent('back', _this);
    });

    this.$toolbar.create_folder.on('click', function () {
      var __name = _this.getNewFolderName();
      _this.$form.new_folder_name.val(__name).select();
      if (_this.isUpload) _this.$form.create_first.show();
      _this.$form.new_folder.modal('show');
    });

    this.$toolbar.edit_folder.on('click', function () {
      _this.isEditFolder = true;
      var __id = _this.$toolbar.folder.val();
      for (var i = 0; i < _this.folders.length; i++) {
        if (_this.folders[i].uuid === __id) {
          _this.$form.new_folder_name.val(_this.folders[i].name).select();
          _this.$form.new_folder.modal('show');
          break;
        }
      }
    });

    this.$form.new_folder_ok.on('click', function () {
      var __group = _this.getType(),
          __uuid = _this.$toolbar.folder.val(),
          __name = _this.$form.new_folder_name.val();
      if (!_this.isEditFolder) {
        _this.createFolder(__group, __name);
      } else {
        _this.isEditFolder = false;
        _this.editFolder(__uuid, __name);
      }
    });

    this.$form.new_folder_name.on('keyup', function (e) {

      if (e.which === 13) {
        _this.$form.new_folder_ok.click();
      }
    });

    this.$toolbar.delete_folder.on('click', function () {
      _this.deleteFolder();
    });

    this.$viewer.viewer.on('click', '.btn-insert-link', function () {
      $.postJSON(_this.url.insert_link, {
        folder: _this.folderInsertLink,
        code: _this.codeInsertLink,
        link: _this.getType() === _this.mediaType.image ? _this.$viewer.viewer_link.val() : _this.sourcePosterVideo,
        description: _this.$viewer.description.val(),
        position: _this.$viewer.position.val()
      }, function (data) {
        if (data.type === CMSConfig.TYPE_ERROR) {
          _this.error('Cập nhật thông tin', 'Cập nhật thông tin xảy ra lỗi.')
        } else {
          _this.store.put(data.uuid, data);
          _this.$viewer.viewer.modal('hide');
          _this.success('Cập nhật thông tin', 'Cập nhật thông tin thành công.');
          if (_this.getType() === _this.mediaType.document) {
            setTimeout(function () {
              _this.listDocument.load();
            }, 300);
          } else if (_this.getType() === _this.mediaType.video) {
            setTimeout(function () {
              _this.listDocument.load();
            }, 300);
          }
        }
      });
    });

    // Publish folder
    this.$toolbar.publish_folder.on('click', function () {
      if (!_this.publishModalDlg) {
        _this.publishModalDlg = new iNet.ui.dialog.ModalDialog({
          id: 'modal-publish-' + iNet.alphaGenerateId(),
          title: _this.getText('publish_folder', 'media'),
          buttons: [{
            text: iNet.resources.message.button.ok,
            cls: 'btn-primary',
            icon: 'icon-ok icon-white',
            fn: function () {
              _this.publishFolder(this.getOptions());
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              _this.publishModalDlg.hide();
            }
          }]
        });
      }
      _this.publishModalDlg.setOptions({category: _this.getFolder(), published: true, type: _this.getType()});
      _this.publishModalDlg.setTitle(_this.getText('publish_folder', 'media'));
      _this.publishModalDlg.setContent(String.format(_this.getText('publish_folder_text', 'media'), '<b>' + _this.getFolder() + '</b>'));
      _this.publishModalDlg.show();
    });

    // UnPublish folder
    this.$toolbar.unpublish_folder.on('click', function () {
      if (!_this.publishModalDlg) {
        _this.publishModalDlg = new iNet.ui.dialog.ModalDialog({
          id: 'modal-publish-' + iNet.alphaGenerateId(),
          title: _this.getText('unpublish_folder', 'media'),
          buttons: [{
            text: iNet.resources.message.button.ok,
            cls: 'btn-primary',
            icon: 'icon-ok icon-white',
            fn: function () {
              _this.publishFolder(this.getOptions());
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              _this.publishModalDlg.hide();
            }
          }]
        });
      }
      _this.publishModalDlg.setOptions({category: _this.getFolder(), published: false, type: _this.getType()});
      _this.publishModalDlg.setTitle(_this.getText('unpublish_folder', 'media'));
      _this.publishModalDlg.setContent(String.format(_this.getText('unpublish_folder_text', 'media'), '<b>' + _this.getFolder() + '</b>'));
      _this.publishModalDlg.show();
    });

    $('#file-upload-trigger').on('click',function () {
      // console.log('click...uploadasset');
      if (iNet.isEmpty(_this.getFolder())) {
        $('#file-uploader').ace_file_input('disable');
        _this.isUpload = true;
        _this.$toolbar.create_folder.trigger('click');
      }
    });

    $('#file-uploader').ace_file_input({
      style: 'well',
      no_file: 'No File ...',
      btn_choose: 'Kéo thả vào đây hoặc bấm vào để chọn',
      no_icon: 'ace-icon fa fa-cloud-upload',
      btn_change: null,
      icon_remove: 'fa fa-times',
      droppable: true,
      allowExt:  ['jpg', 'jpeg', 'png', 'gif'],
      thumbnail: false//large, fit, small

    }).on('change',function () {
      // console.log('$(this)',$(this));
      var files = $(this).data('ace_input_files');
      // console.log('files--',files);
      if (files.length < 1) {
        files = [];
        return;
      }
      var __files = files || [];
      for (var i = 0; i < __files.length; i++) {
        var __file = __files.item(i) || {};
        // console.log('__file...',__file);
        _this.uploadFile(__file, _this.uploadIndex++);
      }
      $('#file-uploader').ace_file_input('reset_input_ui');
    });

    this.$toolbar.edit.click(function () {
      _this.setEdit(true);
    });
    this.$toolbar.cancel.click(function () {
      _this.setEdit(false);
    });
    this.$toolbar.select.click(function () {
      if (_this.getType() === CMSConfig.ASSET_TYPE_DOCUMENT) {
        _this.selected = _this.listDocument.getSelection();
      }
      _this.fireEvent('selected', _this.selected || []);
    });
    this.$toolbar.folder.on('change', function () {
      var __folder = $(this).val();
      _this.setFolder(__folder);
      _this.checkFolder(__folder);
      _this.load();
    });

    this.$wrapper.on('click', 'div[data-fi] [data-action="dfile"]', function () {
      var $file = $(this).parent().parent().parent();
      // console.log('$file1',$file);
      var __fid = $file.attr('data-fi');
      _this.deleteFile(__fid);
    });
    this.$wrapper.on('click', 'div[data-fi] [data-action="lfile"]', function () {
      var $file = $(this).parent().parent().parent();
      // console.log('$file2',$file);
      if (_this.getType() === _this.mediaType.image) {
        fileList = _this.files;
        fileStore = _this.store;
        currentView = $file.attr('data-fi');
        viewImage(false, false);
      }
    });

    this.$wrapper.on('click', 'div[data-fi] [data-action="sfile"]', function () {
      var $file = $(this).parent().parent().parent();
      // console.log('$file3',$file);
      var __fid = $file.attr('data-fi');
      var __check = $(this).attr('data-check');
      if (!_this.multiSelect) {
        _this.selected = [];
        _this.$wrapper.find('div[data-fi] [data-action="sfile"]').attr('data-check', 0);
        _this.$wrapper.find('div[data-fi] [data-action="sfile"] i').removeClass('icon-check').addClass('icon-check-empty');
      }

      if (__check == 1) {
        $(this).find('i').removeClass('icon-check').addClass('icon-check-empty');
        $(this).attr('data-check', 0);
        // console.log('un-select file', __fid);
        for (var i = _this.selected.length - 1; i >= 0; i--) {
          if (_this.selected[i].uuid === __fid) {
            _this.selected.splice(i, 1);
            break;
          }
        }
        $file.removeClass('active');
      } else {
        var __file = _this.store.get(__fid) || {};
        $(this).find('i').removeClass('icon-check-empty').addClass('icon-check');
        $(this).attr('data-check', 1);
        if (!iNet.isEmpty(__file)) {
          _this.selected.push(__file);
        }
        $file.addClass('active');
      }
    });

    this.$toolbar.inputSearch.on('keydown', function (e) {
      if (e.keyCode === 13) {
        var params = {
          pageNumber: 0,
          filename: _this.$toolbar.inputSearch.val(),
          category: _this.getFolder(),
          type: _this.getType(),
          keyword: _this.$toolbar.inputSearch.val()
        };
        if (_this.getType() !== _this.mediaType.image) {
          params['pageSize'] = 10;
        }
        _this.setParams(params);
        _this.load();
      }
    });
    this.$toolbar.btnSearch.on('click', function () {
      setTimeout(function () {
        var params = {
          pageNumber: 0,
          filename: _this.$toolbar.inputSearch.val(),
          category: _this.getFolder(),
          type: _this.getType(),
          keyword: _this.$toolbar.inputSearch.val()
        };
        if (_this.getType() !== _this.mediaType.image) {
          params['pageSize'] = 10;
        }
        _this.setParams(params);
        _this.load();
      }, 100);
    });

    if (this.isSelect) {
      this.setEdit(false);
    }

    this.getPaging().on('load', function (data) {
      if (data.type !== 'ERR0R') {
        FormUtils.showButton(_this.$toolbar.cancel, _this.isEdit);
        FormUtils.showButton(_this.$toolbar.edit, !_this.isEdit);
        // console.log('data.a',data);
        _this.renderList(data);
      } else {
        FormUtils.showButton(_this.$toolbar.edit, false);
        FormUtils.showButton(_this.$toolbar.cancel, false);
        _this.Error.put(data.errors[0].message);
        _this.error('', _this.Error.get());
      }
      FormUtils.showButton(_this.$toolbar.select, _this.isSelect);
    });
  };
  iNet.extend(iNet.ui.author.AssetManager, iNet.ui.WidgetExt, {
    getPathImage: function (urlImg) {
      if (iNet.staticUrl.charAt(iNet.staticUrl.length - 1) !== '/') {
        return iNet.staticUrl + '/' + urlImg;
      } else {
        return iNet.staticUrl + urlImg;
      }
    },
    //constructor: iNet.ui.author.AssetManager,
    init: function () {
      var _this = this;
      this.loadFolder();
      this.loadPublicFolder(function () {
        _this.checkFolder(_this.getFolder());
      });
    },
    getId: function () {
      return this.id;
    },
    /**
     * @returns {iNet.ui.common.PagingToolbar}
     */
    getPaging: function () {
      return this.paging;
    },
    /**
     * Type of media: IMAGE or DOCUMENT
     * @param type
     */
    setType: function (type) {
      this.type = type;
    },
    getType: function () {
      return this.type || this.mediaType.image;
    },
    setFolder: function (folder) {
      this.folder = folder;
      this.$toolbar.folder.val(folder);
    },
    getFolder: function () {
      return this.folder || this.$toolbar.folder.val();
    },
    setParams: function (data) {
      this.params = data;
      this.params.order = '-created';
    },
    getParams: function () {
      return this.params || {
        type: this.getType(),
        category: this.getFolder(),
        order: '-created'
      };
    },
    setAssetFolder: function (asset) {
      this.assetFolder = asset;
    },
    setStatusEdit: function (isEdit) {
      this.isEdit = isEdit;
    },
    getStatusEdit: function () {
      return this.isEdit;
    },
    setMultiple: function (isMultiple) {
      this.multiSelect = isMultiple || false;
    },
    changeBtn: function (isEdit) {
      FormUtils.showButton(this.$toolbar.edit, !isEdit);
      FormUtils.showButton(this.$toolbar.cancel, isEdit);
    },
    setEdit: function (isEdit) {
      if (isEdit) {
        this.$wrapper.find('[data-ctrl="fctrl"]').show();
        this.$wrapper.find('div[data-fi] [data-action="dfile"]').show();
        this.$wrapper.find('div[data-fi] [data-action="sfile"]').hide();
        this.fireEvent('editclick', this);
      } else if (this.isSelect) {
        this.$wrapper.find('div[data-fi] [data-action="dfile"]').hide();
        this.$wrapper.find('div[data-fi] [data-action="sfile"]').show();
        this.$wrapper.find('[data-ctrl="fctrl"]').show();
      } else {
        this.$wrapper.find('[data-ctrl="fctrl"]').removeAttr('style');
        this.fireEvent('canceledit', this);
      }
      this.isEdit = isEdit;
      this.changeBtn(isEdit);
    },
    load: function () {
      var that = this;
      FormUtils.showButton(that.$toolbar.cancel, that.isEdit);
      FormUtils.showButton(that.$toolbar.edit, !that.isEdit);
      FormUtils.showButton(that.$toolbar.select, that.isSelect);
      if (this.getType() === this.mediaType.video) {
        if (this.listVideo) {
          FormUtils.showButton(this.$toolbar.edit, false);
          this.listVideo.setFolder(this.getFolder());
          this.listDocument.setParams(this.getParams());
          this.listVideo.load();
          this.listVideo.show();
        }
        this.listDocument && this.listDocument.hide();
        this.hide();
      } else if (this.getType() === this.mediaType.document) {
        if (this.listDocument) {
          FormUtils.showButton(this.$toolbar.edit, false);
          this.listDocument.setFolder(this.getFolder());
          this.listDocument.setParams(this.getParams());
          this.listDocument.load();
          this.listDocument.show();
        }
        this.listVideo && this.listVideo.hide();
        this.hide();
      } else {
        this.getPaging().setParams(this.getParams());
        this.getPaging().load();
        this.show();
        this.listDocument && this.listDocument.hide();
        this.listVideo && this.listVideo.hide();
      }
    },
    addFolder: function (data) {
      var __data = data || '';
      if (!iNet.isEmpty(__data)) {
        var __html = '<option value="' + __data + '">' + __data + '</option>';
        this.$toolbar.folder.append(__html);
      }
    },
    loadFolder: function () {
      var that = this;
      var __type = this.getType();
      var __params = {type: __type};
      $.postJSON(that.url.folder, __params, function (json) {
        var __result = json || {};
        if (__result.type !== 'ERROR') {
          var __data = __result.elements || [];
          that.folders = __data;
          that.$toolbar.folder.html('');
          for (var i = 0; i < __data.length; i++) {
            that.addFolder(__data[i]);
          }
          if (that.folders.length > 0) {
            that.$toolbar.folder.val(that.folders[0]);
            that.setFolder(that.folders[0]);
            that.load();
          } else {
            that.setFolder('');
            that.$wrapper.html('');
          }
        } else {
          that.Error.put(__result.errors[0].message);
          that.error('', that.Error.get());
        }
      }, {
        mask: that.getMask(),
        msg: iNet.resources.ajaxLoading.loading
      });
    },
    setPublicFolder: function (publicFolder) {
      this.publishedFolder = publicFolder;
    },
    getPublicFolder: function () {
      return this.publishedFolder;
    },
    loadPublicFolder: function (callback) {
      var _this = this;
      var __fn = callback || iNet.emptyFn;
      $.postJSON(this.url.folder_published, {type: this.getType()}, function (result) {
        _this.setPublicFolder(result.elements);
        _this.$toolbar.folder.change();
        __fn(result);
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.loading
      });
    },
    checkFolder: function (folderName) {
      if (!iNet.isEmpty(folderName) && iNet.isDefined(folderName)) {
        var __publishedFolder = this.getPublicFolder();
        folderName = folderName.toString();
        var isPublic = false;
        for (var i = 0; i < iNet.getSize(__publishedFolder); i++) {
          if (folderName === __publishedFolder[i]) {
            isPublic = true;
            break;
          }
        }
        FormUtils.showButton(this.$toolbar.publish_folder, !isPublic);
        FormUtils.showButton(this.$toolbar.unpublish_folder, isPublic);
      }
    },
    renderList: function (data) {
      var __items = data.items || [];
      this.$wrapper.html('');
      for (var i = 0; i < __items.length; i++) {
        this.$wrapper.append(this.renderFile(__items[i]));
      }
    },
    renderFile: function (data) {
      var file = data || {};
      var tmpNameSplit = file.brief.split('.');
      var __src = CMSUtils.getMediaPath(file);
      var viewUrl = iNet.urlAppend(this.url.view_file, String.format('code={0}', file.code));
      var __name = file.brief.substring(0, (file.brief.length - (tmpNameSplit[(tmpNameSplit.length - 1)].length + 1)));
      file.src = __src;
      file.viewUrl = viewUrl;
      file.name = __name;
      this.store.put(file.uuid, file);
      this.files.push(file);
      var __html = '<div data-fi="' + file.uuid + '" class="file image">';
      __html += '<div class="file-container">';
      __html += '<div data-ctrl="fctrl" class="file-control">';
      __html += '<button data-action="sfile" data-check="0" class="btn btn-success file-ctrl" ' + (this.isSelect ? '' : 'style="display: none;"') + '><i class="icon-check-empty"> </i></button>';
      __html += '<button data-action="dfile" class="btn btn-danger file-ctrl" ' + (!this.isSelect ? '' : 'style="display: none;"') + '><i class="icon-trash"> </i></button>';
      __html += '</div>';
      __html += '<div class="file-content text-center">';
      if (this.getType() == this.mediaType.document) {
        __html += '<i class="icon-file-text-alt"></i>';
      } else {
        __html += '<img data-action="lfile" src="' + __src + '" onerror="this.src=\'' + viewUrl + '\'" />';
      }
      __html += '</div>';
      __html += '</div>';
      __html += '<div class="file-name" style="width: 170px;">' + __name + '</div>';
      __html += '</div>';
      return __html;
    },
    renderUploader: function (name, index) {
      var tmpNameSplit = name.split('.');
      var __name = name.substring(0, (name.length - (tmpNameSplit[(tmpNameSplit.length - 1)].length + 1)));
      var __html = String.format('<div data-fi="" class="file image" id="file-upload-{0}">', index);
      __html += '<div class="file-container">';
      __html += '<div data-ctrl="fctrl" class="file-control">';
      __html += String.format('<button id="file-upload-select-btn-{0}" data-action="sfile" data-check="0" class="btn btn-success file-ctrl" style="display: none;"><i class="icon-check-empty"></i></button>', index);
      __html += String.format('<button id="file-upload-remove-btn-{0}" data-action="dfile" class="btn btn-danger file-ctrl" style="display: none;"><i class="icon-trash"></i></button>', index);
      __html += String.format('<button id="file-upload-cancel-btn-{0}" class="btn btn-danger file-ctrl"><i class="icon-remove"></i></button>', index);
      __html += '</div>';
      __html += '<div class="file-content text-center">';
      if (this.getType() == this.mediaType.document) {
        __html += '<i class="icon-file-text-alt"></i>';
      } else {
        __html += String.format('<img id="file-upload-img-{0}" data-action="lfile" />', index);
      }
      __html += String.format('<div id="file-upload-mask-{0}" class="file-mask" ><div class="progress progress-mini file-progress"><div id="file-upload-progress-{0}" class="progress-bar progress-danger" style="width: 0%;"></div></div></div>', index);
      __html += '</div>';
      __html += '</div>';
      __html += '<div class="file-name" style="width: 170px;">' + __name + '</div>';
      __html += '</div>';
      return __html;
    },
    previewFile: function (obj, file) {
      var preview = document.getElementById(obj);
      var reader = new FileReader();
      reader.onloadend = function () {
        preview.src = reader.result;
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        preview.src = "";
      }
    },
    uploadFile: function (file, index) {
      var that = this;
      var __file = file || '';
      if (!iNet.isEmpty(__file)) {
        var __html = this.renderUploader(__file.name, index) || '';
        $(__html).appendTo(that.$wrapper);
        var __imgId = 'file-upload-img-' + index;
        var __obj = '#file-upload-' + index;
        var __mask = '#file-upload-mask-' + index;
        var __btnRemove = '#file-upload-remove-btn-' + index;
        var __btnSelect = '#file-upload-select-btn-' + index;
        var __btnCancel = '#file-upload-cancel-btn-' + index;
        var __progress = '#file-upload-progress-' + index;
        if (this.getType() == this.mediaType.image) {
          this.previewFile(__imgId, file);
        }

        $(__btnCancel).on('click', function () {
          that.submiter[$(this).prop('id')].abort();
        });

        //upload file
        var formData = new FormData();
        formData.append(__file.name, __file);
        formData.append('type', that.getType());
        formData.append('category', that.getFolder());
        var checked = $('#checkbox-submit-checked').prop("checked");
        this.submiter['file-upload-cancel-btn-' + index] = $.submitData({
          url: checked ?that.url.uploadCheckImage: that.url.upload,
          params: formData,
          method: 'POST',
          callback: function (data) {
            var __data = data.elements || {};
            if (!iNet.isEmpty(__data)) {
              var __id = __data[0].uuid;
              $(__obj).attr('data-fi', __id);
              var __src = CMSUtils.getMediaPath(__data[0]);
              var viewUrl = iNet.urlAppend(that.url.view_file, String.format('code={0}', __data[0].code));
              __data[0].src = __src;
              __data[0].fileView = viewUrl;

              that.store.put(__data[0].uuid, __data[0]);
              that.files.push(__data[0]);
              if (!that.isSelect) $(__obj).find('[data-ctrl="fctrl"]').hide();
              if (that.isEdit) $(__btnRemove).show();
              if (that.isSelect) $(__btnSelect).show();
              $(__btnCancel).hide();
              if (that.getType() === that.mediaType.image) {
                $('#' + __imgId).attr({
                  'src': viewUrl,
                  'onerror': 'this.src=' + viewUrl
                });
              }
              FormUtils.showButton(that.$toolbar.cancel, that.isEdit);
              FormUtils.showButton(that.$toolbar.edit, !that.isEdit);
              $(__mask).hide();
            }
          },
          onProgress: function (value) {
            $(__progress).css({width: String.format("{0}%", value)});
          },
          onComplete: function (e) {
            $("#checkbox-submit-checked").prop( "checked", false );
          },
          onError: function (e) {

          }
        });
      }
    },
    deleteFile: function (uuid) {
      var that = this;
      var __uuid = uuid || '';
      if (!iNet.isEmpty(__uuid)) {
        var __file = that.store.get(__uuid);
        var __dialogId = 'dialog-delete-file-' + iNet.alphaGenerateId();
        if (!that.confirmDeleteFile) {
          var __dialogContent = '<label for="gallery-txt-confirm-' + __dialogId + '">' + that.getText('confirm_del_file', 'media') + '</label>';
          that.confirmDeleteFile = new iNet.ui.dialog.ModalDialog({
            id: __dialogId,
            title: that.getText('delete_file', 'media'),
            buttons: [{
              text: iNet.resources.message.button.ok,
              cls: 'btn-primary',
              icon: 'icon-ok icon-white',
              fn: function () {
                var __opts = that.confirmDeleteFile.getOptions();
                $.postJSON(that.url.delete_file, __opts, function (json) {
                  var __result = json || {};
                  if (__result.type != 'ERROR') {
                    that.$wrapper.find('div[data-fi="' + __opts.uuid + '"]').remove();
                    that.success(that.getText('delete_file', 'media'), that.getText('del_file_success', 'media'));
                    that.files = $.grep(that.files, function (n, i) {
                      return n.uuid != __opts.uuid;
                    });
                  } else {
                    that.Error.put(__result.errors[0].message);
                    that.error('', that.Error.get());
                  }
                  that.confirmDeleteFile.hide();
                }, {
                  mask: that.getMask(),
                  msg: iNet.resources.ajaxLoading.deleting
                });
              }
            }, {
              text: iNet.resources.message.button.cancel,
              icon: 'icon-remove',
              fn: function () {
                that.confirmDeleteFile.hide();
              }
            }]
          });
        }
        var __data = {folder: __file.folder, file: 1, uuid: __uuid};
        that.confirmDeleteFile.setOptions(__data);
        that.confirmDeleteFile.setContent(__dialogContent);
        that.confirmDeleteFile.show();
      }
    },
    getNewFolderName: function (name, i) {
      var __i = i || 0;
      var __name = name || this.getText('new_folder', 'media');
      var __newName = __name;
      if (__i > 0) __newName += '(' + __i + ')';
      if (this.folders.indexOf(__newName) >= 0) {
        __i++;
        return this.getNewFolderName(__name, __i);
      } else {
        return __newName;
      }
    },
    createFolder: function (group, name) {
      var that = this;
      var __group = group || '', __name = name || '';
      if (!iNet.isEmpty(__group) && !iNet.isEmpty(__name)) {
        var __data = {
          name: __name,
          category: __name,
          type: that.getType()
        };
        $.postJSON(that.url.create_folder, __data, function (json) {
          var __result = json || {};
          if (__result.type !== 'ERROR') {
            that.$form.new_folder.modal('hide');
            that.success(that.getText('create_folder', 'media'), that.getText('create_folder_success', 'media'));
            that.addFolder(__result.category);
            that.setFolder(__result.category);
            that.folders.push(__result.category);
            if (that.isUpload) {
              $('#file-uploader').ace_file_input('enable');

              that.$upload.trigger('click');
              that.isUpload = false;
              that.$form.create_first.hide();
            }
            that.load();
          } else {
            that.error(that.getText('create_folder', 'media'), that.getText('create_folder_error', 'media'));
          }
        }, {
          mask: that.getMask(),
          msg: iNet.resources.ajaxLoading.saving
        });
      }
    },
    editFolder: function (uuid, name) {
      var that = this;
      var __uuid = uuid || '', __name = name || '';
      if (!iNet.isEmpty(__uuid)) {
        var __data = {
          name: __name,
          folder: __uuid
        };
        $.postJSON(that.url.rename_folder, __data, function (json) {
          var __result = json || {};
          if (__result.type != 'ERROR') {
            that.$form.new_folder.modal('hide');
            that.success(that.getText('edit_folder', 'media'), that.getText('edit_folder_success', 'media'));
            that.load();
          } else {
            that.error(that.getText('edit_folder', 'media'), that.getText('edit_folder_error', 'media'));
          }
        }, {
          mask: that.getMask(),
          msg: iNet.resources.ajaxLoading.saving
        });
      }
    },
    deleteFolder: function () {
      var that = this;
      var __folder = that.getFolder();
      if (!iNet.isEmpty(__folder)) {
        if (!that.confirmDeleteFolder) {
          var __dialogId = 'dialog-delete-folder-' + iNet.alphaGenerateId();
          var __dialogContent = '<label for="gallery-txt-confirm-' + __dialogId + '">' + that.getText('confirm_del_folder', 'media') + '</label>';
          that.confirmDeleteFolder = new iNet.ui.dialog.ModalDialog({
            id: __dialogId,
            title: that.getText('delete_folder', 'media'),
            buttons: [{
              text: iNet.resources.message.button.ok,
              cls: 'btn-primary',
              icon: 'icon-ok icon-white',
              fn: function () {
                var __opts = that.confirmDeleteFolder.getOptions();
                $.postJSON(that.url.delete_folder, __opts, function (json) {
                  var __result = json || {};
                  if (__result.type != 'ERROR') {
                    that.success(that.getText('delete_folder', 'media'), that.getText('del_folder_success', 'media'));
                    that.init();
                  } else {
                    that.Error.put(__result.errors[0].message);
                    that.error('', that.Error.get());
                  }
                  that.confirmDeleteFolder.hide();
                }, {
                  mask: that.getMask(),
                  msg: iNet.resources.ajaxLoading.deleting
                });
              }
            }, {
              text: iNet.resources.message.button.cancel,
              icon: 'icon-remove',
              fn: function () {
                that.confirmDeleteFolder.hide();
              }
            }]
          });
        }
        var __data = {category: __folder, type: that.getType(), file: 0};
        that.confirmDeleteFolder.setOptions(__data);
        that.confirmDeleteFolder.setContent(__dialogContent);
        that.confirmDeleteFolder.show();
      }
    },
    publishFolder: function (params) {
      var _this = this;
      var __folder = this.getFolder();
      if (!iNet.isEmpty(__folder)) {
        $.postJSON(_this.url.publish_folder, params || {}, function (json) {
          var __result = json || {};
          if (__result.type != 'ERROR') {
            _this.success(
                _this.getText(params.published ? 'publish_folder' : 'unpublish_folder', 'media'),
                String.format(_this.getText(params.published ? 'publish_folder_success' : 'unpublish_folder_success', 'media'), '<b>' + _this.getFolder() + '</b>'));
            _this.init();
          } else {
            _this.Error.put(__result.errors[0].message);
            _this.error('', _this.Error.get());
          }
          _this.publishModalDlg.hide();
        }, {
          mask: _this.getMask(),
          msg: iNet.resources.ajaxLoading.acting
        });
      }
    },
    showModal: function () {
      this.resetSelected();
      this.$modal.modal('show');
    },
    hideModal: function () {
      this.$modal.modal('hide');
    },
    resetSelected: function () {
      this.selected = [];
      this.$wrapper.find('div[data-fi] [data-action="sfile"] i').removeClass('icon-check').addClass('icon-check-empty');
    },
    showMediaLib: function (type, multiple) {
      var __type = type || this.mediaType.image;
      var __multiple = multiple || false;
      this.setType(__type);
      this.setMultiple(__multiple);
      this.init();
      this.show();
      this.showModal();
    }
  });
});