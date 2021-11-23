/**
 * #PACKAGE: admin
 * #MODULE: land-route-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:05 22/08/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file RouteContent.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.RouteContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.RouteContent');
  iNet.ui.admin.RouteContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'land-detail-wg';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.module = 'land';
    this.formId = 'form-content';

    this.toolbar = {
      BACK: $('#content-btn-back'),
      CREATE: $('#content-btn-create'),
      SAVE: $('#content-btn-save')
    };

    this.form = {
      name: $('#txt-name'),
      parent: $('#cbb-parent'),
      content: $('#txt-content')
    };

    this.formValidator = new iNet.ui.form.Validate({
      id: this.formId,
      rules: [{
        id: this.form.name.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('name'));
        }
      }]
    });

    this.editor = new iNet.ui.common.LittleEditor({id: '#' + this.form.content.prop('id')});

    iNet.ui.admin.RouteContent.superclass.constructor.call(this);

    this.toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back', _this);
    });

    this.toolbar.CREATE.on('click', function () {
      _this.resetForm();
    });

    this.toolbar.SAVE.on('click', function () {
      console.log('validation result: ', _this.getFormValidator().check());
      if (_this.getFormValidator().check()) {
        _this.save();
      }
    });

    // this.parentSelect = this.initSelect2(this.form.parent, LandCateAPI.URL.SEARCH, '', 'Chọn tuyến đường cấp trên');
    renderCategory(this.form.parent, function () {
      _this.parentSelect = _this.form.parent.select2();
    });
  };
  iNet.extend(iNet.ui.admin.RouteContent, iNet.ui.WidgetExt, {
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
      LandCateAPI.list({group: '', pageSize: -1}, function (results) {
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
      this.setRecordId(record.uuid || null);
      this.setFormData(record);
    },
    getRecord: function () {
      return this.record || {};
    },
    setFormData: function (data) {
      var _this = this;
      renderCategory(this.form.parent, function () {
        _this.parentSelect = _this.form.parent.select2();
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var value = data[key];
            if (key === 'parentId' && value) {
              _this.triggerSelect2(_this.parentSelect, value);
            }
            else if (key === 'description' && value) {
              _this.getEditor().setValue(value);
            }
            else {
              $('[name="' + key + '"]').val(value);
            }
          }
        }
      });
    },
    getFormData: function () {
      return new FormData(document.getElementById(this.formId));
    },
    resetForm: function () {
      this.setRecord({});
      this.getFormEl()[0].reset();
      if (this.getEditor()) {
        this.getEditor().setValue('');
      }
      if (this.form.parent && this.form.parent.length > 0) {
        this.resetSelect2(this.form.parent);
      }
    },
    save: function () {
      var _this = this;
      var formData = this.getFormData();
      console.log('save function has been call with id: ', this.getRecordId());
      if (this.getRecordId()) {
        formData.append('uuid', this.getRecordId());
      }
      formData.append('description', this.getEditor().getValue());
      LandCateAPI.save(formData, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR) {
          _this.error(_this.getText('title'), _this.getText('save_error'));
        }
        else {
          _this.success(_this.getText('title'), _this.getText('save_success'));
          _this.setRecordId(result.uuid);
          _this.fireEvent('saved', result, _this);
        }
      });
    },
    remove: function () {
      if (this.getRecordId()) {
        var _this = this;
        LandCateAPI.remove({uuid: this.getRecordId()}, function (result) {
          _this.fireEvent('removed', result, _this);
        });
      }
    }
  });
  function renderCategory(element, callback) {
    var optionHtml = '';
    $.getJSON(iNet.getPUrl('land/route/tree'), {items: false, sort: '-createdDate', group: CMSConfig.GROUP_LAND_ROUTE}, function (results) {
      renderOption(results.items || [], '');
      var option = '<option value="ROOT">--- Chọn tuyến đường cấp trên ---</option>' + optionHtml;
      element.html(option);
      callback && callback();
    });

    function renderOption(data, pre) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        optionHtml += '<option value="' + item.uuid + '">' + pre + item.name + '</option>';
        if (item.childrens && item.childrens.length > 0) {
          renderOption(item.childrens, pre + '-');
        }
      }
    }
  }
});