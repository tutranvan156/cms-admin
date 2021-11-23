// #PACKAGE: author
// #MODULE: cms-app-summary-detail
//
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09/09/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ApplicationSummaryDetail
 * @author nbchicong
 */

$(function () {
  /**
   * @class iNet.ui.apps.ApplicationSummaryDetail
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.apps.ApplicationSummaryDetail');
  iNet.ui.apps.ApplicationSummaryDetail = function (options) {
    var _this = this, __opts = options || {};
    iNet.apply(this, __opts);
    this.id = this.id || 'detail-app-summary-wg';
    this.module = 'apps';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.tmpFileUpload = new Hashtable();
    this.elements = new Hashtable();
    this.images = new Hashtable();
    this.references = [];
    this.packageZip = null;
    this.url = {
      create: iNet.getUrl('application/summary/create'),
      update: iNet.getUrl('application/summary/update'),
      delImg: iNet.getUrl('application/summary/imgdel'),
      category: iNet.getUrl('application/summary/category'),
      preview: iNet.getUrl('cms/asset/photoview'),
      loadElItem: iNet.getUrl('workflow/cms/load')
    };
    this.$toolbar = {
      BACK: $('#detail-btn-back'),
      CREATE: $('#detail-btn-create'),
      SAVE: $('#detail-btn-save')
    };
    this.$button = {
      addImage: $('#btn-upload-images'),
      addItemInfo: $('#add-new-items-info')
    };
    this.$form = {
      appImageList: $('#app-images-list'),
      inputUploadImage: $('#input-image-file-upload'),
      inputUploadPackage: $('#input-package-file-upload'),
      appPackageContainer: $('#app-package-file-container'),
      appName: $('#app-name'),
      appType: $('#app-type'),
      appCate: $('#app-cate'),
      appPublisher: $('#app-publisher'),
      appStatus: $('#app-status'),
      appPrice: $('#app-price'),
      appVersion: $('#app-version'),
      appAuthor: $('#app-author'),
      appPublishedDate: $('#app-published-date'),
      appBrief: $('#app-brief')
    };
    this.referenceList = new iNet.ui.apps.ApplicationReferenceList({id: this.id});
    this.tabElementList = new iNet.ui.apps.TabItemList({id: this.id});
    this.validateForm = new iNet.ui.form.Validate({
      id: _this.id,
      rules: [{
        id: _this.$form.appName.prop('id'),
        validate: function(v) {
          if (iNet.isEmpty(v)) {
            return String.format(iNet.resources.message.field_not_empty, _this.getText('name'));
          }
        }
      }, {
        id: _this.$form.appType.prop('id'),
        validate: function(v) {
          if (iNet.isEmpty(v)) {
            return String.format(iNet.resources.message.field_not_empty, _this.getText('type'));
          }
        }
      }, {
        id: _this.$form.appCate.prop('id'),
        validate: function(v) {
          if (iNet.isEmpty(v)) {
            return String.format(iNet.resources.message.field_not_empty, _this.getText('name', 'category'));
          }
        }
      }]
    });
    iNet.ui.apps.ApplicationSummaryDetail.superclass.constructor.call(this);
    // init category auto complete
    this.appCategory = new iNet.ui.form.AutoComplete({
      id: this.$form.appCate.prop('id')
    });
    // init tags author
    try {
      this.$form.appAuthor.tagsinput({
        tagClass: 'label label-primary'
      });
      var $inputTag = this.$form.appAuthor.tagsinput('input');
      $inputTag.css({'width': 'auto !important'});
      $inputTag.parent().addClass('col-md-12 col-sm-12');
    } catch (msg) {
      this.$form.appAuthor.after(
          String.format(
              '<textarea id="{0}" class="{1}" name="{2}" rows="2" placeholder="{3}">{4}</textarea>',
              this.$form.appAuthor.attr('id'),
              this.$form.appAuthor.attr('class'),
              this.$form.appAuthor.attr('name'),
              this.$form.appAuthor.attr('placeholder'),
              this.$form.appAuthor.val()
          )
      ).remove();
    }
    // action button
    this.$toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent(_this.getEvent('back'), _this);
    });
    this.$toolbar.CREATE.on('click', function () {
      _this.resetData();
    });
    this.$toolbar.SAVE.on('click', function () {
      if (!_this.checkForm()) {
        return;
      }
      var __url = _this.url.create;
      var __data = _this.getData();
      var __isUpdate = false;
      if (iNet.isDefined(_this.getRecordId()) && !iNet.isEmpty(_this.getRecordId())) {
        __url = _this.url.update;
        __data.append('uuid', _this.getRecordId());
        __isUpdate = true;
      }
      $.submitData({
        url: __url,
        params: __data,
        callback: function (data) {
          if (!!data && iNet.isDefined(data.uuid)) {
            _this.tmpFileUpload.clear();
            _this.setRecord(new iNet.ui.model.ApplicationSummary(data));
            if (__isUpdate) {
              _this.fireEvent(_this.getEvent('updated'), _this.getRecord(), _this);
              _this.success(_this.getText('update_title'), String.format(_this.getText('update_success'), '<b>'+_this.getRecord().getName()+'</b>'));
            } else {
              _this.fireEvent(_this.getEvent('created'), _this.getRecord(), _this);
              _this.success(_this.getText('create_title'), String.format(_this.getText('create_success'), '<b>'+_this.getRecord().getName()+'</b>'));
            }
          } else {
            if (__isUpdate) {
              _this.error(_this.getText('update_title'), _this.getText('update_error'));
            } else {
              _this.error(_this.getText('create_title'), _this.getText('create_error'));
            }
          }
        }
      });
    });
    // EVENT show suggest category
    this.$form.appCate.on('focusin', function () {
      _this.appCategory.lookup();
    });
    // EVENT add package for app
    this.$form.inputUploadPackage.change(function () {
      _this.readPackageUpload(this.files);
    });
    this.$form.appPackageContainer.on('click', '[data-action="remove"]', function () {
      _this.clearPackageUpload();
    });
    // EVENT Add picture for app
    this.$button.addImage.on('click', function () {
      _this.$form.inputUploadImage.trigger('click');
    });
    this.$form.inputUploadImage.change(function () {
      _this.renderTmpImage(this.files);
    });
    this.$form.appImageList.on('click', '[data-action="remove"]', function () {
      var $this = $(this);
      var $item = $this.parent();
      var __itemId = $item.prop('id');
      _this.confirmDlg('', '', function () {
        if (!_this.tmpFileUpload.isEmpty() && _this.tmpFileUpload.containsKey(__itemId)) {
          _this.tmpFileUpload.remove(__itemId);
          $item.remove();
        } else {
          _this.removeFileFromServer(__itemId);
        }
        this.hide();
      });
      _this.dialog.show();
    });
    // EVENT Change Type
    this.$form.appType.on('change', function () {
      _this.referenceList.setType($(this).val()).reload();
    });
    // EVENT Add tab element for app
    this.tabElementList.on(this.tabElementList.getEvent('save'), function (data, list) {
      list.insert(data);
      _this.putElementToMaps({name: data.item.menuID, code: data.name, display: data.item.subject});
    });
    this.tabElementList.on(this.tabElementList.getEvent('update'), function (data, oldData, list) {
      list.update(data);
      _this.putElementToMaps({name: data.item.menuID, code: data.name, display: data.item.subject});
    });
    this.tabElementList.on(this.tabElementList.getEvent('remove'), function (data) {
      _this.removeElement({name: data.item.menuID, code: data.name, display: data.item.subject});
    });
    // EVENT Add reference for app
    this.referenceList.on(this.referenceList.getEvent('select'), function (data, records) {
      _this.setReferenceMaps(records);
    });
  };
  iNet.extend(iNet.ui.apps.ApplicationSummaryDetail, iNet.ui.WidgetExt, {
    setRecordId: function (uuid) {
      this.cache.uuid = uuid;
    },
    getRecordId: function () {
      return this.cache.uuid;
    },
    setFilterType: function (type) {
      this.filterType = type;
    },
    getFilterType: function () {
      return this.filterType || AppConfig.TYPE_THEME;
    },
    setRecord: function (record) {
      this.cache.record = record;
      this.loadCategory();
      this.setRecordId(record.getUuid());
      this.tabElementList.setOwnerId(record.getOwnerId()).loadItems();
      this.setData();
    },
    getRecord: function () {
      return this.cache.record || new iNet.ui.model.ApplicationSummary({type: this.getFilterType()});
    },
    loadCategory: function () {
      $.postJSON(this.url.category, {}, function (result) {
        var __result = result || {};
        this.appCategory.setSource(__result.elements);
      }.createDelegate(this));
    },
    renderAuthorList: function (author) {
      var __authors = author || [];
      this.$form.appAuthor.tagsinput('removeAll');
      if (iNet.getSize(__authors) > 0) {
        for (var i = 0; i < iNet.getSize(__authors); i ++) {
          this.$form.appAuthor.tagsinput('add', __authors[i].value);
        }
      }
    },
    getAuthorList: function () {
      var __authorsList = this.$form.appAuthor.tagsinput('items');
      var __authorListStr = '[';
      var __authorItem = '{"code": "{0}", "name": "{1}"}';
      for (var i = 0; i < iNet.getSize(__authorsList); i ++) {
        __authorListStr += String.format(__authorItem, __authorsList[i], __authorsList[i]);
        if (i < iNet.getSize(__authorsList) - 1) {
          __authorListStr += ',';
        }
      }
      return __authorListStr + ']';
    },
    isFileList: function (file) {
      return Object.prototype.toString.apply(file) === '[object FileList]';
    },
    isFile: function (file) {
      return Object.prototype.toString.apply(file) === '[object File]';
    },
    clearPackageUpload: function () {
      this.packageZip = null;
      this.$form.inputUploadPackage.replaceWith(
          this.$form.inputUploadPackage = this.$form.inputUploadPackage.clone(true)
      );
      this.$form.appPackageContainer.find('[data-type="button"]').attr('data-title', this.getText('select_package')).removeClass('selected');
      this.$form.appPackageContainer.find('[data-type="label"]').attr('data-title', this.getText('no_select_package'));
      this.$form.appPackageContainer.find('[data-type="icon"]').removeClass('fa-file-archive-o').addClass('fa-upload');
    },
    readPackageUpload: function (packageUpload) {
      this.packageZip = (this.isFileList(packageUpload)&&this.isFile(packageUpload[0]))?packageUpload[0]:null;
      this.$form.appPackageContainer.find('[data-type="button"]').attr('data-title', this.getText('change_package')).addClass('selected');
      this.$form.appPackageContainer.find('[data-type="label"]').attr('data-title', packageUpload[0].name || '');
      this.$form.appPackageContainer.find('[data-type="icon"]').removeClass('fa-upload').addClass('fa-file-archive-o');
    },
    putElementToMaps: function (item) {
      this.removeElement(item);
      this.elements.put(item.code, item);
    },
    removeElement: function (item) {
      if (this.elements.containsKey(item.code)) {
        this.elements.remove(item.code);
      }
    },
    getElementMaps: function () {
      var _this = this;
      var __count = 0;
      var __elementMapsStr = '[';
      var __elItem = '{"code": "{0}", "name": "{1}", "display": "{2}"}';
      this.elements.each(function (key, value) {
        __elementMapsStr += String.format(__elItem, key, value.name, value.display);
        if (__count < _this.elements.size() - 1) {
          __elementMapsStr += ',';
        }
        __count ++;
      });
      return __elementMapsStr + ']';
    },
    putReferenceToMaps: function (item) {
      this.references.push(item);
    },
    setReferenceMaps: function (refMaps) {
      this.references = refMaps;
    },
    getReferenceMaps: function () {
      var __refMapsStr = '[';
      var __refItem = '{"code": "{0}", "subject": "{1}"}';
      for (var i = 0; i < this.references.length; i ++) {
        __refMapsStr += String.format(__refItem, this.references[i].uuid, this.references[i].name);
        if (i < this.references.length - 1) {
          __refMapsStr += ',';
        }
      }
      return __refMapsStr + ']';
    },
    putImageToMaps: function (item) {
      this.images.put(item.uuid, item);
    },
    getImageById: function (id) {
      return this.images.get(id);
    },
    removeFileFromServer: function (fileId) {
      var __image = this.getImageById(fileId);
      $.postJSON(this.url.delImg, {uuid: this.getRecordId(), image: __image.gridfsUUID}, function (results) {
        var __results =  results || {};
        if (iNet.isDefined(__results.uuid)) {
          $.getCmp(fileId).remove();
        }
      });
    },
    renderImageList: function (data) {
      var __data = data || [];
      var __html = '';
      if (iNet.getSize(__data) > 0) {
        var __itemHTML = '<div id="{0}" class="image-item"><span data-action="remove" class="del-action"></span><img src="{1}" /></div>';
        for (var i = 0; i < iNet.getSize(__data); i ++) {
          this.putImageToMaps(__data[i]);
          __html += String.format(__itemHTML, __data[i].uuid, iNet.urlAppend(this.url.preview, String.format('folder={0}&code={1}', __data[i].folder, __data[i].code)));
        }
      }
      this.$form.appImageList.find('.image-item').remove();
      this.$form.appImageList.prepend(__html);
    },
    renderTmpImage: function (files) {
      var _this = this;
      var __files = files;
      var __html = '';
      var __itemHTML = '<div id="{0}" class="image-item"><span data-action="remove" class="del-action"></span><img src="{1}" /></div>';
      var reader = new FileReader();
      var readFile = function(index) {
        if (index >= __files.length) {
          _this.$form.appImageList.prepend(__html);
          return;
        }
        var __file = __files[index];
        var __fileId = iNet.generateUUID();
        reader.onload = function(e) {
          __html += String.format(__itemHTML, __fileId, e.target.result);
          readFile(index + 1);
        };
        reader.readAsDataURL(__file);
        _this.tmpFileUpload.put(__fileId, __file);
      };
      readFile(0);
    },
    renderElementsList: function (elements) {
      var __elements = elements || [];
      this.elements.clear();
      for (var i = 0; i < iNet.getSize(__elements); i ++) {
        this.putElementToMaps({name: __elements[i].uuid, code: __elements[i].name, display: __elements[i].value});
      }
      this.tabElementList.setElements(__elements);
      this.tabElementList.loadItems();
      this.tabElementList.load();
    },
    renderReferenceList: function (references) {
      var _this = this;
      var __references = references || [];
      this.referenceList.setType(this.getRecord().getType());
      this.referenceList.setCategory(this.getRecord().getCategory());
      this.referenceList.setCurrentAppId(this.getRecordId());
      this.referenceList.load();
      if (!iNet.isEmpty(__references)) {
        this.referenceList.grid.on('loaded', function () {
          _this.referenceList.clearSelected();
          for (var i = 0; i < iNet.getSize(__references); i ++) {
            _this.referenceList.grid.selectById(__references[i].uuid);
          }
        });
      }
    },
    checkForm: function () {
      return this.validateForm.check();
    },
    setData: function () {
      var __data = this.getRecord();
      this.$form.appName.val(__data.getName());
      this.$form.appType.val(__data.getType());
      this.appCategory.setValue(__data.getCategory());
      this.$form.appPublisher.val(__data.getPublisher());
      this.$form.appStatus.val(__data.getStatus());
      this.$form.appPrice.val(__data.getPrice());
      this.$form.appVersion.val(__data.getVersion());
      this.$form.appPublishedDate.val(
          iNet.isEmpty(__data.getPublishedDate()) ? '' :new Date(__data.getPublishedDate()).format(iNet.fullDateFormat)
      );
      this.$form.appBrief.val(__data.getBrief());
      if (!iNet.isEmpty(__data.getContentId())) {
        this.readPackageUpload([{name: __data.getName()}]);
      } else {
        this.clearPackageUpload();
      }
      this.renderAuthorList(__data.getAuthors());
      this.renderImageList(__data.getImages());
      this.renderElementsList(__data.getElements());
      this.renderReferenceList(__data.getReferences());
      // Check Status
      FormUtils.showButton(this.$toolbar.PUBLISHED, __data.getStatus() != AppConfig.MODE_PUBLISHED);
    },
    getData: function () {
      var __formData = new FormData();
      __formData.append('name', this.$form.appName.val());
      __formData.append('type', this.$form.appType.val());
      __formData.append('category', this.appCategory.getValue());
      __formData.append('brief', this.$form.appBrief.val());
      __formData.append('price', this.$form.appPrice.val());
      __formData.append('version', this.$form.appVersion.val());
      __formData.append('publisher', this.$form.appPublisher.val());
      __formData.append('status', this.$form.appStatus.val());
      __formData.append('author', this.getAuthorList());
      __formData.append('element', this.getElementMaps());
      __formData.append('reference', this.getReferenceMaps());
      if (!iNet.isEmpty(this.packageZip)) {
        __formData.append(this.packageZip.name, this.packageZip);
      }
      this.tmpFileUpload.each(function (key, value) {
        var __file = value || {};
        __formData.append(key, __file);
      });
      return __formData;
    },
    resetData: function () {
      this.images.clear();
      this.elements.clear();
      this.references = [];
      this.setRecord(new iNet.ui.model.ApplicationSummary());
    }
  });
});