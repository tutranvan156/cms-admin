/**
 * #PACKAGE: document
 * #MODULE: published-approved
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 16:40 19/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file PublishedApproved.js
 */
$(function () {
  /**
   * @class iNet.ui.document.PublishedApproved
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.document.PublishedApproved');
  iNet.ui.document.PublishedApproved = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'approved-content-wg';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.formId = this.formId || 'draft-form';
    this.attachTplId = 'list-file-script-2';
    this.resourceParent = 'link';
    this.attachmentsApproved = [];
    this.filenames = [];
    this.count = 0;
    this.toolbar = {
      BACK: $('#content-btn-back'),
      SAVE: $('#content-btn-save')
    };

    this.approvedUrl = iNet.getPUrl('steering/document/approved');
    this.dictUrl = iNet.getPUrl('legal/dictionary/list');
    this.loadApproved = iNet.getPUrl('steering/document/load')

    this.form = {
      fileForm: $('#id-input-file'),
      spanForm: $('.ace-file-container'),
      type: $("#type-doc"),
      industry: $('#industry-doc'),
      organ: $('#organ-doc'),
      listUpload: $('#file-attachments-1'),
      docId: $('#txt-doc-id'),
      promulDate: $('#promul-date'),
      dateEffec: $('#effec-date'),
      numSign: $('#signNumber'),
      singer: $('#signer'),
      content: $('#content'),
      draftRef: $('#txt-draft-ref')
    };

    this.datepickerConfig = {
      format: 'dd/mm/yyyy',
      todayBtn: 'linked',
      autoclose: true,
      todayHighlight: true
    };

    this.formValidator = new iNet.ui.form.Validate({
      id: this.formId,
      rules: [{
        id: this.form.promulDate.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_promul'));
        }
      }, {
        id: this.form.organ.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_name_organ'));
        }
      }, {
        id: this.form.type.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_name_type'));
        }
      }, {
        id: this.form.industry.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_name_industry'));
        }
      }, {
        id: this.form.numSign.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_num_sign'));
        }
      }, {
        id: this.form.singer.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_signer'));
        }
      }, {
        id: this.form.content.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_content'));
        }
      }]
    });
    this.publisherSelect = this.initSelect2(this.form.organ, this.dictUrl, 'PUBLISHER', 'Cơ quan ban hành');
    this.typeSelect = this.initSelect2(this.form.type, this.dictUrl, 'CATEGORY', 'Loại văn bản');
    this.industrySelect = this.initSelect2(this.form.industry, this.dictUrl, 'INDUSTRY', 'Lĩnh vực văn bản');
    iNet.ui.document.PublishedApproved.superclass.constructor.call(this);
    this.toolbar.SAVE.on('click', function () {
      if (_this.getFormValidator().check()) {
        _this.save();
      }
    });

    this.form.fileForm.on('change', function () {
      _this.checkingFile(this.files);
      _this.appendFile(_this.attachmentsApproved);
      console.log('record111: ', _this.getRecord());
    });

    this.toolbar.BACK.click(function () {
      _this.filenames = [];
      _this.form.fileForm.val('');
      _this.hide();
      _this.fireEvent(_this.getEvent('back'), _this);
      if (_this.count !== 0) {
        _this.fireEvent(_this.getEvent('published'), _this.getRecord(), _this);

      }
    });
    this.form.promulDate.datepicker(this.datepickerConfig);
    this.form.dateEffec.datepicker(this.datepickerConfig);
    this.form.listUpload.on('click', '.remove', function () {
      var thisEl = $(this);
      var name = thisEl.attr('data-name');
      var uuid = thisEl.attr('data-uuid');
      var attachId = thisEl.attr('data-grid');
      var dialog = _this.confirmDlg(
          _this.getText('title_delete', _this.resourceParent),
          _this.getText('quesion_delete', _this.resourceParent),
          function () {
            dialog.hide();
            if (uuid) {
              LegalDocumentAPI.rmAttach(dialog.getData(), function (result) {
                if (result.type === 'ERROR')
                  _this.error(_this.getText('delete', _this.resourceParent), _this.getText('delete_error', _this.resourceParent));
                else {
                  thisEl.parents('.child-file').remove();
                  _this.success(_this.getText('delete', _this.resourceParent), _this.getText('delete_success', _this.resourceParent));
                  _this.removeFileInList(name);
                }
              });
            }
            else {
              thisEl.parents('.child-file').remove();
              _this.success(_this.getText('delete', _this.resourceParent), _this.getText('delete_success', _this.resourceParent));
              _this.removeFileInList(name);
            }
          });
      dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', _this.resourceParent));
      dialog.setData({
        uuid: uuid,
        attachId: attachId
      });
      dialog.show();
    });

  };

  iNet.extend(iNet.ui.document.PublishedApproved, iNet.ui.WidgetExt, {
    convertDate: function (strDate) {
      var date = strDate.split('/');
      date = date[1] + '/' + date[0] + '/' + date[2];
      return date;
    },
    appendFile: function (listFile) {
      // this.form.listUpload.empty();
      this.clearArrayFile();
      var html = '';
      for (var i = 0; i < listFile.length; i++) {
        listFile[i].name = listFile[i].name || listFile[i].file;
        html += iNet.Template.parse(this.attachTplId, listFile[i]);
      }
      this.form.listUpload.append(html);
    },
    removeFileInList: function (name) {
      this.attachmentsApproved = $.grep(this.attachmentsApproved, function (item) {
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
          this.attachmentsApproved.push(file);
        }
      }
    },
    clearDataForm: function () {
      this.getFormEl()[0].reset();
      this.resetSelect2(this.form.type);
      this.resetSelect2(this.form.organ);
      this.resetSelect2(this.form.industry);
    },
    clearArrayFile: function () {
      this.form.listUpload.empty();
    },
    initSelect2: function (element, url, dictType, placeholderMsg) {
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
              __results.push({
                id: item.uuid,
                text: item.name
              });
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
    },
    getDocId: function () {
      return this.docId;
    },
    setRecord: function (record) {
      this.record = record;
    },
    getRecord: function () {
      return this.record || {};
    },
    setFormData: function (data) {
      this.attachmentsApproved = data.attachments || [];
      for (var key in data) {
        if (key !== 'attachments' && data.hasOwnProperty(key)) {
          var value = data[key];
          if (key === 'industry' && value) {
            this.triggerSelect2(this.industrySelect, value);
          }
          else if (key === 'type' && value) {
            this.triggerSelect2(this.typeSelect, value);
          }
          else if (key === 'publisher' && value) {
            this.triggerSelect2(this.publisherSelect, value);
          }
          else if (key === 'receiveDate' && value) {
            this.form.dateEffec.val(new Date(parseInt(value)).format('d/m/Y'));
          }
          else if (key === 'promulgationDate' && value)
            this.form.promulDate.val(new Date(parseInt(value)).format('d/m/Y'));
          else if (key === 'timeExpiredComment' && value)
            this.form.expiredDate.val(new Date(parseInt(value)).format('d/m/Y'));
          else if (key === 'allowComment' && value) {
            this.form.checkEnable[0].checked = value;
            FormUtils.showButton(this.toolbar.VIEW_COMMENT, !iNet.isEmpty(value));
          }
          else {
            $('[name="' + key + '"]').val(value);
          }
        }
        else {
          this.appendFile(data[key]);
        }
      }
    },
    getFormData: function () {
      var fd = new FormData(document.getElementById(this.formId));
      for (var i = 0; i < this.attachmentsApproved.length; i++) {
        fd.append(this.attachmentsApproved[i].name, this.attachmentsApproved[i]);
      }
      if (this.form.promulDate.val()) {
        fd.append('promulgationDate', new Date(this.convertDate(this.form.promulDate.val())).getTime());
      }
      if (this.form.dateEffec.val()) {
        fd.append('effectedDate', new Date(this.convertDate(this.form.dateEffec.val())).getTime());
      }
      fd.append('steeringRefId', this.getRecord().uuid);
      fd.append('steeringRefOrganId', this.getRecord().publisherCode);
      return fd;
    },
    save: function () {
      var _this = this;
      var fd = this.getFormData();
      $.submitData({
        url: _this.approvedUrl,
        params: fd,
        method: 'POST',
        callback: function (result) {
          if (result.type === 'ERROR')
            _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
          else {
            _this.count++;
            _this.setRecord(result);
            _this.appendFile(result.attachments || []);
            _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
            _this.hide();
            _this.fireEvent(_this.getEvent('published'), _this.getRecord(), _this);
          }
        }
      });
    },
    load: function (result) {
      var _this = this;
      this.clearDataForm();
      this.clearArrayFile();
      $.postJSON(this.loadApproved, {uuid: result.uuid, publisherCode: result.publisherCode}, function (data) {
        _this.setRecord(data);
        _this.setFormData(data);
      });

    }
  });
});
