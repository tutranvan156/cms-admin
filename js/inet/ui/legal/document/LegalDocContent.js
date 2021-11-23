/**
 * #PACKAGE: document
 * #MODULE: legal-doc-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 14:18 08/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file LegalDocContent.js
 */
$(function () {
  /**
   * @class iNet.ui.document.LegalDocContent
   * @extends iNet.ui.document.DraftDocContent
   */
  iNet.ns('iNet.ui.document.LegalDocContent');
  iNet.ui.document.LegalDocContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'doc-content-wg';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.formId = 'legal-form';
    this.draftDoc = false;

    this.toolbar = {
      BACK: $('#content-btn-back'),
      CREATE: $('#content-btn-create'),
      SAVE: $('#content-btn-save-legal'),
      PUBLISH: $('#content-btn-publish-edoc'),
      UN_PUBLISH: $('#content-btn-unpublish-edoc')
    };

    this.form = {
      fileForm: $('#id-input-file-edoc'),
      spanForm: $('.ace-file-container.edoc-files'),
      type: $("#type-edoc"),
      industry: $('#industry-edoc'),
      documentType: $('#documentType'),
      organ: $('#organ-edoc'),
      listUpload: $('#file-edoc-attachments'),
      docId: $('#txt-edoc-id'),
      promulDate: $('#promul-edoc-date'),
      expiredDate: $('#expire-edoc-date'),
      effectDate: $('#effec-edoc-date'),
      numSign: $('#sign-number-edoc'),
      singer: $('#signer-edoc'),
      content: $('#content-edoc'),
      subject: $('#subject-edoc'),
      draftRef: $('#txt-draft-ref')
    };

    this.formValidator = new iNet.ui.form.Validate({
      id: this.formId,
      rules: [{
        id: this.form.promulDate.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_promul'));
        }
      },
        //   {
        //   id: this.form.organ.prop('id'),
        //   validate: function (v) {
        //     if (iNet.isEmpty(v))
        //       return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_name_organ'));
        //   }
        // },
        {
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
    iNet.ui.document.LegalDocContent.superclass.constructor.call(this);

    // this.toolbar.SAVE.on('click', function () {
    //   console.log('11111111');
    //   if (_this.getFormValidator().check()) {
    //     _this.saveData();
    //   }
    // });

    this.toolbar.PUBLISH.on('click', function () {
      _this.showPublishConfirm({
        uuid: _this.getDocId(),
        authorUnitCode: _this.getAuthorUnitCode()
      });
    });
    this.toolbar.UN_PUBLISH.on('click', function () {
      _this.showUnPublishConfirm({
        uuid: _this.getDocId(),
        authorUnitCode: _this.getAuthorUnitCode()
      });
    });

    FormUtils.showButton(this.toolbar.CREATE, !this.transfer);
  };
  iNet.extend(iNet.ui.document.LegalDocContent, iNet.ui.document.DraftDocContent, {
    transferFrom: function (draftId) {
      this.form.draftRef.val(draftId);
      this.setDocId(null);
    },
    getFormData: function () {
      // console.log('get form data function has been call with form id: ', this.formId);
      var fd = new FormData(document.getElementById(this.formId));
      for (var i = 0; i < this.attachments.length; i++) {
        fd.append(iNet.generateId(), this.attachments[i]);
      }
      fd.append('docDate', new Date(this.convertDate(this.form.promulDate.val())).getTime());
      if (this.form.organ.select2('data')[0]) {
        fd.append('publisherName', this.form.organ.select2('data')[0].text);
        fd.append('promulgationPlace', this.form.organ.select2('data')[0].text);

      }
      if (this.form.expiredDate.val()) {
        fd.append('explExpireDate', new Date(this.convertDate(this.form.expiredDate.val())).getTime());
      }
      if (this.form.effectDate.val()) {
        fd.append('explEffectDate', new Date(this.convertDate(this.form.effectDate.val())).getTime());
      }
      return fd;
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
          } else if (key === 'documentName' && value) {
            this.form.type.append('<option value="' + value + '">' + value + '</option>');
            this.form.type.val(value);
            this.form.type.val(value).trigger('change.select2')
          } else if (key === 'publisherCode' && value) {
            this.form.organ.append('<option value="' + value + '">' + data['publisherName'] + '</option>');
            this.form.organ.val(value);
            this.form.organ.val(value).trigger('change.select2')
          } else if (key === 'promulgationDate' && value > 0) {
            this.form.promulDate.val(new Date(value).format('d/m/Y'));
            var promulDate =  this.form.promulDate.datepicker({
              format: 'dd/mm/yyyy'
            }).on('changeDate', function (ev) {
              promulDate.hide();
            }).data('datepicker');
            if (promulDate) {
              promulDate.update();
            }
          } else if (key === 'explEffectDate' && value > 0) {
            this.form.effectDate.val(new Date(value).format('d/m/Y'));
            var effectDate =  this.form.promulDate.datepicker({
              format: 'dd/mm/yyyy'
            }).on('changeDate', function (ev) {
              effectDate.hide();
            }).data('datepicker');
            if (effectDate) {
              effectDate.update();
            }
          } else if (key === 'explExpireDate' && value > 0) {
            this.form.expiredDate.val(new Date(value).format('d/m/Y'));
            var expiredDate =  this.form.promulDate.datepicker({
              format: 'dd/mm/yyyy'
            }).on('changeDate', function (ev) {
              expiredDate.hide();
            }).data('datepicker');
            if (expiredDate) {
              expiredDate.update();
            }
          } else if (key === 'allowComment' && value && this.isDraftDoc()) {
            this.form.checkEnable[0].checked = value;
            FormUtils.showButton(this.toolbar.VIEW_COMMENT, !iNet.isEmpty(value));
          } else {
            $('[name="' + key + '"]').val(value);
          }
        }
      }
      var html = '';
      for (var i = 0; i < data.attachments.length; i++) {
        var item = data.attachments[i];
        html += iNet.Template.parse(this.attachTplId, item);
      }
      this.form.listUpload.append(html);
      FormUtils.showButton(this.toolbar.PUBLISH, data.exploitation.indexOf(CMSConfig.APPLICATION) === -1);
      FormUtils.showButton(this.toolbar.UN_PUBLISH, data.exploitation.indexOf(CMSConfig.APPLICATION) !== -1);
    },
    save: function () {
      var _this = this;
      var fd = this.getFormData();
      console.log('save function has been call with doc id: ', this.getDocId());
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
    publish: function (params) {
      var _this = this;
      LegalDocumentAPI.shareEdoc(params, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR)
          _this.error(_this.getText('published'), _this.getText('published_error'));
        else {
          _this.reload();
          _this.success(_this.getText('published'), _this.getText('published_success'));
        }
      });
    },
    showPublishConfirm: function (publishData) {
      var _this = this;
      var dialog = this.confirmDlg(
          this.getText('published'),
          this.getText('published_confirm'),
          function () {
            var params = dialog.getData();
            _this.publish(params);
            dialog.hide();
          });
      dialog.setTitle('<i class="fa fa-globe text-success"></i> ' + _this.getText('published'));
      dialog.setData(publishData);
      dialog.show();
    },
    unPublish: function (params) {
      var _this = this;
      LegalDocumentAPI.shareEdoc(params, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR)
          _this.error(_this.getText('unpublished'), _this.getText('unpublished_error'));
        else {
          _this.fireEvent('back', _this);
          _this.success(_this.getText('unpublished'), _this.getText('unpublished_success'));
        }
      });
    },
    showUnPublishConfirm: function (unPublishData) {
      var _this = this;
      var dialog = this.confirmDlg(
          _this.getText('unpublished'),
          _this.getText('unpublished_confirm'), function () {
            var params = dialog.getData();
            params['shr_stt'] = false;
            _this.unPublish(params);
            dialog.hide();
          }
      );
      dialog.setTitle('<i class="fa fa-times-circle-o text-warning"></i> ' + _this.getText('unpublished'));
      dialog.setData(unPublishData);
      dialog.show();
    }
  });
});
