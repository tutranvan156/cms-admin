/**
 * #PACKAGE: document
 * #MODULE: draft-doc-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:10 10/02/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file DraftDocContent.js
 */
$(function () {
  /**
   * @class iNet.ui.document.DraftDocContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.document.DraftDocContent');
  iNet.ui.document.DraftDocContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'draft-content-wg';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.module = 'document';
    this.formId = this.formId || 'draft-form';
    this.attachTplId = 'list-file-script';
    this.resourceParent = 'link';
    this.attachments = [];
    this.filenames = [];
    this.transfer = iNet.isDefined(this.transfer) ? this.transfer : false;
    this.draftDoc = iNet.isDefined(this.draftDoc) ? this.draftDoc : true;

    this.dictUrl = iNet.getPUrl('legal/dictionary/list');
    this.url = {
      industry: iNet.getPUrl('cms/egov/industry/search'),
      agency: iNet.getPUrl('cms/egov/agency/search'),
      category: iNet.getPUrl('cms/egov/category/search'),
      download: iNet.getPUrl('steering/document/download')
    };

    this.toolbar = this.toolbar || {
      BACK: $('#content-draft-back'),
      CREATE: $('#content-draft-create'),
      SAVE: $('#content-draft-save'),
      VIEW_COMMENT: $('#content-draft-comment'),
      PROMULGATION: $('#content-draft-promulgation')
    };

    this.form = this.form || {
      fileForm: $('#inp-draft-file-attachments'),
      spanForm: $('#span-draft-file-container'),
      // type: $('#cbb-draft-type'),
      industry: $('#cbb-draft-industry'),
      organ: $('#cbb-draft-organ'),
      listUpload: $('#draft-file-attachments'),
      docId: $('#txt-draft-uuid'),
      numSign: $('#txt-draft-sign-number'),
      content: $('#txt-draft-content'),
      checkEnable: $('#chk-enable-comment'),
      promulDate: $('#promul-date'),
      expiredDate: $('#expire-date'),
      effectDate: $('#effec-date')
    };

    this.datepickerConfig = this.datepickerConfig || {
      format: 'dd/mm/yyyy',
      todayBtn: 'linked',
      autoclose: true,
      todayHighlight: true
    };

    this.formValidator = this.formValidator || new iNet.ui.form.Validate({
      id: this.formId,
      rules: [{
        id: this.form.industry.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_name_industry'));
        }
      }, {
        id: this.form.content.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_content'));
        }
      }]
    });
    this.form.promulDate.datepicker(this.datepickerConfig);
    this.form.effectDate.datepicker(this.datepickerConfig);
    this.form.expiredDate.datepicker(this.datepickerConfig);
    iNet.ui.document.DraftDocContent.superclass.constructor.call(this);

    this.toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back', _this);
    });

    this.toolbar.CREATE.on('click', function () {
      _this.setDocId(null);
      _this.clearDataForm();
      _this.clearArrayFile();
      _this.checkDraftEnable();
    });

    this.toolbar.SAVE.on('click', function () {
      if (_this.getFormValidator().check()) {
        _this.save();
      }
    });

    if (this.isDraftDoc()) {
      this.form.expiredDate.datepicker(this.datepickerConfig);

      this.toolbar.VIEW_COMMENT.on('click', function () {
        _this.fireEvent('view_comment', _this, _this.getRecord());
      });

      this.toolbar.PROMULGATION.on('click', function () {
        _this.fireEvent('promulgation', _this.getDocId(), _this.getAuthorUnitCode(), _this);
      });
    }

    this.form.fileForm.on('change', function () {
      _this.checkingFile(this.files);
      _this.appendFile(_this.attachments);
    });

    this.form.listUpload.on('click', '.btn-download', function () {
      $.download(_this.url.download, {
        uuid: _this.getDocId(),
        authorUnitCode: _this.getAuthorUnitCode(),
        contentId: $(this).attr('data-contentId')
      });
    });
    this.form.listUpload.on('click', '.btn-remove', function () {
      var thisEl = $(this);
      var name = thisEl.attr('data-name');
      var uuid = thisEl.attr('data-uuid');
      var attachId = thisEl.attr('data-grid');
      var dialog = _this.confirmDlg(
          _this.getText('title_delete', _this.resourceParent),
          _this.getText('quesion_delete', _this.resourceParent),
          function () {
            dialog.hide();
            if (dialog.getData().attachId) {
              LegalDocumentAPI.rmAttachEgovEdoc(dialog.getData(), function (result) {
                if (result.type === 'ERROR')
                  _this.error(_this.getText('delete', _this.resourceParent), _this.getText('delete_error', _this.resourceParent));
                else {
                  dialog.getOptions().fileEl.parents('.attachment').remove();
                  _this.success(_this.getText('delete', _this.resourceParent), _this.getText('delete_success', _this.resourceParent));
                  _this.removeFileInList(dialog.getOptions().name);
                }
              });
            } else {
              dialog.getOptions().fileEl.parents('.attachment').remove();
              _this.success(_this.getText('delete', _this.resourceParent), _this.getText('delete_success', _this.resourceParent));
              _this.removeFileInList(dialog.getOptions().name);
            }
          });
      dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', _this.resourceParent));
      dialog.setData({
        uuid: _this.getDocId(),
        attachId: uuid,
        authorUnitCode: _this.getAuthorUnitCode()
      });
      dialog.setOptions({
        name: name,
        fileEl: thisEl
      });
      dialog.show();
    });

    this.publisherSelect = this.initSelect2(this.form.organ, this.url.agency, 'PUBLISHER', 'Cơ quan ban hành', true);
    this.industrySelect = this.initSelect2(this.form.industry, this.url.industry, 'INDUSTRY', 'Lĩnh vực văn bản', false);
  };
  iNet.extend(iNet.ui.document.DraftDocContent, iNet.ui.WidgetExt, {
    setOrgName: function (name) {
      this.orgName = name;
    },
    getOrgName: function () {
      return this.orgName || '';
    },
    setOrgId: function (id) {
      this.orgId = id;
    },
    getOrgId: function () {
      return this.orgId;
    },
    convertDate: function (strDate) {
      var date = strDate.split('/');
      date = date[1] + '/' + date[0] + '/' + date[2];
      return date;
    },
    appendFile: function (listFile) {
      this.form.listUpload.empty();
      var html = '';
      for (var i = 0; i < listFile.length; i++) {
        var file = listFile[i];
        console.log("dr file", file);
        file.name = file.name || file.file;
        file.local = !file.uuid;
        html += iNet.Template.parse(this.attachTplId, file);
      }
      this.form.listUpload.append(html);
    },
    removeFileInList: function (name) {
      this.attachments = $.grep(this.attachments, function (item) {
        return item.name !== name;
      });
      this.filenames = $.grep(this.filenames, function (item) {
        return item !== name;
      });
    },
    checkingFile: function (files) {
      for (var i = 0; i < (files || []).length; i++) {
        var file = files[i];
        if (this.filenames.indexOf(file.name) === -1) {
          this.filenames.push(file.name);
          this.attachments.push(file);
        }
      }
    },
    distinctArrayFile: function (files) {
      return (files || []).reduce(function (memory, e1) {
        var matches = memory.filter(function (e2) {
          return e1.name === e2.name
        });
        if (matches.length === 0)
          memory.push(e1);
        return memory;
      }, []);
    },
    clearDataForm: function () {
      this.getFormEl()[0].reset();
      // this.resetSelect2(this.form.type);
      this.resetSelect2(this.form.organ);
      this.resetSelect2(this.form.industry);
      if (this.form.type) {
        this.resetSelect2(this.form.type);
      }
      // this.form.type.append('<option value="Văn bản dự thảo">Văn bản dự thảo</option>');
      // this.form.type.val('Văn bản dự thảo');
      // this.form.type.val('Văn bản dự thảo').trigger('change.select2');
    },
    clearArrayFile: function () {
      this.attachments = [];
      this.filenames = [];
      this.form.listUpload.empty();
    },
    initSelect2: function (element, url, dictType, placeholderMsg, type) {
      return element.select2({
        placeholder: placeholderMsg,
        allowClear: true,
        ajax: {
          url: url,
          dataType: 'json',
          multiple: true,
          delay: 250,
          data: function (params) {
            params.page = params.page || 0;
            return {
              keyword: params.term,
              pageNumber: params.page,
              pageSize: CMSConfig.PAGE_SIZE,
              dictType: dictType
            };
          },
          processResults: function (data, params) {
            var __results = [];
            var __data = data.items || [];
            __data.forEach(function (item) {
              if (type) {
                __results.push({
                  id: item.code,
                  text: item.name
                });
              } else {
                __results.push({
                  id: item.description,
                  text: item.description
                });
              }
            });
            return {
              results: __results,
              pagination: {
                more: (CMSConfig.PAGE_SIZE * 30) < data.total
              }
            };
          },
          cache: true
        }
      });
    },
    resetSelect2: function (el) {
      el.val(null).trigger('change');
    },
    triggerSelect2: function (select, data) {
      var option = new Option(data.name, data.uuid, true, true);
      select.append(option).trigger('change');
      select.trigger({
        type: 'select2:select',
        params: {
          data: data
        }
      });
      // el.val(value).trigger('change');
    },
    getFormEl: function () {
      return $('#' + this.formId);
    },
    /**
     * @returns {iNet.ui.form.Validate}
     */
    getFormValidator: function () {
      return this.formValidator;
    },
    setDocId: function (uuid) {
      this.docId = uuid;
      this.form.docId.val(uuid);
    },
    getDocId: function () {
      return this.docId;
    },
    setPublisherCode: function (code) {
      this.pulisherCode = code;
    },
    getPublisherCode: function () {
      return this.pulisherCode || '';
    },
    setAuthorUnitCode: function (code) {
      this.authorUnitCode = code;
    },
    getAuthorUnitCode: function () {
      return this.authorUnitCode || '';
    },
    setRecord: function (record) {
      this.record = record;
    },
    getRecord: function () {
      return this.record || {};
    },
    setTransfer: function (transfer) {
      this.transfer = transfer;
    },
    isTransfer: function () {
      return this.transfer;
    },
    setDraftDoc: function (status) {
      this.draftDoc = status;
    },
    isDraftDoc: function () {
      return this.draftDoc || false;
    },
    setFormData: function (data) {
      this.attachments = data.attachments || [];
      for (var key in data) {
        if (key !== 'attachments' && data.hasOwnProperty(key)) {
          var value = data[key];
          if (key === 'field' && value) {
            this.form.industry.append('<option value="' + value + '">' + value + '</option>');
            this.form.industry.val(value);
            this.form.industry.val(value).trigger('change.select2')
          }
          // else if (key === 'documentName' && value) {
          //   this.form.type.append('<option value="' + value + '">' + value + '</option>');
          //   this.form.type.val(value);
          //   this.form.type.val(value).trigger('change.select2')
          // }
          else if (key === 'publisherCode' && value) {
            this.form.organ.append('<option value="' + value + '">' + data['publisherName'] + '</option>');
            this.form.organ.val(value);
            this.form.organ.val(value).trigger('change.select2')
          } else if (key === 'explEffectDate' && value && !this.isDraftDoc()) {
            this.form.effectDate.val(new Date(parseInt(value)).format('d/m/Y'));
          } else if (key === 'promulgationDate' && value && !this.isDraftDoc())
            this.form.promulDate.val(new Date(parseInt(value)).format('d/m/Y'));
          else if (key === 'explExpireDate' && value > 0 && this.isDraftDoc())
            this.form.expiredDate.val(new Date(parseInt(value)).format('d/m/Y'));
          else if (key === 'allowComment' && value && this.isDraftDoc()) {
            this.form.checkEnable[0].checked = value;
            FormUtils.showButton(this.toolbar.VIEW_COMMENT, !iNet.isEmpty(value));
          } else {
            $('[name="' + key + '"]').val(value);
          }
        }
      }
      if (!this.isTransfer()) {
        var html = '';
        for (var i = 0; i < this.attachments.length; i++) {
          var item = this.attachments[i];
          html += iNet.Template.parse(this.attachTplId, item);
        }
        this.form.listUpload.append(html);
      }
      this.checkDraftEnable();
    },
    getFormData: function () {
      console.log('attachments: ', this.attachments);
      var fd = new FormData(document.getElementById(this.formId));
      for (var i = 0; i < this.attachments.length; i++) {
        fd.append(iNet.generateId(), this.attachments[i]);
      }
      fd.append('type', 'DRAFT');
      if (this.form.expiredDate.val()) {
        fd.append('explExpireDate', new Date(this.convertDate(this.form.expiredDate.val())).getTime());
      }
      fd.append('publisherCode', this.getOrgId());
      fd.append('publisherName', this.getOrgName());
      // fd.append('timeExpiredComment', '0');
      // fd.append('allowComment', 'false');
      // fd.append('draft', 'false');
      return fd;
    },
    save: function () {
      var _this = this;
      var fd = this.getFormData();
      if (this.getDocId()) {
        LegalDocumentAPI.updateEgovEdoc(fd, function (result) {
          if (result.type === 'ERROR') {
            _this.error(_this.getText('update', _this.resourceParent), _this.getText('update_error', _this.resourceParent));
          } else {
            _this.fireEvent('doc_updated', result, _this);
            _this.success(_this.getText('update', _this.resourceParent), _this.getText('update_success', _this.resourceParent));
          }
        });
      } else {
        LegalDocumentAPI.createEgovEdoc(fd, function (result) {
          if (result.type === 'ERROR') {
            _this.error(_this.getText('create', _this.resourceParent), _this.getText('create_error', _this.resourceParent));
          } else {
            _this.success(_this.getText('create', _this.resourceParent), _this.getText('create_success', _this.resourceParent));
            _this.setDocId(result.uuid);
            _this.fireEvent('doc_created', result, _this);
            if (_this.isTransfer()) {
              var fd = new FormData();
              fd.append('promulgationDate', new Date().getTime().toString());
              fd.append('allowComment', 'false');
              fd.append('uuid', result.draftRef);
              LegalDocumentAPI.updateEgovEdoc(fd, function (draft) {
                _this.fireEvent('draft_updated', draft, _this);
              });
            }
          }
        });
      }
    },
    load: function () {
      var _this = this;
      this.clearDataForm();
      this.clearArrayFile();
      if (this.getDocId()) {
        LegalDocumentAPI.loadSteeringDoc({
          uuid: this.getDocId(),
          authorUnitCode: this.getAuthorUnitCode()
        }, function (result) {
          _this.setRecord(result);
          _this.setFormData(result);
        });
      }
    },
    checkDraftEnable: function () {
      if (this.isDraftDoc()) {
        FormUtils.showButton(this.toolbar.VIEW_COMMENT, !iNet.isEmpty(this.getDocId()));
        FormUtils.showButton(this.toolbar.PROMULGATION, !iNet.isEmpty(this.getDocId()) && this.getRecord().promulgationDate <= 0);
      }
    }
  });
});