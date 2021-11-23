/**
 * #PACKAGE: admin
 * #MODULE: revocation-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 11:21 18/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file RevocationContent.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.RevocationContent
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.RevocationContent');
  iNet.ui.admin.RevocationContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'doc-content-wg';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.resourceParent = 'link';
    this.formId = 'revocation-form';
    this.attachments = [];
    this.filenames = [];
    this.count = 0;
    this.$btn = {
      BACK: $('#revocation-btn-back'),
      SAVE: $('#revocation-btn-save'),
      CREATE: $('#revocation-btn-create')
    };
    this.datepickerConfig = {
      format: 'dd/mm/yyyy',
      todayBtn: 'linked',
      autoclose: true,
      todayHighlight: true
    };


    this.url = {
      list_formality: iNet.getPUrl('land/revocation/formality/search'),
      update: iNet.getPUrl('land/revocation/save'),
      load: iNet.getPUrl('land/revocation/load'),
      download: iNet.getPUrl('land/revocation/downfile'),
      remove: iNet.getPUrl('land/revocation/rmattach')
    };

    this.$form = {
      fileForm: $('#id-input-file-2'),
      listUpload: $('#file-attachments'),
      formality: $('#type-formality'),
      date: $('#date-end'),
      content: $('#revocation-content'),
      note: $('#revocation-note'),
      file: $('#list-formality')
    };

    this.editor = new iNet.ui.common.LittleEditor({id: '#revocation-content'});

    // this.$form.date.datepicker(this.datepickerConfig);
    this.initSelect2 = function (element, url, placeholderMsg) {
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
              pageSize: CMSConfig.PAGE_SIZE
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
    };

    this.$form.listUpload.on('click', '.btn-download', function () {
      var thisEl = $(this);
      var uuid = _this.getUUID();
      var attachId = thisEl.attr('data-grid');
      $.download(_this.url.download, {uuid: uuid, attachId: attachId});
    });

    this.$form.listUpload.on('click', '.btn-remove', function () {
      var thisEl = $(this);
      var uuid = _this.getUUID();
      var attachId = thisEl.attr('data-grid');
      var dialog = _this.confirmDlg(
          _this.getText('title_delete', _this.resourceParent),
          _this.getText('quesion_delete', _this.resourceParent),
          function () {
            dialog.hide();
            if (uuid) {
              $.postJSON(_this.url.remove, dialog.getData(), function (result) {
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

    this.valueFormality = this.initSelect2(this.$form.formality, this.url.list_formality, 'Hình thức');
    this.formValidate = new iNet.ui.form.Validate({
      id: _this.id,
      rules: [{
        id: _this.$form.formality.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_issue', _this.getModule()));
        }
      },
        {
          id: _this.$form.content.prop('id'),
          validate: function (v) {
            if (iNet.isEmpty(v))
              return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_issue', _this.getModule()));
          }
        }]
    });
    this.$form.fileForm.on('change', function () {
      _this.checkingFile(this.files);
      _this.appendFile(_this.attachments);
    });

    iNet.ui.admin.RevocationContent.superclass.constructor.call(this);
    this.$btn.BACK.click(function () {
      _this.hide();
      _this.fireEvent(_this.getEvent('back'), _this);
      if (_this.count !== 0) {
        _this.fireEvent(_this.getEvent('load'), _this);
      }
    });

    this.$btn.CREATE.click(function () {
      _this.resetData();
    });

    this.$btn.SAVE.click(function () {
      if (_this.getFormValidator().check()) {
        var formData = _this.getFormData();

        $.submitData({
          url: _this.url.update,
          params: formData,
          method: 'POST',
          callback: function (result) {
            if (result.type === 'ERROR')
              if (!_this.getUUID())
                _this.error(_this.getText('create', 'link'), _this.getText('create_error', 'link'));
              else
                _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
            else {
              _this.count++;
              if (_this.getUUID())
                _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
              else {
                _this.success(_this.getText('create', 'link'), _this.getText('create_success', 'link'));
                _this.setUuid(result.uuid);
              }
            }
          }
        });
      }
    });
  };


  iNet.extend(iNet.ui.admin.RevocationContent, iNet.ui.ViewWidget, {
    setData: function (record) {
      var _this = this;
      $.get(this.url.load, {uuid: record.uuid}, function (data) {
        _this.attachments = data.attachments || [];
        _this.editor.setValue(data.content);
        for (var x in data) {
          if (x === 'expiredDate') {
            $('[name=' + x + ']').val(new Date(parseInt(data[x])).format('d/m/Y'));
          }
          else if (x === 'formality') {
            var value = data[x];
            _this.$form.formality.append('<option value="' + value[0].uuid + '">' + value[0].name + '</option>');
            _this.$form.formality.val(value[0].uuid);
            // _this.triggerSelect2(_this.valueFormality, data[x]);
            _this.$form.formality.val(value[0].uuid).trigger('change.select2');
          }
          else if (x === 'attachments') {
            _this.appendFile(data[x]);
          }
          else {
            $('[name=' + x + ']').val(data[x]);
          }
        }
      });
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
    removeFileInList: function (name) {
      this.attachments = $.grep(this.attachments, function (item) {
        return item.name !== name;
      });
      this.filenames = $.grep(this.filenames, function (item) {
        return item !== name;
      });
    },
    setUuid: function (x) {
      this.uuid = x;
    },
    getUUID: function () {
      return this.uuid || '';
    },
    setUrl: function (x) {
      this._url = x;
    },
    getUrl: function () {
      return this._url;
    },
    getFormData: function () {
      var __this = this;
      var fd = new FormData(document.getElementById(this.formId));
      if (this.getUUID()) {
        fd.append('uuid', this.getUUID());
      }
      for (var i = 0; i < this.attachments.length; i++) {
        fd.append(this.attachments[i].name, this.attachments[i]);
      }
      fd.append('content', this.editor.getValue());
      return fd;
    },
    convertDate: function (strDate) {
      var date = strDate.split('/');
      date = date[1] + '/' + date[0] + '/' + date[2];
      return date;
    },
    appendFile: function (listFile) {
      this.$form.listUpload.empty();
      var html = '';
      for (var i = 0; i < listFile.length; i++) {
        listFile[i].name = listFile[i].name || listFile[i].file;
        html += iNet.Template.parse('list-file-script', listFile[i]);
      }
      this.$form.listUpload.append(html);
    },
    setSelect2: function () {
      this.$form.formality.val(null).trigger('change.select2');
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
    resetData: function () {
      this.$form.listUpload.empty();
      this.setUuid(null);
      $('#revocation-form').trigger("reset");
      this.setSelect2();
      this.attachments = [];
      this.filenames = [];
      this.editor.setValue(null);
    },
    getFormValidator: function () {
      return this.formValidate;
    }
  });
});
