/**
 * #PACKAGE: admin
 * #MODULE: dynamic-content-detail
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 14:58 20/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file DynamicContentDetail.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.DynamicContentDetail
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.DynamicContentDetail');
  iNet.ui.admin.DynamicContentDetail = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'dynamic-content-detail-wg';
    this.module = this.module || 'content';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.formId = this.formId || 'form-content';
    this.group = this.group || CMSConfig.GROUP_LAND;
    this.typeGroup = this.typeGroup || 'GROUP_LAND_TYPE';
    this.typeUrl = ContentAPI.URL.LIST;

    this.toolbar = this.toolbar || {
      BACK: $('#content-btn-back'),
      CREATE: $('#content-btn-create'),
      SAVE: $('#content-btn-save')
    };

    this.form = this.form || {
      name: $('#txt-name'),
      type: $('#cbb-type'),
      group: $('#txt-group'),
      brief: $('#txt-brief'),
      content: $('#txt-content')
    };

    this.formValidator = this.formValidator || new iNet.ui.form.Validate({
      id: this.formId,
      rules: [{
        id: this.form.name.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('name'));
        }
      }, {
        id: this.form.type.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('type'));
        }
      }, {
        id: this.form.group.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('group'));
        }
      }, {
        id: this.form.content.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('content'));
        }
      }]
    });

    iNet.ui.admin.DynamicContentDetail.superclass.constructor.call(this);

    if (this.form.content && this.form.content.length > 0) {
      this.editor = new iNet.ui.common.LittleEditor({id: '#' + this.form.content.prop('id')});
    }

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

    if (this.form.type && this.form.type.length > 0) {
      this.typeSelect = this.initSelect2(this.form.type, this.typeUrl, this.typeGroup, 'Chọn loại nội dung');
    }
  };
  iNet.extend(iNet.ui.admin.DynamicContentDetail, iNet.ui.WidgetExt, {
    constructor: iNet.ui.admin.DynamicContentDetail,
    /**
     * @returns {iNet.ui.common.ContentEditor}
     */
    getEditor: function () {
      return this.editor;
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
              group: dictType
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
      ContentAPI.list({group: this.typeGroup}, function (results) {
        var items = results.items || [];
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.uuid === data) {
            var option = new Option(item.name, item.uuid, true, true);
            select.append(option).trigger('change');
            select.trigger({
              type: 'select2:select',
              params: {
                data: item
              }
            });
            break;
          }
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
    setFormData: function (data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var value = data[key];
          if (key === 'type' && value) {
            this.triggerSelect2(this.typeSelect, value);
          }
          else if(key === 'content' && value) {
            this.getEditor().setValue(value);
          }
          else {
            $('[name="' + key + '"]').val(value);
          }
        }
      }
    },
    getFormData: function () {
      return new FormData(document.getElementById(this.formId));
    },
    resetForm: function () {
      this.setRecordId(null);
      this.getFormEl()[0].reset();
      if (this.getEditor()) {
        this.getEditor().setValue('');
      }
      if (this.form.type && this.form.type.length > 0) {
        this.resetSelect2(this.form.type);
      }
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
        ContentAPI.update(formData, function (result) {
          if (result.type === CMSConfig.TYPE_ERROR) {
            _this.error(_this.getText('update'), _this.getText('update_error'));
          }
          else {
            _this.fireEvent('updated', result, _this);
            _this.success(_this.getText('update'), _this.getText('update_success'));
          }
        });
      }
      else {
        ContentAPI.create(formData, function (result) {
          if (result.type === CMSConfig.TYPE_ERROR) {
            _this.error(_this.getText('create'), _this.getText('create_error'));
          }
          else {
            _this.success(_this.getText('create'), _this.getText('create_success'));
            _this.setRecordId(result.uuid);
            _this.fireEvent('created', result, _this);
          }
        });
      }
    },
    load: function () {
      var _this = this;
      if (this.getRecordId()) {
        ContentAPI.load({
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