/**
 * #PACKAGE: admin
 * #MODULE: poor-household-detail
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09:50 23/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file PoorHouseHoldDetail.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.PoorHouseHoldDetail
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.PoorHouseHoldDetail');
  iNet.ui.admin.PoorHouseHoldDetail = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'poor-household-detail-wg';
    this.group = CMSConfig.GROUP_POOR_HOUSEHOLD;
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.module = 'poor';
    this.formId = 'form-content';
    this.filenames = [];
    this.attachments = [];
    this.hasRemoteFile = false;
    this.hasChooseFile = false;
    this.url = {
      district: iNet.getPUrl('cms/district/list'),
      ward: iNet.getPUrl('cms/ward/list')
    };
    this.toolbar = {
      BACK: $('#detail-btn-back'),
      CREATE: $('#detail-btn-create'),
      SAVE: $('#detail-btn-save')
    };
    this.form = {
      year: $('#cbb-year'),
      district: $('#cbb-district'),
      ward: $('#cbb-ward'),
      poorNo: $('#txt-poor-number'),
      nearPoorNo: $('#txt-near-poor-number'),
      attachment: {
        wrapper: $('#attach-wrapper'),
        file: $('#file-attach')
      }
    };

    this.fileLabelEl = $('#file-label');
    this.fileContainer = this.fileLabelEl.find('.ace-file-container');
    this.fileNameEl = this.fileLabelEl.find('.ace-file-name');
    this.fileIconEl = this.fileNameEl.find('i.ace-icon');

    this.formValidator = new iNet.ui.form.Validate({
      id: this.formId,
      rules: [{
        id: this.form.year.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('year'));
        }
      }, {
        id: this.form.district.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('unit'));
        }
      }, {
        id: this.form.poorNo.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('poor_household'));
        }
      }, {
        id: this.form.nearPoorNo.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('near_poor_household'));
        }
      }]
    });

    iNet.ui.admin.PoorHouseHoldDetail.superclass.constructor.call(this);
    this.toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back', _this);
    });

    this.toolbar.CREATE.on('click', function () {
      _this.setRecordId(null);
      _this.resetForm();
    });

    this.toolbar.SAVE.on('click', function () {
      console.log('button save has been click with validator: ', _this.getFormValidator());
      console.log('validation result: ', _this.getFormValidator().check());
      if (_this.getFormValidator().check()) {
        _this.save();
      }
    });

    this.form.attachment.file.on('change', function () {
      _this.hasChooseFile = true;
      _this.changeFile(this.files);
    });

    this.fileLabelEl.on('click', '.remove', function () {
      _this.removeFile();
    });

    this.fileLabelEl.on('click', '.download', function () {
      _this.downloadFile();
    });

    this.districtSelect = this.initSelect2(this.form.district, this.url.district, {city: iNet.cityCode, pageSize: -1}, 'Chọn Huyện/TP');
    this.wardSelect = this.initSelect2(this.form.ward, this.url.ward, {district: this.getDistrict(), pageSize: -1}, 'Chọn Phường/Xã/TT');
    
    this.form.district.on('change.select2', function () {
      _this.setDistrict(_this.form.district.val());
    });
    this.form.ward.on('change.select2', function () {
      if (_this.form.ward.val()) {
        _this.form.attachment.wrapper.show();
      }
      else {
        _this.form.attachment.wrapper.hide();
      }
    });
  };
  iNet.extend(iNet.ui.admin.PoorHouseHoldDetail, iNet.ui.WidgetExt, {
    setDistrict: function (value) {
      this.district = value;
    },
    getDistrict: function () {
      return this.district || '';
    },
    changeDistrict: function (code) {
      var _this = this;
      AddressAPI.listDistrict({city: iNet.cityCode, pageSize: -1}, function (results) {
        var items = results.items || [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].code === code) {
            _this.triggerSelect2(_this.districtSelect, items[i]);
            break;
          }
        }
      });
    },
    changeWard: function (wardCode, districtCode) {
      var _this = this;
      AddressAPI.listWard({district: districtCode, pageSize: -1}, function (results) {
        var items = results.items || [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].code === wardCode) {
            _this.triggerSelect2(_this.wardSelect, items[i]);
            break;
          }
        }
      });
    },
    changeFile: function (files) {
      this.attachments = [];
      this.filenames = [];
      for (var i = 0; i < (files || []).length; i++) {
        var file = files[i];
        this.filenames.push(file.name || file.file);
        this.attachments.push(file);
      }

      this.fileContainer.removeClass('selected');
      if (this.filenames.length > 0) {
        this.fileContainer.addClass('selected');
        this.fileContainer.attr('data-title', 'Thay đổi');
        this.fileNameEl.attr('data-title', this.filenames.join(','));
        this.fileIconEl.removeClass('fa-upload').addClass('fa-file');
        if (this.hasRemoteFile) {
          this.fileLabelEl.find('.download').show();
        }
      }
    },
    clearInputFile: function () {
      this.fileContainer.removeClass('selected');
      this.fileContainer.attr('data-title', 'Tải lên');
      this.fileNameEl.attr('data-title', 'Chọn một tập tin...');
      this.fileIconEl.removeClass('fa-file').addClass('fa-upload');
    },
    removeRemoteFile: function (index) {
      var attachment = this.attachments[index];
      if (attachment && attachment.gridfsUUID) {
        var _this = this;
        PoorHouseAPI.rmAttach({
          attachId: attachment.gridfsUUID,
          uuid: this.getRecordId()
        }, function () {
          if (++index < _this.attachments.length) {
            _this.removeRemoteFile(index);
          }
        });
      }
    },
    removeFile: function () {
      if (this.hasRemoteFile) {
        var _this = this;
        this.confirmDelFile = this.confirmDlg(
            'Xóa đính kèm',
            'Bạn chắc chắn muốn xóa tập tin đính kèm',
            function () {
              _this.clearInputFile();
              _this.removeRemoteFile(0);
              this.hide();
            }
        );
        this.confirmDelFile.show();
      }
      else {
        this.clearInputFile();
      }
    },
    downloadFile: function () {
      if (this.getRecordId() && this.hasRemoteFile) {
        var attachment = this.attachments[0];
        if (attachment && attachment.gridfsUUID) {
          PoorHouseAPI.downAttach({
            attachId: attachment.gridfsUUID,
            uuid: this.getRecordId()
          });
        }
      }
    },
    initSelect2: function (element, url, params, placeholderMsg) {
      var _this = this;
      return element.select2({
        placeholder: placeholderMsg,
        allowClear: true,
        ajax: {
          url: url,
          dataType: 'json',
          multiple: true,
          delay: 250,
          data: function (data) {
            data.page = data.page || 0;
            return {
              keyword: data.term,
              pageNumber: data.page,
              pageSize: params.pageSize,
              city: iNet.cityCode,
              district: _this.getDistrict()
            };
          },
          processResults: function (data, params) {
            var __results = [];
            var __data = data.items || [];
            __data.forEach(function (item) {
              __results.push({
                id: item.code || item.uuid,
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
    triggerSelect2: function (select, data) {
      var option = new Option(data.name, data.code, true, true);
      select.append(option).trigger('change');
      select.trigger({
        type: 'select2:select',
        params: {
          data: data
        }
      });
    },
    resetSelect2: function (el) {
      el.val(null).trigger('change');
    },
    setFormData: function (data) {
      this.attachments = data.attachments || [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var value = data[key];
          if (key === 'districtCode') {
            this.changeDistrict(value);
          }
          else if (key === 'wardCode') {
            if (value) {
              this.changeWard(value, data.group || this.getDistrict());
              this.form.attachment.wrapper.show();
            }
            else
              this.form.attachment.wrapper.hide();
          }
          $('[name="' + key + '"]').val(value);
        }
      }
      this.hasRemoteFile = !iNet.isEmpty(this.attachments);
      this.changeFile(this.attachments);
    },
    getFormData: function () {
      var fd = new FormData(document.getElementById(this.formId));
      this.attachments.forEach(function (file) {
        fd.append(file.name, file);
      });

      return fd;
    },
    resetForm: function () {
      this.setRecordId(null);
      this.getFormEl()[0].reset();
      this.clearInputFile();
      this.resetSelect2(this.form.district);
      this.resetSelect2(this.form.ward);
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
    setRecordId: function (uuid) {
      this.recordId = uuid;
    },
    getRecordId: function () {
      return this.recordId;
    },
    setRecord: function (record) {
      this.record = record;
      this.setRecordId(record.uuid);
    },
    getRecord: function () {
      return this.record || {};
    },
    save: function () {
      var _this = this;
      var formData = this.getFormData();
      console.log('save function has been call with doc id: ', this.getRecordId());
      if (this.getRecordId()) {
        if (formData instanceof FormData) {
          formData.append('uuid', this.getRecordId());
        } else if (formData instanceof Array) {
          formData.push({name: 'uuid', value: this.getRecordId()});
        } else if (!iNet.isEmptyObject(formData)) {
          formData['uuid'] = this.getRecordId();
        }
      }
      PoorHouseAPI.save(formData, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR) {
          _this.error(_this.getText('save'), _this.getText('save_error'));
        }
        else {
          _this.fireEvent('saved', result, _this);
          _this.success(_this.getText('save'), _this.getText('save_success'));
        }
      });
    },
    load: function () {
      var _this = this;
      if (this.getRecordId()) {
        PoorHouseAPI.load({
          uuid: this.getRecordId()
        }, function (result) {
          _this.resetForm();
          _this.setRecord(result);
          _this.setFormData(result);
        });
      }
    }
  });
});